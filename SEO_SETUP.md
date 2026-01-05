# SEO Setup Guide - Dook Scoop 'Em

Complete checklist for setting up proper SEO after the www redirect is live.

---

## Current Status

✅ **Completed:**
- www → non-www 301 redirect implemented (server/index.ts:8-15)
- Meta tags in place (title, description, OG tags, Twitter cards)
- Schema.org structured data (LocalBusiness markup)
- Google Analytics installed (G-C9GESDP6BV)
- Facebook Pixel tracking (786314387209998)

⏳ **Pending:**
- DNS CNAME for www subdomain
- Google Search Console setup
- Bing Webmaster Tools setup
- Sitemap generation
- robots.txt optimization

---

## Step 1: Verify DNS & Redirect Working

**Before proceeding, confirm:**

1. `www.dookscoopem.com` DNS record is live
2. Test the redirect:
   ```bash
   curl -I https://www.dookscoopem.com
   ```
   Should return:
   ```
   HTTP/2 301
   Location: https://dookscoopem.com/
   ```

---

## Step 2: Google Search Console Setup

### Add Both Domain Versions

1. **Go to:** https://search.google.com/search-console
2. **Add Property:** `dookscoopem.com` (non-www)
   - Choose "URL prefix" method
   - Verify via HTML file upload OR meta tag
3. **Add Property:** `www.dookscoopem.com` (www version)
   - Also verify this version
   - Google needs to see both to track the redirect properly

### Verification Methods

**Option A: HTML File Upload** (Recommended)
- Download verification file from Google
- Add to `/client/public/` directory
- Rebuild and deploy
- Click "Verify" in Search Console

**Option B: Meta Tag** (Easier)
- Google gives you a meta tag like:
  ```html
  <meta name="google-site-verification" content="ABC123..." />
  ```
- Add to `client/index.html` in the `<head>` section (around line 18)
- Deploy and verify

### Set Preferred Domain

1. Once both are verified, go to **Settings**
2. Under **Crawling**, set preferred domain: `dookscoopem.com` (non-www)
3. Google will consolidate all signals to this version

---

## Step 3: Submit Sitemap

### Generate Sitemap

Create `/client/public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://dookscoopem.com/</loc>
    <lastmod>2025-01-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://dookscoopem.com/about-us</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://dookscoopem.com/residential</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://dookscoopem.com/commercial</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://dookscoopem.com/locations</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://dookscoopem.com/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://dookscoopem.com/onboard</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

### Submit to Google

1. In Google Search Console → **Sitemaps**
2. Enter: `https://dookscoopem.com/sitemap.xml`
3. Click **Submit**
4. Google will crawl your site using this map

---

## Step 4: Optimize robots.txt

Create `/client/public/robots.txt`:

```
# Allow all search engines
User-agent: *
Allow: /

# Sitemap location
Sitemap: https://dookscoopem.com/sitemap.xml

# Block admin pages from public search
Disallow: /admin/
Disallow: /dashboard/

# Block API endpoints
Disallow: /api/
```

**This tells search engines:**
- ✅ Crawl all public pages
- ❌ Don't index admin dashboard
- ❌ Don't index API routes
- 📍 Here's the sitemap

---

## Step 5: Bing Webmaster Tools (Optional but Recommended)

1. **Go to:** https://www.bing.com/webmasters
2. **Add site:** `dookscoopem.com`
3. **Import from Google Search Console** (easiest method)
4. Bing powers Yahoo, DuckDuckGo, and other search engines (~30% market share)

---

## Step 6: Local SEO - Google Business Profile

**Critical for local service businesses!**

1. **Go to:** https://business.google.com
2. **Create business profile:**
   - Business name: Dook Scoop 'Em
   - Category: Pet Waste Removal Service
   - Service areas: Jacksonville, FL (add specific zip codes)
   - Phone: (904) 312-2422
   - Website: https://dookscoopem.com
3. **Verify ownership** (Google will mail a postcard or call)
4. **Add photos:** Logo, service photos, team photos
5. **Add services:** Weekly cleanup, bi-weekly, one-time, etc.
6. **Set hours** (if applicable)

**Why this matters:**
- Shows up in Google Maps
- Appears in local search ("dog waste removal near me")
- Gets reviews (social proof)
- FREE advertising

---

## Step 7: Monitor & Track

### What to Monitor

**Google Search Console:**
- Coverage errors (pages not indexed)
- Mobile usability issues
- Core Web Vitals (speed metrics)
- Search queries driving traffic
- Backlinks

**Google Analytics:**
- Traffic sources (organic vs. direct vs. social)
- Bounce rate by page
- Conversion tracking (form submissions)
- User behavior flow

### Set Up Conversion Tracking

