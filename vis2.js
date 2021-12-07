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
        .attr("transform", `translate(${0}, ${height - margin.bottom})`)
        .call(d3.axisBottom(vis2.xScale));

    vis2.yAxisGroup = d3.select("#vis-players svg g.y-axis")
        .attr("transform", `translate(${margin.right}, ${0})`)
        .call(d3.axisLeft(vis2.yScale));

    // AXIS LABELS
    vis2.xLabel = d3.select("#vis-players svg text.x-label")
        .attr("transform", `translate(${width / 2}, ${height - margin.bottom * .2})`)
        .text("Top 10 Players")

    vis2.yLabel = d3.select("#vis-players svg text.y-label")
        .attr("transform", `translate(${18}, ${height / 2})`)
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


    // BAR NUMBERS
    vis2.svg.selectAll("text.vis2-bar-num")
        .data(vis2.top10)
        .join("text")
        .attr("class", "vis2-bar-num")
        .attr("x", (d, i) => vis2.xScale(d.Player) + (i * 0.8) + String(d[vis2.variable]).length * 1.5)
        .text(d => `${d[vis2.variable]}`)
        .attr("y", d => vis2.yScale(d[vis2.variable]) - 8)
   
    // BAR RECTANGLES
    vis2.svg.selectAll("rect.vis2-bar")
        .data(vis2.top10)
        .join("rect")
        .attr("class", "vis2-bar")
        .attr("width", vis2.xScale.bandwidth())
        .attr("height", d => height - vis2.yScale(d[vis2.variable]) - margin.bottom)
        .attr("x", d => vis2.xScale(d.Player))
        .attr("y", d => vis2.yScale(d[vis2.variable]) - 1)
        .attr("fill", d => {

            let color = state.Team_Colors[d.Team_Code][0];

            return "#" + (color ? color : "black");
        })
        .attr("stroke", d => {

            let color = state.Team_Colors[d.Team_Code][1];

            return "#" + (color ? color : "black");
        })
        .attr("stroke-width", "3px");
  }