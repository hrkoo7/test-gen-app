const axios = require('axios');
const GITHUB_API_BASE = 'https://api.github.com';

const buildHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github.v3+json',
  'User-Agent': 'test-gen-app',
});

exports.getUserRepos = async (token) => {
  const res = await axios.get(`${GITHUB_API_BASE}/user/repos`, {
    headers: buildHeaders(token),
  });
  return res.data;
};

exports.getRepoFiles = async (owner, repo, token) => {
  const res = await axios.get(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`,
    { headers: buildHeaders(token) }
  );
  return res.data.tree.filter(item => item.type === 'blob');
};

exports.getFileContent = async (owner, repo, sha, token) => {
  const res = await axios.get(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/blobs/${sha}`,
    { headers: buildHeaders(token) }
  );
  return Buffer.from(res.data.content, 'base64').toString('utf8');
};
