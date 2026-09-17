# Parlance MyBiz (parlancemybiz.com.ph)

Modernized, secure, responsive static website for **Parlance MyBiz** Virtual Office & Conference Rooms in Makati CBD, Philippines.

---

## 🌟 Highlights
- **100% Static HTML5/CSS3/JS**: Zero server-side PHP to permanently eliminate RCE (Remote Code Execution) and web shell attack vectors.
- **Brand Palette**: Custom royal blue (`#105ba7`) and electric blue (`#2093df`) styling.
- **Serverless Form Handling**: Integrated with EmailJS SDK for contact and booking inquiries.
- **Automated CI/CD**: Pre-configured GitHub Actions workflow deploying to HostGator `public_html/` on push.
- **Hardened Security**: Includes `.htaccess` with security headers, HTTPS redirect, asset caching, and exploit blocking.

---

## 🚀 Pushing to GitHub

To link this directory to your new GitHub repository:

```bash
# 1. Create a new repository on GitHub (e.g. jdyyy1/parlancemybiz)
# 2. Link your local repo to GitHub:
git remote add origin https://github.com/jdyyy1/parlancemybiz.git

# 3. Push to GitHub:
git branch -M main
git push -u origin main
```

---

## 🔐 GitHub Secrets Setup

In your GitHub repository under **Settings > Secrets and variables > Actions**, add:
- `FTP_SERVER`: `gator4095.hostgator.com` (or your domain)
- `FTP_USERNAME`: `etpparlance`
- `FTP_PASSWORD`: `YourHostGatorPassword`

For more details, see [HOSTGATOR_GITHUB_ACTIONS_GUIDE.md](file:///c:/Users/jonat/parlancemybiz/HOSTGATOR_GITHUB_ACTIONS_GUIDE.md).
