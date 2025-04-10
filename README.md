# 🎫 Event Manager UIC

> A modern event management system for UIC campus events with QR code check-in functionality

## 🚀 Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Express.js
- **Database:** MongoDB

## ✨ Features

- 🔄 Real-time event updates from UIC's website
- 📱 Mobile-friendly design
- 🔐 Google OAuth and email authentication
- 📅 RSVP system for events
- 📸 QR code scanning for event check-in
- 👑 Admin dashboard for event management

## 📖 How to Use

### 👤 For Users

1. **Login/Register**: Use Google OAuth or create an account
2. **Browse Events**: View all events scraped from UIC's website
3. **RSVP**: Click on an event and hit the green RSVP button
4. **Check-in**: At the event, use your camera to scan the QR code
   - Go to the RSVP page in the navbar
   - Select your RSVP'd event
   - Click "Open Camera"
   - Grant camera permissions
   - Scan the QR code to check in

### 👨‍💼 For Admins

1. **Login**: Use these credentials
   - Email: `admin@admin.com`
   - Password: `newAdminPassword`
2. **Manage Events**:
   - Click "Fetch Events" for latest UIC events
   - Select any event to generate QR codes
   - Use "Show QR" to display dynamic QR codes (updates every 100ms)

## 👨‍💻 Authors

This project was built collaboratively by:

- **Umar Khan** - [LinkedIn](https://www.linkedin.com/in/umarkhan394/)
- **Muhsin Adan** - [LinkedIn](https://www.linkedin.com/in/muhsin-adan-916026227/)
