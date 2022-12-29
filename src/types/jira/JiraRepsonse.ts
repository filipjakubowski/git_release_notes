export interface JiraRepsonse {
    self: string,
    key: string,
    fields: {
        summary: string,
        issuetype: {
            name: string,
            description: string
        },
        project: {
            key: string,
            name: string,
        },
        priority: {
            name:string,
        },
        labels:string[],
        status: {
            name: string
        },
        creator: {
            displayName: string
        },
        reporter: {
            displayName: string
        },
    }
}