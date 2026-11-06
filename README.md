# UniConnect

**Cross-platform student & staff interaction platform for Nasarawa State University, Keffi (NSUK) and beyond.**

UniConnect is a modern social and academic collaboration app designed for university communities. Students, lecturers, and staff can share status updates (disappear after 24h), posts (text with custom backgrounds, photos, videos), follow each other, engage in real-time, join communities, and participate in live tutorials with video calls and screen sharing.

## Key Features

- **Status posts**: 24-hour disappearing statuses with rich text styling (background colors, fonts).
- **Feed**: Following, Trending, My Department filters.
- **Trending algorithm**: Engagement score within first 24 hours (views, clicks, comments, replies, shares) with real-time updates.
- **Live sessions**: Video calls, screen sharing, raised hands for tutorials, lectures, and virtual meetings (powered by LiveKit).
- **Communities & Forums**: Department/course-specific groups, private messaging.
- **Verification**: Students (admission letter + ID), lecturers, SUG/faculty/departmental executives, staff — with unique badges.
- **Admin console**: Super admin + role-based permissions for verification queue, content moderation, user management.
- **Auth**: Google Sign-In + Email/Password (Argon2/bcrypt), 2FA for admins.
- **Cross-platform**: Single codebase for Web (Next.js), Android & iOS (React Native + Expo).

## Tech Stack

| Layer       | Technology                  | Reason |
|-------------|-----------------------------|--------|
| Mobile      | React Native + Expo         | One codebase for Android & iOS |
| Web         | Next.js (React)             | Shared logic with mobile |
| Backend     | NestJS (Node.js + TypeScript) | Structured, scalable, WebSockets |
| Real-time   | Socket.IO + Redis           | Instant engagement & trending |
| Database    | PostgreSQL                  | Users, posts, follows, faculties |
| Cache/Live  | Redis                       | Trending scores, status expiry |
| Video       | LiveKit (self-hostable)     | High-quality calls, screen share |
| Storage     | Cloud storage + CDN         | Media |
| Auth        | Passport + Google OAuth     | Secure |

## Project Structure

```
UniConnect/
├── mobile/          # Expo React Native app
├── web/             # Next.js web app
├── backend/         # NestJS API + WebSockets
├── data/            # NSUK faculties & departments
├── docs/            # Architecture, API docs
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL
- Redis
- Expo CLI / Android Studio / Xcode (for mobile)

### Setup
```bash
# Clone
git clone https://github.com/victorism/UniConnect.git
cd UniConnect

# Backend
cd backend && npm install && cp .env.example .env
# Configure DATABASE_URL, REDIS_URL, etc.
npm run start:dev

# Mobile
cd ../mobile && npm install
npx expo start

# Web
cd ../web && npm install
npm run dev
```

## NSUK Faculties (as of 2026 Senate decisions)

Based on the May 25, 2026 Senate approval unbundling the Faculty of Natural and Applied Sciences:

1. Administration
2. Agriculture (Lafia campus)
3. Arts
4. Communication & Media Studies
5. Computing
6. Education
7. Engineering
8. Environmental Sciences
9. Health Sciences
10. Law
11. Life Sciences
12. Physical Sciences
13. Social Sciences

> **Note**: Confirm exact department mappings and any pending Governing Council approvals with Academic Affairs before production launch. Departments are loaded dynamically in the signup flow.

## Roadmap

- [x] UI designs (7 key screens)
- [ ] Auth + signup with faculty/department picker
- [ ] Home feed + statuses
- [ ] Trending engine
- [ ] Live video integration
- [ ] Verification system
- [ ] Admin panel
- [ ] Communities & private chat
- [ ] Push notifications
- [ ] Production deployment

## Contributing

This project is being developed collaboratively. Pull requests and issues are welcome.

## License

MIT (or specify later)

---

*Built for the NSUK community — Knowledge for Development.*
