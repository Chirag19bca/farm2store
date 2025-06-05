🌾 Farm2Store
Farm2Store is a full-stack web application that connects farmers and retailers in a seamless online marketplace. Farmers can list their products, retailers can place orders, and admins can manage the entire flow — all in one platform.

🚀 Features
👨‍🌾 Farmer Dashboard: View orders, track earnings, update delivery status.

🛒 Retailer Dashboard: Browse products, manage cart, place orders, view history.

🛠️ Admin Panel: View reports, feedback, total sales, and user data.

📊 Sales Reports: Total sales, average income, orders per farmer/retailer.

📦 Real-time status updates: Delivered/Completed tracking.

🧾 Export reports as PDF with charts.

🎨 Responsive design with clean UI.

🧰 Tech Stack
Frontend
React.js (v19+)

Vite

React Router v7

Axios

Chart.js via react-chartjs-2

jsPDF + html2canvas + autoTable

CSS Modules

Backend
Node.js

Express.js

MySQL

📦 Installation
1. Clone the Repository
git clone https://github.com/Chirag19bca/farm2store.git
cd farm2store

2. Backend Setup (/backend folder)
cd backend
npm install

✅ Required Backend Packages:
npm install bcrypt cookie-parser cors express express-mysql-session express-session multer mysql nodemailer react-router-dom

🧪 Backend Dev Dependency:
npm install --save-dev nodemon

🛠 Configure MySQL DB connection in db.js.

Start the backend:

npm start

3. Frontend Setup (/frontend folder)
Important: You'll start by creating a new React.js project using Vite.

First, navigate back to your main farm2store directory (if you're currently in the /backend folder):

cd ..

Now, create a new Vite React project named frontend:

npm create vite@latest frontend -- --template react

After the project is created, go into the frontend directory:

cd frontend

Next, replace the src folder that Vite just created in this frontend directory with the src folder from the Farm2Store repository that you cloned earlier. This ensures you're using the project's actual source code.

Once the src folder is replaced, install all the necessary packages:

npm install

✅ Required Frontend Packages:
npm install axios html2canvas jspdf jspdf-autotable lucide-react papaparse react react-chartjs-2 react-dom react-icons react-router-dom

🧪 Frontend Dev Dependencies:
npm install --save-dev @eslint/js @types/react @types/react-dom @vitejs/plugin-react eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh globals vite

Finally, run the frontend:

npm run dev

🏃‍♂️ How to Use
Visit http://localhost:5173

Register as a Farmer, Retailer, or Admin

Farmers:

View orders

Mark as delivered

Track income

Retailers:

Add products to cart

Checkout

View order history

Admin:

View overall reports

Export reports as PDF

Review feedback and users

🗃️ MySQL Tables:

ordersr — Order data with statuses

farmer — Farmer profile

retailer — Retailer profile

📸 Screenshots
Add screenshots here to show off the UI!

🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

📃 License
MIT License

🔗 Repository
🔗 Farm2Store GitHub Repo

© Copyright
Copyright (c) 2024-25 Chirag19bca and dhruvil25Bca
