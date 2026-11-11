# UniConnect

**A social and academic platform for students, lecturers and staff at Nasarawa State University, Keffi (NSUK), built to grow to other universities.**

One codebase gives you three things: a **website** (with a desktop layout), an **Android app** and an **iOS app**. The backend serves the website itself, so one server runs everything.

## Features

### Everyone
- **Sign up and log in.**
  - Email and password, or Google.
  - People choose student, lecturer or staff (academic or non-academic), then their faculty, department and level. All 13 NSUK faculties are loaded.
- **Profiles:** profile picture, bio and username. Post, follower and following counts update live.
- **Posts:**
  - text on 10 backgrounds in 4 fonts
  - photos (up to 10 MB) and videos (up to 100 MB)
- **Statuses** that disappear 24 hours after posting. They play full-screen, and the owner sees a live view count.
- **Feeds:** Following, My Department and My Faculty.
- **Trending:** the most engaged posts within 24 hours of posting, across all of NSUK, your faculty or your department.
- **Engagement:**
  - likes, comments and replies
  - shares
  - views (counted once per person) and clicks
  - every count updates live on everyone's screen
- **Communities**, for course groups (e.g. CSC 301), departments, clubs and study groups:
  - public communities, or private ones that people join with an invite code
  - posts, a group chat and live sessions inside each community
  - owner and moderator roles
- **Chat:**
  - private one-to-one messages, plus each community's group chat
  - photos
  - "typing…" and "Seen" indicators
  - unread counts
  - messages arrive instantly
- **Live tutorials, classes and meetings** (video):
  - camera, microphone and **screen sharing**
  - chat and raised hands
  - start now or schedule ahead; members or followers are notified
  - **view-only mode** for lectures and management meetings: only the host presents, and others can raise a hand
  - the host can end the session for everyone
- **Verification and badges:**
  - Students upload their **admission letter** and **ID card**.
  - Lecturers and staff upload their **staff ID**.
  - SUG, faculty and departmental executives add their **office** and an election or appointment letter.
  - Badge colours: students green, lecturers blue, executives brown (with their office shown), staff grey.
- **Notifications:** follows, likes, comments, replies, people going live, community joins and verification results. They appear instantly.
- **Reporting:** anyone can report a post (spam, harassment, exam malpractice and more). Reporters stay anonymous.

### Admins
- **Super admin plus admins with chosen permissions:**
  - verify users
  - moderate content
  - manage users
  - manage faculties
  - manage live sessions
  - change settings

  Only the super admin can add or remove admins.
- **Two-step login is required for every admin**, using an authenticator app such as Google Authenticator, Microsoft Authenticator or Authy.
- **Console pages:**
  - Overview
  - Verification queue, with the documents side by side
  - Reports
  - Users: search, suspend or restore, give a badge, move to another department
  - Live sessions
  - Faculties and departments
  - Settings: pause sign-ups, an announcement banner for everyone, and who may host live sessions or create communities (anyone, or verified accounts only)
  - Admins and roles
  - **Audit log** of every admin action

### Security
- **Passwords:**
  - hashed with bcrypt
  - an account locks for 15 minutes after 5 wrong passwords
  - logins and sign-ups are rate-limited
- **Sessions:**
  - login tokens are kept in the phone's secure storage
  - "log out on all devices" is available
  - a password change signs out every other device
- **Verification documents:**
  - stored privately, never in the public uploads folder
  - admins open them through links that expire after 15 minutes
  - deleted when a request is rejected
- **Suspensions** sign the person out immediately.
- **Private content:** private communities and their posts are hidden from non-members, and chats are visible only to their members.

## Tech stack

| Part | Technology |
|---|---|
| App: web, Android, iOS | React Native + **Expo** (SDK 58), Expo Router, TanStack Query |
| Backend | **Node.js + TypeScript**, Express 5, Zod validation |
| Database | **PostgreSQL** via Drizzle ORM (SQL migrations in `backend/drizzle/`) |
| Live updates and chat | Socket.IO |
| Video | **LiveKit** (LiveKit Cloud, or self-hosted) |
| Uploads | Local disk (`backend/uploads/`). Move to S3 or Cloudflare R2 for large deployments. |

```
UniConnect/
├── backend/   API, database, live updates, chat, video tokens; also serves the website
├── mobile/    The app (web, Android, iOS)
├── data/      Earlier NSUK faculty list (see "NSUK faculties" below)
└── docs/      Architecture and API notes
```

(Full README continues with setup, NSUK faculties, etc. - updated from previous version.)