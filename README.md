**Imagined Futures - Final project for CS50**

This is the final project for the Harvardx / edX CS50 course.
It is a simple website that shows what different movies, films, and other media from the past thought the future would look like. 
The interface is styled in a retro-futurist way, borrowing from the sci-fi dashboards of movies such as Aliens. The main functionality of the website is a timeline scroller that reads data from a back-end database and dynamically populates the cards below the timeline. The images for each entry is also dynamically loaded from a database URL (this is to save storage space, as there are so many entries!).

<img src="demo.gif" width="500" alt="Video">

[Watch the demo](https://vimeo.com/534491719)


The most difficult part of this project is not in the web app itself, but was rather the preperation work. I had to create 2 web scrappers to populate my database. The one scrapped information about the movies from a Wikipedia page. The second scrapped image URLs from Bing search results (it would make searches from the database data, and then find the image search result URLs). 

The timeline was also tricky, as the code I borrowed is a static timeline. I had to rewrite some of the Javascript/JQuery to make it work dynimically with the Python/Flask app. 

The styling was also a challenge, as I incorporated things like animations. 

The last little cherry on top is that if a user clicks on about 10 different entries, they will be prompted to deliver their own prediction of the future (with different scenario prompts). These answers are then saved into the database and become part of the timeline of future predictions. 

**Project Includes:**

*Python Web-scrapper (pythonscraper.py)*
Python webscrapper to populate my SQL database with information taken from a Wikipedia page table.

Credit: 
* Code adapted from Justin Yek at [FreeCodeCamp](https://www.freecodecamp.org/news/how-to-scrape-websites-with-python-and-beautifulsoup-5946935d93fe/)

*Python Image-scrapper*

Python webscrapper to populate my SQL database with image URLs from Bing image searches. A bit complicated to navigate the markup. But seemed to have worked. Main problem: some images (because the process was automated) were either wrong images (especially in case of movies with generic names) or for some reason pointed to broken links. Had to fix this by manually auditing the files and creating an 'update' function to fix the worst cases. 

Credit: 
* Code adapted from Justin Yek at [FreeCodeCamp](https://www.freecodecamp.org/news/how-to-scrape-websites-with-python-and-beautifulsoup-5946935d93fe/)

*Website*
Front-end: HTML, CSS, Javascript
Used a preset timeline from  [Codyhouse.co](https://codyhouse.co/gem/horizontal-timeline/), but had to change the .js as it functioned with static DOMs, instead of dynamically populated DOMs. The trick was thus to make it work dynamically with my database and Python app. 

The animation was also tricky to change, add, and edit. 

Credit: 
* Utlized code from Horizontal Timeline by [Codyhouse.co](https://codyhouse.co/gem/horizontal-timeline/)
* CSS CRT screen effect by [Lucas Bebber](https://codepen.io/lbebber/pen/XJRdrV)


Backend: Python, Flask, SQL
Quite a simple backend that just reads data from an SQL database and dynamically returns information to front-end. It also saves data back in, after user input is given about their own future predictions. 
* Code adapted from [Harvardx CS50](https://www.edx.org/course/cs50s-introduction-to-computer-science)
