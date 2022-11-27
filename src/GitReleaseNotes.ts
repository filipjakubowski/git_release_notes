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

    async getNotesWithJira(sha:string):Promise<GitCommit[]>{
        let commits:GitCommit[] =[];
        try {
            commits = await this.getNotesFromSha(sha);
        }
        catch (error){
            console.log(error);
        }

        commits = await this.jiraAdapter.fillFromJira(commits);
        return commits;
    }

}