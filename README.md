**Final project for Harvardx CS50**

Work in progress.

Description coming soon.

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
Used a preset timeline from  [Codyhouse.co](https://codyhouse.co/gem/horizontal-timeline/), but had to change the .js somewhat as it functioned with a static DOMs, instead of dynamically populated DOMs. 

Credit: 
* Utlized code from Horizontal Timeline by [Codyhouse.co](https://codyhouse.co/gem/horizontal-timeline/)
* CSS CRT screen effect by [Lucas Bebber](https://codepen.io/lbebber/pen/XJRdrV)


Backend: Python, Flask, SQL
Quite a simple backend that just reads data from an SQL database and dynamically returns information to front-end. 
* Code adapted from [Harvardx CS50](https://www.edx.org/course/cs50s-introduction-to-computer-science)

TO DO:
- Fix styling
- Remove first card
- Promt question on nth slide
  - Save to DB 
-  Thing 1 & Thing 2 animations