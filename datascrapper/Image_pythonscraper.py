import time
import random
from cs50 import SQL
import urllib2
import cookielib
from bs4 import BeautifulSoup
import json

db = SQL("sqlite:///Movie.db")


# Using Contextual Web Search image search API
def main():
    getMovie()
    # updateDB() only liev when I wante to make fixes
    # updateDB()


def updateDB():
    # Make corrections: Image files that had broken URLs or incorrect links
    fileR = open("SQL_fixes.txt", "r")
    lines = fileR.readlines()
    for line in lines:
        sqlQuery = line.rstrip('\n')
        db.execute(sqlQuery)


def getMovie():
    results = db.execute("SELECT * FROM Movies")

    for movie in results:
        # Sleep as not to disturb Google with bot calls
        sleepNow()
        movieID = movie["id"]
        # Get name for image search
        movieName = movie["Name"]+" "+movie["YearText"]
        # get URL image
        imageURL = getImageURL(movieName, movieID)
        print("MovieName: ", movieName, " imageURL: ", imageURL)


def getImageURL(movieName, movieID):
    # Format search term

    movieNameSearch = (movieName.replace('\n', '')).replace(' ', '+')
    searchURL = "https://www.bing.com/images/search?q="+movieNameSearch+"&FORM=AWIR"
    # searchURL = "https://www.google.com/search?q="+movieNameSearch+"+setting&source=lnms&tbm=isch&sa=X&ved=0ahUKEwi58q7lvafkAhWDyKQKHdyVAcUQ_AUIESgB&biw=1536&bih=750"
    print(searchURL)
    soup = getSoup(searchURL)

    # if empty results
    try:
        # Get full image source
        searchDiv = (soup.find("div", {"id": "b_content"})).find("ul", {"class": "dgControl_list"}).find("li").find("a")
        print searchDiv
        imageHREF = searchDiv.get("m")
        imageContent = json.loads(str(imageHREF.encode('utf-8')))
        imageURLSource = imageContent["murl"]
        print "Image SRC: ", imageURLSource
        savetoDB(imageURLSource, db, movieID)
    except OSError as err:
        print("OS error: {0}".format(err))
    except:
        print("*** Try again ***")

        # Try again with different search term
        # print ("*** Try again ***")
        # StrArray = movieNameSearch.rsplit("+")
        # del StrArray[-1]
        # getImageURL((' ').join(StrArray))


def getSoup(searchURL):
    # query the website and return the html to the variable 'page'
    hdr = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
           'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
           'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
           'Accept-Encoding': 'none',
           'Accept-Language': 'en-US,en;q=0.8',
           'Connection': 'keep-alive'}
    req = urllib2.Request(searchURL, headers=hdr)
    page = urllib2.urlopen(req)
    soup = BeautifulSoup(page, 'html.parser')
    return soup


def sleepNow():
    timetoSleep = random.uniform(0.0, 1.5)
    print('TIME OUT: ', timetoSleep)
    time.sleep(.5)


def savetoDB(imageURL, db, movieID):
    db.execute("UPDATE Movies SET ImageUrl='"+imageURL+"' WHERE id='" + str(movieID) + "'")


if __name__ == "__main__":
    main()