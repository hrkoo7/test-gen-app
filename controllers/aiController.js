const githubService = require('../services/githubService');
const geminiService = require('../services/geminiService');

exports.generateSummaries = async (req, res) => {
  const { owner, repo, files } = req.body;
  const token = req.user.githubToken;

  try {
    const fileData = await Promise.all(
      files.map(async f => ({
        filename: f.path,
        content: await githubService.getFileContent(owner, repo, f.sha, token)
      }))
    );

    const summaries = await geminiService.getTestSummaries(fileData);
    res.json({ summaries });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate summaries' });
  }
};

exports.generateTestCode = async (req, res) => {
  const { summary, file } = req.body;
  // file: { path, sha }
  const token = req.user.githubToken;

  try {
    const content = await githubService.getFileContent(req.body.owner, req.body.repo, file.sha, token);
    const code = await geminiService.getTestCodeFromSummary(summary, content);
    res.json({ code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate test code' });
  }
};
