
/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.75,
  heightForVis1 = window.innerHeight * 0.65
  margin = {
    top: 50,
    bottom: 50,
    left: 30,
    right: 80
  };


let vis1 = {
    variable: "Assists",
    player1: "",
    player2: "",
    bothPlayersData: []
};

let vis2 = {
    variable: "Assists",
    Year: 2000,
    top10: []
};

let vis3 = {
    variable: "Assists",
    Year: 2000
};

/* APPLICATION STATE */
let state = {
    data: []
  };

  d3.csv("datasets/team_colors.csv").then(data => {

    state.Team_Colors = {};
    state.Team_CodeToName = {};

    data.map(d => {
        state.Team_Colors[d.Team_Code] = [d.color1, d.color2]
        state.Team_CodeToName[d.Team_Code] = d.Team_Name
      }
    )
  });

  d3.csv("datasets/merged_data.csv", d => {
    // use custom initializer to reformat the data the way we want it
    // ref: https://github.com/d3/d3-fetch#dsv
    return {
      Player: d.Player,
      Year: +d.Season.split(" - ")[1],
      Team_Code: d.Team_Code,
      Team_Name: d.Team_Name,
      Games_Played: +d.Games_Played,
      "Minutes_Played_(Total)": Math.round(+d.Minutes_Played),
      Field_Goals_Made: +d.Field_Goals_Made,
      Field_Goal_Attempts: +d.Field_Goal_Attempts,
      Three_Pointers_Made: +d.Three_Pointers_Made,
      Three_Pointers_Attempts: +d.Three_Pointers_Attempts,
      Free_Throws_Made: +d.Free_Throws_Made,
      Free_Throw_Attempts: +d.Free_Throw_Attempts,
      Turnovers: +d.Turnovers,
      Personal_Fouls: +d.Personal_Fouls,
      "Rebounds_(Offensive)": +d.Offensive_Rebounds,
      "Rebounds_(Defensive)": +d.Defensive_Rebounds,
      "Rebounds_(All)": +d.All_Rebounds,
      Assists: +d.Assists,
      Steals: +d.Steals,
      Blocks: +d.Blocks,
      Total_Points_Made: +d.Total_Points_Made,
      "Salary_(Millions)": Math.round(+d.Salary * 2 / 1000000) / 2,
      // "Cost_Per_Point_(Thousands)": Math.round(+d.Cost_Per_Point * 2 / 1000) / 2,
      "Free_Throw_Accuracy %": Math.round(+d.Free_Throw_Accuracy * 100),
      "Field_Goal_Accuracy %": Math.round(+d.Field_Goal_Accuracy * 100),
      "Three_Pointers_Accuracy %": Math.round(+d.Three_Pointers_Accuracy * 100),
      "Min_per_game_(Avg)": Math.round(+d.avg_minutes_per_game * 2) / 2,
    }
  })
    .then(data => {
      console.log("loaded data:", data);
      state.data = data;

      init1();
      init2();
      init3();
    });


function disableFor500ms() {
  document.querySelector("#body-wrapper").classList.add("disabled-mouse");

  setTimeout(() => {
    document.querySelector("#body-wrapper").classList.remove("disabled-mouse");
  }, 510);
}