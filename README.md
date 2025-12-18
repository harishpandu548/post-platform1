# 🖼️ Post Platform – Full Stack Next.js Application

A production-style full stack web application built using **Next.js App Router** that supports authentication, image uploads, role-based access control, and a scalable feed system.

This project was built as an assignment but designed to closely follow **real-world production patterns**.

---

##  Live Demo
 (Add your Vercel deployed link here)

---

## Tech Stack

**Frontend**
- Next.js (App Router)
- React
- Tailwind CSS
- Framer Motion (animations)
- Next/Image (optimized images)

**Backend**
- Next.js API Routes
- NextAuth (Credentials authentication)
- Prisma ORM
- PostgreSQL (Neon DB)
- Cloudinary (image storage)

**Other**
- JWT-based authentication
- Role-based access control (USER / ADMIN)
- Rate limiting
- Cursor-based pagination

---

## Features

###  Authentication & Authorization
- Signup & Login using email/password
- JWT-based session handling
- Protected routes with server-side redirects
- Logout functionality
- Role-based access (USER / ADMIN)

---

###  Post Management
- Upload image posts (file upload, not URL)
- Images stored securely in Cloudinary
- Posts displayed in a responsive grid
- Infinite scrolling feed
- Users can delete their own posts
- Admins can delete any post

---

###  Admin Access (Demo-Friendly)
- Secure `/admin` page
- Admin role can be enabled using a secret key
- Allows recruiters to test admin features without DB access
- Admin role persists via JWT after re-login

---

###  Scalability & Performance
- Cursor-based pagination to handle thousands of posts
- Infinite scrolling using Intersection Observer
- Rate limiting on API routes
- Optimized image loading using Next.js Image component
- Serverless backend via Next.js API routes

---

##  Application Flow

### Authentication Flow
1. User signs up or logs in
2. JWT token is created via NextAuth
3. Session is stored securely in cookies
4. Protected routes check authentication server-side

---

### Image Upload Flow
1. User selects image file
2. Frontend sends file via `FormData`
3. Backend uploads image to Cloudinary
4. Secure Cloudinary URL is saved in database
5. Image is rendered using `next/image`

---

### Feed & Pagination
- Posts are fetched in batches using cursor-based pagination
- Infinite scroll loads more posts as user scrolls
- Duplicate posts are prevented on the frontend
- Backend queries are optimized for scalability

---

##  Admin Role Explanation

- Users have a `role` field (`USER` or `ADMIN`)
- Admin permissions are enforced on the backend
- Frontend conditionally renders admin-only controls
- A secure admin page allows role promotion using an environment-based secret

This approach allows safe demo access while maintaining proper security practices.

---

###  Clone the repository
```bash
git clone <your-repo-url>
cd post-platform
