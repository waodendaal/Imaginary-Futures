# Scrapes webpage for database
# Code made from https://medium.freecodecamp.org/how-to-scrape-websites-with-python-and-beautifulsoup-5946935d93fe
import re
import urllib2
from bs4 import BeautifulSoup
from cs50 import SQL
import sys


def main():
    db = SQL("sqlite:///Movie.db")
    #db.execute("INSERT INTO 'Movies' ('id','Name') VALUES (NULL, 'test')")
    #data = db.execute("SELECT * FROM Movies")
    #print (data)
    parseFirstPage(db)


def parseFirstPage(db):
    # Parse https://en.wikipedia.org/wiki/List_of_stories_set_in_a_future_now_past
    quote_page = 'https://en.wikipedia.org/wiki/List_of_stories_set_in_a_future_now_past'

    # query the website and return the html to the variable 'page'
    page = urllib2.urlopen(quote_page)

    # parse the html using beautiful soup and store in variable 'soup'
    soup = BeautifulSoup(page, 'html.parser')
    # print (soup)

    # parse HTML table to DB
    for tr in soup.find_all('tr')[2:]:
        tds = tr.find_all('td')
        name = tds[0].text

        source = tds[1].text
        yearText = tds[2].text
        futureText = tds[3].text

        year = parseNumbers(yearText)
        future = parseNumbers(futureText)

        # Encoding because it kept giving errors
        name = encoder(name)
        yearText = encoder(yearText)
        futureText = encoder(futureText)

        # If there is no description
        setting = ""
        # If there is description
        if len(tds) == 5:
            fourth = True
            setting = tds[4].text
            # Decode/Encode
            setting = encoder(setting)
            setting = parseSetting(setting)

        # TO DO: parse year and future to 1234
        print('Name: ', name)
        print('Setting: ', setting)
        print('Future: ', future, ' FutureText: ', futureText, ' Year: ', year, ' YearText: ', yearText)

        # print ('Name: ', name)
        # Insert into DB
        db.execute("INSERT INTO 'Movies' ('id','Name', 'Year', 'YearText', 'Future', 'FutureText', 'Setting','Plot') VALUES (NULL, :name, :year, :yeartext, :future, :futuretext, :setting, NULL)", name=str(
            name), year=year, yeartext=str(yearText), future=future, futuretext=str(futureText), setting=str(setting))


def parseNumbers(number):
    # To Do: Parse if multiple numbers: https://stackoverflow.com/questions/11339210/how-to-get-integer-values-from-a-string-in-python
    return int(re.search(r'\d+', number).group())


def encoder(toencode):
    # Encoding solution found https://stackoverflow.com/questions/21129020/how-to-fix-unicodedecodeerror-ascii-codec-cant-decode-byte/21129492
    toencode = toencode.encode('utf-8')
    toencode = re.sub("\xe2\x80\x93", "-", toencode)

    if isinstance(toencode, str):
        # note: this removes the character and encodes back to string.
        toencode = toencode.decode('ascii', 'ignore').encode('ascii')
    elif isinstance(toencode, unicode):
        toencode = toencode.encode('ascii', 'ignore')

    # toencode = re.sub("\xc3\xb3", "o", toencode)
    # toencode = re.sub("\xe2\x80\x9c", "\"", toencode)
    # toencode = re.sub("\xe2\x80\x9d", "\"", toencode)
    # toencode = re.sub("\xe2\x80\x98", "'", toencode)
    # toencode = re.sub("\xe2\x80\x99", "'", toencode)
    # toencode = re.sub("\xc3\xa9", "e", toencode)

    return toencode


def parseSetting(setting):
    # remove '[x] Wikipedia footnotes'
    setting = re.sub(r'\[.+?\]', '', setting)

    # remove 'See also: XX.'
    setting = re.sub('See also: 2012 phenomenon.', '', setting)
    return setting


if __name__ == "__main__":
    main()