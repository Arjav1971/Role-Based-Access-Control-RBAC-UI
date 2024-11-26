# **Role-Based Access Control (RBAC) Management System**

## **Overview**

This project is a **Role-Based Access Control (RBAC) Management System**, designed to provide an intuitive and efficient interface for managing users, roles, and permissions. It empowers administrators to control user access dynamically, manage roles, assign permissions, and ensure a secure system environment.

The project is built using **React** and **Material-UI (MUI)**, leveraging best practices in modern front-end development to deliver a responsive, scalable, and user-friendly UI.

---

## **Features**

### 1. **User Management**
- View a list of all users in a tabular format with pagination.
- Add new users with details such as:
  - **Name**
  - **Projects**
  - **Role**
  - **Expiration Date**
  - **Status (Active/Inactive)**.
- Edit existing users, including changing roles, status, and expiration dates (with validations).
- Delete users from the system.

### 2. **Role Management**
- View all available roles in a neatly organized list.
- Create new roles with:
  - A unique role name.
  - A set of permissions (at least one permission is required to create a role).
- Manage permissions for existing roles dynamically.
- Delete roles directly from the **Manage Role** dialog.

### 3. **Dynamic Permission Assignment**
- View all available permissions (e.g., Read, Write, Delete, Execute, Manage Users).
- Assign or revoke permissions for roles in real-time.

### 4. **Validation**
- **Yup** is used for validation to ensure:
  - Unique role names.
  - At least one permission is selected for new roles.
  - Expiration dates cannot be in the past.

### 5. **Responsive Design**
- Fully responsive interface with **Material-UI**, optimized for devices of all sizes.

### 6. **Mock API Integration**
- Simulated backend using in-memory data for all CRUD operations (get, add, update, delete users and roles).

---

## **Tech Stack**

- **Frontend**: React, Material-UI (MUI), Formik, Yup
- **Styling**: Material-UI, Tailwind CSS (for some custom styles)
- **Routing**: React Router
- **Data Handling**: Mock API simulation with JSON data
- **Validation**: Yup (integrated with Formik)

---

## **Setup Instructions**

Follow these steps to set up and run the project locally:

### 1. **Prerequisites**
- Ensure you have **Node.js** (>= 14.x) and **npm** (or yarn) installed on your machine.

### 2. **Clone the Repository**
```bash
git clone <repository-url>
cd <repository-folder>
```

### 3. **Install Dependencies**
Install all required dependencies using npm:
```bash
npm install
```

### 4. **Run the Application**
Start the development server:
```bash
npm start
```

The app will be accessible at [http://localhost:3000](http://localhost:3000).

---

## **Project Structure**

```
src/
├── components/
│   ├── Dashboard.js   # Main navigation layout
│   └── PermissionsPage.js  # Role management
├── pages/
│   ├── Users.js       # User management page
│   └── Roles.js       # Role management page
├── apis/
│   └── mockApi.js     # Mock API functions for CRUD operations
├── assets/
│   ├── DataAssets/    # Mock data files
│   └── ImageAssets/   # Static images (e.g., logo, avatar)
├── App.js             # Main app entry point
├── index.js           # React app entry point
└── App.css            # Global styles
```

---

## **Key Components**

### **1. Dashboard**
- A responsive layout with a sidebar navigation menu.
- Provides links to **Users** and **Roles** pages.

### **2. Users Page**
- Displays a paginated table of users.
- Supports filtering, sorting, and searching by user details.
- Allows CRUD operations on user data.

### **3. Roles Page**
- Displays all available roles.
- Allows role creation, permission management, and deletion.

### **4. Manage Role Dialog**
- A dynamic modal to edit or delete roles.
- Provides checkboxes to assign/revoke permissions.

### **5. Add Role Dialog**
- A modal to create a new role with validation to ensure unique names and selected permissions.

---

## **Validation Rules**

- **Role Name**: Must be unique and not empty.
- **Permissions**: At least one permission must be selected.
- **User Expiration Date**: Cannot be a past date.
- **User Projects**: Must be a valid non-negative number.

---

## **Sample Data**

The app uses mock data stored in `src/assets/DataAssets/mockUsers.json`. The structure includes:
```json
[
  {
    "id": 1,
    "user": "John Doe",
    "projects": 5,
    "status": "Active",
    "role": "Admin",
    "expiration": "2024-11-30"
  },
  {
    "id": 2,
    "user": "Jane Smith",
    "projects": 2,
    "status": "Inactive",
    "role": "Editor",
    "expiration": "2024-10-10"
  }
]
```

---

## **Screenshots**



### **Users Page**
 <img width="1465" alt="Screenshot 2024-11-27 at 12 58 01 AM" src="https://github.com/user-attachments/assets/d8878ea9-573b-4e86-bd96-3cad9237fe57">

<img width="1466" alt="Screenshot 2024-11-27 at 12 57 26 AM" src="https://github.com/user-attachments/assets/12a81e3e-b5f1-4bd6-a9ae-e7b4814c686d">


### **Roles Page**
<img width="1458" alt="Screenshot 2024-11-27 at 1 05 54 AM" src="https://github.com/user-attachments/assets/bcd955a5-7136-4189-a0ef-a95ba9926152">


### **Manage Role Dialog**
<img width="1460" alt="Screenshot 2024-11-27 at 12 58 25 AM" src="https://github.com/user-attachments/assets/b484e713-8fe4-489c-bef7-e7961f5544ff">


---

## **Future Enhancements**
- **Backend Integration**: Connect with a real API for persistent data.
- **Access Levels**: Define hierarchical roles (e.g., Super Admin, Admin, User).
- **Activity Logs**: Track changes made to users and roles.
- **Role Groups**: Group roles for easier management.

---

## **Contributing**
Contributions are welcome! Please fork the repository and submit a pull request for review.

---


