import {GitReleaseNotes} from "./GitReleaseNotes";
import {GithubAdapter} from "./services/GithubAdapter";
import {JiraAdapter, JiraTypeEnum} from "./services/JiraAdapter";

module.exports = {
    notes: (fromSha: string) => {
        const jiraUrl = process.env.JIRA_URL!;
        const jiraUser = process.env.JIRA_USER!;
        const jiraPat = process.env.JIRA_PASS_PWA!;
        const jiraProjectKey = process.env.JIRA_PROJECT_KEY!;

        let ga = new GithubAdapter();
        let ja = new JiraAdapter(jiraUrl, jiraUser, jiraPat, JiraTypeEnum.CLOUD);
        ja.addProjectKey(jiraProjectKey);
        let rn = new GitReleaseNotes(ga,ja);
        let notesString:string = "";

        (async () => {
            let notes:any;
            notes = await rn.getNotesStringWithJira(fromSha);
            console.log("Notes:");
            console.log(notes);
            return notes;
        })();

        return  notesString;
    }
};