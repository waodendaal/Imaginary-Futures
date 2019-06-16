from cs50 import SQL
from flask import Flask, flash, jsonify, redirect, render_template, request, session
from flask_session import Session

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

# Configure SQLite database
db = SQL("sqlite:///static/db/Movie.db")

@app.route("/")
def index():
    # Populate Timeline
    queryResults = db.execute("SELECT id, Name, Year FROM Movies WHERE Year > '1999'")
    # Print all results: print ('Query Result' + str(queryResults))
    print ('SELECTER id: ' + str(queryResults[0]['id']))
    print ('SELECTER name: ' + str(queryResults[0]['Name']))

    for item in queryResults:
        print('hi')

    return render_template('index.html', queryResults=queryResults)

