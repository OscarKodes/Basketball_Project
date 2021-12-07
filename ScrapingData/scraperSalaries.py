from urllib.request import urlopen
from bs4 import BeautifulSoup
import certifi
import ssl


# CSV FILE CREATE ############################################

# # create a csv file to save scraped data
# filename = "basketball_team_colors.csv"

# # open file to write
# f = open(filename, "w")

# # declare headers
# headers = "Team_Name,bg_color,border_color\n"

# # write headers into csv file
# f.write(headers)


# PAGE REQUEST ############################################

link = "https://basketball.fandom.com/wiki/List_of_NBA_team_colors"


# request page
requestPage = urlopen(
    link, context=ssl.create_default_context(cafile=certifi.where()))

pageHTML = requestPage.read()

# close requested page
requestPage.close()

# parse saved HTML page
htmlSoup = BeautifulSoup(pageHTML, "html.parser")


# PARSING ----------------------

tableData = htmlSoup.find_all("tr")

# loop through array, find specific element and class
for row in tableData:

    th = row.find("th")

    # if th == :
    #     continue

    # Team_Name = td[0].text
    # bg_color = tdList[1]

    # # write data into csv file
    # f.write("%s,%s,%s,%s,%s,%s\n" %
    #         (id, name, year, position, team, salary))

    # console feedback
    print("new row", th.text)

# close file
# f.close()

print("Task completed.")
