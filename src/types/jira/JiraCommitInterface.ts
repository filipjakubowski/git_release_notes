import {JiraLink} from "./JiraLink";

export interface JiraCommitInterface {
    title?: string,
    type?: string,
    message?: string,
    jiraKey?: string,
    jiraSummary?: string,
    jiraStatus?: string,
    jiraUrl?: string,
    labels?: string[],
    issueLinks?: JiraLink[]
}