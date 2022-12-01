import * as exec from "@actions/exec";
import {GitCommit} from "../types/GitCommit";

function gitLogToGitCommit(commitSting:string){
    const lines = commitSting
        .split("\n")
        .filter( line => line.length > 1);

    let gc = {
        commit: lines[0]?.split(" ")[1]?.trim(),
        author: lines[1]?.split(":")[1]?.trim(),
        authorDateString: lines[2]?.split(":")[1]?.trim(),
        authorHandle: lines[3]?.split(":")[1]?.trim(),
        commitDateString: lines[4]?.split(":")[1]?.trim(),
        title: lines[5]?.trim(),
    } as GitCommit;

    if(gc.author == undefined){
        throw Error("error reding: " + commitSting);
    }

    if(lines.length > 6){
        gc.message = lines[6].trim()
    }
    return gc;
}

export async function getCommits(fromSha: string, toSha: string): Promise<GitCommit[]> {
    let commits: GitCommit[] = [];
    let buffer: string = ""
    let commitLines: string[] = [];

    const options = {
        listeners: {
            stdout: (data: Buffer) => {
                if(data != undefined){
                    const newBuffer = buffer + data.toString();
                    buffer =  "";
                    const bufferSplit = newBuffer.split("\n")
                    bufferSplit.forEach((bufferLine) => {
                        if(bufferLine.match(/^commit \W{40}/)){
                            commitLines.push(buffer);
                            buffer = bufferLine;
                        }
                        else {
                            buffer += bufferLine + "\n";
                        }
                    })
                }
            },
            stderr: (data: Buffer) => {
                console.log(`Command Error: ${data.toString()}`);
            }
        }
    };

    const args: string[] = ["log", "--format=fuller", `${fromSha}..${toSha}`];
    try{
        await exec.exec("git", args, options);
    }
    catch (error){
        console.log("Error while git log. ");
        console.log(error);
    }

    commitLines.push(buffer);
    commitLines.forEach(commitLine => {
        if(commitLine.length > 'commitLine '.length){
            const commit = gitLogToGitCommit(commitLine);
            commits.push(commit);
        }
    });

    return commits;
}
