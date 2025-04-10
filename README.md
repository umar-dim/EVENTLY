# Event manager UIC

## Tech stack

- React
- Tailwind
- Express.js
- MongoDB

## How to use the site:

Hello, this website is about users seeing the events that are happening around UIC, RSVPing for them, and opening their camera to scan the QR code at the event. This will require two devices to test. In order to use the site, either log in with Google or sign in with your account. If you don't have an account and don't want to use Google, then just register. Then you'll be taken to the dashboard page, which has a list of all the events happening around campus that we webscraped off of UIC's website. Choose an event by clicking on one of them. Then click on the green RSVP button. It will save your RSVP'd event, and you can see your RSVP'd events at the RSVP page that's in the navbar. When you go to the RSVP page, click on one of the events you've RSVP'd for and then click on the blue "Open Camera" button. This will take you to a page where it asks for camera permissions. Click on the "Request Camera Permissions" button and then click "Start Scanning," and it will open up your camera. Then scan the QR code, and it will take you to the checked-in page. 

On the admin side, log in with these credentials for email and password: `admin@admin.com` and `newAdminPassword`, and you'll be taken to a dashboard page. Then you'll see the same dashboard page with all the events. Click on the "Fetch Events" button to get the latest list of UIC events. Click on an event and click "Show QR," which will show a new QR code every 100ms. With these QR codes, the users will scan these for their RSVP events in order to check in.

## Authors

This project was built collaboratively by:

- **Umar Khan** - [LinkedIn](https://www.linkedin.com/in/umarkhan394/)
- **Muhsin Adan** - [LinkedIn](https://www.linkedin.com/in/muhsin-adan-916026227/)
