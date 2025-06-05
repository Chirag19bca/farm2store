# 🌾 Farm2Store

Farm2Store is a full-stack web application that connects farmers and retailers in a seamless online marketplace. Farmers can list their products, retailers can place orders, and admins can manage the entire flow — all in one platform.

---

## 🚀 Features

- 👨‍🌾 Farmer Dashboard: View orders, track earnings, update delivery status.
- 🛒 Retailer Dashboard: Browse products, manage cart, place orders, view history.
- 🛠️ Admin Panel: View reports, feedback, total sales, and user data.
- 📊 Sales Reports: Total sales, average income, orders per farmer/retailer.
- 📦 Real-time status updates: Delivered/Completed tracking.
- 🧾 Export reports as PDF with charts.
- 🎨 Responsive design with clean UI.

---

## 🧰 Tech Stack

### Frontend
- React.js (v19)
- Vite
- React Router v7
- Axios
- Chart.js via `react-chartjs-2`
- jsPDF + html2canvas + autoTable
- CSS Modules

### Backend
- Node.js
- Express.js
- MySQL

---

## 📦 Installation

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

#### ✅ Required Backend Packages:

```bash
npm install bcrypt cookie-parser cors express express-mysql-session express-session multer mysql nodemailer react-router-dom
```

#### 🧪 Backend Dev Dependency:

```bash
npm install --save-dev nodemon
```

🛠 Configure MySQL DB connection in `db.js`.

Start the backend:

```bash
npm start
```

---

### 3. Frontend Setup (`/frontend` folder)

```bash
cd ../frontend
npm install
```

#### ✅ Required Frontend Packages:

```bash
npm install axios html2canvas jspdf jspdf-autotable lucide-react papaparse react react-chartjs-2 react-dom react-icons react-router-dom
```

#### 🧪 Frontend Dev Dependencies:

```bash
npm install --save-dev @eslint/js @types/react @types/react-dom @vitejs/plugin-react eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh globals vite
```

Run the frontend:

```bash
npm run dev
```

---

## 🏃‍♂️ How to Use

1. Visit `http://localhost:5173`
2. Register as a **Farmer**, **Retailer**, or **Admin**
3. Farmers:
   - View orders
   - Mark as delivered
   - Track income
4. Retailers:
   - Add products to cart
   - Checkout
   - View order history
5. Admin:
   - View overall reports
   - Export reports as PDF
   - Review feedback and users

🗃️ MySQL Tables:
- `ordersr` — Order data with statuses
- `farmer` — Farmer profile
- `retailer` — Retailer profile

---

## 📸 Screenshots

_Add screenshots here to show off the UI!_

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📃 License

MIT License

---

## 🔗 Repository

🔗 [Farm2Store GitHub Repo](https://github.com/Chirag19bca/farm2store.git)
