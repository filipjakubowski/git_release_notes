import {GitReleaseNotes} from "./GitReleaseNotes";
import {GithubAdapter} from "./services/GithubAdapter";
import github from "@actions/github";
import {JiraAdapter} from "./services/JiraAdapter";

console.log("GitReleaseNotes");

console.log("github");
console.log(github);

const jiraurl = "https://koia.atlassian.net";
const jirauser = "filip@koia.consulting";
const jirapat = "2eDxNAhcc3snt5fC0Vzm8C69";

let ga = new GithubAdapter();
let ja = new JiraAdapter(jiraurl,jirauser,jirapat, "");
ja.addProjectKey("WPA");
let rn = new GitReleaseNotes(ga,ja);
rn.getNotesFromSha("5b86e08fe883079770adc7f5e099b6980bcbea01");
const gc = rn.getNotesWithJira("5b86e08fe883079770adc7f5e099b6980bcbea01");
console.log("Notes");
console.log(gc);




