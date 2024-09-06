import React, { useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";
import * as XLSX from "xlsx";

function App() {
  const [content, setContent] = useState(""); // Email content from Jodit editor
  const [email, setEmail] = useState(""); // User's email
  const [password, setPassword] = useState(""); // App-specific password
  const [file, setFile] = useState(null); // Uploaded file with emails
  const [emails, setEmails] = useState([]); // Parsed emails from file
  const [subject, setSubject] = useState(""); // Email subject
  const [status, setStatus] = useState({ total: 0, sent: 0, failed: 0 }); // Status for email sending
  const [currentEmail, setCurrentEmail] = useState(""); // Email being processed
  const [showPopup, setShowPopup] = useState(false); // Show popup state
  const [isSending, setIsSending] = useState(false); // Sending status

  const config = {
    readonly: false,
    height: 400,
  };

  // Handle file upload and parse emails
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        header: 1,
      });

      // Ensure each row contains an email address and remove any empty values
      const emailList = sheet
        .map((row) => row[0])
        .filter((email) => email && email.includes("@"));
      setEmails(emailList);
      setStatus({ total: emailList.length, sent: 0, failed: 0 });
    };
    reader.readAsBinaryString(uploadedFile);
  };

  // Show popup for 2 seconds
  const showPopupNotification = (message) => {
    setCurrentEmail(message);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 2000); // Hide after 2 seconds
  };

  // Listen to email events from the server
  useEffect(() => {
    const eventSource = new EventSource("http://localhost:5000/email-events");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStatus((prevStatus) => ({
        ...prevStatus,
        sent: data.sent,
        failed: data.failed,
      }));

      showPopupNotification(`Email ${data.status} to ${data.recipient}`);
    };

    eventSource.onerror = (error) => {
      console.error("Error in event source:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close(); // Cleanup on component unmount
    };
  }, []);

  // Handle sending email
  const sendEmail = async () => {
    setIsSending(true);

    try {
      await axios.post("http://localhost:5000/send-email", {
        email,
        password,
        content,
        emails,
        subject, // Send subject as well
      });

      setIsSending(false);
    } catch (error) {
      console.error("Error sending emails:", error);
      showPopupNotification("Failed to send emails.");
      setIsSending(false);
    }
  };

  // Handle stop process on the backend
  const stopEmailSending = async () => {
    try {
      await axios.post("http://localhost:5000/stop-email");
      showPopupNotification("Email sending process stopped.");
    } catch (error) {
      console.error("Error stopping email process:", error);
    }
  };

  return (
    <div className="flex flex-row w-full min-h-screen">
      <div className="w-[20%] bg-gray-100 p-4 inline">Area for ads</div>
      <div className="w-[60%] bg-white p-4 inline">
        <h1 className="text-3xl font-bold underline mb-4">Email Sender App</h1>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block font-bold mb-2">Your Email Address:</label>
          <input
            type="email"
            className="border p-2 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        {/* App Password Input */}
        <div className="mb-4">
          <label className="block font-bold mb-2">App-Specific Password:</label>
          <input
            type="password"
            className="border p-2 w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your app password"
          />
        </div>

        {/* Subject Input */}
        <div className="mb-4">
          <label className="block font-bold mb-2">Email Subject:</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter email subject"
          />
        </div>

        {/* File Upload Input */}
        <div className="mb-4">
          <label className="block font-bold mb-2">Upload CSV/Excel File:</label>
          <input
            type="file"
            accept=".csv, .xlsx, .xls"
            onChange={handleFileUpload}
          />
        </div>

        {/* Email Content Editor */}
        <div className="mb-4">
          <label className="block font-bold mb-2">Write Email Content:</label>
          <JoditEditor
            value={content}
            config={config}
            onBlur={(newContent) => setContent(newContent)}
          />
        </div>

        {/* Status Bar */}
        <div className="mb-4">
          <p>Total emails: {status.total}</p>
          <p>Sent emails: {status.sent}</p>
          <p>Failed emails: {status.failed}</p>
        </div>

        {/* Send and Stop Buttons */}
        <div className="mb-4">
          <button
            onClick={sendEmail}
            className={`bg-blue-500 text-white p-2 rounded ${
              isSending ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSending}
          >
            {isSending ? "Sending Emails..." : "Send Emails"}
          </button>

          <button
            onClick={stopEmailSending}
            className="bg-red-500 text-white p-2 rounded ml-4"
            disabled={!isSending} // Disable if not sending
          >
            Stop
          </button>
        </div>

        {/* Popup Notification */}
        {showPopup && (
          <div className="fixed top-0 right-0 mt-4 mr-4 p-4 bg-green-500 text-white rounded shadow-lg">
            {currentEmail}
          </div>
        )}
      </div>
      <div className="w-[20%] bg-gray-100 p-4 inline">Area for ads</div>
    </div>
  );
}

export default App;
