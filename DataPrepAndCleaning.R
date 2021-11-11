
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
tail(data)
str(data)
summary(data)
colnames(data)

# library
library(tidyverse)