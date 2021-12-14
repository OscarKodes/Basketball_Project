
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

# rename abbreviated columns
new_col_names <- c("Player",
                   "Season",
                   "Team_Code",
                   "Games_Played",
                   "Minutes_Played",
                   "Field_Goals_Made",
                   "Field_Goal_Attempts",
                   "Three_Pointers_Made",
                   "Three_Pointers_Attempts",
                   "Free_Throws_Made",
                   "Free_Throw_Attempts",
                   "Turnovers",
                   "Personal_Fouls",
                   "Offensive_Rebounds",
                   "Defensive_Rebounds",
                   "All_Rebounds",
                   "Assists",
                   "Steals",
                   "Blocks",
                   "Total_Points_Made",
                   "birth_year",
                   "birth_month",
                   "birth_date",
                   "height",
                   "height_cm",
                   "weight",
                   "weight_kg",
                   "Position",
                   "Team_Name",
                   "Salary")
colnames(merged_data) <- new_col_names
colnames(merged_data)

# Create some new columns ===================================
merged_data$Free_Throw_Accuracy <- round(merged_data$Free_Throws_Made / merged_data$Free_Throw_Attempts, 2)
merged_data$Field_Goal_Accuracy <- round(merged_data$Field_Goals_Made / merged_data$Field_Goal_Attempts, 2)
merged_data$Three_Pointers_Accuracy <- round(merged_data$Three_Pointers_Made / merged_data$Three_Pointers_Attempts, 2)
merged_data$avg_minutes_per_game <- round(merged_data$Minutes_Played / merged_data$Games_Played, 2)

merged_data$Three_Pointers_Accuracy <- ifelse(is.nan(merged_data$Three_Pointers_Accuracy), 
                                           0, merged_data$Three_Pointers_Accuracy)

merged_data$Cost_Per_Point <- round(merged_data$Salary / merged_data$Total_Points_Made, 2)



# Create csv file of merged data
write.csv(merged_data, file = "merged_data.csv", row.names=F)


# # Finding which player had the lowest salary per total points made =========
# min_cost_per_pt <- min(merged_data$Cost_Per_Point, na.rm = T)
# most_cost_effective <- !is.na(merged_data$Cost_Per_Point) & merged_data$Cost_Per_Point == min_cost_per_pt
# merged_data[most_cost_effective,]


