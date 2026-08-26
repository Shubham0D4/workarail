# Work à Rail

A [Next.js](https://nextjs.org) app (App Router, React 19, Tailwind CSS v4).

## Getting started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The sign-in page is at
[/signin](http://localhost:3000/signin).

## Structure

| Path                              | Purpose                                              |
| --------------------------------- | ---------------------------------------------------- |
| `app/page.tsx`                    | Landing page                                         |
| `app/signin/page.tsx`              | Sign-in page                                         |
| `app/forgot-password/page.tsx`    | Password reset request page                          |
| `app/admin/layout.tsx`            | Admin shell — top bar + nav                           |
| `app/admin/page.tsx`              | Redirects `/admin` → `/admin/dashboard`               |
| `app/admin/dashboard/page.tsx`    | Dashboard — stat tiles, chart, jobs table             |
| `app/ui/admin/`                   | Dashboard components                                  |
| `app/lib/admin-data.ts`           | Placeholder dashboard data — replace with queries     |
| `app/ui/auth-shell.tsx`           | Shared split layout — cover left, form right (35%)   |
| `app/ui/signin-form.tsx`           | Two-step form — Google + email, then password        |
| `app/ui/forgot-password-form.tsx` | Reset request form + confirmation panel              |
| `app/ui/logo-mark.tsx`            | Brand mark, shared by the auth pages and the rail     |
| `app/ui/styles.ts`                | Shared Tailwind class strings                        |
| `app/lib/auth-state.ts`           | Form state types and initial values                  |
| `app/actions/auth.ts`             | Server Actions (async exports only)                  |
| `public/signin-cover.svg`          | Cover artwork; replace with your own                 |

## Sign-in flow

Two steps, in the Google/Okta style:

1. **Continue with Google**, or enter an email address and press Continue.
2. Enter the password. The email is shown with a **Change** link back to step 1.

Step state lives in the Server Action's return value, so the flow works from a
single `useActionState` and survives a round trip without client-side routing.

**Forgot password** (`/forgot-password`) takes an email and confirms that a link
was sent. It reports the same result whether or not the account exists, so the
endpoint can't be used to discover which addresses are registered.

> A `'use server'` file may only export async functions — that's why the shared
> types and initial state live in `app/lib/auth-state.ts` rather than alongside
> the actions.

## Admin dashboard

`/admin/dashboard` — stat tiles, a 14-day stacked bar chart of hours, and a
recent-jobs table. `/admin` redirects here. All figures come from `app/lib/admin-data.ts`; swap it for real queries.

> **The route has no auth guard.** Anyone who knows the URL can open it. Before
> this goes anywhere real, read the session in `app/admin/layout.tsx` and
> `redirect('/signin')` when it is missing — and re-check inside every Server
> Action, since a layout check alone does not protect them.

The sidebar reuses the sign-in page's visual language: the same
`signin-cover.svg` artwork behind an `indigo-950/85` scrim, the same `LogoMark`,
and the indigo palette from the cover. Text on it clears WCAG AA against the
lightest pixel of the artwork (white 12.1:1, indigo-200 8.1:1, indigo-300
6.1:1). The focus ring goes white there, since an indigo ring would vanish.

Chart colours are the two leading categorical slots, validated against the
surfaces they render on (white / zinc-950): CVD ΔE 24.7 light and 26.8 dark,
normal-vision ΔE 33.6 / 31.8, all at least 3:1 against the surface. The dark
steps are chosen for the dark surface rather than flipped. A legend is always
shown, status colours always carry a label, and the chart has a **Table** toggle
so nothing depends on colour alone.

## Wiring up authentication

The Server Actions in `app/actions/auth.ts` validate their input and then stop
at a `TODO`:

- `signIn` — verify the credentials against your user store, create a session
  cookie (`httpOnly`, `secure`, `sameSite: 'lax'`), then `redirect()`.
- `signInWithGoogle` — redirect to your OAuth authorize URL and handle the
  callback in a route handler.
- `requestPasswordReset` — store a hashed, short-lived token and email the
  link. Rate-limit it, since it sends mail on demand.

See the [authentication guide](https://nextjs.org/docs/app/guides/authentication).

The sign-in page also links to `/signup`, which does not exist yet.
