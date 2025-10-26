# 🛒 RationEase — AI Smart Ration Queue Management System

### 🌾 “Smart Queues. Smarter Access. Empowering Every Citizen.”

---

## 📌 Overview

**RationEase** is an AI-powered digital queue and token management system designed to modernize public ration distribution.  
It eliminates long physical waiting lines by offering **real-time token tracking**, **SMS notifications**, and **AI-based wait-time predictions** for citizens — ensuring fair, transparent, and efficient ration delivery.

Built with **Supabase**, **React + Vite**, **TailwindCSS**, and **Deno functions**, RationEase empowers shop owners and citizens with a seamless and intelligent digital experience.

---

## 🚀 Key Features

### 👩‍💼 For Ration Shop Officers
- **Digital Token Approval Dashboard** — View, approve, or reject customer tokens.
- **Smart Queue Estimation** — ML-powered wait time predictions.
- **Automated SMS Alerts** — Notify customers when their turn is near.
- **Analytics Panel** — Track queue length, time, and served customers.

### 👨‍👩‍👧 For Citizens
- **Live Token Status** — Real-time updates on queue position.
- **SMS Notifications** — Multilingual alerts (English + Tamil).
- **Seamless Booking** — Token generation via the web app or kiosk.

---

## ⚙️ Tech Stack

| Component | Technology Used |
|------------|----------------|
| **Frontend** | React + Vite + TypeScript |
| **UI Library** | ShadCN/UI + Tailwind CSS |
| **Backend** | Supabase (PostgreSQL + Edge Functions) |
| **Serverless Function** | Deno (Twilio SMS Integration) |
| **Realtime Updates** | Supabase Realtime |
| **SMS API** | Twilio |
| **Deployment** | Vercel / Supabase Edge Functions |

---

## 📁 Project Structure

rationease/
├── supabase/
│ └── functions/
│ └── send-sms-notifications/
│ ├── index.ts
│ └── .env
├── src/
│ ├── components/
│ ├── pages/
│ ├── hooks/
│ ├── lib/
│ └── App.tsx
├── public/
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md


---

## 🔐 Environment Variables

Create a `.env` file inside  
`s‌upabase/functions/send-sms-notifications/` and add:

```bash
# Supabase Project Details
VITE_SUPABASE_URL="https://<your-project-id>.supabase.co"
VITE_SUPABASE_PROJECT_ID="<your-project-id>"
VITE_SUPABASE_PUBLISHABLE_KEY="<your-publishable-key>"

# Twilio Credentials
TWILIO_ACCOUNT_SID="<your-account-sid>"
TWILIO_AUTH_TOKEN="<your-auth-token>"
TWILIO_PHONE_NUMBER="+1XXXXXXXXXX"

## ⚙️ Setting Up Locally

```bash
# Clone the repository
git clone https://github.com/<your-username>/rationease.git

# Navigate to the project directory
cd rationease

🔗 Live Demo: https://rationease.vercel.app


## 📊 Dashboard Highlights

- ⏱ **Estimated wait time for each token (AI-powered)**
- 🔔 **Live SMS updates to customers**
- 🧾 **Token management panel for ration officers**
- 🌐 **Tamil + English bilingual user interface**
- 📉 **Analytics view of daily service efficiency**

---

## 🧠 Future Enhancements

- 🔍 **AI-based footfall prediction using historical data**
- 💳 **Integration with Aadhaar-linked ration cards**
- 🌎 **Offline kiosk version for rural deployment**
- 🧾 **Automated stock tracking and restock alerts**

