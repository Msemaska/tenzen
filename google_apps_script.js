// This is the Google Apps Script code you should use in your Google Apps Script project
// Copy this code to your Google Apps Script project and deploy it as a web app

// Set up the doGet function to handle GET requests (not used in this case)
function doGet(e) {
  return HtmlService.createHtmlOutput("The script is running correctly.");
}

// Set up the doPost function to handle POST requests from your form
function doPost(e) {
  // Log the content type for debugging
  Logger.log("Content type: " + (e.postData ? e.postData.type : "No postData"));
  Logger.log("Parameters: " + JSON.stringify(e.parameter));
  
  try {
    // Get the data from the request
    var data;
    
    // Check if this is JSON data
    if (e.postData && e.postData.type === "application/json") {
      // Parse JSON data
      data = JSON.parse(e.postData.contents);
      Logger.log("Received JSON data: " + JSON.stringify(data));
    } else if (e.parameter && e.parameter.format === "json") {
      // This is our special case for the form submission approach
      data = e.parameter;
      Logger.log("Received form data with JSON format: " + JSON.stringify(data));
    } else {
      // Regular form data
      data = e.parameter;
      Logger.log("Received regular form data: " + JSON.stringify(data));
    }
    
    return processFormData(data);
  } catch (error) {
    // Log the error
    Logger.log("Error in doPost: " + error.toString());
    
    // Return error response
    return ContentService.createTextOutput(
      JSON.stringify({
        result: "error",
        message: "Error processing request: " + error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function processFormData(data) {
  try {
    // Get the spreadsheet and the active sheet
    var ss = SpreadsheetApp.openById("1MMr0QE89cqC8JVpjCXoyzitpdncC4JxnuCQbPMGBqcU"); // Your spreadsheet ID
    var sheet = ss.getSheetByName("Waitlist") || ss.getActiveSheet(); // Use "Waitlist" sheet or the active sheet
    
    // Log the data for debugging
    Logger.log("Processing data: " + JSON.stringify(data));

    // Sanitize and validate the business needs field
    if (data.businessNeeds) {
      // Trim excessive whitespace and limit length if needed
      data.businessNeeds = data.businessNeeds.trim();
      if (data.businessNeeds.length > 1000) {
        data.businessNeeds = data.businessNeeds.substring(0, 1000) + "...";
        Logger.log("Business needs field was truncated due to excessive length");
      }
    }

    // Check if this is the first entry (create headers if needed)
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "First Name",
        "Last Name",
        "Email",
        "Phone",
        "Location",
        "Expertise",
        "Business Needs",
      ]);
    }

    // Format the timestamp
    var timestamp = data.timestamp || new Date().toISOString();

    // Append the data to the sheet
    sheet.appendRow([
      timestamp,
      data.firstName || "",
      data.lastName || "",
      data.email || "",
      data.phone || "",
      data.location || "",
      data.expertise || "",
      data.businessNeeds || ""
    ]);

    // Create a success response
    var htmlOutput = HtmlService.createHtmlOutput(
      "<html><body><h1>Success!</h1><p>Your information has been submitted successfully.</p>" +
      "<p>You can close this window now.</p>" +
      "<script>window.parent.postMessage('success', '*'); setTimeout(function() { window.close(); }, 500);</script>" +
      "</body></html>"
    );
    
    // For API calls, return JSON
    if (data.format === "json" || data.format === undefined) {
      return ContentService.createTextOutput(
        JSON.stringify({
          result: "success",
          message: "Data added to spreadsheet",
        })
      ).setMimeType(ContentService.MimeType.JSON);
    } else {
      // For form submissions, return HTML
      return htmlOutput;
    }
  } catch (error) {
    // Log the error
    Logger.log("Error in processFormData: " + error.toString());

    // Return error response
    return ContentService.createTextOutput(
      JSON.stringify({
        result: "error",
        message: error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
