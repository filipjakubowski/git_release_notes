import {GitCommit} from "../types/GitCommit";

import axios, {AxiosRequestConfig} from "axios";
import {JiraRepsonse} from "../types/JiraRepsonse";

export class JiraAdapter {
    static JIRA_ISSUE_REGEXP = "$KEYS-\\d+";

    projectKeys:string[] = [];
    jiraURL: string;
    jiraPassword: string;
    jiraUsername: string;

    constructor(url:string, username:string, password: string) {
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

     async fillFromJira(commits: GitCommit[]):Promise<GitCommit[]>{

         await Promise.all(commits.map(async (commit) => {
             try{
                 await this.getJiraIssue(commit);
             }
             catch (error){
                 console.log(error);
             }
         }));
        return commits;
    }

    async getJiraIssue(commit: GitCommit):Promise<GitCommit>{
        if(commit.jiraKey == null) return commit;
        const axiosReqConf:AxiosRequestConfig = this.axiosConfigForJiraKey(commit.jiraKey);

        try {
            const response = await axios(axiosReqConf);
            commit = this.updateCommiitWithJiraResponse(commit,response.data);
            return commit;
        }
        catch (error){
            console.log(`Error why querying JIRA for ${commit.jiraKey}`);
            console.log(error)
            return commit;
        }
    }

    private axiosConfigForJiraKey(jiraKey: string): AxiosRequestConfig{
        return {
            method: "GET",
            url: this.issueUrl(jiraKey),
            auth: {
                username: this.jiraUsername,
                password: this.jiraPassword,
            },
            headers: {
                'Accept': "application/json",
                'Content-Type': 'application/json',
                'Accept-Encoding': ''
            },
        }
    }

    private updateCommiitWithJiraResponse(commit: GitCommit, data: JiraRepsonse):GitCommit{
        commit.summary = data.fields.summary;
        commit.jiraStatus = data.fields.status.name;
        commit.jiraUrl = `${this.jiraURL}/browse/${commit.jiraKey}`;
        return commit;
    }

    private issueUrl(jiraKey:string){
        return `${this.jiraURL}/rest/api/3/issue/${jiraKey}`;
    }
}