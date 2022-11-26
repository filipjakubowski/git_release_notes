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

    async getNotesFromSha(sha:string){
        const gitCommits = await this.getLogsFromSha(sha);
        const selectedCommits = gitCommits.filter(commit => {
            return commit.title.match(this.jiraAdapter.getJIRARegexp());
        });
        console.log("selected commits");
        console.log(selectedCommits);
    }

}