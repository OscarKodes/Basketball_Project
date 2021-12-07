

// INIT AND DRAW FUNCTIONS FOR VIS 1: TRENDLINES


  /* INITIALIZING FUNCTION */
  // this will be run *one time* when the data finishes loading in
  function init1() {

    const idx1 = Math.floor(state.data.length * Math.random());
    const idx2 = Math.floor(state.data.length * Math.random());
    vis1.player1 = state.data[idx1].Player;
    vis1.player2 = state.data[idx2].Player;

    vis1.bothPlayersData = state.data.
      filter(d => [vis1.player1, vis1.player2].includes(d.Player));

    // + SCALES
    vis1.xScale = d3.scaleLinear()
      .domain(d3.extent(vis1.bothPlayersData, d => d.Year))
      .range([margin.left, width - margin.right]);

    vis1.yScale = d3.scaleLinear()
      .domain(d3.extent(vis1.bothPlayersData, d => d.Games_Played))
      .range([height - margin.bottom, margin.top])
      .nice();
  
    // + UI ELEMENT SETUP
    const selectDropMenu = d3.select("#compare-trendlines-variable");
    const selectUpdateBtn = d3.select("#update-trendlines-btn");
    const DOM_menu = document.getElementById("compare-trendlines-variable");
    const DOM_player1 = document.getElementById("player1");
    const DOM_player2 = document.getElementById("player2");
    

    DOM_player1.value = vis1.player1;
    DOM_player2.value = vis1.player2;

    const varNames = Object.keys(state.data[0]).slice(4).sort();

    selectDropMenu.selectAll("option")
      .data(varNames)
      .join("option")
      .attr("attr", d => d)
      .attr("value", d => d)
      .text(d => d.replaceAll("_", " "));

    const clickBtn = () => {

      setTimeout(() => {
        document.getElementById("update-trendlines-btn").click();
      }, 200);
      
    };

    selectDropMenu.on("change", clickBtn);
    d3.select("#player1").on("change", clickBtn);
    d3.select("#player2").on("change", clickBtn);


    selectUpdateBtn.on("click", e => {

      const player1Text = DOM_player1.value;
      const player2Text = DOM_player2.value;
      const selectedOption = DOM_menu.options[DOM_menu.selectedIndex].value;

      vis1.player1 = player1Text;
      vis1.player2 = player2Text;
      vis1.variable = selectedOption;

      draw1();
    });
  
    // + CREATE SVG ELEMENT
    vis1.svg = d3.select("#vis-trendlines svg")
        .attr("width", width)
        .attr("height", height)
  
    // + CALL AXES
    vis1.xAxisGroup = vis1.svg.select(".x-axis")
      .attr("transform", `translate(${0}, ${height - margin.bottom})`)
      .call(d3.axisBottom(vis1.xScale));

    vis1.yAxisGroup = vis1.svg.select(".y-axis")
      .attr("transform", `translate(${margin.right}, ${0})`)
      .call(d3.axisLeft(vis1.yScale));

    // AXIS LABELS
    vis1.xLabel = vis1.svg.select(".x-label")
      .attr("transform", `translate(${width / 2}, ${height - margin.bottom * .2})`)
      .text("Year")

    vis1.yLabel = vis1.svg.select(".y-label")
      .attr("transform", `translate(${18}, ${height / 2})`)
      .attr("writing-mode", 'vertical-rl')
      .text(vis1.variable.replaceAll("_"," "))
  
  
    draw1(); // calls the draw function
  }
  
  /* DRAW FUNCTION */
  // we call this every time there is an update to the data/vis1
  function draw1() {
    // + FILTER DATA BASED ON vis1
    vis1.bothPlayersData = state.data.
        filter(d => [vis1.player1, vis1.player2].includes(d.Player));


    // + UPDATE SCALE(S), if needed
    vis1.yScale.domain(d3.extent(vis1.bothPlayersData, d => d[vis1.variable])).nice()
    vis1.xScale.domain(d3.extent(vis1.bothPlayersData, d => d.Year))

    // + UPDATE AXIS/AXES, if needed
    vis1.yAxisGroup
      .transition()
      .duration(1000)
      .call(d3.axisLeft(vis1.yScale))// need to udpate the scale

    vis1.xAxisGroup
      .transition()
      .duration(1000)
      .call(d3.axisBottom(vis1.xScale))// need to udpate the scale

    // + UPDATE Y LABEL
    vis1.yLabel
      .text(vis1.variable.replaceAll("_"," "))

    // specify line generator function
    const lineGen = d3.line()
      .x(d => vis1.xScale(d.Year))
      .y(d => vis1.yScale(d[vis1.variable]))

    
    const player1data = vis1.bothPlayersData.filter(d => d.Player === vis1.player1);
    const player2data = vis1.bothPlayersData.filter(d => d.Player === vis1.player2);

    // + DRAW LINE AND/OR AREA
    vis1.svg.selectAll(".line1")
      .data([player1data]) // data needs to take an []
      .join("path")
      .attr("class", 'line1')
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", "0.5rem")
      .attr("d", d => lineGen(d));

    // + DRAW LINE AND/OR AREA
    vis1.svg.selectAll(".line2")
      .data([player2data]) // data needs to take an []
      .join("path")
      .attr("class", 'line2')
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", "0.5rem")
      .attr("d", d => lineGen(d));
  }