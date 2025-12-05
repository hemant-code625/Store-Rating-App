# Store Rating App

A web application that lets users submit ratings for stores registered on the platform. Ratings range from 1 to 5. The app includes a single login system and role-based access for three roles: System Administrator, Normal User, and Store Owner.

## Tech Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS
- **Backend:** Express.js
- **Package Manager / Tooling:** `pnpm`, Vite, `@vitejs/plugin-react`
- **Dev & Quality:** ESLint, Prettier, Nodemon
- **Database:** XAMPP MySQL (accessed via `mysql2`)
- **Authentication:** JWT (`jsonwebtoken`)
- **Containerization:** Docker

## Features

- Role-based authentication and authorization (System Administrator, Normal User, Store Owner).
- Normal users can sign up, browse stores, submit and modify ratings (1-5).
- Store owners can view ratings submitted for their stores and see average ratings.
- System administrators can manage stores and users, view dashboards and filtered listings.
- Robust form validations and sortable listings across key fields.

## User Roles & Capabilities

- **System Administrator**

  - Add new stores, normal users, and admin users.
  - Dashboard with totals: users, stores, submitted ratings.
  - View and filter lists of stores and users by Name, Email, Address, Role.
  - See user/store details; show Store Owner rating where applicable.
  - Logout.

- **Normal User**

  - Sign up and login.
  - Update password after login.
  - View searchable list of stores (search by Name and Address).
  - Store listing shows: Store Name, Address, Overall Rating, User's Submitted Rating, options to submit or modify a rating.
  - Submit and edit ratings (1–5).
  - Logout.

- **Store Owner**
  - Login and update password.
  - Dashboard: list of users who rated their store and the store's average rating.
  - Logout.

## Form Validation Rules

- Name: min 20 characters, max 60 characters.
- Address: max 400 characters.
- Password: 8–16 characters; must include at least one uppercase letter and one special character.
- Email: standard email validation.

All tables support ascending/descending sorting on key fields like Name and Email.
