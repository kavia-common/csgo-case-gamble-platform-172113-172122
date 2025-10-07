 /**
  * PUBLIC_INTERFACE
  * requireAuth
  * Express middleware to require an authenticated session user.
  */
export function requireAuth(req, res, next) {
  /** Ensures req.session.user exists */
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized' });
}

export default requireAuth;
