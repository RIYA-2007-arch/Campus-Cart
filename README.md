# CampusCart

A student-to-student second-hand marketplace for campus communities (first campus: AKS University, Satna).
Students verify their email with an OTP, list and discover products, chat with sellers and confirm a
handover with an OTP. CartMate, an AI assistant, answers in English, Hindi and Hinglish.

## Features
- Email OTP registration, login, password reset
- Categories and sub-categories (Electronics > Laptops, Books > DSA, and more) with filters and sorting
- Sell with photo upload and a fair-price suggestion
- Product detail, similar ads, seller profile, wishlist, report listing
- Buyer-seller chat with inbox, quick messages, and handover OTP to confirm the exchange
- My Ads: edit price, mark sold, remove
- CartMate multilingual assistant (Gemini API, with a built-in fallback when no key is set)
- Admin panel: statistics and reported listings

## Tech stack
React + Vite (frontend), Flask + SQLAlchemy (backend), MySQL (database), Gmail SMTP (OTP email),
Gemini API (assistant).

## Setup
1. Create the MySQL database `campuscart` and import `campuscart_backup.sql` if provided.
2. Backend:
   cd backend
   py -m pip install -r requirements.txt
   Create `backend/.env` with: DATABASE_URL, SECRET_KEY, MAIL_USERNAME, MAIL_APP_PASSWORD,
   ADMIN_EMAILS, GEMINI_API_KEY (optional)
   py app.py
3. Frontend:
   cd frontend
   npm install
   npm run dev
4. Open http://localhost:5173
5. Optional demo data: `py seed_demo.py` (remove with `py seed_demo.py --remove`)
6. Check everything: `py self_test.py`

## Project structure
backend/app.py       core API: auth, OTP, products, wishlist, upload, price suggestion
backend/extras.py    chat inbox, My Ads, admin reports
backend/more.py      sub-categories, catalog filters, similar ads, seller profile
backend/cartmate.py  multilingual assistant
backend/seed_demo.py demo catalog        backend/self_test.py automated checks
frontend/src/pages   screens              frontend/src/components  shared components

## Security notes
Passwords are hashed, OTPs are hashed with expiry and attempt limits, API actions use signed tokens,
uploads are checked by file signature, and secrets stay in `.env`.

## Future scope
Multiple photos per ad, seller ratings and reviews, push notifications, online deployment,
more campuses.