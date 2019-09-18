from cs50 import SQL
from flask import Flask, flash, jsonify, redirect, render_template, request, session
from flask_session import Session
import random
import datetime

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
    # Populate Timeline with all the distinct dates in the database
    queryResults = db.execute("SELECT DISTINCT Year FROM Movies ORDER BY Year")

    # queryResults = db.execute("SELECT id, Name, Year FROM Movies WHERE Year > '1999' ORDER BY Year")
    # print ('SELECTER id: ' + str(queryResults[0]['id']))
    # print ('SELECTER name: ' + str(queryResults[0]['Name']))
    print('Running...')

    return render_template('index.html', queryResults=queryResults)


@app.route("/prompt", methods=["POST", "GET"])
def prompt():
    descriptionPrompt = request.form.get("answer")
    yearFuture = int(request.form.get("numberpicker"))
    yearNow = datetime.date.today().year
    # query = "INSERT INTO 'Movies' ('id','Name', 'Year', 'YearText', 'Future', 'FutureText', 'Setting','Plot') VALUES (NULL, :name, :year, :yeartext, :future, :futuretext, :setting, NULL)", name = str('User'), year=year,yeartext = str(yearText), future=future, futuretext = str(futureText), setting= str(setting)
    userNumber = random.randrange(2000)
    db.execute("INSERT INTO 'Movies' ('id','Name', 'Year', 'YearText', 'Future', 'FutureText', 'Setting','Plot') VALUES (NULL, :name, :year, :yeartext, :future, :futuretext, :setting, NULL)",
               name='User #'+str(userNumber), year=yearNow, yeartext=str(yearNow), future=yearFuture, futuretext=str(yearFuture), setting=str(descriptionPrompt))
    print('Answer', descriptionPrompt)
    print('Year', yearFuture)
    print('Year', yearNow)

    return "", 204


@app.route('/dateClicked', methods=['GET'])
def dateClicked():
    print('clicked')
    dateData = request.args.get('dateData')
    # Get DB entries for the date user clicked on
    query = "SELECT * FROM Movies WHERE Year = '" + dateData+"'"
    print('Query: ', query)
    queryResults = db.execute(query)
    print(queryResults)

    # Select random entry from that date
    entry = queryResults[random.randrange(len(queryResults))]
    # print('Entry: ', entry)

    # Build html
    dateData = request.args.get('direction')
    print('Image'+entry['ImageUrl'])
    html = "<div class='cd-h-timeline__event-content container'>\
                <div class='containerTV'>\
                <div class='event-content_foreground-box screen'>\
                <input type='checkbox' id='switch' checked>\
                <div class='containerTV event-content_image'>\
                <div class='screen' style='background-image:url("+entry['ImageUrl']+")'></div>\
                </div>\
                <div class='text_entry'>\
                <h2>" + entry['Name']+"</h2>\
                <em class='cd-h-timeline__event-date'>What the world of <span class='year_color'>"+entry['FutureText'] + "</span> looked like in <span class='year_color'>" + entry['YearText']+"</span></em>\
                <p class='cd-h-timeline__event-description text--subtle'>"+entry['Setting']+"</p>\
                </div>\
                </div>\
                </div>\
            </div>"

    return jsonify(html), 200
