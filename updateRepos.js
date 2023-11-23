const axios = require("axios");
const args = require("minimist")(process.argv.slice(2));
const HOST = "https://api.github.com";

const TOKEN = args.token || args.t;
const TEAM = args.team || args.tm;
const OWNER = args.owner || args.o;

axios.defaults.headers.common["Authorization"] = `Bearer ${TOKEN}`;
axios.defaults.headers.common["X-GitHub-Api-Version"] = "2022-11-28";
axios.defaults.headers.common["Accept"] = "application/vnd.github+json";

async function getRepoNames() {
  try {
    let response = await axios.get(`${HOST}/user/repos?type=owner`);
    let { data: repoList } = response;
    let repoNames = repoList.map((repo) => {
      return repo.name;
    });
    return repoNames;
  } catch (e) {
    console.log(e);
    return [];
  }
}

async function updateTeam(team, repoOwner, repoName) {
  try {
    const data = { permission: "push" };
    let response = await axios.put(
      `${HOST}/orgs/regentmarkets/teams/${team}/repos/${repoOwner}/${repoName}`,
      data
    );
  } catch (e) {
    console.log(`Failed to update repo:https://github.com/${repoOwner}/${repoName}/settings`);
    console.log(e.response.data);
  }
}

const run = async (team, owner) => {
  let names = await getRepoNames();
  console.log("Will update repos: ", names);
  names.forEach(async (repo) => {
    await updateTeam(team, owner, repo);
  });
};

if (TOKEN && TEAM && OWNER) {
  run(TEAM, OWNER);
} else {
  console.log(
    "please provide input like:  --token <token> --team <> --owner <>"
  );
}
