# Product-Port - Modern E-Commerce Platform

A feature-rich e-commerce platform built with **Laravel 12** and **React 19**, focused on seamless user experience and secure automated payments.

## 🚀 Overview

Product-Port is a high-performance e-commerce solution that bridges the gap between modern design and powerful backend functionality. It features a fully responsive frontend, a comprehensive admin dashboard, and a state-of-the-art payment integration.

## ✨ Key Features

### 🛒 Customer Experience
- **Dynamic Catalog**: Categorized product browsing with real-time search and filtering.
- **Smart Cart**: Intuitive shopping cart management with instant feedback.
- **Wishlist**: Save favorite items for later.
- **Multi-step Checkout**: A polished flow that manages shipping info and payment selection separately.
- **Bilingual Support**: Full localization in **Thai** and **English** using `i18next`.

### 💳 Payment Integration (Omise)
Secure and automated payment processing:
- **PromptPay (Automated)**: Instant QR generation and automated payment verification (No slip upload required for this method).
- **Credit/Debit Card**: Secure tokenization (PCI-DSS compliant) for card payments.
- **Manual Bank Transfer**: Traditional method with QR code and manual slip upload as a fallback.

### 🛡 Admin & Management
- **Dashboard**: High-level overview of sales, orders, and site traffic.
- **Order Management**: Track and update order statuses (Paid, Shipping, Completed, Cancelled).
- **Revenue tracking**: Automated revenue statistics and payment verification.

## 🛠 Tech Stack

### Backend
- **Laravel 12**: Robust PHP framework.
- **Omise-PHP**: Official SDK for Omise payment gateway.
- **MySQL/SQLite**: Dependable data storage.

### Frontend
- **React 19**: Modern component-based UI.
- **Tailwind CSS 4**: Utility-first styling for a premium look.
- **Vite**: Ultra-fast build tool.
- **i18next**: Advanced localization framework.

## ⚙️ Installation & Setup

1. **Clone & Install**:
   ```bash
   composer install
   npm install
   ```

2. **Environment Configuration**:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   *Make sure to add your Omise keys to `.env`:*
   ```env
   OMISE_PUBLIC_KEY=pkey_test_...
   OMISE_SECRET_KEY=skey_test_...
   VITE_OMISE_PUBLIC_KEY=${OMISE_PUBLIC_KEY}
   ```

3. **Database Setup**:
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

4. **Launch**:
   ```bash
   php artisan serve
   npm run dev
   ```

## 📖 License

This project is licensed under the MIT License.
