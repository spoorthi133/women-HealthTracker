# 🌸 Women Health Tracker

A full-stack women’s health tracking application built with **React, FastAPI, and PostgreSQL**. The application helps users track menstrual cycles, log symptoms, view health insights, and receive AI-powered analysis.

---

## ✨ Features

### 🔴 Cycle Tracking

- Add and track menstrual cycles
- Calculate average cycle length
- Predict upcoming periods
- Predict ovulation date
- Calculate fertile window
- View cycle history
- Calendar-based cycle visualization

### 🩺 Symptom Tracking

- Log daily symptoms
- Track symptom history
- View symptoms associated with cycles
- Analyze recurring symptoms

### 🧠 Health & Hormonal Insights

- PCOS risk assessment
- Hormonal health information
- Health-related insights based on user data
- Risk scoring

### 🤖 AI-Powered Insights

Powered by **Google Gemini API**.

- Analyze logged symptoms
- Generate personalized health insights
- Provide cycle-related analysis
- Generate intelligent summaries
- Predict upcoming cycle information

> AI-generated information is intended for educational purposes and should not be treated as a medical diagnosis.

### 🔐 Authentication

- User registration
- User login
- JWT-based authentication
- Protected routes
- User-specific health data

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- Axios
- React Router
- React Calendar
- Context API
- JavaScript
- CSS

### Backend

- FastAPI
- Python
- SQLAlchemy
- PostgreSQL
- Pydantic
- JWT Authentication
- Uvicorn

### AI

- Google Gemini API
- Custom health-risk scoring
- AI-powered symptom and cycle analysis

### Development Tools

- Git
- GitHub
- VS Code
- Postman
- PostgreSQL

---

## 📁 Project Structure

```text
women-health/
│
├── health-tracker-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── health-tracker-backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── services/
│   │   └── ...
│   ├── requirements.txt
│   └── ...
│
├── .gitignore
└── README.md
