from urllib.request import urlopen
from bs4 import BeautifulSoup
import certifi
import ssl


# CSV FILE CREATE ############################################

# create a csv file to save scraped data
filename = "basketball_player_Salaries.csv"

# open file to write
f = open(filename, "w")

# declare headers
headers = "id,name,year,position,team,salary\n"

# write headers into csv file
f.write(headers)


# PAGE REQUEST ############################################

baseLink = "http://www.espn.com/nba/salaries/_/year/"


for year in range(2000, 2021):

    lastPage = 3
    n = 1
    soupCollection = []

    while n < lastPage + 1:

        page = "/page/" + str(n) if n > 1 else ""

        link = baseLink + str(year) + page

        # print(link)

        # request page
        requestPage = urlopen(
            link, context=ssl.create_default_context(cafile=certifi.where()))

        # read requested page and save to pageHTML
        pageHTML = requestPage.read()

        # close requested page
        requestPage.close()

        # parse saved HTML page
        htmlSoup = BeautifulSoup(pageHTML, "html.parser")

        if n == 1:
            lastPage = htmlSoup.find(
                "div", class_="page-numbers").text
            lastPage = int(lastPage.split(" ")[2])

        # save to list of html pages
        soupCollection.append(htmlSoup)

        # console feedback
        print("Got data from page ", n, " of ", lastPage, " of ", year)

        n += 1

    # PARSING ----------------------

    tableData = soupCollection[0].find_all("nothing")

    for pageSoup in soupCollection:

        # find all instances of element and class, create array
        oddRows = pageSoup.find_all("tr", class_="oddrow")
        evenRows = pageSoup.find_all("tr", class_="evenrow")

        tableData += oddRows + evenRows

    # WRITING EACH ENTRY FOR YEAR'S PAGES---------

    # loop through array, find specific element and class
    for row in tableData:

        tdList = row.find_all("td")

        id = tdList[0].text
        name = tdList[1].find("a").text.replace(",", "")
        team = None
        position = tdList[1].text.split(", ")[1]
        salary = tdList[3].text[1:].replace(",", "")

        if tdList[2].find("a") == None:
            team = tdList[2].text
        else:
            team = tdList[2].find("a").text

        # write data into csv file
        f.write("%s,%s,%s,%s,%s,%s\n" %
                (id, name, year, position, team, salary))

        # console feedback
        print("Wrote data for:", name, " in ", year)

# close file
f.close()

print("Task completed.")
