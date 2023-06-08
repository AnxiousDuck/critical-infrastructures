// Load the CSV file
d3.csv("../sensor_data.csv").then(function(data) {
    // Parse the sensorData values as floats and time values as dates
    var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S.%L");
    data.forEach(function(d) {
      d.sensorData = parseFloat(d.sensorData);
      d.time = parseTime(d.time);
    });
  
    // Set the dimensions of the chart
    var margin = { top: 20, right: 20, bottom: 30, left: 50 };
    var width = 800 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;
  
    // Create the SVG container
    var svg = d3
      .select("#chart-container")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    // Set the x and y scales
    var xScale = d3
      .scaleTime()
      .domain(d3.extent(data, function(d) { return d.time; }))
      .range([0, width]);
  
    var yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, function(d) { return d.sensorData; })])
      .range([height, 0]);
  
    // Create the line generator
    var line = d3
      .line()
      .x(function(d) { return xScale(d.time); })
      .y(function(d) { return yScale(d.sensorData); });
  
    // Append the line chart
    svg
      .append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);
  
    // Define the time ranges to highlight
    // var timeRanges = [
    //   { start: parseTime("2023-06-07 22:00:00"), end: parseTime("2023-06-07 23:00:00") },
    //   { start: parseTime("2023-06-07 18:00:00"), end: parseTime("2023-06-07 19:00:00") }
    // ];
  
    // // Append rectangles to highlight time ranges
    // svg
    //   .selectAll("rect")
    //   .data(timeRanges)
    //   .enter()
    //   .append("rect")
    //   .attr("x", function(d) { return xScale(d.start); })
    //   .attr("y", 0)
    //   .attr("width", function(d) { return xScale(d.end) - xScale(d.start); })
    //   .attr("height", height)
    //   .attr("class", "highlight");
  
    // Add x-axis
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));
  
    // Add y-axis
    svg.append("g").call(d3.axisLeft(yScale));
  });
  