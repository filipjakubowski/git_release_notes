import {GitReleaseNotes} from "./GitReleaseNotes";
import {GithubAdapter} from "./services/GithubAdapter";
import github from "@actions/github";

console.log("GitReleaseNotes");

console.log("github");
console.log(github);

let ga = new GithubAdapter();
let rn = new GitReleaseNotes(ga);
rn.getLogsFromSha("5b86e08fe883079770adc7f5e099b6980bcbea01");



