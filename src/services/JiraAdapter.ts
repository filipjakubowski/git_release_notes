import {GitCommit} from "../types/GitCommit";
import axios, {AxiosRequestConfig} from "axios";

export class JiraAdapter {
    static JIRA_ISSUE_REGEXP = "$KEYS-\\d+";

    projectKeys:string[] = [];
    jiraURL: string;
    jiraPassword?: string;
    jiraUsername: string;

    constructor(url:string, username:string, pat?:string, password?: string) {
        this.jiraURL = url;
        this.jiraUsername = username;
        this.jiraPassword = password;
    }

    addProjectKey(key:string){
        this.projectKeys.push((key.toUpperCase()));
    }

    getJIRARegexp(){
        const keyRegPattern = this.projectKeys.join("|");
        const regString = JiraAdapter.JIRA_ISSUE_REGEXP.replace("$KEYS", keyRegPattern);
        return new RegExp(regString);
    }

     fillFromJira(commits: GitCommit[]):GitCommit[]{
        commits.forEach( (commit) => {
            if(commit.jiraKey != null){
                this.getJiraIssue(commit);
            }
        })
        return commits;
    }

    async getJiraIssue(commit: GitCommit):Promise<GitCommit>{
        if(commit.jiraKey == null) return commit;

        const axiosReqConf:AxiosRequestConfig = {
            auth: {
                username: this.jiraUsername,
                password: ""+this.getPass()
            }
        }

        const jira_issue = commit;
        await axios
            .get(this.issueUrl(commit.jiraKey),axiosReqConf)
            .then(function(response){
                console.log(response);
                jira_issue.summary = "WORKS";
            }).catch(function(error){
                console.log(`Error why querying JIRA for ${commit.jiraKey}`);
            });

        return jira_issue;
    }



    private issueUrl(jiraKey:string){
        return `${this.jiraURL}/rest/api/3/issue/${jiraKey}`;
    }

    private getPass(){
        return this.jiraPassword != "" ? this.jiraPassword : this.jiraPassword
            ;
    }
}