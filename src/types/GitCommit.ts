export interface GitCommit {
    commit: string,
    author: string,
    authorDateString: string,
    authorHandle: string,
    commitDateString: string,
    title: string,
    message?: string,
    jiraKey?: string,
    summary?: string,
    jiraStatus?: string
}