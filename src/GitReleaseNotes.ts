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

        commits = await this.jiraAdapter.fillFromJira(commits);
        return commits.map((c) => {
            return this.getNoteString(c);
        });
    }

    async getNotesStringWithJira(fromSha:string, toSha: string):Promise<string>{
        const notes = await this.getNotesWithJira(fromSha, toSha);
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