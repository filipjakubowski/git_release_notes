import {getCommits} from "../helpers/git-helpers";
import {GitCommit} from "../types/GitCommit";

export class GithubAdapter {
    async getCommitsSinceSha(fromSha:string, toSha: string):Promise<GitCommit[]>{
        return await getCommits(fromSha, toSha);
    }
}