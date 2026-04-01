# ✨ Poem Weaver (AI Poem Generator)

**Poem Weaver** is a modern, full-stack web application that uses deep learning (PyTorch, RNN, LSTM) to generate beautiful, thematic poetry based on user-provided seed words. It combines a heavy Machine Learning inference backend with a lightweight Node.js/Express API and a stunning, responsive React frontend.

### 🔗 Project Links
- **🔴 Live Demo**: [Live](https://poemweaver-ai.netlify.app/)
- **🧠 Base ML Model Repository**: [Text Generation Using RNN and LSTM](https://github.com/AyushHL/Text-Generation-Using-RNN-and-LSTM.git)
- **📓 Kaggle Notebook**: [Kaggle Notebook](https://www.kaggle.com/code/ayush120/poem-generation-using-rnn-and-lstm)
- **📊 Dataset (100 Poems)**: [Poems Dataset](https://www.kaggle.com/datasets/ayush120/poems-dataset/data/data)

---

## 🚀 Built With

- **Frontend**: React 19, Vite, TypeScript, Vanilla CSS (Glassmorphism & Modern UI)
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB (Mongoose) - *Stores generated poem history*
- **ML Inference Service**: Python, Flask, PyTorch (RNN & LSTM models)

---

## ✨ Key Features

- **Full-Stack AI Architecture:** Decoupled microservice architecture connecting a React/TypeScript frontend to a Node.js/Express backend API and a standalone Python/PyTorch inference server.
- **Deep Learning for NLP:** Custom Recurrent Neural Networks (One-Hot RNN) and Long Short-Term Memory (Embedding LSTM) models trained to generate natural language poetry from user-defined seed words.
- **High-Performance UI/UX:** Pixel-perfect, responsive frontend built using React and pure CSS with modern glassmorphism design, CSS grid/flexbox, and seamless micro-animations.
- **Data Pipeline & Storage:** MongoDB integration to persist global user-generated poems, alongside `localStorage` for secure, localized browsing history.
- **Production-Ready Deployment:** Containerized the ML inference service using Docker (for Hugging Face Spaces) and scalable cloud deployment setups for the backend and frontend.

---

## ⚙️ Local Development Setup

Because the application is split into microservices, you will need to run all three layers simultaneously to test it locally.

### 🔑 Environment Variables

Before starting the servers, create `.env` files in both the Backend and Frontend directories.

**`Backend/.env`**
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/Poem-Generator
ML_SERVER_URL=http://127.0.0.1:5001
CORS_ORIGINS=*
```

**`Frontend/.env`**
```env
VITE_API_BASE=http://localhost:5000/api
```

---

### 1. Python ML Service (Port 5001)
*This serves the trained `.pt` PyTorch models and acts as the inference engine.*
```bash
cd Model_Service
pip install -r requirements.txt
python inference.py
```

### 2. Node.js Backend (Port 5000)
*This acts as the bridge connecting the Frontend to MongoDB and the ML Service.*
```bash
cd Backend
npm install
npm run dev
```
*(Make sure to configure your `MONGO_URI` in `Backend/.env`)*

### 3. React Frontend (Port 5173)
*The user-facing web application.*
```bash
cd Frontend
npm install
npm run dev
```

---

## 🧠 Model Architectures

The AI inference engine offers two selectable models:
1. **OneHotRNN**: A traditional Recurrent Neural Network utilizing one-hot encoded input sequences. It offers more varied, creative, and sometimes chaotic outputs.
2. **EmbeddingLSTM**: A Long Short-Term Memory network utilizing a trainable embedding layer for deeper word relationship representation. It outputs significantly more fluid, coherent, and thematic poetry.

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
