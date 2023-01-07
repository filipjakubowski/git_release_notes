import {GitReleaseNotes} from "./GitReleaseNotes";
import {GithubAdapter} from "./services/GithubAdapter";
import {JiraAdapter, JiraTypeEnum} from "./services/JiraAdapter";
import {GithubCommit} from "./types/github/GithubCommit";
require('dotenv').config()
async function releaseNotesString(fromSha: string, toSha: string) {
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

async function releaseNotesStringFromCommits(githubCommits: GithubCommit[]){
    const jiraUrl = process.env.JIRA_URL!;
    const jiraUser = process.env.JIRA_USER!;
    const jiraPat = process.env.JIRA_PASS_PWA!;
    const jiraProjectKey = process.env.JIRA_PROJECT_KEY!;
    const jiraType = process.env.IS_JIRA_SERVER ? JiraTypeEnum.SERVER : JiraTypeEnum.CLOUD;

    let ga = new GithubAdapter();
    let ja = new JiraAdapter(jiraUrl, jiraUser, jiraPat, jiraType);
    ja.addProjectKey(jiraProjectKey);
    let rn = new GitReleaseNotes(ga,ja);
    return await rn.getNotesStingWithJitaFromGithubCommits(githubCommits);
}

module.exports = {
    releaseNotesString: async(fromSha: string, toSha: string) => {
        return await releaseNotesString(fromSha, toSha);
    },

    releaseNotesStringFromCommits: async(githubCommits: GithubCommit[]) => {
        return await releaseNotesStringFromCommits(githubCommits);
    }
};

module.exports.releaseNotesString("5b86e0","HEAD").then(
    (notesString: string)=>
    {
        console.log(`!!!!: ${notesString}`);
    }
);