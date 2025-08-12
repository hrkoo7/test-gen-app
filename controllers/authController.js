const { generateToken } = require('../utils/jwt');
const axios = require('axios');

exports.githubLogin = (req, res) => {
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo`;
  res.redirect(redirectUrl);
};

exports.githubCallback = async (req, res, next) => {
  try {
    const code = req.query.code;

    const response = await axios.post(`https://github.com/login/oauth/access_token`, {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }, {
      headers: { Accept: 'application/json' }
    });

    const accessToken = response.data.access_token;
    const userRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const user = {
      username: userRes.data.login,
      avatar: userRes.data.avatar_url,
      githubToken: accessToken,
    };

    const jwtToken = generateToken(user);

    // Set cookie with lax sameSite and path so browser will send it after GitHub redirect
    res.cookie('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',      // <-- important for cross-site OAuth redirect
      path: '/',            // <-- ensure cookie is sent to all routes on your domain
      maxAge: 7 * 24 * 60 * 60 * 1000, // optional: 7 days
    });

    // Redirect the browser back to your SPA route (keep FRONTEND_URL in .env)
    res.redirect(`${process.env.FRONTEND_URL}/testcase`);
  } catch (error) {
    next(error);
  }
};
