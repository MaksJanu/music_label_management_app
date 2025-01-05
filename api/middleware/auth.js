export function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
}
  
export function ensureArtistRole(req, res, next) {
if (req.user && req.user.role === 'artist') {
    return next();
}
res.status(403).json({ message: 'Forbidden: Only artists can perform this action' });
}

export function ensureUserRole(req, res, next) {
  if (req.user && req.user.role === 'user') {
      return next();
  }
  res.status(403).json({ message: 'Forbidden: Only artists can perform this action' });
}