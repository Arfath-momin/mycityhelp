export function roleAuth(...allowedRoles) {
  return (handler) => {
    return async (req, res) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Access forbidden' });
      }

      return handler(req, res);
    };
  };
} 