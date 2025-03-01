// This is the Google Apps Script code you should use in your Google Apps Script project
// Copy this code to your Google Apps Script project and deploy it as a web app

// Set up the doGet function to handle GET requests (not used in this case)
function doGet(e) {
  return HtmlService.createHtmlOutput("The script is running correctly.");
}

// Set up the doPost function to handle POST requests from your form
function doPost(e) {
  try {
    // Get the spreadsheet and the active sheet
    var ss = SpreadsheetApp.openById("YOUR_SPREADSHEET_ID_HERE"); // Replace with your actual spreadsheet ID
    var sheet = ss.getSheetByName("Waitlist") || ss.getActiveSheet(); // Use "Waitlist" sheet or the active sheet

    // Get the data from the form submission
    var data;

    // Check if the data is in the POST body
    if (e.postData && e.postData.contents) {
      try {
        // Try to parse as JSON first
        data = JSON.parse(e.postData.contents);
      } catch (error) {
        // If not JSON, try to handle as form data
        data = {};
        var formData = e.postData.contents.split("&");
        for (var i = 0; i < formData.length; i++) {
          var keyValue = formData[i].split("=");
          data[decodeURIComponent(keyValue[0])] = decodeURIComponent(
            keyValue[1] || ""
          );
        }
      }
    } else if (e.parameter) {
      // If data is in URL parameters
      data = e.parameter;
    } else {
      // Handle FormData object
      data = {};
      for (var key in e.parameters) {
        data[key] = e.parameters[key];
      }
    }

    // Log the received data for debugging
    Logger.log("Received data: " + JSON.stringify(data));

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

    // Return success response
    return ContentService.createTextOutput(
      JSON.stringify({
        result: "success",
        message: "Data added to spreadsheet",
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    // Log the error
    Logger.log("Error: " + error.toString());

    // Return error response
    return ContentService.createTextOutput(
      JSON.stringify({
        result: "error",
        message: error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
