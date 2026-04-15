# app.py
from flask import Flask

# This is the "attribute" Gunicorn is looking for
myapp = Flask(__name__) 

@app.route('/')
def home():
    return "Hello"
