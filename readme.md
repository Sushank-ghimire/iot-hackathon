# 🚀 SensorHub - Environmental Monitoring

### ✅ 1. **Clone the Repository**

```bash
git clone https://github.com/Sushank-ghimire/iot-hackathon.git
cd iot-hackathon
```

---

### ✅ 2. **Create and Activate a Virtual Environment (Optional but Recommended)**

```bash
python -m venv venv
# On Windows
venv\Scripts\activate
# On Linux/macOS
source venv/bin/activate
```

---

### ✅ 3. **Install Python Dependencies**

```bash
pip install -r requirements.txt
```

---

### ✅ 4. **Run the Flask Backend with Hot Reload**

#### If `app.py` is the entry point:

```bash
flask --app main run --reload
```

---

## 🧪 Example Directory Structure

```
iot-hackathon/
├── app.py
├── templates/
│   └── index.html
│   └── dashboard.html
├── instance/
│   └── data.db
├── static/
├── sensors/
│   └── arduino_code.ino
├── requirements.txt
└── README.md
```

---

## 📲 Upload Arduino Code

1. Open `arduino_code.ino` in the **Arduino IDE**.
2. Select the correct **board** and **COM port**.
3. Click **Upload**.

Make sure you have installed necessary libraries like:

- `DHT`
- `MQ135`
- `Adafruit_Sensor`

---

## 🧾 Sample `requirements.txt`

Make sure this exists:

```txt
Flask
flask-cors
requests
```

Add any other used packages.

---

## ✅ Done!

You now have:

- 🧠 Arduino collecting sensor data
- 🌐 Flask backend serving data
- 🔄 Hot reload for development
- 📦 Clean setup via virtual environment
