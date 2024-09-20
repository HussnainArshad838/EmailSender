# Email Sender App

![Logo](./public/peopleConnect.png)

## Overview

The **Email Sender App** is a web application that allows users to send bulk emails effortlessly. It provides an interface to enter the sender’s email address, app-specific password, subject, email content, and a list of recipient email addresses from an uploaded CSV or Excel file. This app is ideal for users who need to automate email campaigns or notify multiple recipients efficiently.

The app is live and can be accessed at:https://email-sender-mauve.vercel.app/

## Features

- **Email Delivery**: Send bulk emails to a list of recipients by uploading a CSV or Excel file.
- **Real-Time Status**: View the total number of emails, successfully sent emails, and any failed attempts.
- **Email Content Editor**: Compose rich text email content using a powerful WYSIWYG editor (Jodit Editor).
- **Process Control**: Start and stop the email-sending process at any time.
- **Polling for Status Updates**: The app regularly checks the backend to update the sending status in real time.

## Technologies Used

- **React**: JavaScript library for building user interfaces.
- **Jodit Editor**: Rich text editor to compose email content.
- **Axios**: Promise-based HTTP client to communicate with the backend.
- **XLSX.js**: For parsing Excel or CSV files.
- **Tailwind CSS**: Utility-first CSS framework for styling the application.
- **Node.js**: Backend for handling email sending (not included in this code).
- **Google App Passwords**: Required for secure email sending (via Gmail).

## How to Use

### 1. Prerequisites

To use the **Email Sender App**, you need the following:

- A Gmail account with **Two-Factor Authentication (2FA)** enabled.
- An **App-Specific Password** generated from your Google Account settings.

### 2. Steps to Follow

1. **Enter Email & Password**:
   - In the `Your Email Address` field, input your Gmail address.
   - In the `App-Specific Password` field, input your generated Google App password.
2. **Enter Email Subject**:

   - Provide the subject line for the email in the `Email Subject` field.

3. **Upload Email List (CSV/Excel)**:

   - Upload a CSV or Excel file with a list of recipient email addresses in the first column.

4. **Compose Email**:

   - Write your email content in the text editor. The content can include rich text formatting.

5. **Send Emails**:

   - Click on the `Send Emails` button to start sending emails. You can monitor the progress as the app updates the status of sent, failed, and total emails.

6. **Stop Email Sending (Optional)**:
   - You can stop the sending process at any time by clicking the `Stop` button.

### Example File Format (CSV/Excel)

| Email Address     |
| ----------------- |
| user1@example.com |
| user2@example.com |
| user3@example.com |

### Handling Errors

If emails fail to send, the app will notify you in real time. You can check the number of failed emails in the status section.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/HussnainArshad838/EmailSender.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

Ensure you have set up your backend to handle email sending and status updates, as this frontend interacts with an API.

## API Endpoints

The app communicates with the backend API at the following endpoints:

- `POST /send-email`: Start sending bulk emails.
- `GET /email-status`: Check the status of the ongoing email process.
- `POST /stop-email`: Stop the current email-sending process.

Make sure the backend server is deployed or running locally for the app to function correctly.

## Acknowledgements

- **Jodit Editor**: For the rich text editing functionality.
- **XLSX.js**: For parsing and reading Excel/CSV files.s
- **Google App Passwords**: Ensuring secure email authentication.
