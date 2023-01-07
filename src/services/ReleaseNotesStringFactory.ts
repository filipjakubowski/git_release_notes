import {JiraCommitInterface} from "../types/jira/JiraCommitInterface";

export class ReleaseNotesStringFactory {
    static getReleaseNotesString(commit: JiraCommitInterface): string {
        const jiraTicket = ReleaseNotesStringFactory;
        return  `${jiraTicket.jiraKey(commit)}: ${jiraTicket.type(commit)} ${jiraTicket.summary(commit)} ${jiraTicket.labels(commit.labels)} ${jiraTicket.linkedJiraKeys(commit)}`;
    }

    private static summary(commit:JiraCommitInterface):string{
        if(commit.jiraSummary){
            return `${commit.jiraSummary} [${commit.jiraStatus}]`
        }
        else {
            if(commit.title){
                return commit.title;
            }
            else if(commit.message){
                return commit.message;
            }
            return "";
        }
    }

    private static type(commit:JiraCommitInterface):string {
        return `(${commit.type})`;
    }

    private static labels(labels?: string[]):string{
        if(!labels){
            return ``;
        }

        let labelsString = "";
        labels.forEach((label) => {
            labelsString += `\`${label}'\, `;
        });
        return `[ ${labelsString} ]`;
    }

    private static linkedJiraKeys(commit:JiraCommitInterface):string {
        let linkString = "";
        if(commit.issueLinks){
            if(commit.issueLinks.length > 0){
                linkString += `\nLinked Jira Tickets: `;
                commit.issueLinks.forEach((link) => {
                    if(link.outwardIssue){
                        linkString += `\n * [${link.outwardIssue.key}](${link.jiraUrl}) /${link.type.outward}/ (${link.outwardIssue.fields.issuetype.name}) ${link.outwardIssue.fields.summary} [${link.outwardIssue.fields.status.name}]`;
                    }
                    else if(link.inwardIssue){
                        linkString += `\n * [${link.inwardIssue.key}](${link.jiraUrl}) /${link.type.inward}/ (${link.inwardIssue.fields.issuetype.name}) ${link.inwardIssue.fields.summary} [${link.inwardIssue.fields.status.name}]`;
                    }
                });
            }
        }
        return linkString;
    }

    private static jiraKey(commit:JiraCommitInterface):string {
        return `[${commit.jiraKey}](${commit.jiraUrl})`
    }
}