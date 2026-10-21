// Keep the legacy import path on the same session implementation.
export {
  createLoginSession,
  destroyLoginSession,
  getCurrentUser,
  requireUser,
  requireAdmin,
  requireRole,
  type UserRole,
} from "@/app/lib/auth";
