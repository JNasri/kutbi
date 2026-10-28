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

This is also one of my first monolithic applications: the public website and admin dashboard share an Express backend, with PostgreSQL handling journals, packages, seasonal offers, and authentication sessions.

## What it includes

- **Bilingual experience:** Arabic and English content, with layouts that adapt between right-to-left and left-to-right.
- **Responsive design:** Desktop and mobile navigation, light and dark themes, and the company's green-and-gold visual identity.
- **Services and fleet:** Umrah visa requests, hospitality, transportation, and vehicle information.
- **Travel packages:** Silver, Gold, Diamond, and Platinum cards, with package details and inquiry forms.
- **Custom trip planner:** Choose travellers, stay dates, hotel category, transportation, and optional extra destinations.
- **Custom calendars:** A single-date calendar for package inquiries and a date-range calendar that calculates the trip duration.
- **WhatsApp inquiries:** Send selected package or custom trip details directly to the company.
- **Company journal:** A dedicated page for events and updates, individual articles, publication dates, and a rotating journal preview on the homepage.
- **Admin dashboard:** A bilingual, dark-mode workspace for journals, packages, and seasonal offers, with separate view/add actions, image uploads, and publication controls.
- **Image storage:** Journal, package, and offer uploads use S3-compatible object storage.

## Built with

**Frontend:** React, TypeScript, Vite, React Router, and CSS.

**Backend:** Node.js, Express, PostgreSQL, and Passport for username/password authentication.

**Uploads:** Multer and the AWS SDK for S3-compatible storage.

## How the code is organized

- **src/components/** — Reusable website sections and UI components.
- **src/pages/** — Journal, login, and admin dashboard pages.
- **src/siteContent.ts** — Arabic and English website content.
- **src/siteStyles.css** — Website styling and responsive layouts.
- **src/adminStyles.css** — Admin workspace, login, calendar, and responsive navigation.
- **shared/catalog.ts** — Shared package and seasonal-offer types.
- **server/** — API routes, authentication, database access, and upload handling.
- **public/images/** — Static assets such as service illustrations, fleet photos, and package artwork.

The React frontend communicates with the Express backend through API requests. The backend reads and writes content in PostgreSQL and handles image uploads separately.

## Managing content

The admin sidebar has three exclusive accordion sections: Journals, Packages, and Seasonal Offers. Journals is expanded by default. Each section has view and add actions. Admin pages always use dark mode, and the language control switches between Arabic and English.

Package editors include both languages' names, descriptions, prices, features, inquiry-button labels, and additional details, plus artwork, featured status, and display order. Seasonal-offer editors include bilingual titles and descriptions, images, image positioning, and display order. Lower display-order numbers appear first.

Drafts stay private. Published content is loaded by the public trips page. At most three seasonal offers can be published simultaneously; additional offers can be prepared as drafts.

Backend startup creates the catalog tables and imports the existing four packages and three offers once. Subsequent startups preserve edits and deletions. Restart the backend after updating to this version; no new environment variables are needed. Catalog image objects are retained when content is replaced or deleted so shared artwork stays available.

## Project status

**Actively being developed.** I'm continuing to refine the design, improve performance, and expand the website as the company's needs grow.
