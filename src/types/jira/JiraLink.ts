export interface JiraLink {
    type: {
        name: string,
        outward: string,
        inward: string
    },
    jiraUrl?: string,
    outwardIssue?: {
        key: string,
        fields: {
            summary: string,
            status: {
                name: string

            },
            issuetype: {
                name: string,
            }
        }
    }
    inwardIssue?: {
        key: string,
        fields: {
            summary: string,
            status: {
                name: string
            },
            issuetype: {
                name: string,
            }
        },
    }
}