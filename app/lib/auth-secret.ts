export class AuthConfigurationError extends Error {
  constructor() {
    super("Configure AUTH_SECRET, NEXTAUTH_SECRET, or JWT_SECRET in the deployment environment.");
    this.name = "AuthConfigurationError";
  }
}

// Resolve at request time so static builds do not need production credentials.
export function getSessionSecret(env: NodeJS.ProcessEnv = process.env): string {
  for (const name of ["AUTH_SECRET", "NEXTAUTH_SECRET", "JWT_SECRET"]) {
    const value = env[name];
    if (value?.trim()) return value;
  }
  if (env.NODE_ENV === "production") throw new AuthConfigurationError();
  return "edsec-development-secret-change-this";
}
