# 🚀 JanSathi 2.0 - Complete Render & MongoDB Atlas Deployment Guide

This guide walks you step-by-step through deploying **JanSathi 2.0** completely for free on **Render** (Backend Web Service + Frontend Static Site) with **MongoDB Atlas** (Cloud Database).

---

## 📋 Prerequisites Checklist

Before beginning, ensure you have free accounts on:
1. [GitHub](https://github.com/) (to host your code repository)
2. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (to host the cloud database)
3. [Render](https://render.com/) (to host both the Backend API and React Frontend)
4. [Google AI Studio](https://aistudio.google.com/) (for your Gemini API key)

---

## 🗄️ Step 1: Set Up MongoDB Atlas (Cloud Database)

1. **Log in** to your [MongoDB Atlas account](https://cloud.mongodb.com/).
2. **Create a Free Cluster**:
   - Click **Create Deployment** (or **Build a Database**).
   - Select the **M0 (Free)** tier.
   - Choose a cloud provider and region close to your users (e.g., AWS / Mumbai `ap-south-1` or Oregon `us-west-2`).
   - Cluster Name: `JanSathiCluster` (or default `Cluster0`).
   - Click **Create Deployment**.
3. **Create Database User**:
   - Under **Database Access** (left sidebar):
   - Click **Add New Database User**.
   - Authentication Method: **Password**.
   - Username: e.g. `jansathi_admin`.
   - Password: Choose a secure password (make sure to avoid special characters like `@` or `:` inside the password, or URL-encode them).
   - Database User Privileges: **Read and write to any database** (Atlas admin or dbAdminAnyDatabase).
   - Click **Add User**.
4. **Configure Network Access (Crucial)**:
   - Under **Network Access** (left sidebar):
   - Click **Add IP Address**.
   - Select **Allow Access from Anywhere** (`0.0.0.0/0`).
   - *Why?* Render's free tier uses dynamic IP addresses, so Atlas needs to allow incoming connections from anywhere.
   - Click **Confirm**.
5. **Get Connection String**:
   - Go back to **Database** (left sidebar) -> click **Connect**.
   - Choose **Drivers** (Node.js).
   - Copy the connection string. It looks like:
     ```text
     mongodb+srv://jansathi_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
     ```
   - Replace `<password>` with the database password you created in step 3.
   - Append the database name `/jansathi` right before the `?`, for example:
     ```text
     mongodb+srv://jansathi_admin:MySecurePass123@cluster0.xxxxx.mongodb.net/jansathi?retryWrites=true&w=majority&appName=Cluster0
     ```
   - Save this string for Step 3.

---

## 🐙 Step 2: Push Your Project to GitHub

1. Open a terminal in the project root: `c:\Users\bhara\Desktop\JanSathi2.0-main`
2. Initialize git and commit your files:
   ```bash
   git init
   git add .
   git commit -m "feat: configure project for Render production deployment"
   ```
3. Create a new repository on [GitHub](https://github.com/new) (e.g., `jansathi-2.0`). Leave it empty (do NOT initialize with README).
4. Link and push your repository:
   ```bash
   git remote add origin https://github.com/<your-username>/jansathi-2.0.git
   git branch -M main
   git push -u origin main
   ```

---

## ⚡ Step 3: Deploy on Render

You can deploy using either **Method A (Automated Blueprint)** or **Method B (Manual Setup)**.

### 🌟 Method A: Automated Deployment via Render Blueprint (Fastest)

Because this repository includes [render.yaml](file:///c:/Users/bhara/Desktop/JanSathi2.0-main/render.yaml), Render can deploy both the frontend and backend in one click!

1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** in the top right and select **Blueprint**.
3. Connect your GitHub account and select your `jansathi-2.0` repository.
4. Render will detect `render.yaml` and show the two services:
   - `jansathi-backend` (Web Service)
   - `jansathi-frontend` (Static Site)
5. Fill in the required environment variables prompted by Render:
   - `MONGO_URI`: Your MongoDB Atlas connection string from Step 1.
   - `GEMINI_API_KEY`: Your Google Gemini API key.
   - Render will automatically auto-generate `JWT_SECRET` and auto-link `FRONTEND_URL` and `VITE_API_URL`.
6. Click **Apply**.
7. Wait 2-3 minutes while Render builds and deploys both services.

---

### 🛠️ Method B: Manual Setup via Render Dashboard

If you prefer configuring each service step-by-step:

#### Part 1: Deploy Backend Web Service
1. In Render Dashboard, click **New +** -> **Web Service**.
2. Select your `jansathi-2.0` GitHub repository.
3. Configure the following settings:
   - **Name**: `jansathi-backend`
   - **Region**: Oregon (or Singapore/Frankfurt)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
4. Expand **Advanced** -> **Environment Variables**:
   Add the following variables:
   | Key | Value | Notes |
   |---|---|---|
   | `NODE_ENV` | `production` | Production environment |
   | `PORT` | `5000` | (Render auto-allocates, but sets fallback) |
   | `MONGO_URI` | `mongodb+srv://.../jansathi?...` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | `generate-a-strong-random-key` | Any 32+ character random string |
   | `GEMINI_API_KEY` | `your_gemini_api_key` | From Google AI Studio |
   | `FRONTEND_URL` | `https://jansathi-frontend.onrender.com` | (Update with your actual frontend URL after creating it) |
5. Click **Create Web Service**.
6. Note down your backend URL (e.g. `https://jansathi-backend.onrender.com`).
7. Test the health check endpoint: Open `https://jansathi-backend.onrender.com/api/health` in your browser. You should see `{"success": true, "message": "Server is running"}`.

#### Part 2: Deploy Frontend Static Site
1. In Render Dashboard, click **New +** -> **Static Site**.
2. Select your `jansathi-2.0` GitHub repository.
3. Configure the following settings:
   - **Name**: `jansathi-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Expand **Advanced** -> **Environment Variables**:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://jansathi-backend.onrender.com` (Your backend URL from Part 1) |
5. Under **Redirects/Rewrites**:
   - Click **Add Rewrite / Redirect**
   - Source: `/*`
   - Destination: `/index.html`
   - Action: `Rewrite`
   *(Note: The included `frontend/public/_redirects` file also handles this automatically)*.
6. Click **Create Static Site**.
7. Once deployed, copy your frontend URL (e.g. `https://jansathi-frontend.onrender.com`).
8. Return to `jansathi-backend` settings -> **Environment Variables** -> ensure `FRONTEND_URL` is set to this frontend URL.

---

## 🔑 Step 4: Seed Default Admin & Demo Data

Once your backend is connected to MongoDB Atlas, you need an admin account to log in to the admin portal:

### Option 1: Run Seed from Your Local Machine (Easiest)
You can connect directly from your machine to your MongoDB Atlas database to populate initial data:
1. In your local `backend/.env`, temporarily update `MONGO_URI` with your MongoDB Atlas connection string.
2. In terminal, navigate to `backend`:
   ```bash
   cd backend
   npm run seed:admin
   ```
   *Output:*
   ```text
   Admin seed completed successfully!
   Email: admin@jansathi.gov.in
   Password: Admin@123
   ```
3. To populate sample complaints and test users as well:
   ```bash
   npm run seed
   ```

### Option 2: Run Seed from Render Shell
1. Go to your `jansathi-backend` service on Render.
2. Click on the **Shell** tab on the left.
3. Type:
   ```bash
   node seed.js
   ```
   Press Enter. The admin account is created directly in the production database!

---

## 🎯 Step 5: Verification & Testing

Visit your deployed frontend URL (e.g., `https://jansathi-frontend.onrender.com`):

1. **Public Grievance Lodging**:
   - Click **Lodge Grievance**.
   - Submit a test complaint with an image/description.
   - Verify that you receive a unique tracking ID (e.g. `GRV-2026-XXXX`).
2. **Track Status**:
   - Go to **Track Status** and enter your tracking ID.
   - Verify complaint details and AI categorization load properly.
3. **Citizen Login / Register**:
   - Register a citizen account.
   - Verify you can log in and view personal complaints in the dashboard.
4. **Admin Portal**:
   - Go to `/admin` or click Admin in the menu.
   - Login with:
     - **Email**: `admin@jansathi.gov.in`
     - **Password**: `Admin@123`
   - Verify the admin analytics dashboard, complaint management table, and status update modals work properly.

---

## 🛡️ Production Security & Performance Best Practices

1. **Free Tier Cold Starts**: Render's free tier spins down web services after 15 minutes of inactivity. The first request after a sleep period may take 30-50 seconds to wake up. To prevent this, you can set up a free uptime monitor like [UptimeRobot](https://uptimerobot.com/) or [Cron-Job.org](https://cron-job.org/) to ping `https://jansathi-backend.onrender.com/api/health` every 10 minutes.
2. **Change Default Credentials**: Change the admin password after initial login.
3. **Database Security**: Never share your MongoDB Atlas credentials or commit `.env` files to git.
4. **CORS Whitelist**: Ensure `FRONTEND_URL` strictly points to your production domain in Render backend settings.
