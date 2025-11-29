# Switching to Custom Domain - Complete Guide

## ✅ Yes, You Can Use Your Real Domain!

Using a custom domain is **better for SEO** because:
- ✅ More professional and trustworthy
- ✅ Better brand recognition
- ✅ Easier to remember
- ✅ Better for local SEO
- ✅ Can build domain authority over time

---

## Step-by-Step Process

### Step 1: Add Custom Domain in Vercel

1. Go to **Vercel Dashboard** → Your Project
2. Click **"Settings"** → **"Domains"**
3. Click **"Add Domain"**
4. Enter your domain (e.g., `ganuprofessional.lk` or `www.ganuprofessional.lk`)
5. Follow Vercel's instructions to configure DNS:
   - Add A record or CNAME record
   - Point to Vercel's servers
   - Wait for DNS propagation (can take 24-48 hours)

**Important:** Vercel will automatically handle SSL certificates for your custom domain!

---

### Step 2: Set Environment Variable

1. In Vercel Dashboard → **Settings** → **Environment Variables**
2. Add new variable:
   - **Name:** `NEXT_PUBLIC_SITE_URL`
   - **Value:** `https://yourdomain.com` (or `https://www.yourdomain.com`)
   - **Environment:** Production (and Preview if needed)
3. Click **"Save"**
4. **Redeploy** your site (Vercel will do this automatically)

---

### Step 3: Update Code Files

I'll update these files for you:
- ✅ `src/config/seo.ts` - Already uses env variable (no change needed)
- ✅ `src/app/robots.ts` - Already uses env variable (no change needed)
- ✅ `public/robots.txt` - Needs update

---

### Step 4: Update Google Search Console

**Important:** You need to add your custom domain as a NEW property!

1. Go to **Google Search Console**
2. Click **"Add Property"**
3. Choose **"URL prefix"** method
4. Enter: `https://yourdomain.com` (your custom domain)
5. Verify ownership (same method as before)
6. Submit sitemap: `sitemap.xml`
7. **Keep the old Vercel property** for now (you can remove it later)

**Why keep both?**
- Redirects from old domain will still work
- You can monitor both during transition
- Remove Vercel property after 1-2 months

---

### Step 5: Update Other Services

#### Google Business Profile
- Update website URL to your custom domain
- Update in business information

#### Social Media Profiles
- **Facebook:** Update website link
- **LinkedIn:** Update company website
- **Twitter/X:** Update bio website link

#### Business Directories
- Update website URL in all directory listings
- Yellow Pages, Lanka Directory, etc.

#### Analytics
- Update website URL in Google Analytics
- Update any tracking codes if needed

---

## What Happens to Old Vercel Domain?

**Good news:** Vercel automatically redirects!

- Old URL: `https://ganu-fe.vercel.app`
- New URL: `https://yourdomain.com`
- Vercel will redirect old URLs to new domain
- This helps preserve SEO value
- Links to old domain still work

---

## Checklist

### Before Switching
- [ ] Domain purchased and ready
- [ ] DNS access available
- [ ] Know your domain registrar

### During Setup
- [ ] Add domain in Vercel
- [ ] Configure DNS records
- [ ] Set `NEXT_PUBLIC_SITE_URL` environment variable
- [ ] Update `public/robots.txt`
- [ ] Wait for DNS propagation (24-48 hours)
- [ ] Verify SSL certificate is active

### After Setup
- [ ] Test website on custom domain
- [ ] Verify sitemap: `https://yourdomain.com/sitemap.xml`
- [ ] Verify robots.txt: `https://yourdomain.com/robots.txt`
- [ ] Add to Google Search Console
- [ ] Submit sitemap in new property
- [ ] Update Google Business Profile
- [ ] Update social media profiles
- [ ] Update business directories
- [ ] Monitor both domains for 1-2 months
- [ ] Remove old Vercel property after transition

---

## Important Notes

### DNS Propagation
- Can take 24-48 hours
- Some regions faster, some slower
- Use https://dnschecker.org to check globally

### SSL Certificate
- Vercel automatically provides SSL
- Usually active within minutes
- Check: Look for 🔒 in browser

### SEO Impact
- **301 Redirects:** Vercel handles automatically
- **Old links:** Will redirect to new domain
- **Search rankings:** May take 2-4 weeks to fully transfer
- **Keep old domain:** Don't delete immediately

### Environment Variables
- Set in Vercel dashboard (not `.env.local`)
- Only affects production builds
- Redeploy after setting

---

## Code Changes Needed

### ✅ Already Configured (No Changes Needed)
- `src/config/seo.ts` - Uses `process.env.NEXT_PUBLIC_SITE_URL`
- `src/app/robots.ts` - Uses `process.env.NEXT_PUBLIC_SITE_URL`
- `src/app/sitemap.ts` - Uses `siteConfig.url` (which uses env var)

### ⚠️ Needs Update
- `public/robots.txt` - Hardcoded URL (I'll update this)

---

## After Domain Switch

### Week 1
- Monitor both domains
- Check for any issues
- Verify redirects work

### Week 2-4
- Monitor Google Search Console
- Check indexing on new domain
- Update any remaining links

### Month 2+
- Remove old Vercel property from Search Console
- Focus SEO efforts on custom domain
- Build backlinks to custom domain

---

## Need Help?

If you need help with:
- Setting up DNS records
- Configuring environment variables
- Updating any code files
- Troubleshooting domain issues

Just ask! I can help with any step. 🚀

---

## Quick Summary

1. ✅ **Add domain in Vercel** → Configure DNS
2. ✅ **Set environment variable** → `NEXT_PUBLIC_SITE_URL`
3. ✅ **Update robots.txt** → I'll do this
4. ✅ **Add to Search Console** → New property
5. ✅ **Update all links** → Social media, directories
6. ✅ **Wait for propagation** → 24-48 hours
7. ✅ **Monitor both domains** → For 1-2 months

Your code is already set up to use environment variables, so most of the work is just configuration! 🎉

