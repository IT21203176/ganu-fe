# Quick Setup Guide: ganuprofessional.lk

## 🚀 Quick Steps (15 minutes)

### 1. Add Domain in Vercel (5 min)
1. Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter: `ganuprofessional.lk`
4. Click **"Add"**
5. Vercel shows DNS instructions → **Copy them**

### 2. Configure DNS (5 min)
1. Go to your DNS provider (where domain is registered)
2. Add **A Record** (Vercel will provide IP):
   ```
   Type: A
   Name: @
   Value: [Vercel IP]
   ```
3. Add **CNAME Record** for www:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### 3. Set Environment Variables (2 min)
Vercel → **Settings** → **Environment Variables** → Add:

**Production:**
```
NEXT_PUBLIC_SITE_URL = https://ganuprofessional.lk
NEXT_PUBLIC_API_URL = https://ganu-be.vercel.app
```

### 4. Wait & Verify (3 min)
- Wait 24-48 hours for DNS propagation
- Check: https://dnschecker.org
- Test: https://ganuprofessional.lk

---

## ✅ What's Already Configured

Your code is ready! These files already use environment variables:
- ✅ `src/config/seo.ts` → Uses `NEXT_PUBLIC_SITE_URL`
- ✅ `src/app/robots.ts` → Uses environment variable
- ✅ `src/app/sitemap.ts` → Uses `siteConfig.url`
- ✅ `src/api/api.ts` → Uses `NEXT_PUBLIC_API_URL`
- ✅ `public/robots.txt` → Uses relative URL

**No code changes needed!** Just configure DNS and environment variables.

---

## 📋 Checklist

- [ ] Domain added in Vercel
- [ ] DNS records configured
- [ ] Environment variables set
- [ ] Wait for DNS propagation (24-48 hours)
- [ ] Test website on custom domain
- [ ] Verify SSL certificate (🔒)
- [ ] Update Google Search Console
- [ ] Update social media profiles
- [ ] Update business directories

---

## 🔧 Current Configuration

**Frontend:** Next.js on Vercel
**Backend API:** `https://ganu-be.vercel.app`
**New Domain:** `ganuprofessional.lk`
**Environment Variable:** `NEXT_PUBLIC_SITE_URL`

---

## ⚠️ Important Notes

1. **DNS Propagation:** Takes 24-48 hours globally
2. **SSL Certificate:** Vercel provides automatically (usually within minutes)
3. **Old Website:** Will go offline when DNS changes
4. **Backup:** Download current website before switching
5. **CORS:** Ensure backend allows requests from `ganuprofessional.lk`

---

## 🆘 Troubleshooting

**Website not loading?**
- Check DNS propagation: https://dnschecker.org
- Verify DNS records are correct
- Wait 24-48 hours

**SSL not working?**
- Wait a few hours after DNS propagation
- Check Vercel dashboard → Domains → SSL status

**API calls failing?**
- Check CORS on backend
- Verify `NEXT_PUBLIC_API_URL` is set correctly

---

## 📚 Full Guide

See `DOMAIN_MIGRATION_GUIDE.md` for complete details.

