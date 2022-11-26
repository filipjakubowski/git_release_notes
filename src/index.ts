import {GitReleaseNotes} from "./GitReleaseNotes";
import {GithubAdapter} from "./services/GithubAdapter";
import github from "@actions/github";
import {JiraAdapter} from "./services/JiraAdapter";

console.log("GitReleaseNotes");

console.log("github");
console.log(github);

let ga = new GithubAdapter();
let ja = new JiraAdapter();
ja.addProjectKey("WPA");
let rn = new GitReleaseNotes(ga,ja);
rn.getLogsFromSha("5b86e08fe883079770adc7f5e099b6980bcbea01");



