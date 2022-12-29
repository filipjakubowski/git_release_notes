export interface GitCommit {
    commit: string,
    author: string,
    authorDateString: string,
    authorHandle: string,
    commitDateString: string,
    title: string,
    message?: string,
    jiraKey?: string,
    jiraSummary?: string,
    jiraStatus?: string
    jiraUrl?: string
}