In Google Analytics, create **Events** for:
- Quote form submission (`/onboard`)
- Contact form submission (`/contact`)
- Waitlist signups
- Phone number clicks

**Already installed:**
- Google Analytics: `G-C9GESDP6BV`
- Facebook Pixel: `786314387209998`

---

## Step 8: Page-Specific SEO (React Helmet)

You have `react-helmet-async` installed. Make sure each page has unique meta tags.

### Example: Add to each page component

```tsx
import { Helmet } from 'react-helmet-async';

// In your page component:
<Helmet>
  <title>Dog Waste Removal Jacksonville FL | Dook Scoop 'Em</title>
  <meta name="description" content="Professional dog waste removal in Jacksonville. Weekly, bi-weekly, and one-time service. Insured, reliable, and affordable. Get your free quote today!" />
  <meta property="og:title" content="Dog Waste Removal Jacksonville FL" />
  <meta property="og:description" content="Professional dog waste removal..." />
  <link rel="canonical" href="https://dookscoopem.com/" />
</Helmet>
```

### Priority Pages to Optimize

1. **Home** (`/`) - Target: "dog waste removal jacksonville"
2. **Residential** - Target: "residential pet waste removal"
3. **Commercial** - Target: "commercial dog waste cleanup"
4. **Locations** - Target: "dog poop removal [neighborhood]"
5. **Onboard** - Target: "dog waste removal quote"

---

## Step 9: Build Local Backlinks

**High-impact, low-effort local SEO:**

1. **Local Directories:**
   - Yelp for Business
   - Angi (formerly Angie's List)
   - HomeAdvisor
   - Nextdoor Business
   - Chamber of Commerce

2. **Local Blogs/News:**
   - Reach out to Jacksonville pet blogs
   - Local news sites (community events)
   - Neighborhood Facebook groups

3. **Partner Links:**
   - Veterinarians (offer referral program)
   - Dog trainers
   - Pet stores
   - Dog daycares

---

## Step 10: Ongoing SEO Checklist

**Weekly:**
- [ ] Check Google Search Console for errors
- [ ] Monitor Analytics for traffic trends
- [ ] Respond to Google Business reviews

**Monthly:**
- [ ] Update sitemap if new pages added
- [ ] Check Core Web Vitals scores
- [ ] Review top-performing keywords
- [ ] Add new blog content (if applicable)

**Quarterly:**
- [ ] Audit page speed (use PageSpeed Insights)
- [ ] Update schema markup if services change
- [ ] Review and update meta descriptions
- [ ] Check for broken links

---

## Quick Wins (Do These First)

**Priority 1 - Critical:**
1. ✅ Set up Google Search Console (both domains)
2. ✅ Submit sitemap
3. ✅ Create Google Business Profile
4. ✅ Add robots.txt

**Priority 2 - High Impact:**
5. Add React Helmet to all main pages
6. Set up Bing Webmaster Tools
7. Claim Yelp/Nextdoor business pages
8. Set up conversion tracking in Analytics

**Priority 3 - Nice to Have:**
9. Build local directory listings
10. Create blog for content marketing
11. Set up email alerts for Search Console issues

---

## Tools & Resources

**Free SEO Tools:**
- **Google Search Console:** https://search.google.com/search-console
- **Google PageSpeed Insights:** https://pagespeed.web.dev
- **Google Business Profile:** https://business.google.com
- **Bing Webmaster Tools:** https://www.bing.com/webmasters
- **Schema Markup Validator:** https://validator.schema.org

**Keyword Research:**
- Google Keyword Planner (free with Google Ads account)
- Answer The Public (see what people search for)

**Competitor Analysis:**
- Search "dog waste removal jacksonville" and analyze top 3 results
- Check their meta tags, content structure, backlinks

---

## Expected Timeline

**Week 1-2:**
- Google Search Console verification
- Sitemap submission
- robots.txt deployment
- Google Business Profile setup

**Week 3-4:**
- Google starts indexing pages
- First impressions appear in Search Console
- Local listings go live

**Month 2-3:**
- Rankings start appearing for brand keywords
- Local pack inclusion (Google Maps)
- Organic traffic starts trickling in

**Month 4-6:**
- Rankings for competitive keywords improve
- Regular organic traffic
- Customer reviews start appearing

**SEO is a marathon, not a sprint.** Consistent effort wins.

---

## Notes

- Current site uses React SPA (client-side rendering)
- Google can crawl it, but SSR would be better long-term
- Focus on local SEO (Jacksonville area)
- Service-based business = local citations matter more than blog content
- Reviews are CRITICAL for local ranking

---

## Contact for Questions

- Owner: ryan@dookscoop.com
- Developer: First Coastal Agency

---

**Last Updated:** January 4, 2026
