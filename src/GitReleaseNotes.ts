import {GithubAdapter} from "./services/GithubAdapter";
import {GitCommit} from "./types/git/GitCommit";
import {JiraAdapter} from "./services/JiraAdapter";
import {JiraCommitInterface} from "./types/jira/JiraCommitInterface";
import {GithubCommit} from "./types/github/GithubCommit";
import {ReleaseNotesStringFactory} from "./services/ReleaseNotesStringFactory";

export class GitReleaseNotes {
    gitAdapter: GithubAdapter;
    jiraAdapter: JiraAdapter;

    constructor(gitAdapter:GithubAdapter, jiraAdapter:JiraAdapter) {
        this.gitAdapter = gitAdapter;
        this.jiraAdapter = jiraAdapter;
    }

    async getLogsFromSha(fromSha:string, toSha:string): Promise<GitCommit[]>{
        return await this.gitAdapter.getCommitsSinceSha(fromSha, toSha);
    }

    async getNotesFromSha(fromSha:string, toSha:string):Promise<GitCommit[]>{
        const gitCommits = await this.getLogsFromSha(fromSha, toSha);
        return gitCommits.filter(commit => {
            const matchResult = commit.title.match(this.jiraAdapter.getJIRARegexp());
            if(matchResult != null) {
                commit.jiraKey = matchResult[0];
            }
            return matchResult != null;
        });
    }

    async getNotesWithJira(fromSha:string, toSha: string):Promise<string[]>{
        let commits:GitCommit[] =[];
        try {
            commits = await this.getNotesFromSha(fromSha, toSha);
            commits = this.removeGitCommitDuplicates(commits);
        }
        catch (error){
            console.log(error);
        }

        commits = await this.jiraAdapter.fillFromJira(commits) as GitCommit[];
        return commits.map((c) => {
            return ReleaseNotesStringFactory.getReleaseNotesString(c);
        });
    }

    async getNotesWithJiraFromGithubCommits(githubCommits: GithubCommit[]):Promise<string[]>{
        let filteredCommits = githubCommits.filter(commit => {
            const matchResult = commit.message.match(this.jiraAdapter.getJIRARegexp());
            if(matchResult != null) {
                commit.jiraKey = matchResult[0];
            }
            return matchResult != null;
        });

        filteredCommits = this.removeGithubCommitDuplicates(filteredCommits);

        let commits = await this.jiraAdapter.fillFromJira(filteredCommits);
        return commits.map((c) => {
            return ReleaseNotesStringFactory.getReleaseNotesString(c as JiraCommitInterface);
        });
    }

    async getNotesStingWithJitaFromGithubCommits(githubCommits: GithubCommit[]):Promise<string>{
        const filteredCommits = this.removeGithubCommitDuplicates(githubCommits);
        const notes = await this.getNotesWithJiraFromGithubCommits(filteredCommits);
        let notesString= "";
        notes.forEach(n=>{
            notesString += n + "\n";
        });
        return notesString;
    }

    async getNotesStringWithJira(fromSha:string, toSha: string):Promise<string>{
        const notes = await this.getNotesWithJira(fromSha, toSha);
        let notesString= "";
        notes.forEach(n=>{
            notesString += n + "\n";
        });
        return notesString;
    }

    async getNotesStringWithJiraFromText(text:string):Promise<string[]>{
        const matchResult = text.match(this.jiraAdapter.getJIRARegexp());
        let jireIssues:JiraCommitInterface[] = [];
        if(matchResult != null) {
            matchResult.forEach( (jiraKey) => {
                jireIssues.push({jiraKey: jiraKey} as JiraCommitInterface);
            });
        }
        return jireIssues.map((c) => {
            return ReleaseNotesStringFactory.getReleaseNotesString(c);
        });
    }


    private removeGithubCommitDuplicates(commits: GithubCommit[] ):   GithubCommit[]  {

        let filteredComits:GithubCommit[] = [];
        commits.filter((commit) => {
            if(filteredComits.findIndex((c) => {
                return c.jiraKey === commit.jiraKey;
            }) === -1){
                filteredComits.push(commit);
            }
        });
        return filteredComits;
    }

    private removeGitCommitDuplicates(commits: GitCommit[] ):   GitCommit[]  {
        console.log("removeGitCommitDuplicates");
        let filteredComits:GitCommit[] = [];
        commits.filter((commit) => {
            if(filteredComits.findIndex((c) => {
                return c.jiraKey === commit.jiraKey;
            }) === -1){
                filteredComits.push(commit);
            }
        });

        return filteredComits;
    }
}