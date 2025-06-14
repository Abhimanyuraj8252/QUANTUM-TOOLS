# Setting Up Google Analytics 4 for QUANTUM TOOLS

This guide will help you set up Google Analytics 4 (GA4) for your website after you've purchased a domain name and are ready to deploy.

## Step 1: Create a Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account (or create one if needed)
3. Click "Start measuring" if you're new to Google Analytics

## Step 2: Set Up a Property

1. Click "Admin" in the bottom left corner
2. In the middle column, click "Create Property"
3. Select "Web" as your platform
4. Enter your website name (e.g., "QUANTUM TOOLS")
5. Select your reporting time zone and currency
6. Click "Create"

## Step 3: Configure Your Data Stream

1. In the setup process, choose "Web" as your platform
2. Enter your website URL (with https://)
3. Give your stream a name (e.g., "QUANTUM TOOLS Website")
4. Click "Create Stream"

## Step 4: Get Your Tracking ID

1. After creating your stream, you'll see a "Measurement ID" (it starts with "G-" followed by a string of letters and numbers)
2. This is your GA4 tracking ID (e.g., G-XXXXXXXX)
3. Copy this ID as you'll need it in the next step

## Step 5: Update Your Website Code

1. Open the file: `seo-analytics.js`
2. Replace all instances of `G-XXXXXXXX` with your actual GA4 tracking ID
3. The changes need to be made in these sections:
   ```javascript
   // Google Analytics 4 Setup
   setupGoogleAnalytics() {
       // Create Google Analytics script
       const gtagScript = document.createElement('script');
       gtagScript.async = true;
       gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX'; // Replace with your actual GA4 ID
       document.head.appendChild(gtagScript);

       // Initialize gtag
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', 'G-XXXXXXXX'); // Replace with your actual GA4 ID
       
       // ...rest of the code
   }
   ```

## Step 6: Verify Installation

After deploying your website with the updated GA4 ID:

1. Go back to Google Analytics
2. Click "Admin" > "Data Streams" > Your website stream
3. Click "View tagging instructions"
4. Choose "Install manually"
5. Click "Check your website to verify installation"

## Step 7: Set Up Key Metrics and Reports

1. Create custom reports for tracking tool usage
2. Set up conversion events for key user actions
3. Configure dashboards to monitor website performance

## Additional Resources

- [Google Analytics 4 Documentation](https://support.google.com/analytics/)
- [GA4 Migration Guide](https://developers.google.com/analytics/devguides/migration/ua/analytics4)
- [GA4 Event Tracking Guide](https://support.google.com/analytics/answer/9216061)
