/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in

function updateTeamRanks () {

    // Get all players for the year
    vis3.allPlayersInYear = state.data
        .filter(d => d.Year === vis3.Year);

    // Create object with team codes as keys
    vis3.teamObj = {};

    state.data.map(d => {

        let teamCode = d.Team_Code;
        if (vis3.teamObj[teamCode] !== 0) {
            vis3.teamObj[teamCode] = 0;
        };
    });

    // Add each player's score to their team's score in the object
    vis3.allPlayersInYear.map(d => vis3.teamObj[d.Team_Code] += d[vis3.variable]);

    // Create array of individual objects for each team and score
    dataArr = Object.keys(vis3.teamObj).map(NBA_Code => {

        let score = vis3.teamObj[NBA_Code];

        // If the sum total variable needs to be averaged for the team
        if (vis3.variable[vis3.variable.length - 1] === "%" || 
            ["Min", "Cos"].includes(vis3.variable.slice(0, 3))) {
            let playerCount = vis3.allPlayersInYear
                .filter(d => d.Team_Code === NBA_Code)
                .length;

            if (playerCount > 0) {
                score = Math.round((score / playerCount) * 2) / 2;
                console.log(playerCount);
            }

            
        }

        return {Team_Code: NBA_Code, [vis3.variable] : score}
    });

    // Filter out teams with scores of 0, and sort them in score order
    vis3.teamRanks = dataArr
        .filter(d => d[vis3.variable] !== 0)
        .sort((a, b) => b[vis3.variable] - a[vis3.variable]);
}

function init3() {

    

    updateTeamRanks();


    // /* SCALES */
    vis3.xScale = d3.scaleLinear()
        .domain(d3.extent(vis3.teamRanks, d => d[vis3.variable]))
        .range([margin.left, width - margin.right])
        .nice()
        

    vis3.yScale = d3.scaleBand()
        .domain(vis3.teamRanks.map(d => d.Team_Code))
        .range([margin.bottom, height - margin.top])
        .paddingInner(.4)
        .paddingOuter(.3)
        
    

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

        disableFor500ms();
        draw3();
    });

    selectYear.on("change", e => {

        vis3.Year = Number(e.target.value);
  
        disableFor500ms();
        draw3();
    });

  
    // AXIS -------------------------------------


    // + CALL AXES
    vis3.xAxisGroup = d3.select("#vis-teams svg g.x-axis")
        .attr("transform", `translate(${50}, ${height - margin.bottom})`)
        .call(d3.axisBottom(vis3.xScale));

    vis3.yAxisGroup = d3.select("#vis-teams svg g.y-axis")
        .attr("transform", `translate(${margin.right}, ${0})`)
        .call(d3.axisLeft(vis3.yScale));

    // AXIS LABELS
    vis3.xLabel = d3.select("#vis-teams svg text.x-label")
        .attr("transform", `translate(${width / 2.5}, ${height - margin.bottom * .2})`)
        .text(vis3.variable.replaceAll("_"," "))

    vis3.yLabel = d3.select("#vis-teams svg text.y-label")
        .attr("transform", `translate(${18}, ${height / 2})`)
        .attr("writing-mode", 'vertical-rl')
        .text("Teams")


    // SVG
    vis3.svg = d3.select("#vis-teams svg")
        .attr("height", height)
        .attr("width", width)

    draw3(); // calls the draw function
  }
  
  /* DRAW FUNCTION */
  // we call this every time there is an update to the data/state
  function draw3() {
    
    // + FILTER DATA BASED ON vis3
    updateTeamRanks();


    // + UPDATE SCALE(S), if needed
    vis3.yScale.domain(vis3.teamRanks.map(d => d.Team_Code))
    vis3.xScale.domain(d3.extent(vis3.teamRanks, d => d[vis3.variable])).nice()

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
    vis3.xLabel
      .text(vis3.variable.replaceAll("_"," "))













    // Tooltip Handling START #################################################
    const tooltip = d3.select("#tooltip");

    // Tooltip Mouseover 
    const tipMouseover = function(event, d) {
  
      const tooltipHTML = `<b>Team Name:</b> ${state.Team_CodeToName[d.Team_Code]}<br/>
                            <b>${vis3.variable.replaceAll("_"," ")}:</b> ${d[vis3.variable]}`;
  
      let colorArr = state.Team_Colors[d.Team_Code] ?
          state.Team_Colors[d.Team_Code] :
          ["black", "grey"];
  
      tooltip.html(tooltipHTML)
        .style("left", (event.pageX - 160 + "px"))  
        .style("top", (event.pageY - 80 + "px"))
        .style("border", `${"#" + colorArr[0]} solid 0.2rem`) // Same border color as genre
        .style("outline", `1px solid ${"#" + colorArr[1]}`)
        .transition()
          .duration(100) 
          .style("opacity", 1) 
  
      d3.select(this)
        .transition()
        .duration(100)
        .style("opacity", 1);
    };
  
    // Tooltip Mouseout
    const tipMouseout = function(d) {
        tooltip.transition()
            .duration(200) 
            .style("opacity", 0); // Make tooltip div invisible
  
        d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", 0.5);
    };
  
  // Tooltip Handling END #################################################













    // BAR NUMBERS
    vis3.svg.selectAll("text.vis3-bar-num")
        .data(vis3.teamRanks)
        .join("text")
        .attr("class", "vis3-bar-num")
        .attr("x", (d, i) => vis3.xScale(d[vis3.variable]) + 
            (i * 2 > 15 ? 15 : 10) +
            + 50)
        .text(d => `${d[vis3.variable]}`)
        .attr("y", d => vis3.yScale(d.Team_Code) + 11)
   
    // BAR RECTANGLES
    vis3.svg.selectAll("rect.vis3-bar")
        .data(vis3.teamRanks, d => d.Team_Code)
        .join(
            enter => enter
                .append("rect")
                    .attr("class", "vis3-bar")
                    .attr("width", 0)
                    .attr("height", vis3.yScale.bandwidth())
                    .attr("x", margin.left + 2 + 50)
                    .attr("y", d => vis3.yScale(d.Team_Code))
                    .attr("fill", d => {
            
                        let colorArr = state.Team_Colors[d.Team_Code] ?
                                state.Team_Colors[d.Team_Code] :
                                ["black", "grey"];
            
                        return "#" + colorArr[0];
                    })
                    .attr("stroke", d => {
            
                        let colorArr = state.Team_Colors[d.Team_Code] ?
                                state.Team_Colors[d.Team_Code] :
                                ["black", "grey"];
            
                        return "#" + colorArr[1];
                    })
                    .attr("stroke-width", "3px")
                    .attr("opacity", 0.3)
                    .on("mouseover", tipMouseover)
                    .on("mouseout", tipMouseout)
                .call(enter => enter.transition()
                    .duration(500)
                    .attr("width", d => vis3.xScale(d[vis3.variable]) - 30)),
            update => update
                .call(update => update.transition()
                    .duration(500)
                    .attr("y", d => vis3.yScale(d.Team_Code))
                    .attr("width", d => vis3.xScale(d[vis3.variable]) - 30)),
            exit => exit
                    .call(exit => exit.transition()
                        .duration(500)
                        .attr("opacity", 0))
                    .remove()
        )
        ;
  }