# 🔐 Secure Password Manager

A privacy-focused password manager built with **Next.js**, **Appwrite**, **CryptoJS**, and **bcryptjs**.

---

## 🚀 Features

- ⚙️ **Built with**:  
  - [Next.js](https://nextjs.org/)
  - [Appwrite](https://appwrite.io/) for backend services and authentication
  - [CryptoJS](https://www.npmjs.com/package/crypto-js) for encryption
  - [bcryptjs](https://www.npmjs.com/package/bcryptjs) for secure hashing

- 🔐 **User Authentication**:
  - Login/signup with **email + password**
  - **Google OAuth** login integration via Appwrite

- 🧠 **Password Management**:
  - Users can securely:
    - ➕ Add passwords
    - ✏️ Edit existing passwords
    - 👁️ View decrypted passwords
    - 🗑️ Delete passwords

- 🛡️ **Privacy & Security**:
  - All saved passwords are **encrypted**.
  - The **secret key** used for encryption is derived from the user’s **email**:
    - Email → `bcrypt-hashed` → Encrypted with `CryptoJS` → Used as the key
  - This ensures that:
    - Even the app itself **cannot reverse-engineer passwords**
    - Each user has a **unique key** without storing it directly

---

## 🛠️ Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/secure-password-manager.git
   cd secure-password-manager
2. **Install the dependencies**:
   ```bash
    npm install
3. **Configure environment variables**:
4. Run the local server
   ```bash
      npm run dev
