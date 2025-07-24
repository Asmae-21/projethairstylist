💇‍♀️ Hair Salon Reservation System
This project is a web application for managing hair salon reservations using microservices built with Node.js, Express, and MySQL.

It includes:

🟦 user_service: handles registration, login, and user authentication

🟩 disponibilite_service: admin manages available time slots

🟥 reservation_service: clients book, update, or cancel reservations

🌐 frontend: HTML/CSS/JS interface for users (admin + client)

📦 Prerequisites
Make sure the following are installed:

Node.js (v18 or higher)

MySQL

Optional: VS Code with Live Server for frontend

⚙️ Step-by-Step Setup
1. 📁 Unzip the Project
Extract the zip and open the folder in your editor.

2. 🗃️ Create the Databases in MySQL
Run the following SQL commands (in MySQL Workbench or terminal):

sql
Copier
Modifier
CREATE DATABASE user_db;
CREATE DATABASE reservation_db;
CREATE DATABASE disponibilite_db;
If needed for admin role:

sql
Copier
Modifier
USE user_db;
UPDATE User SET role = 'admin' WHERE email = 'nossa@gmail.com';
3. 🔧 Setup Each Microservice
Do this for each folder: user_service, disponibilite_service, and reservation_service.

bash
Copier
Modifier
cd service_folder_name
npm install
npx prisma generate
npx prisma db push
npm start
Repeat for all 3 services. Each one should show “running on port …” if successful.

4. 🚀 Launch the Frontend
Just open frontend/index.html in your browser
OR
use the Live Server extension in VS Code.

🔑 Login Tips
You can register a new user via the UI.

An admin can login using the email you promoted via SQL.

Admin can add slots; clients can view and book them.

🔐 Auth Info
JWT tokens are stored in localStorage

They're automatically attached in requests for protected endpoints

✅ Project Features (per Cahier des Charges)
✔ Register/Login (with role support)
✔ View and manage available time slots
✔ Book, update, or cancel a reservation
✔ Admin dashboard to manage slots
✔ Secure authentication (JWT)
✔ Responsive design for mobile & desktop
✔ Only one reservation per time slot
