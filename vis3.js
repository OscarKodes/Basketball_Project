/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in

function updateTeamRanks () {

    vis3.allPlayersInYear = state.data
        .filter(d => d.Year === vis3.Year);

    vis3.teamObj = {};

    state.data.map(d => {

        let teamCode = d.Team_Code;
        if (vis3.teamObj[teamCode] !== 0) {
            vis3.teamObj[teamCode] = 0;
        };
    });

    vis3.allPlayersInYear.map(d => vis3.teamObj[d.Team_Code] += d[vis3.variable]);

    dataArr = Object.keys(vis3.teamObj).map(key => {

        let score = vis3.teamObj[key];

        return {Team_Code: key, [vis3.variable] : score}
    });

    vis3.teamRanks = dataArr.sort((a, b) => b[vis3.variable] - a[vis3.variable]);
}

function init3() {

    

    updateTeamRanks();


    // /* SCALES */
    vis3.xScale = d3.scaleBand()
        .domain(vis3.teamRanks.map(d => d.Team_Code))
        .range([margin.left, width - margin.right])
        .paddingInner(.2)
        .paddingOuter(.1)

    vis3.yScale = d3.scaleLinear()
        .domain(d3.extent(vis3.teamRanks, d => d[vis3.variable]))
        .range([height - margin.top, margin.bottom])
    

    // UI SETUP
    const selectVar = d3.select("#team-ranks-variable");
    const selectYear = d3.select("#team-ranks-year");
    const varNames = Object.keys(state.data[0]).slice(4).sort();
    const years = [];

    for (let i = 2000;  i <= 2020; i++) {
        years.push(i);
    };

    selectVar.selectAll("option")
      .data(varNames)
      .join("option")
      .attr("attr", d => d)
      .attr("value", d => d)
      .text(d => d.replaceAll("_", " "));
    
    selectYear.selectAll("option")
      .data(years)
      .join("option")
      .attr("attr", d => d)
      .attr("value", d => d)
      .text(d => d);

    

    selectVar.on("change", e => {

        vis3.variable = e.target.value;

        console.log(e.target.value)
        draw3();
    });

    selectYear.on("change", e => {

        vis3.Year = Number(e.target.value);
  
        console.log(e.target.value)
        draw3();
    });

  
    // AXIS -------------------------------------


    // + CALL AXES
    vis3.xAxisGroup = d3.select("#vis-teams svg g.x-axis")
        .attr("transform", `translate(${0}, ${height - margin.bottom})`)
        .call(d3.axisBottom(vis3.xScale));

    vis3.yAxisGroup = d3.select("#vis-teams svg g.y-axis")
        .attr("transform", `translate(${margin.right}, ${0})`)
        .call(d3.axisLeft(vis3.yScale));

    // AXIS LABELS
    vis3.xLabel = d3.select("#vis-teams svg text.x-label")
        .attr("transform", `translate(${width / 2}, ${height - margin.bottom * .2})`)
        .text("Teams")

    vis3.yLabel = d3.select("#vis-teams svg text.y-label")
        .attr("transform", `translate(${18}, ${height / 2})`)
        .attr("writing-mode", 'vertical-rl')
        .text(vis3.variable.replaceAll("_"," "))


    // SVG
    vis3.svg = d3.select("#vis-teams svg")
        .attr("height", height)
        .attr("width", width)
        .style("background-color", "lavender")
        .attr("opacity", 0.5);

    draw3(); // calls the draw function
  }
  
  /* DRAW FUNCTION */
  // we call this every time there is an update to the data/state
  function draw3() {
    
    // + FILTER DATA BASED ON vis3
    updateTeamRanks();


    // + UPDATE SCALE(S), if needed
    vis3.yScale.domain(d3.extent(vis3.teamRanks, d => d[vis3.variable]))
    vis3.xScale.domain(vis3.teamRanks.map(d => d.Team_Code))

    // + UPDATE AXIS/AXES, if needed
    vis3.yAxisGroup
      .transition()
      .duration(1000)
      .call(d3.axisLeft(vis3.yScale))// need to update the scale

    vis3.xAxisGroup
      .transition()
      .duration(1000)
      .call(d3.axisBottom(vis3.xScale))// need to update the scale

    // + UPDATE Y LABEL
    vis3.yLabel
      .text(vis3.variable.replaceAll("_"," "))


    // BAR NUMBERS
    vis3.svg.selectAll("text.vis3-bar-num")
        .data(vis3.teamRanks)
        .join("text")
        .attr("class", "vis3-bar-num")
        .attr("x", (d, i) => vis3.xScale(d.Team_Code) + (i * 0.8) + String(d[vis3.variable]).length * 1.5)
        .text(d => `${d[vis3.variable]}`)
        .attr("y", d => vis3.yScale(d[vis3.variable]) - 8)
   
    // BAR RECTANGLES
    vis3.svg.selectAll("rect.vis3-bar")
        .data(vis3.teamRanks)
        .join("rect")
        .attr("class", "vis3-bar")
        .attr("width", vis3.xScale.bandwidth())
        .attr("height", d => height - vis3.yScale(d[vis3.variable]) - margin.bottom)
        .attr("x", d => vis3.xScale(d.Team_Code))
        .attr("y", d => vis3.yScale(d[vis3.variable]))
        .attr("fill", "yellow")
        .attr("stroke", "black");
  }