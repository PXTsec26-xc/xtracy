# GOOGLE SEARCH CONSOLE SETUP & FOUNDER INDEXING GUIDE

**Target Platform**: XTRACY Cybersecurity Intelligence Platform
**Official URL**: `https://xtracy.vercel.app/`
**Official Founder**: Sahil Maisuria (Elliot PXT)
**Organization**: PhantomXTrace (PXT)
**Date**: November 10, 2026

---

## 1. Objective & Target Queries

This guide outlines the precise steps to verify ownership of `https://xtracy.vercel.app/` in Google Search Console, submit sitemaps, inspect the `/founder` page, and monitor search appearance for the following target search queries:

- `Sahil Maisuria`
- `Elliot PXT`
- `Sahil Maisuria XTRACY`
- `Elliot PXT Founder`
- `XTRACY Founder`
- `Founder of XTRACY`
- `PhantomXTrace Founder`

---

## 2. Property Setup & Ownership Verification

### Step 1: Open Google Search Console
Navigate to [https://search.google.com/search-console/](https://search.google.com/search-console/) and log in with your primary Google account.

### Step 2: Add Property
1. Choose **URL-prefix property**.
2. Enter exact live URL: `https://xtracy.vercel.app/`
3. Click **Continue**.

### Step 3: Verification Methods
Two verification methods are pre-configured in this repository:
1. **HTML File Verification (Recommended)**:
   - File already exists at: `https://xtracy.vercel.app/google8e7a6e34132ffca2.html`
   - Content: `google-site-verification: google8e7a6e34132ffca2.html`
   - In Search Console, select **HTML file** method and click **Verify**.
2. **HTML Tag Verification**:
   - Meta tag `<meta name="google-site-verification" content="google8e7a6e34132ffca2" />` is configured in `src/app/layout.tsx`.

---

## 3. Sitemap Submission

1. In the Search Console sidebar, navigate to **Indexing** > **Sitemaps**.
2. In the "Add a new sitemap" input field, type:
   `sitemap.xml`
3. Click **Submit**.
4. Verify status: It will show **Success** and indicate discovery of all 23 platform routes, including `/founder`, `/legal`, `/intellectual-property`, `/ownership`, `/press`, and `/governance`.

---

## 4. URL Inspection & Requesting Indexing for the Founder Page

1. In the top Search Console search bar, paste:
   `https://xtracy.vercel.app/founder`
2. Press Enter to retrieve current Google index status.
3. Click **Test Live URL** to confirm Googlebot can render the page without blockers.
4. Click **Request Indexing**.
5. Repeat the test for the homepage:
   `https://xtracy.vercel.app/`

---

## 5. Schema.org Structured Data Validation

Google validates structured data for rich snippets and entity graphing:

1. Open [Google Rich Results Test](https://search.google.com/test/rich-results).
2. Input URL: `https://xtracy.vercel.app/founder`
3. Confirm that the following entities are detected without errors:
   - **Person**:
     - `name`: Sahil Maisuria
     - `alternateName`: Elliot PXT
     - `jobTitle`: Founder & Creator of XTRACY
     - `worksFor`: PhantomXTrace (PXT)
     - `url`: https://xtracy.vercel.app/founder
   - **Organization**:
     - `name`: XTRACY
     - `alternateName`: PhantomXTrace
     - `url`: https://xtracy.vercel.app
   - **SoftwareApplication**:
     - `name`: XTRACY
     - `applicationCategory`: SecurityApplication

---

## 6. Performance & Query Monitoring

1. In Search Console, monitor **Performance** > **Search results**.
2. Track impressions and clicks for branded queries: `Sahil Maisuria`, `Elliot PXT`, `XTRACY Founder`.
3. Check the **Pages** report to verify indexed status across all routes.
