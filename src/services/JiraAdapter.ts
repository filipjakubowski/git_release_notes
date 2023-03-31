import axios, {AxiosRequestConfig} from 'axios';
const https = require('https');

import {JiraRepsonse} from "../types/jira/JiraRepsonse";
import {JiraCommitInterface} from "../types/jira/JiraCommitInterface";

export enum JiraTypeEnum {
    CLOUD,
    SERVER,
}

export class JiraAdapter {
    static JIRA_ISSUE_REGEXP = "$KEYS-\\d+";

    projectKeys:string[] = [];
    jiraURL: string;
    jiraPassword: string;
    jiraUsername: string;
    jiraType: JiraTypeEnum;

    constructor(url:string, username:string, password:string, jiraType:JiraTypeEnum = JiraTypeEnum.CLOUD) {
        this.jiraURL = url;
        this.jiraUsername = username;
        this.jiraPassword = password;
        this.jiraType = jiraType;
    }

    addProjectKey(key:string){
        console.log(`Adding project key: ${key}`);
        this.projectKeys.push((key.toUpperCase()));
    }

    getJIRARegexp(){
        if(this.projectKeys.length == 0){
            throw new Error("No projectKeys set");
        }
        const keyRegPattern = this.projectKeys.join("|");
        const regString = JiraAdapter.JIRA_ISSUE_REGEXP.replace("$KEYS", keyRegPattern);
        return new RegExp(regString);
    }

     async fillFromJira(commits: JiraCommitInterface[]):Promise<JiraCommitInterface[]>{
         await Promise.all(commits.map(async (commit) => {
             try{
                 const jiraIssue = await this.fetchJiraIssue(commit);
             }
             catch (error){
                 console.log(error);
             }
         }));
        return commits;
    }

    async fetchJiraIssue(commit: JiraCommitInterface):Promise<JiraCommitInterface>{
        if(commit.jiraKey == null) return commit;
        const axiosReqConf:AxiosRequestConfig = this.axiosConfigForJiraKey(commit.jiraKey);

        try {
            const response = await axios(axiosReqConf);
            commit = this.updateCommitWithJiraResponse(commit,response.data);
            return commit;
        }
        catch (error){
            console.log(`Error why querying JIRA for ${commit.jiraKey}`);
            console.log(error)
            return commit;
        }
    }

    private axiosConfigForJiraKey(jiraKey: string): AxiosRequestConfig{
        if(this.jiraType == JiraTypeEnum.CLOUD){
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
                }
            }
        }
        else {
            return {
                method: "GET",
                url: this.issueUrl(jiraKey),
                headers: {
                    'Accept': "application/json",
                    'Content-Type': 'application/json',
                    'Accept-Encoding': '',
                    'Authorization': `Bearer ${this.jiraPassword}`
                },
                httpAgent: new https.Agent({ rejectUnauthorized: false })
            }
        }
    }

    private updateCommitWithJiraResponse(commit: JiraCommitInterface, data: JiraRepsonse):JiraCommitInterface{
        commit.jiraSummary = data.fields.summary;
        commit.jiraStatus = data.fields.status.name;
        commit.jiraUrl = `${this.jiraURL}/browse/${commit.jiraKey}`;
        commit.type = data.fields.issuetype.name;
        commit.issueLinks = [];


        if(data.fields.issuelinks){
            commit.issueLinks = data.fields.issuelinks;

            commit.issueLinks?.forEach((link) => {
                if(link.outwardIssue){
                    link.jiraUrl = `${this.jiraURL}/browse/${link.outwardIssue.key}`;
                }
                else if(link.inwardIssue){
                    link.jiraUrl = `${this.jiraURL}/browse/${link.inwardIssue.key}`;
                }
            });
        }

        return commit;
    }

    private issueUrl(jiraKey:string){
        switch(this.jiraType){
            case JiraTypeEnum.CLOUD: {
                return `${this.jiraURL}/rest/api/3/issue/${jiraKey}`;
            }
            case JiraTypeEnum.SERVER: {
                return `${this.jiraURL}/rest/agile/1.0/issue/${jiraKey}`;
            }
        }
    }
}