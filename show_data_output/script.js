// Set the dimensions of the SVG container
var width = 800;
var height = 400;
var margin = { top: 20, right: 20, bottom: 30, left: 50 };

// Create the SVG container
var svg = d3.select("#graph-container")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

// Load the CSV file
d3.csv("../sensor_data.csv")
  .then(function(data) {
    // Parse the sensorData values as floats
    data.forEach(function(d) {
      d.sensorData = parseFloat(d.sensorData);
    });

    // Set the scales for x and y axes
    var xScale = d3.scaleBand()
                   .domain(data.map(function(d) { return d.time; })) // Use time as the x-axis label
                   .range([margin.left, width - margin.right])
                   .padding(0.1);

    var yScale = d3.scaleLinear()
                   .domain([0, d3.max(data, function(d) { return d.sensorData; })])
                   .range([height - margin.bottom, margin.top]);

    // Create the bars
    svg.selectAll("rect")
       .data(data)
       .enter()
       .append("rect")
       .attr("x", function(d) { return xScale(d.time); })
       .attr("y", function(d) { return yScale(d.sensorData); })
       .attr("width", xScale.bandwidth())
       .attr("height", function(d) { return height - margin.bottom - yScale(d.sensorData); })
       .attr("fill", "steelblue");

    // Create y-axis
    svg.append("g")
       .attr("transform", "translate(" + margin.left + ",0)")
       .call(d3.axisLeft(yScale));
  })
  .catch(function(error) {
    console.log("Error loading CSV file:", error);
  });
