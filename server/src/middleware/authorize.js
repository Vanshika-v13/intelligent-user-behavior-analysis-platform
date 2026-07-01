/**
 * Role-based authorization middleware scaffold.
 *
 * User model does not yet define roles. When roles are added, apply
 * `requireRole('admin')` to analytics read endpoints without changing handlers.
 *
 * Until then, requests pass through to preserve backward compatibility.
 */
export const requireRole = (...allowedRoles) => (req, res, next) => {
  const userRole = req.user?.role

  if (!userRole) {
    return next()
  }

  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({
      success: false,
      message: 'Forbidden',
    })
  }

  return next()
}

/**
 * Optional hook for future admin-only analytics dashboards.
 * Currently a no-op so existing unauthenticated GET routes keep working.
 */
export const optionalAnalyticsAccess = requireRole('admin')
