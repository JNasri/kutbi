<p align="center">
  <img src="public/images/alkutbi-logo-transparent.png" alt="Al Kutbi Group logo" width="110" />
</p>

<h1 align="center">Al Kutbi Group | مجموعة الكتبي</h1>

<p align="center">
  <strong>A bilingual travel and Umrah website, built from frontend to backend.</strong>
</p>

<p align="center">
  Arabic & English · Custom Trip Planning · Company Journal · Admin Dashboard
</p>

---

## About the project

I'm building a full-stack website for Al Kutbi Group, a company serving visitors to Makkah and Madinah. The project brings the company's services, fleet, travel packages, and updates into one responsive experience.

This is also one of my first monolithic applications: the public website and admin dashboard share an Express backend, with PostgreSQL handling journal content and authentication sessions.

## What it includes

- **Bilingual experience:** Arabic and English content, with layouts that adapt between right-to-left and left-to-right.
- **Responsive design:** Desktop and mobile navigation, light and dark themes, and the company's green-and-gold visual identity.
- **Services and fleet:** Umrah visa requests, hospitality, transportation, and vehicle information.
- **Travel packages:** Silver, Gold, Diamond, and Platinum cards, with package details and inquiry forms.
- **Custom trip planner:** Choose travellers, stay dates, hotel category, transportation, and optional extra destinations.
- **Custom calendars:** A single-date calendar for package inquiries and a date-range calendar that calculates the trip duration.
- **WhatsApp inquiries:** Send selected package or custom trip details directly to the company.
- **Company journal:** A dedicated page for events and updates, individual articles, publication dates, and a rotating journal preview on the homepage.
- **Admin dashboard:** Sign in to create, edit, and delete journal posts, with cover images and additional article images.
- **Image storage:** Journal uploads use S3-compatible object storage.

## Built with

**Frontend:** React, TypeScript, Vite, React Router, and CSS.

**Backend:** Node.js, Express, PostgreSQL, and Passport for username/password authentication.

**Uploads:** Multer and the AWS SDK for S3-compatible storage.

## How the code is organized

- **src/components/** — Reusable website sections and UI components.
- **src/pages/** — Journal, login, and admin dashboard pages.
- **src/siteContent.ts** — Arabic and English website content.
- **src/siteStyles.css** — Website styling and responsive layouts.
- **server/** — API routes, authentication, database access, and upload handling.
- **public/images/** — Static assets such as service illustrations, fleet photos, and package artwork.

The React frontend communicates with the Express backend through API requests. The backend reads and writes journal data in PostgreSQL and handles image uploads separately.

## Project status

**Actively being developed.** I'm continuing to refine the design, improve performance, and expand the website as the company's needs grow.
