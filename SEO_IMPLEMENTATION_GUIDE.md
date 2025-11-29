# SEO Implementation Guide - Short Term Actions

## Step-by-Step Guide for GANU Professional Services

---

## 1. Google Search Console Setup

### Step 1.1: Access Google Search Console
1. Go to: https://search.google.com/search-console
2. Sign in with your Google account (use a business account if possible)
3. Click "Start now" or "Add Property"

### Step 1.2: Add Your Website Property
1. Choose **"URL prefix"** method (easier for Vercel)
2. Enter: `https://ganu-fe.vercel.app`
3. Click **"Continue"**

### Step 1.3: Verify Ownership
You have several options. Choose the easiest:

**Option A: HTML File Upload (Recommended)**
1. Download the HTML verification file
2. Upload it to your `public/` folder in the project
3. Commit and push to GitHub
4. Vercel will automatically deploy it
5. Click "Verify" in Search Console

**Option B: HTML Tag Method**
1. Copy the meta tag provided
2. Add it to your `src/app/layout.tsx` in the `<head>` section
3. Deploy and verify

**Option C: Domain Name Provider**
- If you have access to DNS settings (not applicable for free Vercel)

### Step 1.4: Submit Sitemap
1. Once verified, go to **"Sitemaps"** in the left menu
2. Enter: `sitemap.xml`
3. Click **"Submit"**
4. Wait 24-48 hours for Google to process

### Step 1.5: Request Indexing (Optional but Recommended)
1. Go to **"URL Inspection"** tool
2. Enter your homepage URL: `https://ganu-fe.vercel.app`
3. Click **"Request Indexing"**
4. Repeat for key pages:
   - `/about-us`
   - `/solutions/hr`
   - `/solutions/finance`
   - `/solutions/secretariat`
   - `/solutions/gas`
   - `/contact`

---

## 2. Monitor Indexing and Performance

### Daily Checks (First Week)
1. **Coverage Report**
   - Go to Search Console → **"Coverage"**
   - Check for errors (404s, blocked pages)
   - Fix any issues found

2. **Performance Report**
   - Go to **"Performance"**
   - Monitor:
     - Total clicks
     - Total impressions
     - Average CTR (Click-Through Rate)
     - Average position

### Weekly Checks
1. **Search Analytics**
   - Review top queries
   - See which pages get most impressions
   - Identify opportunities

2. **Mobile Usability**
   - Check **"Mobile Usability"** report
   - Fix any mobile issues

### Monthly Checks
1. **Core Web Vitals**
   - Monitor page speed metrics
   - Ensure good scores (LCP < 2.5s, FID < 100ms, CLS < 0.1)

---

## 3. Regular Content Updates

### Weekly Content Tasks

#### Blog Posts (2-4 per month)
Create blog posts about:
- HR best practices
- Finance tips
- Compliance updates
- Industry news
- Case studies (with client permission)

**Example Topics:**
- "5 Essential HR Policies Every Sri Lankan Business Needs"
- "Understanding EPF and ETF Contributions in 2025"
- "How to Ensure Payroll Compliance in Sri Lanka"
- "Company Registration Process in Sri Lanka: Complete Guide"

#### Update Existing Pages
- Add new testimonials
- Update service descriptions
- Add FAQ sections
- Update statistics/numbers

### Monthly Content Tasks
1. **Review and Update**
   - Check all service pages for outdated information
   - Update contact information if changed
   - Refresh testimonials section

2. **Add New Content**
   - Create new event/news posts
   - Add new career listings
   - Update company information

---

## 4. Internal Linking Strategy

### Where to Add Internal Links

#### Homepage (`src/app/page.tsx`)
Add links to:
- Service pages in "Our Solutions" section
- About Us page
- Contact page
- Recent blog posts
- Upcoming events

#### Service Pages (`src/app/solutions/*/page.tsx`)
Add links to:
- Related services
- Contact page (CTA)
- Relevant blog posts
- Case studies

#### Blog Posts
Add links to:
- Related service pages
- Other relevant blog posts
- Contact page
- About Us page

#### Events/News Pages
Add links to:
- Related events
- Service pages mentioned
- Contact page for inquiries

### Implementation Example

```tsx
// In your service pages, add:
<Link href="/solutions/hr" className="text-desertSun hover:underline">
  Learn more about our HR Solutions
</Link>

// In blog posts, add:
<Link href="/solutions/finance" className="text-desertSun hover:underline">
  Explore our Finance Solutions
</Link>
```

---

## 5. Optimize Existing Pages

### Checklist for Each Page

#### ✅ Technical SEO
- [ ] Unique title tag (50-60 characters)
- [ ] Meta description (150-160 characters)
- [ ] Proper heading hierarchy (H1 → H2 → H3)
- [ ] Alt text on all images
- [ ] Internal links (3-5 per page)
- [ ] Mobile responsive
- [ ] Fast loading speed

#### ✅ Content Optimization
- [ ] Keyword-rich content (natural, not stuffed)
- [ ] At least 300 words of quality content
- [ ] Clear call-to-action (CTA)
- [ ] Relevant images with alt text
- [ ] Proper formatting (bullets, headings)

#### ✅ User Experience
- [ ] Easy navigation
- [ ] Clear contact information
- [ ] Fast page load
- [ ] Mobile-friendly
- [ ] Accessible (proper contrast, readable fonts)

---

## 6. Build Backlinks

### 6.1: Sri Lankan Business Directories

#### Free Listings (Do These First)

1. **Google Business Profile**
   - Go to: https://www.google.com/business/
   - Create/claim your business
   - Add complete information:
     - Address: No. 94/6, Hokandara East, Hokandara, Sri Lanka, 10118
     - Phone: +94 11 2563944
     - Email: service@ganuprofessional.lk
     - Website: https://ganu-fe.vercel.app
     - Business hours: Mon-Fri, 9 AM - 5 PM
     - Categories: HR Services, Accounting Services, Business Services
   - Add photos
   - Request reviews from clients

