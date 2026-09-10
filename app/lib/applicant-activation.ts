import crypto from "node:crypto";

const ACTIVATION_SECRET =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "edsec-development-secret-change-this";

const ACTIVATION_TTL_SECONDS = 60 * 60 * 72;

type ActivationPayload = {
  userId: string;
  applicationId: string;
  passwordFingerprint: string;
  exp: number;
};

function base64UrlEncode(value: string) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function base64UrlDecode(value: string) {
  return Buffer.from(
    value.replace(/-/g, "+").replace(/_/g, "/"),
    "base64",
  ).toString("utf8");
}

function sign(value: string) {
  return crypto
    .createHmac("sha256", ACTIVATION_SECRET)
    .update(value)
    .digest("base64url");
}

function fingerprintPasswordHash(passwordHash: string) {
  return crypto
    .createHash("sha256")
    .update(passwordHash)
    .digest("hex");
}

export function createApplicantActivationToken({
  userId,
  applicationId,
  passwordHash,
}: {
  userId: string;
  applicationId: string;
  passwordHash: string;
}) {
  const payload: ActivationPayload = {
    userId,
    applicationId,
    passwordFingerprint: fingerprintPasswordHash(passwordHash),
    exp: Math.floor(Date.now() / 1000) + ACTIVATION_TTL_SECONDS,
  };

  const encoded = base64UrlEncode(JSON.stringify(payload));
  return `${encoded}.${sign(encoded)}`;
}

export function verifyApplicantActivationToken(token: string) {
  try {
    const [encoded, signature] = token.split(".");

    if (!encoded || !signature) {
      return null;
    }

    const expected = sign(encoded);
    const actualBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);

    if (actualBuffer.length !== expectedBuffer.length) {
      return null;
    }

    if (!crypto.timingSafeEqual(actualBuffer, expectedBuffer)) {
      return null;
    }

    const payload = JSON.parse(base64UrlDecode(encoded)) as ActivationPayload;

    if (
      !payload.userId ||
      !payload.applicationId ||
      !payload.passwordFingerprint ||
      !payload.exp ||
      payload.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function activationMatchesPasswordHash(
  tokenFingerprint: string,
  passwordHash: string,
) {
  const currentFingerprint = fingerprintPasswordHash(passwordHash);

  const actual = Buffer.from(tokenFingerprint);
  const expected = Buffer.from(currentFingerprint);

  return (
    actual.length === expected.length &&
    crypto.timingSafeEqual(actual, expected)
  );
}
