from flask import Flask, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy
import serial
import threading

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sensor_data.db'
db = SQLAlchemy(app)

class SensorData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    temperature = db.Column(db.Float)
    humidity = db.Column(db.Float)
    air_quality = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime, default=db.func.now())

# Read from Arduino in a background thread
def read_from_arduino():
    ser = serial.Serial('COM3', 9600)
    while True:
        try:
            line = ser.readline().decode().strip()
            if line.startswith("T:"):
                parts = line.split(',')
                temperature = float(parts[0][2:])
                humidity = float(parts[1][2:])
                air_quality = int(parts[2][3:])
                data = SensorData(temperature=temperature, humidity=humidity, air_quality=air_quality)
                db.session.add(data)
                db.session.commit()
        except Exception as e:
            print("Error:", e)

@app.route('/')
def index():
    data = SensorData.query.order_by(SensorData.id.desc()).limit(10).all()
    return render_template("index.html", data=data)

@app.route('/api/latest')
def latest():
    data = SensorData.query.order_by(SensorData.id.desc()).first()
    return jsonify({
        'temperature': data.temperature,
        'humidity': data.humidity,
        'air_quality': data.air_quality,
        'timestamp': data.timestamp.isoformat()
    })

@app.route('/api/all')
def all_data():
    data = SensorData.query.order_by(SensorData.id.desc()).all()
    return jsonify([
        {
            'id': d.id,
            'temperature': d.temperature,
            'humidity': d.humidity,
            'air_quality': d.air_quality,
            'timestamp': d.timestamp.isoformat()
        } for d in data
    ])


if __name__ == '__main__':
    threading.Thread(target=read_from_arduino, daemon=True).start()
    app.run(debug=True)
