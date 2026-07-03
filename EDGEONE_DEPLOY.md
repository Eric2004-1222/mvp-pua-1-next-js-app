# EdgeOne Makers Deployment Notes

This project can be migrated to EdgeOne Makers without changing app code.

## 1. Connect the repository

- Open `https://pages.edgeone.ai`
- Create a new project
- Connect the GitHub repository for this project

## 2. Framework and build

EdgeOne Makers states it has zero-config support for full-stack frameworks like Next.js.

If the console asks for manual values, use:

- Framework: `Next.js`
- Install command: `pnpm install`
- Build command: `pnpm run build`
- Start command: `pnpm run start`

If EdgeOne auto-detects Next.js, prefer the detected values.

## 3. Environment variables

Add these variables in the EdgeOne project settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ADMIN_PASSWORD`
- `SUPABASE_SERVICE_ROLE_KEY`

Do not expose `ADMIN_PASSWORD` or `SUPABASE_SERVICE_ROLE_KEY` to the browser.

## 4. Domain

For first testing, use the temporary EdgeOne domain.

If that works on mobile:

- Add your custom domain in EdgeOne
- Follow the DNS instructions in the console
- Wait for SSL to be issued automatically

## 5. Expected behavior

- The site entry should become easier to open on mainland China mobile networks than `vercel.app`
- Supabase is still hosted overseas, so login, submit, and admin requests may remain slower than the page shell itself

## 6. Verification checklist

- Open `/`
- Open `/cases`
- Open one case detail page
- Open `/submit-case`
- Submit one anonymous case
- Open `/admin`
- Open `/admin/analytics`
