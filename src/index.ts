import {GitReleaseNotes} from "./GitReleaseNotes";
import {GithubAdapter} from "./services/GithubAdapter";
import {JiraAdapter, JiraTypeEnum} from "./services/JiraAdapter";
import {GithubCommit} from "./types/github/GithubCommit";
require('dotenv').config()

function areEnvVarsSet() : boolean {
    let validVars = true;
    if( process.env.JIRA_URL == null ){
        validVars = false;
        console.log("Missing JIRA_URL env var");
    }

    if( process.env.JIRA_USER == null ){
        validVars = false;
        console.log("Missing JIRA_USER env var");
    }

    if( process.env.JIRA_PASS_PWA == null ){
        validVars = false;
        console.log("Missing JIRA_PASS_PWA env var");
    }

    if( process.env.JIRA_PROJECT_KEY == null ){
        validVars = false;
        console.log("Missing JIRA_PROJECT_KEY env var");
    }

    if ( process.env.IS_JIRA_SERVER == null ){
        validVars = false;
        console.log("Missing IS_JIRA_SERVER env var");
    }

    if(!validVars)
    {
        console.log("Missing env vars");
        return false;
    }

    return true;
}

async function releaseNotesString(fromSha: string, toSha: string,gitBranchName: string) {
    if(areEnvVarsSet()){
        return;
    }

    const jiraUrl = process.env.JIRA_URL!;
    const jiraUser = process.env.JIRA_USER!;
    const jiraPat = process.env.JIRA_PASS_PWA!;
    const jiraProjectKey = process.env.JIRA_PROJECT_KEY!;
    const jiraType = process.env.IS_JIRA_SERVER ? JiraTypeEnum.SERVER : JiraTypeEnum.CLOUD;

    let ga = new GithubAdapter();
    let ja = new JiraAdapter(jiraUrl, jiraUser, jiraPat, jiraType);
    ja.addProjectKey(jiraProjectKey);
    let rn = new GitReleaseNotes(ga,ja);
    return await rn.getNotesStringWithJira(fromSha, toSha);
}

async function releaseNotesStringFromCommits(githubCommits: GithubCommit[],gitBranchName: string){
    if(process.env.LOG_LEVEL == "DEBUG") console.log("Getting release notes from commits");
    if(areEnvVarsSet()){
        return;
    }

    const jiraUrl = process.env.JIRA_URL!;
    const jiraUser = process.env.JIRA_USER!;
    const jiraPat = process.env.JIRA_PASS_PWA!;
    const jiraProjectKey = process.env.JIRA_PROJECT_KEY!;
    const jiraType = process.env.IS_JIRA_SERVER ? JiraTypeEnum.SERVER : JiraTypeEnum.CLOUD;

    let ga = new GithubAdapter();
    let ja = new JiraAdapter(jiraUrl, jiraUser, jiraPat, jiraType);
    ja.addProjectKey(jiraProjectKey);
    try {
        let rn = new GitReleaseNotes(ga, ja);
        return await rn.getNotesStingWithJitaFromGithubCommits(githubCommits);
    }
    catch (error){
        console.log(error);
        return "";
    }
}


module.exports = {
    releaseNotesString: async(fromSha: string, toSha: string) => {
        return await releaseNotesString(fromSha, toSha);
    },

    releaseNotesStringFromCommits: async(githubCommits: GithubCommit[]) => {
        return await releaseNotesStringFromCommits(githubCommits);
    }
};
