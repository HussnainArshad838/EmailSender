import React, { useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";
import * as XLSX from "xlsx";
import logo from "../public/peopleConnect.png"; // Adjust the path to your logo image

function App() {
  const [showPopup, setShowPopup] = useState(false); // Show popup state

  const [content, setContent] = useState(""); // Email content from Jodit editor
  const [email, setEmail] = useState(""); // User's email
  const [password, setPassword] = useState(""); // App-specific password
  const [file, setFile] = useState(null); // Uploaded file with emails
  const [emails, setEmails] = useState([]); // Parsed emails from file
  const [subject, setSubject] = useState(""); // Email subject
  const [status, setStatus] = useState({ total: 0, sent: 0, failed: 0 }); // Status for email sending
  const [isSending, setIsSending] = useState(false); // Sending status
  const [currentEmail, setCurrentEmail] = useState(""); // Email being processed

  const config = {
    readonly: false,
    height: 400,
  };

  // Show popup for 2 seconds
  const showPopupNotification = (message) => {
    setCurrentEmail(message);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 2000); // Hide after 2 seconds
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

  // Poll email status every 5 seconds
  useEffect(() => {
    if (isSending) {
      const intervalId = setInterval(() => {
        axios
          .get("https://email-sender-backend-olive.vercel.app/email-status")
          .then((response) => {
            setStatus(response.data);
          })
          .catch((error) => {
            console.error("Error polling email status:", error);
          });
      }, 5000); // Poll every 5 seconds

      return () => clearInterval(intervalId); // Cleanup on component unmount
    }
  }, [isSending]);

  // Handle sending email
  const sendEmail = async () => {
    setIsSending(true);

    try {
      await axios.post(
        "https://email-sender-backend-olive.vercel.app/send-email",
        {
          email,
          password,
          content,
          emails,
          subject, // Send subject as well
        }
      );

      showPopupNotification("Emails are being sent.");
    } catch (error) {
      console.error("Error sending emails:", error);
      showPopupNotification("Failed to start email sending.");
      setIsSending(false);
    }
  };

  // Handle stop process on the backend
  const stopEmailSending = async () => {
    try {
      await axios.post(
        "https://email-sender-backend-olive.vercel.app/stop-email"
      );
      showPopupNotification("Email sending process stopped.");
      setIsSending(false);
    } catch (error) {
      console.error("Error stopping email process:", error);
    }
  };

  return (
    <>
      <header className="flex items-center justify-between py-4 px-6 bg-pink-200 dark:text-white text-black">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-12 w-12 mr-3" />
          <h1 className="text-xl font-bold">Email Sender</h1>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold">Effortless Email Delivery</h2>
        </div>
      </header>

      <div className="flex flex-row">
        <div className="w-[20%] text-center ">Ads Section</div>
        <div className="w-[60%] text-center bg-red-100 px-3">
          <h1 className="text-3xl font-bold underline mb-4">
            Email Sender App
          </h1>
          <div className="flex flex-row w-full space-x-4">
            <div className="w-[60%]">
              <div className="grid grid-cols-2 gap-4 mr-4">
                <div className="mb-4">
                  <label className="block font-bold mb-2 text-left">
                    Your Email Address:
                  </label>
                  <input
                    type="email"
                    className="border p-2 w-full rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>

                <div className="mb-4">
                  <label className="block font-bold mb-2 text-left">
                    App-Specific Password:
                  </label>
                  <input
                    type="password"
                    className="border p-2 w-full rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your app password"
                  />
                </div>

                <div className="mb-4">
                  <label className="block font-bold mb-2 text-left">
                    Email Subject:
                  </label>
                  <input
                    type="text"
                    className="border p-2 w-full rounded"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter email subject"
                  />
                </div>

                <div className="mb-4">
                  <label className="block font-bold mb-2 text-left">
                    Upload CSV/Excel File:
                  </label>
                  <input
                    type="file"
                    accept=".csv, .xlsx, .xls"
                    className="border p-2 w-full rounded"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
            </div>

            <div className="w-[40%] ">
              <label className="block font-bold mb-2">Instructions:</label>
              <ul className="list-disc border-2 text-left text-sm p-2">
                <li>
                  Enter the email address in the "
                  <strong>Your Email Address</strong>" input field.
                </li>
                <li>
                  Go to Google account manager, generate an "
                  <strong>App-Specific Password</strong>" (two-factor
                  authentication is required), and paste it in the corresponding
                  field.
                </li>
                <li>
                  Enter the subject of the email in the "
                  <strong>Email Subject</strong>" field.
                </li>
                <li>
                  Upload an Excel file with one column containing the email
                  addresses in the "<strong>Upload Excel File</strong>" field.
                </li>
              </ul>
            </div>
          </div>

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
          {showPopup && (
            <div className="fixed top-0 right-0 mt-4 mr-4 p-4 bg-green-500 text-white rounded shadow-lg">
              {currentEmail}
            </div>
          )}
          <div className="mb-4">
            <div className="mb-4 flex flex-row justify-between">
              <p>
                <strong>Total emails:</strong> {status.total}
              </p>
              <p>
                <strong className="text-green-600">Sent emails:</strong>{" "}
                <span className="text-lg">{status.sent}</span>
              </p>
              <p>
                <strong className="text-red-600">Failed emails:</strong>{" "}
                {status.failed}
              </p>
            </div>

            <label className="block font-bold mb-2">Write Email Content:</label>
            <JoditEditor
              value={content}
              config={config}
              className="text-left"
              onBlur={(newContent) => setContent(newContent)}
            />
          </div>
        </div>
        <div className="w-[20%] text-center">Ads Section</div>
      </div>
    </>
  );
}

export default App;
