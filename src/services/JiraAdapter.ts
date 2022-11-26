export class JiraAdapter {
    static JIRA_ISSUE_REGEXP = "/$KEYS-\d+/";

    projectKeys:string[] = [];

    constructor() {
    }

    addProjectKey(key:string){
        this.projectKeys.push((key.toUpperCase()));
    }

    getJIRARegexp(){
        const keyRegPattern = this.projectKeys.join("|");
        return JiraAdapter.JIRA_ISSUE_REGEXP.replace("$KEYS", keyRegPattern);
    }


}