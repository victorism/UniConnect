# UniConnect Architecture

## Overview
Monorepo-style project with shared types where possible.

### Mobile (Expo)
- Navigation: Expo Router or React Navigation
- State: Zustand or React Query + Context
- Styling: NativeWind (Tailwind for RN) or StyleSheet
- Video: LiveKit React Native SDK

### Web (Next.js)
- App Router
- Shared components via monorepo package (future: Turborepo)
- Real-time: Socket.IO client

### Backend (NestJS)
- Modules: Auth, Users, Posts, Trending, LiveSessions, Communities, Admin, Verification
- Guards: Role-based (Student, Lecturer, Staff, Executive, Admin, SuperAdmin)
- WebSockets gateway for live engagement and chat
- Cron or Redis TTL for status expiry and trending windows

## Trending Score
```
score = (views + clicks*2 + replies*3 + comments*4 + shares*5) / hours_since_posting
```
Posts leave the trending list after 24 hours. Filters: All NSUK / Faculty / Department / Campus.

## Verification Flow
1. User selects type (Student / Lecturer / Executive / Staff)
2. Uploads required documents
3. Enters verification queue
4. Admin reviews against school records
5. On approval → badge issued (green student, blue lecturer, brown executive, grey staff)

## Security
- JWT + refresh tokens
- Rate limiting
- 2FA mandatory for admin roles
- Document uploads scanned / private storage
