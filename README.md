# FinTrack AI

🚀 Live Demo: https://fintrack-ai-1-aifa.onrender.com

📖 Backend API Docs: https://fintrack-ai-yaih.onrender.com/docs

## Features

- User Authentication (Login/Signup)
- Expense Tracking
- Budget Management
- Expense Analytics
- Profile Management
- Responsive UI

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- Axios
### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT Authentication

## Deployment

Frontend: https://fintrack-ai-1-aifa.onrender.com

Backend: https://fintrack-ai-yaih.onrender.com

## Overview

FinTrack AI is a modern web-based personal finance management application designed to help users track expenses, manage budgets, and gain meaningful insights into their spending habits.

The platform enables users to organize financial data, monitor spending trends, visualize expenses through interactive charts, and maintain better control over personal finances through a simple and intuitive interface.

Built using React, FastAPI, SQLite, and modern visualization libraries, FinTrack AI delivers a seamless experience for both casual users and individuals focused on financial planning.

---

# Purpose & Use Case

## The Problem

Managing personal finances manually can be difficult and time-consuming.

Users often face challenges such as:

* Tracking daily expenses consistently
* Understanding where money is being spent
* Maintaining budgets effectively
* Analyzing spending patterns over time
* Organizing financial records across different categories

Without proper tools, it becomes difficult to make informed financial decisions.

## The Solution

FinTrack AI provides a centralized platform where users can:

* Record and manage expenses
* Categorize spending activities
* Set monthly budgets
* Monitor financial health in real-time
* Visualize spending behavior through analytics dashboards
* Access financial insights from a single interface

---

# Key Features

## 1. User Authentication & Security

* Secure account registration and login
* JWT-based authentication
* Protected routes and session management
* Password hashing using bcrypt
* Secure user data storage

---

## 2. Expense Management

* Add new expenses quickly
* Edit existing expense records
* Delete unnecessary entries
* Organize expenses by category
* Track spending history over time

---

## 3. Budget Tracking

* Create monthly spending budgets
* Monitor budget utilization in real-time
* View remaining available balance
* Receive visual indicators of spending progress

---

## 4. Analytics & Reporting

* Interactive spending dashboards
* Category-wise expense distribution
* Pie chart visualizations
* Financial trend analysis
* Spending insights and summaries

---

## 5. Search & Filtering

* Search expenses instantly
* Filter by category
* Filter by date range
* Quickly locate historical transactions

---

## 6. Responsive User Interface

* Mobile-friendly design
* Modern Material UI components
* Responsive layouts for all screen sizes
* Smooth and intuitive user experience

---

# How It Works

## Workflow

```text
1. USER CREATES ACCOUNT
   ↓
2. USER LOGS IN
   ↓
3. USER ADDS EXPENSES
   ↓
4. SYSTEM STORES DATA
   ↓
5. USER SETS BUDGETS
   ↓
6. DASHBOARD CALCULATES INSIGHTS
   ↓
7. USER VIEWS ANALYTICS & REPORTS
```

---

## Data Flow

### Expense Creation

```text
User Input
   ↓
React Frontend
   ↓
FastAPI Backend
   ↓
SQLite Database
   ↓
Dashboard & Analytics
```

### Budget Tracking

```text
Budget Configuration
   ↓
Expense Monitoring
   ↓
Remaining Budget Calculation
   ↓
Visual Dashboard Updates
```

---

# Key Components

## Web Interface

* User authentication pages
* Expense management dashboard
* Budget tracking section
* Analytics and charts
* Profile management

---

## Backend API

* Authentication endpoints
* Expense CRUD operations
* Budget management services
* Database communication
* Data validation and security

---

## Analytics Engine

* Spending calculations
* Budget tracking logic
* Category aggregation
* Visualization data preparation

---

## Data Storage

* User information
* Expense records
* Budget configurations
* Session data
* Application metadata

---

# System Architecture

## Technology Stack

### Frontend

* React
* Vite
* React Router
* Axios
* Tailwind CSS
* Material UI
* Recharts

### Backend

* FastAPI
* SQLAlchemy
* SQLite
* JWT Authentication
* bcrypt

### Development Tools

* Git
* npm
* Python Virtual Environment
* ESLint

---

# Getting Started

## Prerequisites

Before running the application, ensure the following software is installed:

* Node.js (v16+)
* npm
* Python (v3.8+)
* pip
* Git

Verify installations:

```bash
node --version
npm --version
python --version
pip --version
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/FinTrack-AI.git

cd FinTrack-AI
```

---

## Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt
```

---

## Frontend Setup

```bash
cd frontend

npm install
```

---

# Running the Application

## Start Backend

```bash
cd backend

uvicorn main:app --reload
```

Backend URL:

```text
http://localhost:8000
```

Swagger Documentation:

```text
http://localhost:8000/docs
```

---

## Start Frontend

```bash
cd frontend

npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

# API Documentation

## Authentication

### POST /auth/signup

Creates a new user account.

### POST /auth/login

Authenticates users and returns a JWT access token.

---

## Expenses

### GET /expenses

Retrieve all expenses.

### POST /expenses

Create a new expense.

### PUT /expenses/{id}

Update an existing expense.

### DELETE /expenses/{id}

Delete an expense.

---

## API Explorer

FastAPI automatically generates interactive API documentation:

```text
http://localhost:8000/docs
```

---

# Data & Output Management

## Stored Data

The system stores:

* User accounts
* Expense records
* Budget configurations
* Authentication tokens
* Dashboard metrics

---

## Generated Insights

The platform automatically generates:

* Expense summaries
* Budget utilization metrics
* Category distributions
* Financial analytics visualizations

---

# Security & Privacy

## Authentication

* JWT-based authentication
* Password hashing with bcrypt
* Protected API routes
* Secure session management

---

## Data Protection

* Local database storage
* Controlled API access
* Input validation
* Secure authentication flow

---

## Best Practices

* Use environment variables for secrets
* Rotate JWT secrets regularly
* Enable HTTPS in production
* Restrict database access
* Maintain regular backups

---

# Future Enhancements

* Monthly and yearly financial reports
* PDF export functionality
* Multi-currency support
* Recurring expense tracking
* Budget notifications
* AI-powered spending recommendations
* Mobile application support
* Cloud synchronization
* Bank account integrations
* Dark mode support

---

# Troubleshooting

## Backend Connection Issues

If the frontend cannot connect:

* Ensure FastAPI server is running
* Verify API URL configuration
* Check CORS settings
* Confirm port 8000 is available

---

## Database Issues

* Verify SQLite permissions
* Check database file location
* Restart the backend service

---

## Frontend Issues

* Delete node_modules and reinstall dependencies
* Clear browser cache
* Verify Node.js version compatibility

---

# Maintenance & Updates

## Regular Tasks

* Monitor application performance
* Update dependencies
* Review security settings
* Backup database files
* Optimize analytics queries

---

## Performance Optimization

* Database indexing
* API response optimization
* Asset compression
* Efficient chart rendering

---

# Next Steps

1. Clone the repository
2. Install dependencies
3. Configure environment variables
4. Start backend server
5. Launch frontend application
6. Create an account
7. Begin tracking expenses

---

# License

This project is licensed under the MIT License.

---

# Support & Feedback

For issues, feature requests, or improvements:

* Create a GitHub Issue
* Submit a Pull Request
* Contact the project maintainers

---

**Last Updated:** June 2026
**Version:** 1.0
