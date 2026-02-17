# My App - E-Commerce Platform

<p align="center">
  <strong>A modern e-commerce platform built with Laravel 12 and React</strong>
</p>

<p align="center">
  <a href="#overview">Overview</a> | 
  <a href="#features">Features</a> | 
  <a href="#tech-stack">Tech Stack</a> | 
  <a href="#requirements">Requirements</a> | 
  <a href="#installation">Installation</a> | 
  <a href="#usage">Usage</a>
</p>

## Overview

My App is a modern e-commerce platform built with Laravel 12 backend framework and React frontend library. The application is designed to provide a seamless user experience for product browsing, searching, and shopping cart management.

## Features

### Customer Functionalities
- Home Page - Hero section and featured content
- Product Catalog - Display and management of product listings
- Search Functionality - Quick product search capability
- Shopping Cart - Add, remove, and manage shopping items
- Wishlist - Save preferred products for future reference
- Company Information - About page with company details
- Contact Form - Customer inquiry submission
- Authentication - User login and account management

### User Interface
- Responsive Design - Full compatibility across all device sizes
- Modern Design System - Built with Tailwind CSS framework
- Smooth Animations - Polished user interface transitions
- Dynamic Navigation Bar - Context-aware navbar with scroll behavior
- Smooth Page Navigation - Seamless section-to-section scrolling

## Tech Stack

### Backend
- Laravel 12 - PHP Web Application Framework
- PHP 8.2+ - Programming Language
- Composer - PHP Dependency Manager

### Frontend
- React 19 - JavaScript Library for Building User Interfaces
- Vite - Next Generation Frontend Build Tool
- Tailwind CSS 4 - Utility-first CSS Framework
- JavaScript ES6+ - Modern JavaScript Standards

### Database
- SQLite/MySQL - Relational Database Management System

### Development and Testing
- Sail - Docker Environment for Laravel Development
- PHPUnit - PHP Unit Testing Framework
- Laravel Pint - Code Style Formatter and Linter
- npm - Node Package Manager

## Requirements

- PHP Version: 8.2 or higher
- Node.js: Version 16.x or higher
- Composer: Latest version
- npm: Version 9.x or higher
- Git: Version control system

## Installation

### Step 1: Navigate to Project Directory

```bash
cd c:\Users\ISP-ITE02\Desktop\my-app
```

### Step 2: Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### Step 3: Configure Environment

```bash
# Copy environment configuration file
cp .env.example .env

# On Windows system:
copy .env.example .env

# Generate application encryption key
php artisan key:generate
```

### Step 4: Set Up Database

```bash
# Execute database migrations
php artisan migrate

# Optional: Seed database with sample data
php artisan db:seed
```

### Step 5: Build Frontend Assets

```bash
# Development build
npm run dev

# Production build
npm run build
```

## Usage

### Development Environment

#### Option 1: Run All Services Concurrently

```bash
# Start Laravel server, queue listener, logs viewer, and Vite development server
composer run dev
```

#### Option 2: Run Services Separately

```bash
# Terminal 1: Start Laravel Development Server
php artisan serve

# Terminal 2: Start Frontend Development Server
npm run dev
```

Access the application at `http://localhost:8000`

### Production Environment

```bash
# Build frontend assets for production
npm run build

# Optimize application for production
php artisan optimize

# Start production server
php artisan serve --env=production
```

## Project Structure

```
my-app/
├── app/                           # Laravel Application Core
│   ├── Http/                      # HTTP Controllers and Middleware
│   ├── Models/                    # Eloquent ORM Models
│   └── Providers/                 # Service Providers
├── resources/
│   ├── js/
│   │   ├── App.jsx                # React Root Component
│   │   ├── bootstrap.js           # Bootstrap Configuration
│   │   └── components/            # React Components Library
│   │       ├── Navbar.jsx         # Navigation Component
│   │       ├── sections/          # Page Sections
│   │       └── modals/            # Modal Components
│   ├── css/                       # Stylesheets
│   └── views/                     # Blade Templates
├── routes/                        # Route Definitions
├── database/                      # Database Migrations and Seeders
├── public/                        # Public Assets
├── storage/                       # Logs and Cache Storage
├── tests/                         # Unit and Feature Tests
├── config/                        # Configuration Files
├── vite.config.js                 # Vite Configuration
├── tailwind.config.js             # Tailwind CSS Configuration
└── composer.json                  # PHP Dependencies Manifest
```

## Testing

```bash
# Execute unit and feature tests
composer run test

# Alternative: Run tests with artisan
php artisan test
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server for frontend |
| `npm run build` | Build and compile frontend assets for production |
| `composer run dev` | Execute all development services concurrently |
| `composer run setup` | Complete initial project setup and configuration |
| `composer run test` | Execute PHPUnit test suite |
| `php artisan migrate` | Execute database migration files |
| `php artisan db:seed` | Populate database with seed data |

## Configuration

### Frontend Styling
Modify the Tailwind CSS configuration in `tailwind.config.js` to customize the application design and color scheme.

### Product Information
Update product data in `resources/js/components/data/ProductsData.js`

### Database Configuration
Edit database connection parameters in `.env` file:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=my_app
DB_USERNAME=root
DB_PASSWORD=
```

## Browser Compatibility

- Google Chrome - Latest version
- Mozilla Firefox - Latest version
- Apple Safari - Latest version
- Microsoft Edge - Latest version

## License

This project is open-sourced software licensed under the MIT License. See the LICENSE file for details.

## Support and Contribution

For technical support, bug reports, or feature requests, please create an issue in the project repository or contact the development team.

---

**Development Team**

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework. You can also check out [Laravel Learn](https://laravel.com/learn), where you will be guided through building a modern Laravel application.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
=======
# Product-Port
>>>>>>> 6b46e9de514216cb46958b30bad81b6a0bf74984
