# 🌸 Women Health Tracker – Full Stack Application

A complete health-tracking web app built with **React + FastAPI + PostgreSQL**, focused on women’s cycle tracking, symptoms logging, hormonal insights, and AI-powered predictions.

---

## 🚀 Features

### 🔴 Cycle Tracking
- Add and track menstrual cycles  
- Predict next period  
- Predict ovulation & fertile window  
- Visual calendar highlights  
- Cycle history & insights  

### 🩺 Symptoms Logging
- Log daily symptoms  
- View trends  
- Manage symptom history  

### 🤖 AI Insights (Gemini)
- Analyze symptoms  
- Provide hormonal imbalance risk  
- Cycle prediction models  
- Intelligent summaries  

### 🔐 Authentication
- JWT-based secure login/register  
- User-specific data storage  

---

## 🛠 Tech Stack

### **Frontend**
- React + Vite  
- Axios  
- React Calendar  
- Context API Auth  

### **Backend**
- FastAPI  
- SQLAlchemy  
- PostgreSQL  
- JWT Auth  

### **AI Layer**
- Google Gemini API  
- Custom risk scoring models  

---

## 📦 Folder Structure
```bash
women-health/
│── health-tracker-frontend/
│── health-tracker-backend/
│── README.md
```


---

## ▶️ Running the Project

### **1. Backend Setup**

```bash
cd health-tracker-backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Backend runs on:

http://localhost:8000

### **2. Frontend Setup**
```bash
cd health-tracker-frontend
npm install
npm run dev

```
Frontend runs on:

http://localhost:5173


🗄 Database

Project uses PostgreSQL.
Tables include:

Users

User Profiles

Cycles

Symptoms

AI Insights

### **Future Enhancements**
mobile app version
Advanced Ml-based predictions
Doctor consultation & reports 
Data visualizations & analytics


### **💖 Author**
Built with love by Spoorthi ✨
