# 🏥 Swasthya Mitra AI Healthcare Platform

**An AI-Powered Healthcare Assistant & Comprehensive Wellness Hub**

## 📋 Overview
Swasthya Mitra is a modern, privacy-first healthcare web application that revolutionizes how users interact with medical technology. Built with cutting-edge web technologies and fully integrated with Google's Gemini AI, it provides instant symptom analysis, X-Ray imaging insights, dermatological condition scanning, and personalized wellness management—all encapsulated within a beautiful, dynamic interface.

---

## ✨ Key Highlights
- **🤖 Advanced AI Diagnostics** - Powered by Google's Gemini AI for medical insights, skin condition analysis, and intelligent symptom checking.
- **🏛️ Intelligent Government Schemes Finder** - A dedicated AI assistant that scans your demographic profile to find tailored active Indian healthcare schemes you're eligible for.
- **� Complete Ecosystem** - Everything from daily medication trackers and interactive health reports to X-Ray scans and AI Dermatologists.
- **🎨 Glass-morphism & Dark Mode UI** - A stunning, modern, and highly responsive user interface built efficiently with Tailwind CSS.
- **🚨 Instant Emergency Access** - Live SOS buttons, offline-ready First Aid knowledge bases, and real-time mapping for nearby clinics.
- **🔒 Privacy-Focused Architecture** - Designed cleanly with secure mock-state data integrations, prioritizing confidentiality.

---

## 🚀 Features

### 🩺 Core Health Modules
| Feature | Description | Status |
|---------|-------------|--------|
| **AI Symptom Checker** | Interactive chat interface delivering instant AI analysis with urgency risk assessment | ✅ Active |
| **AI X-Ray Analysis** | Upload chest X-Ray images for AI-powered disease detection (e.g., pneumonia probabilities) | ✅ Active |
| **AI Dermatologist** | Upload skin condition photos for AI visual analysis and symptom matching | ✅ Active |
| **Wellness Dashboard** | Complete health overview with daily heart-rate, BP, and activity metrics | ✅ Active |
| **Medication Manager** | Smart visual pill calendar with daily schedule management | ✅ Active |
| **Government Schemes** | Interactive portal to discover, auto-verify eligibility, and track application flows | ✅ Active |

### 🧠 AI-Powered Analysis
- **🔬 Gemini Pro Integration** - Fast, responsive medical context generation using Google's generative models.
- **🔍 Image Recognition** - Robust file validation and contextual prompt-analysis for X-Rays and dermatological scans.
- **⚠️ Risk Assessment** - The AI isolates conditions and prominently displays warnings for critical emergencies.

### 🚨 Emergency & Support Features
- **🆘 SOS Emergency Button** - Persistent quick access to emergency dashboards across all screens.
- **🏥 Nearby Clinics Locator** - Clean interactive maps filtering for local hospitals and specialists.
- **🩹 First Aid Base** - Comprehensive, searchable guides for immediate emergency situational responses.

---

## 🛠️ Tech Stack

### Frontend Architecture
- **React 18 & Vite** - Lightning-fast UI rendering and module bundling.
- **Tailwind CSS** - Modern utility styles and custom animations for the glass-morphism aesthetic.
- **React Router DOM** - Smooth, client-side application routing.
- **React Markdown** - Real-time rich text rendering for AI responses.

### Backend & APIs
- **Google Gemini API** (`gemini-2.5-flash`) - The core engine driving all generative chat, scheme finding, and visual analysis.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or newer
- Google AI Studio API Key (for Gemini functionality)

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/swasthyamitra-ai.git
   cd swasthyamitra-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the project root:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the Mock Backend Server**
   To enable doctor bookings and data fetching for the First Aid & Clinic features, open a separate terminal and start the JSON server:
   ```bash
   npx json-server db.json --port 5000
   ```

5. **Start the Frontend Application**
   In your main terminal, start the Vite development server:
   ```bash
   npm run dev
   ```

6. **Access the platform**
   Open your browser and navigate to `http://localhost:5173`

---

## 📱 Application Map

### Primary Dashboards
- `/dashboard` – Central hub for your health overview
- `/my-health` – Detailed medical metrics and analytics
- `/patient-profile-records` - Medical records, profiles, and settings

### AI Tool Suite
- `/ai-symptom-checker-interface` – Chat with the medical AI
- `/ai-x-ray-analysis-tool` – Radiographic diagnostic assistant
- `/ai-dermatologist` - Skin condition visual analysis
- `/government-health-schemes` - The AI Scheme Finder and document portal

### Utility Pages
- `/first-aid-knowledge-base` - Emergency response guides
- `/emergency-clinic-locator` - Map-based hospital finder
- `/medication-manager-calendar` – Daily pill scheduling

---

## 🤝 Contributing
Contributions are highly welcome! Whether it's adding a new healthcare module, tightening the UI design, or optimizing API calls, here is how you can help:
1. 🍴 **Fork the Repository**
2. 🌿 **Create an isolated Feature Branch** - `git checkout -b feature/new-ai-tool`
3. ✏️ **Implement your changes**
4. 📤 **Submit a Pull Request** summarizing your additions.

---

## 📄 License
This project is open-source and intended for educational & portfolio demonstration purposes.

> **⚠️ Strict Medical Disclaimer**
> **Important**: Swasthya Mitra is an AI-assisted informational tool, NOT a replacement for qualified medical professionals. Any outputs related to X-Rays, Derm-Scans, or Symptoms must be officially verified by a licensed doctor. In a true emergency, call your local authorities immediately.

---
*Built with ❤️ to bridge the gap between AI and accessible healthcare.*
