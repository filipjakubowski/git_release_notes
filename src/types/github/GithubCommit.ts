import {GithubCommitAuthor} from "./GithubCommitAuthor";
import {GithubCommitCommiter} from "./GithubCommitCommiter";
import {JiraCommitInterface} from "../jira/JiraCommitInterface";

export interface GithubCommit extends JiraCommitInterface{
    author: GithubCommitAuthor,
    commiter: GithubCommitCommiter,
    distinct: boolean,
    id: string,
    message: string,
    timestamp: string,
    tree_id: string,
    url: string,
    jiraKey?: string,
    jiraSummary?: string,
    jiraStatus?: string
    jiraUrl?: string
}