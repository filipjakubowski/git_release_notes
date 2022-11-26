import github from "@actions/github";
import {getCommits} from "../helpers/git-helpers";
import {GitCommit} from "../types/GitCommit";

export class GithubAdapter {
    contextCommitSHA:string = "";

    constructor(){
        if(github){
            this.contextCommitSHA = github.context.sha;
        }
    }

    async getCommits():Promise<GitCommit[]>{
        return await getCommits(this.contextCommitSHA);
    }

    async getCommitsSinceSha(sha:string):Promise<GitCommit[]>{
        return await getCommits(sha);
    }

}