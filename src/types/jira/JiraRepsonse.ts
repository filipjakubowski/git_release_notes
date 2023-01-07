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
        issuelinks: [{
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
        }]
    }
}