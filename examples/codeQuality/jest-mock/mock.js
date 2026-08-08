const { getUserInfo, getRepoInfo } = require("./github");

//// USER CHECKS FOR chrisjblackburn ////

async function checkUserLogin(username, expectedLogin = "chrisjblackburn") {
  try {
    const userInfo = await getUserInfo(username);
    if (!userInfo || !userInfo.login) {
      console.error("User info not found or missing login field");
      return;
    }
    if (userInfo.login === expectedLogin) {
      console.log(`User login matches expected: ${userInfo.login}`);
    } else {
      console.log(
        `User login does NOT match expected. Got: ${userInfo.login}, Expected: ${expectedLogin}`,
      );
    }
  } catch (err) {
    console.error("Error fetching user info:", err.message);
  }
}

async function checkUserName(username, expectedName = "Chris Blackburn") {
  try {
    const userInfo = await getUserInfo(username);
    if (!userInfo || !userInfo.name) {
      console.error("User info not found or missing name field");
      return;
    }
    if (userInfo.name === expectedName) {
      console.log(`User name matches expected: ${userInfo.name}`);
    } else {
      console.log(
        `User name does NOT match expected. Got: ${userInfo.name}, Expected: ${expectedName}`,
      );
    }
  } catch (err) {
    console.error("Error fetching user info:", err.message);
  }
}

//// REPO CHECKS FOR ENGINEERING-BOOTCAMP ////

async function checkRepoName(owner, repo, expectedName = "engineering-bootcamp") {
  try {
    const repoInfo = await getRepoInfo(owner, repo);
    if (!repoInfo || !repoInfo.name) {
      console.error("Repo info not found or missing name field");
      return;
    }
    if (repoInfo.name === expectedName) {
      console.log(`Repo name matches expected: ${repoInfo.name}`);
    } else {
      console.log(
        `Repo name does NOT match expected. Got: ${repoInfo.name}, Expected: ${expectedName}`,
      );
    }
  } catch (err) {
    console.error("Error fetching repo info:", err.message);
  }
}

async function checkRepoStars(owner, repo, minStars = 100) {
  try {
    const repoInfo = await getRepoInfo(owner, repo);
    if (!repoInfo || typeof repoInfo.stargazers_count !== "number") {
      console.error("Repo info not found or missing stargazers_count field");
      return;
    }
    if (repoInfo.stargazers_count >= minStars) {
      console.log(
        `Repo has a good number of stars: ${repoInfo.stargazers_count}`,
      );
    } else {
      console.log(
        `Repo has less than ${minStars} stars: ${repoInfo.stargazers_count}`,
      );
    }
  } catch (err) {
    console.error("Error fetching repo info:", err.message);
  }
}

module.exports = {
  checkUserLogin,
  checkUserName,
  checkRepoName,
  checkRepoStars,
};
