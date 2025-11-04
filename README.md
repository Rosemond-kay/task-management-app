# 🧠 DigiiTask — Smart Task Management App

**DigiiTask** is a modern, responsive, and intuitive task management web app designed to help individuals and teams organize, track, and complete their daily tasks efficiently.  
Built with **React**, **TypeScript**, **Zustand**, and **TailwindCSS**, it provides a smooth, real-time experience for managing personal and collaborative projects.

---

## ✨ Features

- 🗂️ **Task Organization:** Create, update, and delete tasks seamlessly.  
- 👤 **User Authentication:** Secure login/signup powered by custom API integration.  
- 🧾 **Role-Based Access:** Admins can manage users, while team members manage personal tasks.  
- 🔄 **Real-Time State Management:** Uses **Zustand** for lightweight and efficient global state.  
- 📱 **Responsive Design:** Optimized for both desktop and mobile devices.  
- 🧩 **Reusable UI Components:** Custom-built dropdowns, avatars, tooltips, and sheets.  
- 🎨 **Dark Mode Friendly:** Uses CSS variables for theme consistency.  
- 💾 **Persistent Login:** User data saved securely via local storage.

---

## 🧱 Tech Stack

| Category | Tools |
|-----------|-------|
| **Frontend** | React + TypeScript |
| **Styling** | TailwindCSS |
| **State Management** | Zustand (with persistence middleware) |
| **Icons** | Lucide React |
| **API Handling** | Axios-based custom services |
| **Deployment** | Vercel |
| **Version Control** | Git + GitHub |

---

## 📁 Project Structure

src/
├── components/
│ ├── navbar/
│ ├── sidebar/
│ ├── ui/
│ └── tasks/
├── stores/
│ └── useAuthStore.ts
├── services/
│ └── api/
│ └── authApi.ts
├── types/
│ └── auth.d.ts
├── pages/
│ ├── Dashboard.tsx
│ ├── Login.tsx
│ └── Signup.tsx
└── App.tsx

yaml
Copy code

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/digiitask.git
cd digiitask
2️⃣ Install Dependencies
bash
Copy code
npm install
3️⃣ Create Environment Variables
Create a .env file in the project root and add:

bash
Copy code
VITE_API_URL=https://your-backend-api-url.com
4️⃣ Run the Development Server
bash
Copy code
npm run dev
Visit http://localhost:5173 to view your app.

🚀 Deployment (Vercel)
To deploy on Vercel from your branch (e.g. restore-backup):

Push your latest changes:

bash
Copy code
git push origin restore-backup
Go to Vercel Dashboard.

Import your GitHub repo.

Under Branch to Deploy, select restore-backup.

Build command:

bash
Copy code
npm run build
Output directory:

bash
Copy code
dist
Click Deploy.

Vercel will build and host your app at:

arduino
Copy code
https://your-app-name.vercel.app
🔑 Authentication Flow
Users can sign up, log in, and remain authenticated using JWT tokens.

The app uses Zustand’s persist middleware to store tokens locally.

On logout, user data is safely cleared from the store.

🧩 Key Components
🧍 Avatar Component
Displays a user’s profile photo or fallback initials with a clean UI.

🧭 Navbar
Shows logged-in user info, logout option, and role-based badges.

📜 Dropdown Menu
Accessible and fully customizable menu with support for shortcuts and variants.

🎛️ Task Board
Displays categorized tasks with options for filtering, editing, and marking completion.



bash
Copy code
/docs
Or view it online at:
➡️ https://your-app-name.vercel.app/docs

👥 Collaboration
If you're a collaborator (e.g., line manager or reviewer):

Clone the repo:
git clone https://github.com/your-username/digiitask.git


Checkout the working branch
git checkout restore-backup

After review, create a Pull Request back to main.



🛠️ Future Improvements
✅ Task prioritization & deadlines

✅ Team collaboration dashboard

⏳ File attachments to tasks

⏳ Integration with Google Calendar

🧑‍💻 Author
Rosemond Ampomah
Aspiring Frontend Developer | Future Fintech Engineer
LinkedIn Profile

🕋 License
This project is licensed under the MIT License — free to use and modify with attribution.

“Organize your mind. Simplify your day. Achieve more with DigiiTask.”