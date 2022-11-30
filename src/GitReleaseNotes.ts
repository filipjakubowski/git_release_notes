import {GithubAdapter} from "./services/GithubAdapter";
import {GitCommit} from "./types/GitCommit";
import {JiraAdapter} from "./services/JiraAdapter";

export class GitReleaseNotes {
    gitAdapter: GithubAdapter;
    jiraAdapter: JiraAdapter;

    constructor(gitAdapter:GithubAdapter, jiraAdapter:JiraAdapter) {
        this.gitAdapter = gitAdapter;
        this.jiraAdapter = jiraAdapter;
    }

    async getLogsFromSha(sha:string): Promise<GitCommit[]>{
        return await this.gitAdapter.getCommitsSinceSha(sha);
    }

    async getNotesFromSha(sha:string):Promise<GitCommit[]>{
        const gitCommits = await this.getLogsFromSha(sha);
        return gitCommits.filter(commit => {
            const matchResult = commit.title.match(this.jiraAdapter.getJIRARegexp());
            if(matchResult != null) {
                commit.jiraKey = matchResult[0];
            }
            return matchResult != null;
        });
    }

    async getNotesWithJira(sha:string):Promise<string[]>{
        let commits:GitCommit[] =[];
        try {
            commits = await this.getNotesFromSha(sha);
        }
        catch (error){
            console.log(error);
        }

        commits = await this.jiraAdapter.fillFromJira(commits);
        return commits.map((c) => {
            return this.getNoteString(c);
        });
    }

    async getNotesStringWithJira(sha:string):Promise<string>{
        const notes = await this.getNotesWithJira(sha);
        var notesString= "";
        notes.forEach(n=>{
            notesString += n + "\n";
        });
        return notesString;
    }

    getNoteString(commit:GitCommit):string{
        return  `${this.getJIRAKeyString(commit)}: ${this.getGitJiraSummary(commit)}`;
    }

    getJIRAKeyString(commit:GitCommit):string {
        return `[${commit.jiraKey}](${commit.jiraUrl})`
    }

    getGitJiraSummary(commit:GitCommit):string{
        if(commit.summary){
            return `${commit.summary} [${commit.jiraStatus}]`
        }
        else {
            return `${commit.title}`
        }
    }

}