/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerWidth * 0.7,
  margin = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50
  };


let svg;
let xScale, yScale;
let xAxisGroup, yAxisGroup;
let xLabel, yLabel;

/* APPLICATION STATE */
let state = {
    data: [],
    variable: "All_Rebounds",
    player1: "",
    player2: "",
    bothPlayersData: []
  };
  
  /* LOAD DATA */
  // + SET YOUR DATA PATH

  d3.csv('merged_data.csv', d => {
    // use custom initializer to reformat the data the way we want it
    // ref: https://github.com/d3/d3-fetch#dsv
    return {
      Player: d.Player,
      Year: +d.Season.split(" - ")[1],
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
 
      init();
    });
  
  /* INITIALIZING FUNCTION */
  // this will be run *one time* when the data finishes loading in
  function init() {

    const idx1 = Math.floor(state.data.length * Math.random());
    const idx2 = Math.floor(state.data.length * Math.random());
    state.player1 = state.data[idx1].Player;
    state.player2 = state.data[idx2].Player;

    state.bothPlayersData = state.data.
      filter(d => [state.player1, state.player2].includes(d.Player));

    // + SCALES
    xScale = d3.scaleLinear()
      .domain(d3.extent(state.bothPlayersData, d => d.Year))
      .range([margin.left, width - margin.right]);

    yScale = d3.scaleLinear()
      .domain(d3.extent(state.bothPlayersData, d => d.Games_Played))
      .range([height - margin.bottom, margin.top])
      .nice();
  
    // + UI ELEMENT SETUP
    const selectDropMenu = d3.select("#compare-trendlines-variable");
    const selectUpdateBtn = d3.select("#update-trendlines-btn");
    const DOM_menu = document.getElementById("compare-trendlines-variable");
    const DOM_player1 = document.getElementById("player1");
    const DOM_player2 = document.getElementById("player2");
    

    DOM_player1.value = state.player1;
    DOM_player2.value = state.player2;

    const varNames = Object.keys(state.data[0]).slice(2).sort();

    selectDropMenu.selectAll("option")
      .data(varNames)
      .join("option")
      .attr("attr", d => d)
      .attr("value", d => d)
      .text(d => d.replaceAll("_", " "));

    selectUpdateBtn.on("click", e => {

      const player1Text = DOM_player1.value;
      const player2Text = DOM_player2.value;
      const selectedOption = DOM_menu.options[DOM_menu.selectedIndex].value;

      state.player1 = player1Text;
      state.player2 = player2Text;
      state.variable = selectedOption;
      console.log(state);
      draw();
    });
  
    // + CREATE SVG ELEMENT
    svg = d3.select("#vis-trendlines svg")
        .attr("width", width)
        .attr("height", height)
        .style("background-color", "lavender")
        .attr("opacity", "0.5")
  
    // + CALL AXES
    xAxisGroup = svg.select(".x-axis")
      .attr("transform", `translate(${0}, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    yAxisGroup = svg.select(".y-axis")
      .attr("transform", `translate(${margin.right}, ${0})`)
      .call(d3.axisLeft(yScale));

    // AXIS LABELS
    xLabel = svg.select(".x-label")
      .attr("transform", `translate(${width / 2}, ${height - margin.bottom * .2})`)
      .text("Year")

    yLabel = svg.select(".y-label")
      .attr("class", 'yLabel')
      .attr("transform", `translate(${18}, ${height / 2})`)
      .attr("writing-mode", 'vertical-rl')
      .text(state.variable.replaceAll("_"," "))
  
  
    draw(); // calls the draw function
  }
  
  /* DRAW FUNCTION */
  // we call this every time there is an update to the data/state
  function draw() {
    // + FILTER DATA BASED ON STATE
    state.bothPlayersData = state.data.
        filter(d => [state.player1, state.player2].includes(d.Player));


    // + UPDATE SCALE(S), if needed
    yScale.domain(d3.extent(state.bothPlayersData, d => d[state.variable]))
    xScale.domain(d3.extent(state.bothPlayersData, d => d.Year))

    // + UPDATE AXIS/AXES, if needed
    yAxisGroup
      .transition()
      .duration(1000)
      .call(d3.axisLeft(yScale))// need to udpate the scale

    xAxisGroup
      .transition()
      .duration(1000)
      .call(d3.axisBottom(xScale))// need to udpate the scale

    // + UPDATE Y LABEL
    yLabel
      .text(state.variable.replaceAll("_"," "))

    // specify line generator function
    const lineGen = d3.line()
      .x(d => xScale(d.Year))
      .y(d => yScale(d[state.variable]))

    
    const player1data = state.bothPlayersData.filter(d => d.Player === state.player1);
    const player2data = state.bothPlayersData.filter(d => d.Player === state.player2);

    // + DRAW LINE AND/OR AREA
    svg.selectAll(".line1")
      .data([player1data]) // data needs to take an []
      .join("path")
      .attr("class", 'line1')
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("d", d => lineGen(d));

    // + DRAW LINE AND/OR AREA
    svg.selectAll(".line2")
      .data([player2data]) // data needs to take an []
      .join("path")
      .attr("class", 'line2')
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("d", d => lineGen(d));
  }