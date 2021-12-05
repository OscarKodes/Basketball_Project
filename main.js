
/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerWidth * 0.7,
  margin = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50
  };


let vis1 = {
    variable: "All_Rebounds",
    player1: "",
    player2: "",
    bothPlayersData: []
};

let vis2 = {
    variable: "All_Rebounds",
    Year: 2015,
    top10: []
};

let vis3 = {
    variable: "All_Rebounds",
    Year: 2015
};

/* APPLICATION STATE */
let state = {
    data: []
  };

  d3.csv('merged_data.csv', d => {
    // use custom initializer to reformat the data the way we want it
    // ref: https://github.com/d3/d3-fetch#dsv
    return {
      Player: d.Player,
      Year: +d.Season.split(" - ")[1],
      Team_Code: d.Team_Code,
      Team_Name: d.Team_Name,
      Games_Played: +d.Games_Played,
      Minutes_Played: +d.Minutes_Played,
      Field_Goals_Made: +d.Field_Goals_Made,
      Field_Goal_Attempts: +d.Field_Goal_Attempts,
      Three_Pointers_Made: +d.Three_Pointers_Made,
      Three_Pointers_Attempts: +d.Three_Pointers_Attempts,
      Free_Throws_Made: +d.Free_Throws_Made,
      Free_Throw_Attempts: +d.Free_Throw_Attempts,
      Turnovers: +d.Turnovers,
      Personal_Fouls: +d.Personal_Fouls,
      Offensive_Rebounds: +d.Offensive_Rebounds,
      Defensive_Rebounds: +d.Defensive_Rebounds,
      All_Rebounds: +d.All_Rebounds,
      Assists: +d.Assists,
      Steals: +d.Steals,
      Blocks: +d.Blocks,
      Total_Points_Made: +d.Total_Points_Made,
      Salary: +d.Salary,
      Cost_Per_Point: +d.Cost_Per_Point,
      Free_Throw_Accuracy: +d.Free_Throw_Accuracy,
      Field_Goal_Accuracy: +d.Field_Goal_Accuracy,
      Three_Pointers_Accuracy: +d.Three_Pointers_Accuracy,
      Avg_minutes_per_game: +d.avg_minutes_per_game,
    }
  })
    .then(data => {
      console.log("loaded data:", data);
      state.data = data;

      init1();
      init2();
      init3();
    });