/**
 * the main function to append scroll bar onto
 * @param {svg} svg the main canvas to append scroll bar onto
 * @param {*} data the data we would like to visualise
 */

var drawScrollBar = function(svg, data) {
  svg = d3.select("svg");
  var x = d3.scaleLinear()
    .domain([1998, 2017])
    .range([0, width])
    .clamp(true);

var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + 50 + "," + 100 + ")");

slider.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
    .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
    .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
    .on("start.interrupt", function() { slider.interrupt(); })
    .on("start drag", function() { hue(x.invert(d3.event.x)); }));

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 1 + ")")
    .selectAll("text")
    .data(x.ticks(19))
    .enter().append("text")
    .attr("x", x)
    .attr("y",20)
    .attr("text-anchor", "middle")
    .text(function(d) { return d; });

var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

slider.transition() // Gratuitous intro!
    .duration(1000)
    .tween("hue", function() {
      var i = d3.interpolate(0, 2005);
      return function(t) { hue(i(t)); };
    });
  yearPrev = 2005;
  function hue(h) {
    handle.attr("cx", x(h));
    svg.style("background-color", d3.hsl(h%360, 0.8, 0.8));
    year = Math.round(h);
    //console.log(yearPrev);
    if (year!=yearPrev){
      console.log(year);
      yearPrev = year;
      drawChart(year,svg,data);
    }
  }

}
