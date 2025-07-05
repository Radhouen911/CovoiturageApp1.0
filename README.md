Covoiturage Frontend
This is the frontend for a carpooling application built with Create React App. The app allows users to search for rides, book as passengers, or offer rides as drivers. It integrates with a Laravel backend (covoiturage-backend) for API services, authentication, and data management.
Project Overview
The carpooling app provides:

Passenger Features: Search rides, book seats, view booking history, and contact drivers.
Driver Features: Create rides, manage booking requests, and view ride history.
Authentication: User registration, login, and logout using Laravel Sanctum.
UI: Built with React, styled with Bootstrap and FontAwesome for a responsive design.

The frontend communicates with the backend at http://localhost:8000/api for endpoints like /api/rides, /api/bookings, and /api/booking-requests.
Prerequisites
Before running the app, ensure you have:

Node.js (v14 or later) and npm installed.
Laravel Backend (covoiturage-backend) set up at D:\CovoiturageWeb\covoiturage-backend.
PHP (v8.0 or later) and Composer for the backend.
A running MySQL database configured in the backend's .env file.
Dependencies:
Frontend: Axios, React Router, Bootstrap, FontAwesome.
Backend: Laravel Sanctum for authentication.

Setup Instructions

Clone the Repository (if not already done):
git clone <repository-url>
cd covoiturage-frontend

Install Frontend Dependencies:In D:\CovoiturageWeb\covoiturage-frontend, run:
npm install

Set Up the Backend:

Navigate to D:\CovoiturageWeb\covoiturage-backend.
Install dependencies:composer install

Copy .env.example to .env and configure:DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=covoiturage
DB_USERNAME=root
DB_PASSWORD=

Generate app key and run migrations:php artisan key:generate
php artisan migrate

Start the backend server:php artisan serve

Configure Frontend:

Ensure src/services/api.js points to the backend:const api = axios.create({
baseURL: "http://localhost:8000",
headers: {
"Content-Type": "application/json",
Accept: "application/json",
},
withCredentials: true,
});

Available Scripts
In the covoiturage-frontend directory (D:\CovoiturageWeb\covoiturage-frontend), you can run:
npm start
Runs the app in development mode.Open http://localhost:3000 to view it in your browser.
The page reloads automatically on code changes. Lint errors appear in the console.
Note: Ensure the backend is running (php artisan serve) at http://localhost:8000.
npm test
Launches the test runner in interactive watch mode.See Running Tests for details.
npm run build
Builds the app for production to the build folder.Bundles React in production mode, minifies files, and includes hashes in filenames for optimal performance.
Your app is ready for deployment! See Deployment for more information.
npm run eject
Warning: This is a one-way operation. You can't undo eject!
Ejects the app from Create React App, exposing all configuration files (Webpack, Babel, ESLint, etc.) for full control. Use this only if you need advanced customization. All commands except eject will still work post-ejection.
Running the Application

Start the Backend:
cd D:\CovoiturageWeb\covoiturage-backend
php artisan serve

Start the Frontend:
cd D:\CovoiturageWeb\covoiturage-frontend
npm start

Test the App:

Open http://localhost:3000.
Register or login as:
Passenger: Bohmid@gmail.com (ID 1, Ahmed).
Driver: radhouen@gmail.com (ID 2, Radhouen).

Navigate to /search to find rides, /ride/:id to book, or /myRides to view rides/bookings.

Debugging:

Frontend logs: Open F12 > Console in the browser.
Backend logs: Check D:\CovoiturageWeb\covoiturage-backend\storage\logs\laravel.log:Get-Content -Path .\storage\logs\laravel.log -Tail 100

Key Features

Pages:
/search: Search for available rides.
/ride/:id: View ride details and book (via RideDetails.js).
/myRides: View rides, bookings, and manage requests (via MyRidesPage.js).
/messages: Chat with drivers/passengers.

API Integration:
/api/rides: List available rides.
/api/my-rides: Driver’s rides with bookings.
/api/bookings: Passenger’s bookings.
/api/booking-requests: Driver’s pending booking requests.

Authentication: Uses Laravel Sanctum with Bearer tokens stored in localStorage.
