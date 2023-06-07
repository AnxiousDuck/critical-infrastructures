from flask import Flask, render_template, jsonify, request
import serial
import csv
import threading
import time
from datetime import datetime

app = Flask(__name__)
app.sensor_data = None  # To store the sensor data


# Route for the home page
@app.route('/')
def index():
    return render_template('index.html', data=app.sensor_data)

@app.route('/data')
def get_sensor_data():
    return jsonify(data=app.sensor_data)

# @app.route('/location', methods=["POST"])
# def get_location_data():
#     data = request.json
#     print(data["latitude"], ", ", data["longitude"])
#     write_to_csv(app.sensor_data, data["latitude"], data["longitude"])

#     return jsonify(response="received location data! danke!")

# Function to read data from the sensor
def read_sensor_data():
    with serial.Serial('/dev/cu.usbserial-0001', 115200) as ser:
        while True:
            try:
                data = ser.readline().decode().strip()

                # Write data to a CSV file
                with open('sensor_data.csv', 'a') as csv_file:
                    writer = csv.writer(csv_file)
                    writer.writerow([data, datetime.now()])

                # Update sensor_data variable
                app.sensor_data_lock.acquire()
                app.sensor_data = data
                app.sensor_data_lock.release()

            except serial.SerialException:
                print("waiting to read data")
                time.sleep(0.2)

def write_to_csv(data, lat, lon):
    # Write to CSV file only if all values are available
    if data is not None and lat is not None and lon is not None:
        with open('sensor_data.csv', 'a') as csv_file:
            writer = csv.writer(csv_file)
            writer.writerow([data, lat, lon])


# Start reading sensor data in a separate thread
sensor_thread = threading.Thread(target=read_sensor_data)
sensor_thread.daemon = True
sensor_thread.start()

# Initialize lock for sensor_data list
app.sensor_data_lock = threading.Lock()

# Start the Flask web server
app.run()
