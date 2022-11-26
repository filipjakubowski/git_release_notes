import {GithubAdapter} from "./services/GithubAdapter";
import {GitCommit} from "./types/GitCommit";

export class GitReleaseNotes {
    gitAdapter: GithubAdapter;

    constructor(gitAdapter:GithubAdapter) {
        this.gitAdapter = gitAdapter;
    }

    async getLogsFromSha(sha:string): Promise<GitCommit[]>{
        return await this.gitAdapter.getCommitsSinceSha(sha);
    }

}