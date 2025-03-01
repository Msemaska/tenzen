# Waitlist Form Setup Guide

This guide will help you set up your waitlist form to properly submit data to Google Sheets.

## Setting Up Google Apps Script

1. **Create a Google Sheet**:
   - Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
   - Rename the first sheet to "Waitlist" (optional)

2. **Set Up Google Apps Script**:
   - In your Google Sheet, click on "Extensions" > "Apps Script"
   - Delete any code in the editor and paste the code from the `google_apps_script.js` file
   - Replace `YOUR_SPREADSHEET_ID_HERE` with your actual spreadsheet ID
     - You can find this in your spreadsheet URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

3. **Deploy the Web App**:
   - Click on "Deploy" > "New deployment"
   - Select "Web app" as the deployment type
   - Set "Execute as" to "Me"
   - Set "Who has access" to "Anyone"
   - Click "Deploy"
   - Copy the Web App URL that appears

4. **Update Your HTML Form**:
   - Open your `index.html` file
   - Replace the `scriptURL` value with your new Web App URL

## Troubleshooting

If your form submissions aren't appearing in your Google Sheet, check the following:

1. **Check Permissions**:
   - Make sure your Google Apps Script has permission to access and modify your spreadsheet
   - The first time you run the script, it will ask for permissions

2. **Check Script Logs**:
   - In the Apps Script editor, go to "View" > "Logs" to see if there are any errors

3. **Check Browser Console**:
   - Open your browser's developer tools (F12) and check the console for any errors when submitting the form

4. **Test the Web App Directly**:
   - Visit your Web App URL directly to make sure it's deployed correctly
   - You should see "The script is running correctly."

5. **Verify CORS Settings**:
   - In your Apps Script project, go to "Project Settings" and check that "Show appsscript.json manifest file in editor" is enabled
   - Add the following to your appsscript.json file:
     ```json
     "webapp": {
       "access": "ANYONE_ANONYMOUS",
       "executeAs": "USER_DEPLOYING"
     }
     ```

## Common Issues

1. **CORS Errors**: Google Apps Script has limitations with CORS. Using `mode: 'no-cors'` in the fetch request helps avoid these errors.

2. **Data Format**: Google Apps Script expects data in specific formats. The updated code uses FormData which is more compatible.

3. **Deployment Settings**: Make sure your Web App is deployed with the correct settings (Anyone can access, Execute as you).

4. **Quota Limits**: Google Apps Script has usage quotas. If you're submitting many forms, you might hit these limits.
