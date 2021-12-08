/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init2() {

    vis2.top10 = state.data
        .filter(d => d.Year === vis2.Year)
        .sort((a, b) => b[vis2.variable] - a[vis2.variable])
        .slice(0, 10);

    // /* SCALES */
    vis2.xScale = d3.scaleBand()
        .domain(vis2.top10.map(d => d.Player))
        .range([margin.left, width - margin.right])
        .paddingInner(.2)
        .paddingOuter(.1)

    vis2.yScale = d3.scaleLinear()
        .domain(d3.extent(vis2.top10, d => d[vis2.variable]))
        .range([height - margin.top, margin.bottom])
        .nice()
    

    // UI SETUP
    const selectVar = d3.select("#player-ranks-variable");
    const selectYear = d3.select("#player-ranks-year");
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

        vis2.variable = e.target.value;

        console.log(e.target.value)
        draw2();
    });

    selectYear.on("change", e => {

        vis2.Year = Number(e.target.value);
  
        console.log(e.target.value)
        draw2();
    });

  
    // AXIS -------------------------------------


    // + CALL AXES
    vis2.xAxisGroup = d3.select("#vis-players svg g.x-axis")
        .attr("transform", `translate(${50}, ${height - margin.bottom})`)
        .call(d3.axisBottom(vis2.xScale));

    vis2.yAxisGroup = d3.select("#vis-players svg g.y-axis")
        .attr("transform", `translate(${margin.right}, ${0})`)
        .call(d3.axisLeft(vis2.yScale));

    // AXIS LABELS
    vis2.xLabel = d3.select("#vis-players svg text.x-label")
        .attr("transform", `translate(${width / 2}, ${height - margin.bottom * .2})`)
        .text("Top 10 Players")

    vis2.yLabel = d3.select("#vis-players svg text.y-label")
        .attr("transform", `translate(${18}, ${(height / 2) - 80})`)
        .attr("writing-mode", 'vertical-rl')
        .text(vis2.variable.replaceAll("_"," "))


    // SVG
    vis2.svg = d3.select("#vis-players svg")
        .attr("height", height)
        .attr("width", width)

    draw2(); // calls the draw function
  }
  
  /* DRAW FUNCTION */
  // we call this every time there is an update to the data/state
  function draw2() {
    
    // + FILTER DATA BASED ON vis2
    vis2.top10 = state.data
        .filter(d => d.Year === vis2.Year)
        .sort((a, b) => b[vis2.variable] - a[vis2.variable])
        .slice(0, 10);


    // + UPDATE SCALE(S), if needed
    vis2.yScale.domain(d3.extent(vis2.top10, d => d[vis2.variable])).nice()
    vis2.xScale.domain(vis2.top10.map(d => d.Player))

    // + UPDATE AXIS/AXES, if needed
    vis2.yAxisGroup
      .transition()
      .duration(1000)
      .call(d3.axisLeft(vis2.yScale))// need to update the scale

    vis2.xAxisGroup
      .transition()
      .duration(1000)
      .call(d3.axisBottom(vis2.xScale))// need to update the scale

    // + UPDATE Y LABEL
    vis2.yLabel
      .text(vis2.variable.replaceAll("_"," "))








    // Tooltip Handling START #################################################
  const tooltip = d3.select("#tooltip");

  // Tooltip Mouseover 
  const tipMouseover = function(event, d) {

    const tooltipHTML = `<b>Player:</b> ${d.Player}<br/>
                          <b>${vis2.variable.replaceAll("_"," ")}:</b> ${d[vis2.variable]}<br/>
                          <b>Team:</b> ${d.Team_Name}`;

    let colorArr = state.Team_Colors[d.Team_Code] ?
        state.Team_Colors[d.Team_Code] :
        ["black", "grey"];

    tooltip.html(tooltipHTML)
      .style("left", (event.pageX - 150 + "px"))  
      .style("top", (event.pageY - 70 + "px"))
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
    vis2.svg.selectAll("text.vis2-bar-num")
        .data(vis2.top10)
        .join("text")
        .attr("class", "vis2-bar-num")
        .attr("x", (d, i) => 
            vis2.xScale(d.Player) + 
            (i * 0.8) + 
            String(d[vis2.variable]).length * 1.5 +
            50)
        .text(d => `${d[vis2.variable]}`)
        .attr("y", d => vis2.yScale(d[vis2.variable]) - 8)
   
    // BAR RECTANGLES
    vis2.svg.selectAll("rect.vis2-bar")
        .data(vis2.top10, d => d.Player)
        .join(
            enter => enter
                .append("rect")
                    .attr("class", "vis2-bar")
                    .attr("width", vis2.xScale.bandwidth())
                    .attr("height", 0)
                    .attr("x", d => vis2.xScale(d.Player) + 50)
                    .attr("y", height - margin.bottom)
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
                    .attr("opacity", 0.5)
                    .on("mouseover", tipMouseover)
                    .on("mouseout", tipMouseout)
                .call(enter => enter.transition()
                    .duration(500)
                    .attr("y", d => vis2.yScale(d[vis2.variable]) - 1)
                    .attr("height", d => height - vis2.yScale(d[vis2.variable]) - margin.bottom)),
            update => update
                    .call(update => update.transition()
                        .duration(500)
                        .attr("x", d => vis2.xScale(d.Player) + 50)
                        .attr("height", d => height - vis2.yScale(d[vis2.variable]) - margin.bottom)
                        .attr("y", d => vis2.yScale(d[vis2.variable]) - 1)),
            exit => exit
                    .call(exit => exit.transition()
                        .duration(500)
                        .attr("opacity", 0))
                    .remove()
        );





}