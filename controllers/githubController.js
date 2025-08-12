const githubService = require('../services/githubService');

exports.getUserRepos = async (req, res) => {
  try {
    const repos = await githubService.getUserRepos(req.user.githubToken);
    const simplified = repos.map(repo => ({
  id: repo.id,
  name: repo.name,
  full_name: repo.full_name,
  owner_login: repo.owner?.login,
  owner_url: repo.owner?.html_url
}));

res.json(simplified);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Could not fetch repos' });
  }
};

exports.getRepoFiles = async (req, res) => {
  try {
    const { owner, repo } = req.query;
    const files = await githubService.getRepoFiles(owner, repo, req.user.githubToken);
    res.json(files);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Could not fetch files' });
  }
};

exports.getFileContent = async (req, res) => {
  try {
    const { owner, repo, sha } = req.query;
    const content = await githubService.getFileContent(owner, repo, sha, req.user.githubToken);
    res.json({ content });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Could not fetch file content' });
  }
};
