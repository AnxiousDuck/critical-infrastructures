from flask import Flask, jsonify, render_template, request
import serial
import serial.tools.list_ports
import threading
import eventlet
import socketio

sio = socketio.Server()
app = socketio.WSGIApp(sio, static_files={
    '/': {'content_type': 'text/html', 'filename': 'index.html'}
})

@sio.event
def connect(sid, environ):
    print('connect ', sid)

@sio.event
def my_message(sid, data):
    print('message ', data)

@sio.event
def disconnect(sid):
    print('disconnect ', sid)

if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('', 5001)), app)

#### global vars ####

### the current indoor air quality value ####
current_iaq_val = ""

#### global vars ####



#### flask stuff ####

# app = Flask(__name__)

# socketio = SocketIo(app)

# @app.route("/send", methods=['POST'])
# def text():
#     data = request.json
#     print(data["lat"], data["lon"])
#     return jsonify({
#         "response": "location request"
#     })

# @app.route('/')
# def index():
#     iaq = current_iaq_val
#     return render_template('index.html', iaq=iaq)

#### flask stuff ####

#### connect to esp stuff ####


def connect_to_esp():
    ports = [port for port in serial.tools.list_ports.comports()]
    for p in range(len(ports)):
        print(f"{p}. " + ports[p].device)

    portSelect = int(input("Enter your port number: "))
    while portSelect > len(ports) or portSelect < 0:
        portSelect = int(input("Enter your port number: "))

    ser = serial.Serial(ports[portSelect].device, 115200)

    with open("output.csv", "a") as file:
        while True:

            data_in = ser.readline().decode()

            current_iaq_val = data_in

            print(f"writing data to file: {data_in}")
            
            socketio.emit('sensor', {'value': current_iaq_val})

            file.write(data_in)



# Start Flask server
# if __name__ == '__main__':
#     socketio.run(app)
#### start listening on esp serial port ####
esp_thread = threading.Thread(target=connect_to_esp)
esp_thread.start()
#### start listening on esp serial port ####


#### start the webserver with socket io ####
if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('', 5001)), app)
#### start the webserver with socket io ####