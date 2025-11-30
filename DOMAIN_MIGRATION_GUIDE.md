# Complete Guide: Using ganuprofessional.lk for Your Next.js Application

## Overview

This guide will help you migrate `ganuprofessional.lk` from your current website to your Next.js application hosted on Vercel.

**Current Situation:**
- Domain: `ganuprofessional.lk` → Currently pointing to separate website
- Frontend: Next.js app → Currently on Vercel (e.g., `ganu-fe.vercel.app`)
- Backend API: `https://ganu-be.vercel.app`

**Goal:**
- Point `ganuprofessional.lk` → Your Next.js application
- Keep backend API at `https://ganu-be.vercel.app` (or configure subdomain)

---

## Migration Strategy Options

### Option 1: Direct Migration (Recommended)
**Best if:** You're ready to fully replace the old website

1. Set up `ganuprofessional.lk` in Vercel
2. Configure DNS to point to Vercel
3. Old website goes offline
4. New Next.js app goes live

**Timeline:** 1-2 days (DNS propagation)

---

### Option 2: Subdomain Approach (Safer)
**Best if:** You want to test before full migration

1. Use `app.ganuprofessional.lk` or `new.ganuprofessional.lk` for Next.js app
2. Keep `ganuprofessional.lk` on old website temporarily
3. Test thoroughly
4. Switch main domain when ready

**Timeline:** Can test indefinitely, switch when ready

---

### Option 3: Gradual Migration
**Best if:** You need both sites running during transition

1. Set up subdomain for new site: `app.ganuprofessional.lk`
2. Run both sites simultaneously
3. Gradually redirect traffic
4. Switch main domain when ready

**Timeline:** Flexible, can take weeks/months

---

## Step-by-Step: Direct Migration (Option 1)

### Phase 1: Preparation (Before DNS Changes)

#### 1.1 Backup Current Website
- Download all files from current website
- Export database if applicable
- Document current functionality
- Note any integrations or APIs

#### 1.2 Verify Next.js App is Ready
- ✅ All features working on Vercel preview
- ✅ Environment variables configured
- ✅ API endpoints tested
- ✅ SEO metadata configured

#### 1.3 Prepare DNS Records
You'll need:
- **A Record** or **CNAME Record** (Vercel will provide)
- Current DNS provider access (where domain is registered)

---

### Phase 2: Vercel Configuration

#### 2.1 Add Domain in Vercel

1. Go to **Vercel Dashboard** → Your Project
2. Navigate to **Settings** → **Domains**
3. Click **"Add Domain"**
4. Enter: `ganuprofessional.lk`
5. Click **"Add"**

Vercel will show you DNS configuration options:
- **Option A:** A Record (for apex domain)
- **Option B:** CNAME Record (for www subdomain)

**Recommended:** Add both `ganuprofessional.lk` and `www.ganuprofessional.lk`

#### 2.2 Configure Environment Variables

In Vercel → **Settings** → **Environment Variables**, add:

**For Production:**
```
NEXT_PUBLIC_SITE_URL = https://ganuprofessional.lk
NEXT_PUBLIC_API_URL = https://ganu-be.vercel.app
```

**For Preview/Development:**
```
NEXT_PUBLIC_SITE_URL = https://ganu-fe.vercel.app
NEXT_PUBLIC_API_URL = https://ganu-be.vercel.app
```

#### 2.3 Update Next.js Config (if needed)

Your `next.config.ts` should allow your domain:

```typescript
const nextConfig = {
  images: {
    domains: [
      'ganuprofessional.lk',
      'www.ganuprofessional.lk',
      'ganu-be.vercel.app',
      // ... existing domains
    ],
  },
  // ... rest of config
}
```

---

### Phase 3: DNS Configuration

#### 3.1 Access Your DNS Provider

Common DNS providers:
- GoDaddy
- Namecheap
- Cloudflare
- Google Domains
- Local Sri Lankan registrars

#### 3.2 Add DNS Records

**For Apex Domain (ganuprofessional.lk):**

Vercel will provide an IP address. Add A record:
```
Type: A
Name: @ (or ganuprofessional.lk)
Value: [Vercel IP address]
TTL: 3600 (or Auto)
```

