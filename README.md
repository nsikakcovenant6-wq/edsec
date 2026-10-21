This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Production sign-in configuration

Set `AUTH_SECRET` to a securely generated random value in the hosting environment,
then redeploy. `NEXTAUTH_SECRET` and the existing `JWT_SECRET` setting are also
accepted, in that order of precedence. Never put these values in source control
or a `NEXT_PUBLIC_` variable. Use the same setting across deployments that should
share sessions; changing it signs existing users out.

Login requires `DATABASE_URL` as well. If `/api/auth/login` returns
`AUTH_NOT_CONFIGURED` (503), configure the session secret and redeploy. For other
500 responses, inspect the server's `LOGIN_ERROR` log for the database or runtime
failure; do not share credentials or full connection strings.

Run authentication configuration regression checks with:

```bash
node --test tests/auth-secret.test.mjs
```
