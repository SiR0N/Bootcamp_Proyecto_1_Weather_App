from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/add_data')
def add_data():
    # CHECK THIS: Does your file have an 'n' or 'ñ' or 'dd'? 
    # Match it to your sidebar link.
    return render_template('andir_datos.html') 

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)