**For WWW Subdomain (www.ganuprofessional.lk):**

Add CNAME record:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

**Important Notes:**
- Remove or update existing A/CNAME records pointing to old website
- Keep other records (MX for email, TXT for verification, etc.)
- DNS changes can take 24-48 hours to propagate globally

#### 3.3 Verify DNS Propagation

Use these tools to check:
- https://dnschecker.org
- https://www.whatsmydns.net
- Command line: `nslookup ganuprofessional.lk`

Wait until DNS shows Vercel's IP addresses globally.

---

### Phase 4: SSL Certificate

Vercel automatically provisions SSL certificates:
- ✅ Usually active within minutes of DNS propagation
- ✅ Supports both `ganuprofessional.lk` and `www.ganuprofessional.lk`
- ✅ Auto-renewal (no action needed)
- ✅ Check for 🔒 in browser after DNS propagates

---

### Phase 5: Post-Migration Tasks

#### 5.1 Verify Website Works

Test these URLs:
- ✅ https://ganuprofessional.lk
- ✅ https://www.ganuprofessional.lk (should redirect to non-www or vice versa)
- ✅ https://ganuprofessional.lk/sitemap.xml
- ✅ https://ganuprofessional.lk/robots.txt
- ✅ All main pages load correctly
- ✅ API calls work (check browser console)

#### 5.2 Update Google Search Console

1. Add new property: `https://ganuprofessional.lk`
2. Verify ownership (same method as before)
3. Submit sitemap: `https://ganuprofessional.lk/sitemap.xml`
4. **Keep old property** for 1-2 months (for monitoring redirects)

#### 5.3 Update All References

**Social Media:**
- Facebook page → Update website URL
- LinkedIn company page → Update website
- Twitter/X profile → Update website link

**Business Directories:**
- Google Business Profile → Update website URL
- Lanka Directory
- Yellow Pages
- Any other directories

**Email Signatures:**
- Update all email signatures with new URL

**Marketing Materials:**
- Business cards
- Brochures
- Advertisements

#### 5.4 Set Up Redirects (if needed)

If old website had specific URLs, set up redirects in Vercel:

Create `vercel.json` in project root:
```json
{
  "redirects": [
    {
      "source": "/old-page",
      "destination": "/new-page",
      "permanent": true
    }
  ]
}
```

---

## API Configuration

### Current Setup
Your API is at: `https://ganu-be.vercel.app`

### Option A: Keep API on Vercel Subdomain (Current)
**Pros:**
- ✅ Already working
- ✅ No changes needed
- ✅ Separate from frontend

**Cons:**
- Different domain (CORS considerations)
- Less professional appearance

**Configuration:**
```typescript
// src/api/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://ganu-be.vercel.app";
```

**CORS Setup (Backend):**
Ensure your backend allows requests from `ganuprofessional.lk`:
```javascript
// Backend CORS configuration
const allowedOrigins = [
  'https://ganuprofessional.lk',
  'https://www.ganuprofessional.lk',
  'https://ganu-fe.vercel.app', // Keep for preview deployments
];
```

---

### Option B: Use API Subdomain (Recommended for Production)
**Pros:**
- ✅ More professional: `api.ganuprofessional.lk`
- ✅ Same domain family
- ✅ Better for branding

**Cons:**
- Requires additional DNS setup
- Need to configure backend deployment

**Setup:**
1. Deploy backend to Vercel (if not already)
2. Add domain: `api.ganuprofessional.lk`
3. Configure DNS: CNAME record pointing to Vercel
4. Update environment variable:
   ```
   NEXT_PUBLIC_API_URL = https://api.ganuprofessional.lk
   ```

---

## Environment Variables Summary

### Required Variables in Vercel

**Production:**
```
NEXT_PUBLIC_SITE_URL=https://ganuprofessional.lk
NEXT_PUBLIC_API_URL=https://ganu-be.vercel.app
```

**Preview/Development:**
```
NEXT_PUBLIC_SITE_URL=https://ganu-fe.vercel.app
NEXT_PUBLIC_API_URL=https://ganu-be.vercel.app
```

**Local Development (.env.local):**
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## Code Updates Needed

