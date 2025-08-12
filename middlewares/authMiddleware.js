const jwt = require('../utils/jwt');

const authenticate = (req, res, next) => {

  let token;

  // Check Authorization header first (works for Postman)
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // If no header token, check cookie (works for browser OAuth flow)
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ error: 'Authorization token new missing or malformed' });
  }

  try {
    const user = jwt.verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authenticate;
