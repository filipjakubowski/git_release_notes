import * as exec from "@actions/exec";
import {GitCommit} from "../types/GitCommit";

function gitLogToGitCommit(commitSting:string){
    const lines = commitSting
        .split("\n")
        .filter( line => line.length > 0);

    let gc = {
        commit: lines[0].split(" ")[1].trim(),
        author: lines[1].split(":")[1].trim(),
        authorDateString: lines[2].split(":")[1].trim(),
        authorHandle: lines[3].split(":")[1].trim(),
        commitDateString: lines[4].split(":")[1].trim(),
        title: lines[5].trim(),
    } as GitCommit;

    if(lines.length > 6){
        gc.message = lines[6].trim()
    }
    return gc;
}

export async function getCommits(sha: string): Promise<GitCommit[]> {
    let commits: GitCommit[] = [];

    const options = {
        listeners: {
            stdout: (data: Buffer) => {
                const commit = gitLogToGitCommit(data.toString());
                commits.push(commit);
            }
        }
    };

    const args: string[] = ["log", "--format=fuller", `${sha}..HEAD`];
    await exec.exec("git", args, options);
    return commits;
}