import {GitReleaseNotes} from "./GitReleaseNotes";
import {GithubAdapter} from "./services/GithubAdapter";
import github from "@actions/github";
import {JiraAdapter} from "./services/JiraAdapter";
import {GitCommit} from "./types/GitCommit";

console.log("GitReleaseNotes");

console.log("github");
console.log(github);

const jiraurl = "https://koia.atlassian.net";
const jirauser = "filip.jakubowski@gmail.com";
const jirapat = "2eDxNAhcc3snt5fC0Vzm8C69";

let ga = new GithubAdapter();
let ja = new JiraAdapter(jiraurl,jirauser,jirapat);
ja.addProjectKey("WP");
let rn = new GitReleaseNotes(ga,ja);


// const notes = (async () => {
// //     const notes = await rn.getNotesWithJira("5b86e08fe883079770adc7f5e099b6980bcbea01");
// //     console.log("Notes");
// //     console.log(notes);
// //     return notes;
// // }
let notes:GitCommit[] = [];
(async () => {
    let notes:any;
    notes = await rn.getNotesWithJira("5b86e08fe883079770adc7f5e099b6980bcbea01");
    console.log("Notes");
    console.log(notes);
    return notes;
})();
export { notes };

//export default await rn.getNotesWithJira("5b86e08fe883079770adc7f5e099b6980bcbea01");
// export default await notes;



