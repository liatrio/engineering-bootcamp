const { Octokit } = require("octokit");

/**
 * Fetches public repository info using Octokit.
 * @param {string} owner - The repo owner (e.g., 'liatrio')
 * @param {string} repo - The repo name (e.g., 'engineering-bootcamp')
 * @returns {Promise<object>} - The repository info object
 */
async function getRepoInfo(owner, repo) {
  const octokit = new Octokit();
  const { data } = await octokit.rest.repos.get({
    owner,
    repo,
  });
  return data;
}

/**
 * Fetches public user info using Octokit.
 * @param {string} username - The GitHub username (e.g., 'chrisjblackburn')
 * @returns {Promise<object>} - The user info object
 */
async function getUserInfo(username) {
  const octokit = new Octokit();
  const { data } = await octokit.rest.users.getByUsername({
    username,
  });
  return data;
}

module.exports = { getRepoInfo, getUserInfo };
