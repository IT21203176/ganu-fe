# Sitemap Troubleshooting Guide

## Issue: Google Search Console Shows "Couldn't Fetch" for Sitemap

---

## Quick Fixes to Try

### 1. Verify Sitemap is Accessible

**Test the sitemap URL directly:**
- Open in browser: `https://ganu-fe.vercel.app/sitemap.xml`
- You should see XML content, not an error page
- If you see an error, the sitemap isn't being generated correctly

### 2. Check Sitemap Format

The sitemap should be valid XML. Common issues:
- Missing XML declaration
- Invalid characters
- Wrong encoding
- Missing closing tags

### 3. Wait and Retry

Sometimes Google needs time:
- Wait 24-48 hours after submission
- Try resubmitting the sitemap
- Check again after a few hours

### 4. Verify URL Format

In Google Search Console:
- Use: `sitemap.xml` (not `/sitemap.xml` or full URL)
- Or use full URL: `https://ganu-fe.vercel.app/sitemap.xml`

---

## Step-by-Step Fix

### Step 1: Test Sitemap Locally

1. Run your dev server: `npm run dev`
2. Visit: `http://localhost:3000/sitemap.xml`
3. Check if XML is displayed correctly

### Step 2: Test on Production

1. Visit: `https://ganu-fe.vercel.app/sitemap.xml`
2. Right-click → "View Page Source"
3. Verify it's valid XML

### Step 3: Check Google Search Console

1. Go to **"Sitemaps"** section
2. Click the **three dots** (⋮) next to your sitemap
3. Select **"Test sitemap"**
4. Review any errors shown

### Step 4: Resubmit Sitemap

1. Delete the old sitemap entry (if possible)
2. Wait a few minutes
3. Submit again with: `sitemap.xml`

---

## Common Errors and Solutions

### Error: "Sitemap could not be read"
**Solution:**
- Check if sitemap.xml is accessible
- Verify XML format is valid
- Ensure no authentication required

### Error: "Sitemap is HTML, not XML"
**Solution:**
- Check Next.js routing
- Verify sitemap.ts is in correct location (`src/app/sitemap.ts`)
- Rebuild and redeploy

### Error: "Sitemap is empty"
**Solution:**
- Check sitemap.ts code
- Verify routes are being added
- Check for errors in console

### Error: "URLs in sitemap are invalid"
**Solution:**
- Verify all URLs use `https://`
- Check URLs are absolute (not relative)
- Ensure URLs match your domain

---

## Verify Your Sitemap Configuration

### Check `src/app/sitemap.ts`:

```typescript
import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url; // Should be: https://ganu-fe.vercel.app
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    // ... more URLs
  ];
}
```

### Check `src/config/seo.ts`:

```typescript
export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://ganu-fe.vercel.app",
  // ...
};
```

---

## Manual Verification Steps

### 1. Check Sitemap Content

Visit: `https://ganu-fe.vercel.app/sitemap.xml`

Expected output should look like:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ganu-fe.vercel.app/</loc>
    <lastmod>2025-11-29</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1</priority>
  </url>
  <!-- More URLs -->
</urlset>
```

### 2. Validate XML Format

Use online validator:
- https://www.xml-sitemaps.com/validate-xml-sitemap.html
- Paste your sitemap URL
- Check for errors

### 3. Check HTTP Headers

The sitemap should return:
- Content-Type: `application/xml` or `text/xml`
- Status: `200 OK`
- No redirects

---

## Next.js Specific Issues

### Issue: Sitemap Not Generating

**Check:**
1. File location: `src/app/sitemap.ts` (not `sitemap.xml`)
2. Export default function
3. Return type: `MetadataRoute.Sitemap`
4. Rebuild after changes

### Issue: Sitemap Returns 404

**Solution:**
1. Ensure file is named `sitemap.ts` (not `.tsx`)
2. Check Next.js version (13+ required)
3. Rebuild and redeploy

### Issue: Sitemap Shows Old Content

**Solution:**
1. Clear Next.js cache
2. Rebuild: `npm run build`
3. Redeploy to Vercel

---

## Testing Checklist

- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Returns valid XML (not HTML)
- [ ] All URLs use `https://`
- [ ] All URLs are absolute (not relative)
- [ ] No authentication required
- [ ] Returns 200 OK status
- [ ] Content-Type is XML
- [ ] XML validates without errors
- [ ] All URLs are accessible (no 404s)

---

## Still Not Working?

### Try These:

1. **Use Full URL in Search Console:**
   - Instead of `sitemap.xml`
   - Use: `https://ganu-fe.vercel.app/sitemap.xml`

2. **Check Vercel Deployment:**
   - Verify latest deployment is live
   - Check deployment logs for errors
   - Ensure environment variables are set

3. **Contact Support:**
   - Google Search Console Help
   - Vercel Support (if deployment issue)

---

## Expected Timeline

- **Immediate:** Sitemap should be accessible
- **24-48 hours:** Google processes sitemap
- **1 week:** Full indexing begins

---

## Need Help?

If you're still having issues:
1. Share the sitemap URL output
2. Share any error messages from Search Console
3. Check Vercel deployment logs

I can help debug further! 🚀

