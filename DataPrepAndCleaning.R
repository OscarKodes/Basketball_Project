
# Clear Everything
rm(list = ls())

# Set working directory
setwd("C:/Users/Oscar Ko/Desktop/BasketBall_Project")

# Get working directory
getwd()

# Get data
salary_data <- read.csv("basketball_player_Salaries.csv")
basketball_data <- read.csv("players_stats_by_season_full_details.csv")

# Examine data
head(salary_data)
head(basketball_data)

tail(salary_data)
tail(basketball_data)

str(salary_data)
str(basketball_data)

summary(salary_data)
summary(basketball_data)

colnames(salary_data)
colnames(basketball_data)

# library
library(tidyverse)

# Cleaning basketball_data dataframe ============================

# Filter out only NBA League and only regular season
filter_league <- basketball_data$League == "NBA"

NBA_data <- basketball_data[filter_league, ]

unique(NBA_data$League)

filter_stage <- NBA_data$Stage == "Regular_Season"

NBA_data <- NBA_data[filter_stage, ]

unique(NBA_data$Stage)


# Filter out unneeded columns
c_names <- colnames(NBA_data)
cols_to_remove <- c("draft_team",
                    "draft_pick",
                    "draft_round",
                    "high_school",
                    "nationality",
                    "League",
                    "Stage")
filter_cols <- !(c_names %in% cols_to_remove)
NBA_data <- NBA_data[, filter_cols]

# Cleaning salary_data dataframe ============================

# Turn Year data into Season
salary_data <- mutate(salary_data, 
                      Season=paste(as.character(year - 1), 
                                   as.character(year), sep=" - "))

# Select columns to keep
colnames(salary_data)
salary_data <- select(salary_data,
                      Player="name",
                      Position="position",
                      Team="team",
                      Salary="salary",
                      "Season")
head(salary_data)


# Combining data frames =====================================

# merge
merged_data <- merge(NBA_data, salary_data, by = c("Player","Season"))

head(merged_data)
tail(merged_data)

# rename team columns
names(merged_data)[names(merged_data) == "Team.x"] <- "Team_Code"
names(merged_data)[names(merged_data) == "Team.y"] <- "Team_Name"
colnames(merged_data)

# Create csv file of merged data
write.csv(merged_data, file = "merged_data.csv", row.names=F)