2. **Yellow Pages Sri Lanka**
   - Website: https://www.yellowpages.lk/
   - Create free listing
   - Add all business details

3. **Lanka Directory**
   - Website: https://www.lankadirectory.com/
   - Submit your business listing

4. **Sri Lanka Business Directory**
   - Search for "Sri Lanka business directory" and submit to multiple sites

5. **TradeKey Sri Lanka**
   - Website: https://srilanka.tradekey.com/
   - Create business profile

### 6.2: Industry-Specific Directories

1. **HR Associations**
   - Institute of Personnel Management (IPM) Sri Lanka
   - Contact them to list your services

2. **Accounting/Finance Directories**
   - Institute of Chartered Accountants of Sri Lanka (ICASL)
   - Sri Lanka Accounting Standards

3. **Business Service Directories**
   - Chamber of Commerce listings
   - Local business associations

### 6.3: Social Media Profiles

#### Facebook
1. Create Business Page: https://www.facebook.com/pages/create/
2. Use existing: https://www.facebook.com/Ganuhrservices
3. Complete profile:
   - Add cover photo
   - Add profile picture (logo)
   - Fill business information
   - Add website link
   - Post regularly (2-3 times per week)
4. Update your SEO config with the Facebook URL

#### LinkedIn
1. Create Company Page: https://www.linkedin.com/company/setup/
2. Complete profile:
   - Company description
   - Website URL
   - Industry: Professional Services
   - Company size
   - Location
3. Post updates about:
   - New services
   - Industry insights
   - Company news
   - Employee spotlights

#### Twitter/X
1. Create business account
2. Add to bio: "HR, Finance & Secretariat Solutions | Sri Lanka"
3. Link to website
4. Tweet regularly about:
   - Industry news
   - Tips and insights
   - Company updates

### 6.4: Guest Posting & Partnerships

1. **Reach Out to Business Blogs**
   - Offer to write guest posts about HR/Finance topics
   - Include link back to your site

2. **Partner with Complementary Businesses**
   - Law firms
   - IT companies
   - Marketing agencies
   - Exchange links/mentions

3. **Industry Publications**
   - Submit articles to:
     - Business magazines
     - HR publications
     - Finance journals

---

## 7. Quick Implementation Checklist

### This Week
- [ ] Set up Google Search Console
- [ ] Verify domain ownership
- [ ] Submit sitemap.xml
- [ ] Request indexing for homepage
- [ ] Create/update Google Business Profile
- [ ] Update Facebook page with website link
- [ ] Add internal links to homepage

### This Month
- [ ] Create 2-4 blog posts
- [ ] Submit to 5+ business directories
- [ ] Optimize all service pages
- [ ] Add FAQ sections to key pages
- [ ] Set up LinkedIn company page
- [ ] Request reviews from 3-5 clients
- [ ] Add internal links throughout site

### Ongoing (Monthly)
- [ ] Monitor Search Console weekly
- [ ] Create 2-4 new blog posts
- [ ] Update existing content
- [ ] Build 2-3 new backlinks
- [ ] Post on social media 2-3x per week
- [ ] Review and improve page speed
- [ ] Check for broken links

---

## 8. Tools You'll Need

### Free Tools
1. **Google Search Console** - Monitor search performance
2. **Google Analytics** - Track website traffic
3. **Google PageSpeed Insights** - Check page speed
4. **Google Mobile-Friendly Test** - Test mobile usability
5. **Schema.org Validator** - Validate structured data

### Optional Paid Tools (Later)
1. **Ahrefs** or **SEMrush** - Keyword research
2. **Screaming Frog** - Technical SEO audit
3. **Moz** - Link building tools

---

## 9. Measuring Success

### Key Metrics to Track

#### Month 1
- Search Console: 10-50 impressions
- Indexed pages: 5-10 pages
- Backlinks: 3-5 directory listings

#### Month 3
- Search Console: 100-500 impressions
- Indexed pages: 15-20 pages
- Backlinks: 10-15 listings
- Organic traffic: 50-200 visitors/month

#### Month 6
- Search Console: 500-2000 impressions
- Indexed pages: 20+ pages
- Backlinks: 20+ listings
- Organic traffic: 200-1000 visitors/month
- Rankings for target keywords

---

## 10. Common Mistakes to Avoid

1. ❌ **Don't** buy backlinks
2. ❌ **Don't** keyword stuff
3. ❌ **Don't** duplicate content
4. ❌ **Don't** ignore mobile users
5. ❌ **Don't** forget to update content regularly
6. ❌ **Don't** ignore Search Console errors
7. ❌ **Don't** use duplicate title tags
8. ❌ **Don't** forget to add alt text to images

---

## 11. Quick Wins (Do Today)

1. ✅ Submit sitemap to Google Search Console (5 minutes)
2. ✅ Create/update Google Business Profile (15 minutes)
3. ✅ Add website link to Facebook page (2 minutes)
4. ✅ Request indexing for homepage (2 minutes)
5. ✅ Add 3 internal links to homepage (10 minutes)

**Total Time: ~35 minutes**

---

## 12. Next Steps After Setup

1. **Week 1**: Complete all "This Week" tasks
2. **Week 2-4**: Complete "This Month" tasks
3. **Month 2+**: Follow "Ongoing" tasks
4. **Review Monthly**: Check metrics and adjust strategy

---

## Need Help?

If you need help implementing any of these:
1. I can help update your code for internal linking
2. I can create templates for blog posts
3. I can help optimize specific pages
4. I can create a content calendar

Just ask! 🚀

