#Gets plots for movies 
import numpy as np 
import wikipedia

def main():
    #Get titles of Films  zz
    titles = getTitles()
    #Get plots of Movies 
    getPlot(titles)

def getPlot(titles):
    # Code from https://medium.com/@Alexander_H/scraping-wikipedia-with-python-8000fc9c9e6c 
    example_titles = titles 
    # create a list of all the names you think/know the section might be called
    possibles = ['Plot','Synopsis','Plot synopsis','Plot summary', 
                'Story','Plotline','The Beginning','Summary',
                'Content','Premise']
    # sometimes those names have 'Edit' latched onto the end due to 
    # user error on Wikipedia. In that case, it will be 'PlotEdit'
    # so it's easiest just to make another list that acccounts for that
    possibles_edit = [i + 'Edit' for i in possibles]
    #then merge those two lists together
    all_possibles = possibles + possibles_edit

    # now for the actual fetching!
    for i in example_titles:
    # load the page once and save it as a variable, otherwise it will request
    # the page every time.
    # always do a try, except when pulling from the API, in case it gets confused
    # by the tttle.
        try:
            wik = wikipedia.WikipediaPage(i)
        except:
            wik = np.NaN
        print (wik)
    # a new try, except for the plot
        try:
            # for all possible titles in all_possibles list
            for j in possibles:
                # if that section does exist, i.e. it doesn't return 'None'
                if wik.section(j) != None:
                    #then that's what the plot is! Otherwise try the next one!
                    plot_ = wik.section(j).replace('\n','').replace("\'","")
                    print('Found', wik.section(j))
        # if none of those work, or if the page didn't load from above, then plot
        # equals np.NaN
        except:
            plot= np.NaN

# Get titles
def getTitles():
    example_titles = ['Algol (film)','Dr. Jekyll and Mr. Hyde (1920 Haydon film)',
    'Figures of the Night']

    return example_titles

 
if __name__ == "__main__":
    main()