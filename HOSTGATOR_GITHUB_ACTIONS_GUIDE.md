# Complete HostGator GitHub Actions CI/CD Deployment Guide

This guide explains how to set up, manage, and verify automated deployments from GitHub to your **HostGator cPanel** hosting account for all three websites.

---

## 1. Hosting Architecture & Directory Mapping

In your HostGator account (`/home3/etpparlance/`), your domains are structured as follows:

| Website Domain | Repository | HostGator Target Folder | Tech Stack & Security |
| :--- | :--- | :--- | :--- |
| **`parlancemybiz.com.ph`** | `parlancemybiz` | `/home3/etpparlance/public_html/` | **Static HTML5/CSS3/JS + EmailJS** *(Zero PHP, 100% RCE Immune)* |
| **`parlancebiz.com.ph`** | `jdyyy1/parlancebiz` | `/home3/etpparlance/parlancebiz.com.ph/` | **Static Portal (HTML/CSS/JS)** |
| **`etpassociates.com.ph`** | `shaeluh/ETP-JDKALBO-` | `/home3/etpparlance/etpassociates.com.ph/` | **Advisory & PHP Chatbot System** |

### Why `public_html` is Isolated from the Other Sites:
- In cPanel, **`parlancebiz.com.ph`** and **`etpassociates.com.ph`** are configured as **Addon Domains** located directly in `/home3/etpparlance/`, **outside** `public_html`.
- Therefore, deploying the modernized code into `public_html/` for `parlancemybiz.com.ph` will **never** alter, overwrite, or interfere with `parlancebiz.com.ph` or `etpassociates.com.ph`.

---

## 2. Understanding GitHub Secrets

### What Are GitHub Secrets?
GitHub Secrets are encrypted environment variables stored securely inside your GitHub repository settings. 
- **Security**: They ensure that sensitive server passwords and credentials are never written in plain text inside your code files or public commits.
- **Automation**: When a GitHub Actions workflow runs, it safely decrypts these secrets in memory to log into your HostGator FTP server and sync your files.

---

## 3. Finding Your HostGator FTP Credentials

You have two methods to connect GitHub Actions to HostGator:

### Method A: Using Your Primary cPanel Account (Simplest)
1. **FTP Server**: `gator4095.hostgator.com` (or `ftp.parlancemybiz.com.ph`)
2. **FTP Username**: `etpparlance`
3. **FTP Password**: Your HostGator cPanel Master Password
4. **FTP Port**: `21` (FTPS / Explicit TLS)

### Method B: Creating Dedicated FTP Accounts in cPanel (Recommended for Strict Isolation)
If you want each repository to have its own isolated login:
1. Log into your **HostGator cPanel**.
2. Under the **Files** section, click **FTP Accounts**.
3. Create an FTP account for each site:
   - **Site 1**: `deploy_main@parlancemybiz.com.ph` -> Directory: `public_html`
   - **Site 2**: `deploy_portal@parlancebiz.com.ph` -> Directory: `parlancebiz.com.ph`
   - **Site 3**: `deploy_etp@etpassociates.com.ph` -> Directory: `etpassociates.com.ph`
4. Note the passwords you assign.

---

## 4. Configuring Secrets in GitHub Repositories

For **each of the 3 repositories** on GitHub:

1. Open your repository on GitHub in your browser.
2. Click on the **Settings** tab (gear icon at the top).
3. In the left sidebar, expand **Secrets and variables** and click **Actions**.
4. Click the green **New repository secret** button.
5. Add the following 3 secrets:

| Secret Name | Secret Value Example |
| :--- | :--- |
| `FTP_SERVER` | `gator4095.hostgator.com` |
| `FTP_USERNAME` | `etpparlance` *(or your dedicated FTP username)* |
| `FTP_PASSWORD` | `YourHostGatorPassword` |

*(Optional)* If using dedicated FTP accounts whose home directory is already locked to the root, you can optionally set `FTP_SERVER_DIR` to `/`. Otherwise, the workflows default to their respective directory paths automatically.

---

## 5. How Automated Deployment Works

Each repository now has a workflow file located at `.github/workflows/deploy.yml`.

### Deployment Triggers:
1. **Automatic Push**: Every time you commit and run `git push origin main` (or `master`), GitHub Actions automatically launches a runner, connects securely via FTPS to HostGator, and synchronizes only the changed files.
2. **Manual Trigger (`workflow_dispatch`)**:
   - Go to the **Actions** tab on your GitHub repository.
   - Click on the deployment workflow on the left.
   - Click **Run workflow** -> Select `main` branch -> Click **Run workflow**.

---

## 6. How the Old Site's RCE & Bot Vulnerabilities Were Solved

### The Problem:
`parlancemybiz.com.ph` was originally built using an outdated Joomla 3.x PHP CMS with legacy plugins and configuration files. Attackers routinely scan shared hosting IPs for unpatched Joomla endpoints to execute arbitrary PHP scripts (Remote Code Execution) and install botnets/web shells.

### The Permanent Solution Implemented:
1. **100% Static Architecture**: The rebuilt `parlancemybiz.com.ph` has **zero server-side PHP files**. Everything runs as standard HTML5, CSS3, and modern clientside JavaScript.
2. **Serverless Forms via EmailJS**: Contact and booking inquiries are processed directly through the EmailJS API from the client's browser, meaning there are no vulnerable PHP form mailer scripts on your server.
3. **Hardened `.htaccess`**:
   - Explicitly disables the Apache PHP execution engine.
   - Returns a `403 Forbidden` on any web requests attempting to execute `.php`, `.phtml`, `.cgi`, or query strings containing `eval()`, `base64_decode`, or SQL keywords.
   - Automatically enforces HTTPS and injects enterprise security headers (`X-Frame-Options`, `X-Content-Type-Options`, `HSTS`, `Referrer-Policy`).

### Recommended Action in HostGator File Manager:
To ensure none of the old Joomla files linger on the server:
1. Log into **cPanel** -> **File Manager**.
2. Open `public_html`.
3. Create a backup zip of `public_html` if desired, then delete the obsolete Joomla folders:
   - `administrator/`
   - `bin/`
   - `cli/`
   - `components/`
   - `includes/`
   - `language/`
   - `layouts/`
   - `libraries/`
   - `logs/`
   - `media/`
   - `modules/`
   - `plugins/`
   - `templates/`
   - `tmp/`
   - `configuration.php`
   - Any suspicious `.php` files or error logs.
4. Once cleared, push your modernized `parlancemybiz` code to GitHub to deploy clean, modern files into `public_html`.

---

## 7. Quick Troubleshooting Reference

- **Workflow fails with "FTPS connection timed out"**: Verify `FTP_SERVER` is set to `gator4095.hostgator.com` and that port 21 is open.
- **Workflow fails with "Login incorrect"**: Check for trailing spaces when copying the password into GitHub Secrets.
- **Changes not showing immediately on the website**: Clear your browser cache or perform a hard refresh (`Ctrl + F5` or `Cmd + Shift + R`).
