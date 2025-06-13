from flask import Flask, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy
import numpy as np
from datetime import datetime, timedelta

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
db = SQLAlchemy(app)

class SensorData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    temperature = db.Column(db.Float)
    humidity = db.Column(db.Float)
    air_quality = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

def generate_dummy_data():
    if SensorData.query.count() == 0:
        now = datetime.now()
        timestamps = [now - timedelta(minutes=i*5) for i in range(100)]
        temperatures = np.random.uniform(23.0, 27.0, 100)
        humidity = np.random.uniform(45.0, 65.0, 100)
        air_quality = np.random.randint(180, 260, 100)

        for i in range(100):
            data = SensorData(
                temperature=round(temperatures[i], 2),
                humidity=round(humidity[i], 2),
                air_quality=int(air_quality[i]),
                timestamp=timestamps[i]
            )
            db.session.add(data)
        db.session.commit()
        print("✅ Dummy data inserted")

@app.route('/')
def index():
    data = SensorData.query.order_by(SensorData.timestamp.desc()).all()
    return render_template("index.html", data=data)

@app.route('/dashboard')
def dashboard():
  data = SensorData.query.order_by(SensorData.timestamp.desc()).all()
  return render_template("dashboard.html", data=data)

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

@app.route('/api/latest')
def latest_data():
    d = SensorData.query.order_by(SensorData.id.desc()).first()
    if not d:
        return jsonify({'error': 'No data available'})
    return jsonify({
        'id': d.id,
        'temperature': d.temperature,
        'humidity': d.humidity,
        'air_quality': d.air_quality,
        'timestamp': d.timestamp.isoformat()
    })

if __name__ == '__main__':
    app.run(debug=True)
