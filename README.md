# 🌾 Farm2Store

Farm2Store is a full-stack web application that connects farmers and retailers in a seamless online marketplace. Farmers can list their products, retailers can place orders, and admins can manage the entire flow — all in one platform.

---

## 🚀 Features

* 👨‍🌾 Farmer Dashboard: View orders, track earnings, update delivery status.
* 🛒 Retailer Dashboard: Browse products, manage cart, place orders, view history.
* 🛠️ Admin Panel: View reports, feedback, total sales, and user data.
* 📊 Sales Reports: Total sales, average income, orders per farmer/retailer.
* 📦 Real-time status updates: Delivered/Completed tracking.
* 🩾 Export reports as PDF with charts.
* 🎨 Responsive design with clean UI.

---

## 🧰 Tech Stack

### Frontend

* React.js (v19)
* Vite
* React Router v7
* Axios
* Chart.js via `react-chartjs-2`
* jsPDF + html2canvas + autoTable
* CSS Modules

### Backend

* Node.js
* Express.js
* MySQL

---

## 📦 Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/Chirag19bca/farm2store.git
cd farm2store
```

---

### 2. Backend Setup (`/backend` folder)

```bash
cd backend
npm install
```

#### ✅ Required Backend Packages

```bash
npm install bcrypt cookie-parser cors express express-mysql-session express-session multer mysql nodemailer react-router-dom
```

#### 🧪 Backend Dev Dependency

```bash
npm install --save-dev nodemon
```

🛠 Configure your MySQL DB connection in `db.js`.

Start the backend server:

```bash
npm start
```

---

### 3. Frontend Setup

> ⚠️ Only the `src` folder is uploaded in this repo.
> You must first **create a new React project** using Vite, then replace the default `src` with the one from this repo.

#### 🛠 Steps:

```bash
cd ..
npm create vite@latest frontend --template react
cd frontend
npm install
```

Now replace the generated `src` folder with the one from the repository:

```bash
rm -rf src
cp -r ../farm2store/frontend/src ./src
```

#### ✅ Required Frontend Packages

```bash
npm install axios html2canvas jspdf jspdf-autotable lucide-react papaparse react react-chartjs-2 react-dom react-icons react-router-dom
```

#### 🧪 Frontend Dev Dependencies

```bash
npm install --save-dev @eslint/js @types/react @types/react-dom @vitejs/plugin-react eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh globals vite
```

Run the frontend app:

```bash
npm run dev
```

---

## 🏃‍♂️ How to Use

1. Visit `http://localhost:5173`
2. Register as a **Farmer**, **Retailer**, or **Admin**
3. Explore each dashboard:

### 👨‍🌾 Farmer

* View incoming orders
* Mark orders as Delivered
* Track earnings from completed orders

### 🛒 Retailer

* Browse all available products
* Add to cart and checkout
* View order history

### 🛠️ Admin

* View reports for sales, orders, and users
* Export sales charts and data as PDF
* Manage user feedback

---

## 🗃️ Database Tables

* `ordersr` — Order data with `farmer_status` and `retailer_status`
* `farmer` — Farmer profile info
* `retailer` — Retailer profile info

### 📊 How to Import Database into XAMPP

1. Start Apache and MySQL from your XAMPP Control Panel.
2. Open your browser and go to `http://localhost/phpmyadmin`
3. Create a new database (e.g., `farm2store`)
4. Click on the `Import` tab
5. Choose the `.sql` file provided in the `backend` folder (or wherever your DB dump file is located)
6. Click **Go** to import the database structure and data
7. Ensure your `db.js` MySQL connection config matches the database name, username (`root` by default), and password (empty by default on XAMPP)

---

## 📸 Screenshots

<!-- Add UI screenshots here -->

![homepage](https://github.com/user-attachments/assets/a7bb9c11-cf0e-47db-b4d1-37757de78784)
![reports](https://github.com/user-attachments/assets/0256c5ff-a956-4822-9624-59373a014c94)
![orders](https://github.com/user-attachments/assets/fdbe93b3-6b61-453e-9921-64b972a937a9)



---

## 🤝 Contributing

Pull requests are welcome!
For major changes, please open an issue first to discuss your idea.

---

## 📃 License

MIT License
© 2024–25 [Chirag19bca](https://github.com/Chirag19bca) and [dhruvil25Bca](https://github.com/dhruvil25Bca)

---

## 🔗 Repository

🔗 GitHub Repo: [Farm2Store](https://github.com/Chirag19bca/farm2store.git)
