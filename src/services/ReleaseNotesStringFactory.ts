import {JiraCommitInterface} from "../types/jira/JiraCommitInterface";

export class ReleaseNotesStringFactory {
    static getReleaseNotesString(commit: JiraCommitInterface): string {
        const jiraTicket = ReleaseNotesStringFactory;
        return  `${jiraTicket.jiraKey(commit)}: ${jiraTicket.summary(commit)} ${jiraTicket.labels(commit.labels)}`;
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

    private static jiraKey(commit:JiraCommitInterface):string {
        return `[${commit.jiraKey}](${commit.jiraUrl})`
    }
}