### ✅ Already Configured (No Changes)
- `src/config/seo.ts` → Uses `process.env.NEXT_PUBLIC_SITE_URL`
- `src/app/robots.ts` → Uses environment variable
- `src/app/sitemap.ts` → Uses `siteConfig.url`
- `src/api/api.ts` → Uses `process.env.NEXT_PUBLIC_API_URL`

### ⚠️ May Need Updates

**1. Update robots.txt (if hardcoded)**
Check `public/robots.txt` - should use relative URLs or environment variable.

**2. Update next.config.ts**
Add your domain to allowed image domains if using external images.

**3. CORS Configuration (Backend)**
Ensure backend allows requests from new domain.

---

## Testing Checklist

### Before Going Live
- [ ] All pages load correctly on Vercel preview
- [ ] API calls work from preview deployment
- [ ] Forms submit correctly
- [ ] File uploads work
- [ ] Authentication works
- [ ] All links work
- [ ] Mobile responsive
- [ ] SEO metadata correct

### After DNS Propagation
- [ ] Website loads on `ganuprofessional.lk`
- [ ] Website loads on `www.ganuprofessional.lk`
- [ ] SSL certificate active (🔒)
- [ ] All pages accessible
- [ ] API calls work
- [ ] No console errors
- [ ] Sitemap accessible
- [ ] Robots.txt accessible

### Post-Migration (Week 1)
- [ ] Monitor Google Search Console
- [ ] Check for 404 errors
- [ ] Verify redirects work
- [ ] Test all forms
- [ ] Check analytics
- [ ] Monitor error logs

---

## Troubleshooting

### DNS Not Propagating
- Wait 24-48 hours (normal)
- Check DNS propagation tools
- Verify DNS records are correct
- Contact DNS provider if issues persist

### SSL Certificate Not Active
- Wait a few hours after DNS propagation
- Vercel usually provisions automatically
- Check Vercel dashboard → Domains → SSL status
- Contact Vercel support if needed

### API Calls Failing
- Check CORS configuration on backend
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check browser console for errors
- Verify backend allows requests from new domain

### Old Website Still Showing
- Clear browser cache
- Check DNS propagation status
- Verify DNS records point to Vercel
- Wait for full propagation (can take 48 hours)

---

## Rollback Plan

If something goes wrong:

1. **Revert DNS Records**
   - Change A/CNAME records back to old website
   - Wait for DNS propagation

2. **Keep Vercel Deployment**
   - Don't delete Vercel project
   - Can switch back when ready

3. **Monitor Both**
   - Keep both sites accessible during transition
   - Test thoroughly before full switch

---

## Timeline Estimate

### Quick Migration (1-2 days)
- Day 1: Configure Vercel + DNS
- Day 2: Wait for DNS propagation + verify

### Safe Migration (1 week)
- Day 1-2: Configure Vercel + DNS
- Day 3-4: Wait for DNS propagation
- Day 5: Test thoroughly
- Day 6-7: Monitor and fix issues

### Gradual Migration (1-2 months)
- Week 1: Set up subdomain, test
- Week 2-4: Run both sites, monitor
- Month 2: Switch main domain when confident

---

## Important Contacts

**Vercel Support:**
- Dashboard → Help → Contact Support
- Usually responds within 24 hours

**DNS Provider:**
- Contact your domain registrar
- They can help with DNS configuration

**Backend Team:**
- Ensure CORS allows new domain
- May need to update API configuration

---

## Next Steps

1. **Decide on migration strategy** (Direct, Subdomain, or Gradual)
2. **Backup current website** (if needed)
3. **Configure Vercel domain**
4. **Set environment variables**
5. **Update DNS records**
6. **Wait for propagation**
7. **Test thoroughly**
8. **Update all references**
9. **Monitor for issues**

---

## Need Help?

If you need assistance with:
- DNS configuration
- Vercel setup
- Code updates
- Troubleshooting

Just ask! I can help with any step of the process. 🚀

---

## Quick Reference

**Domain:** `ganuprofessional.lk`
**Frontend:** Next.js on Vercel
**Backend API:** `https://ganu-be.vercel.app`
**Environment Variable:** `NEXT_PUBLIC_SITE_URL`
**DNS Provider:** [Your current provider]
**Migration Strategy:** [Choose one from above]

