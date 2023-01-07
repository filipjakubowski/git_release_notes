export interface JiraLink {
    type: {
        name: string,
        outward: string,
        inward: string
    },
    outwardIssue: {
        key: string,
        summary: string,
        status: {
            name: string
        }
    },
    issuetype: {
        name: string,
    }
}