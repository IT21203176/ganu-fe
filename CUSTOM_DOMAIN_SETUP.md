# Quick Guide: Switching to Custom Domain

## ✅ Yes, You Can Switch!

Your code is **already configured** to use environment variables, so switching is easy!

---

## What You Need to Do

### 1. Add Domain in Vercel (5 minutes)

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `ganuprofessional.lk`)
4. Follow DNS setup instructions
5. Wait for DNS propagation (24-48 hours)

### 2. Set Environment Variable (2 minutes)

1. In Vercel → **Settings** → **Environment Variables**
2. Add:
   - **Name:** `NEXT_PUBLIC_SITE_URL`
   - **Value:** `https://yourdomain.com` (your actual domain)
   - **Environment:** Production
3. Click **"Save"**
4. Vercel will automatically redeploy

### 3. Update Google Search Console (10 minutes)

1. Add **new property** with your custom domain
2. Verify ownership
3. Submit sitemap: `sitemap.xml`
4. Keep old Vercel property for 1-2 months (for redirects)

### 4. Update Other Services

- Google Business Profile → Update website URL
- Facebook → Update website link
- LinkedIn → Update company website
- Business directories → Update URLs

---

## What's Already Done ✅

Your code already uses environment variables:
- ✅ `src/config/seo.ts` → Uses `NEXT_PUBLIC_SITE_URL`
- ✅ `src/app/robots.ts` → Uses `NEXT_PUBLIC_SITE_URL`
- ✅ `src/app/sitemap.ts` → Uses `siteConfig.url`
- ✅ `public/robots.txt` → Updated to use relative URL

**No code changes needed!** Just set the environment variable.

---

## Important Notes

### DNS Setup
- Vercel will provide DNS records to add
- Usually: A record or CNAME record
- Takes 24-48 hours to propagate globally

### SSL Certificate
- Vercel provides SSL automatically
- Usually active within minutes
- Check for 🔒 in browser

### Old Domain
- Vercel automatically redirects old URLs
- Keep both domains in Search Console for 1-2 months
- Old links will still work (redirected)

### SEO Impact
- 301 redirects preserve SEO value
- Rankings may take 2-4 weeks to transfer
- Old domain can be removed after transition

---

## Checklist

- [ ] Domain purchased
- [ ] Add domain in Vercel
- [ ] Configure DNS records
- [ ] Set `NEXT_PUBLIC_SITE_URL` environment variable
- [ ] Wait for DNS propagation (24-48 hours)
- [ ] Test website on custom domain
- [ ] Verify SSL certificate (🔒)
- [ ] Add to Google Search Console
- [ ] Submit sitemap
- [ ] Update Google Business Profile
- [ ] Update social media profiles
- [ ] Update business directories

---

## After Setup

### Week 1
- Monitor both domains
- Verify redirects work
- Check for any issues

### Week 2-4
- Monitor Search Console
- Check indexing
- Update remaining links

### Month 2+
- Remove old Vercel property
- Focus on custom domain SEO

---

## Need Help?

I can help with:
- DNS configuration
- Environment variable setup
- Troubleshooting domain issues

Just share your domain name and I can provide specific instructions! 🚀

