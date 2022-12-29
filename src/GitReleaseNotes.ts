import {GithubAdapter} from "./services/GithubAdapter";
import {GitCommit} from "./types/git/GitCommit";
import {JiraAdapter} from "./services/JiraAdapter";
import {JiraCommitInterface} from "./types/jira/JiraCommitInterface";
import {GithubCommit} from "./types/github/GithubCommit";

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
        }
        catch (error){
            console.log(error);
        }

        commits = await this.jiraAdapter.fillFromJira(commits) as GitCommit[];
        return commits.map((c) => {
            return this.getNoteString(c);
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

        let commits = await this.jiraAdapter.fillFromJira(filteredCommits);
        return commits.map((c) => {
            return this.getNoteString(c as JiraCommitInterface);
        });
    }

    async getNotesStingWithJitaFromGithubCommits(githubCommits: GithubCommit[]):Promise<string>{
        const notes = await this.getNotesWithJiraFromGithubCommits(githubCommits);
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

    getNoteString(commit:JiraCommitInterface):string{
        return  `${this.getJIRAKeyString(commit)}: ${this.getGitJiraSummary(commit)}`;
    }

    getJIRAKeyString(commit:JiraCommitInterface):string {
        return `[${commit.jiraKey}](${commit.jiraUrl})`
    }

    getGitJiraSummary(commit:JiraCommitInterface):string{
        if(commit.jiraSummary){
            return `${commit.jiraSummary} [${commit.jiraStatus}]`
        }
        else {
            if(commit.title){
                return commit.title;
            }
            else if(commit.message){
                return commit.message;
            }
            return "";
        }
    }
}