import assert from "node:assert/strict";
import test from "node:test";
import { AuthConfigurationError, getSessionSecret } from "../app/lib/auth-secret.ts";

test("production supports each configured secret and keeps precedence", () => {
  assert.equal(getSessionSecret({ NODE_ENV: "production", JWT_SECRET: "jwt-value" }), "jwt-value");
  assert.equal(getSessionSecret({ NODE_ENV: "production", NEXTAUTH_SECRET: "next-value", JWT_SECRET: "jwt-value" }), "next-value");
  assert.equal(getSessionSecret({ NODE_ENV: "production", AUTH_SECRET: "auth-value", NEXTAUTH_SECRET: "next-value" }), "auth-value");
});

test("blank settings do not shadow a configured fallback", () => {
  assert.equal(getSessionSecret({ NODE_ENV: "production", AUTH_SECRET: "  ", JWT_SECRET: "jwt-value" }), "jwt-value");
});

test("production never uses the public development secret", () => {
  assert.throws(() => getSessionSecret({ NODE_ENV: "production" }), AuthConfigurationError);
  assert.throws(() => getSessionSecret({ NODE_ENV: "production", AUTH_SECRET: " " }), AuthConfigurationError);
});

test("development remains usable without production credentials", () => {
  assert.equal(getSessionSecret({ NODE_ENV: "development" }), "edsec-development-secret-change-this");
});
