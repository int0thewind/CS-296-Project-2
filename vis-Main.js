/**
 * Margin info for mapSVG.
 */
const mapSVGMargin = new Margin(50, 50, 50, 50);

/**
 * Margin info for chartSVG.
 */
const chartSVGMargin = new Margin(50, 50, 50, 50);

/**
 * Margin-included height for both SVG canvas.
 */
const height = 720;

/**
 * Margin-excluded width of the map SVG canvas.
 */
const mapSVGWidth = 900 - mapSVGMargin.left - mapSVGMargin.right;

/**
 * Margin-excluded width of the chart SVG canvas.
 */
const chartSVGWidth = 600 - chartSVGMargin.left - chartSVGMargin.right;

/**
 * Margin-excluded height of the map SVG canvas.
 */
const mapSVGHeight = height - mapSVGMargin.top - mapSVGMargin.bottom;

/**
 * Margin-excluded height of the chart SVG canvas.
 */
const chartSVGHeight = height - chartSVGMargin.top - chartSVGMargin.bottom;

/**
 * The colour to denote 0 students.
 */
const startColour = "#000089"; //"#eff4ff";

/**
 * The colour to denote the highest number of students.
 */
const endColour = "#ffa600"; //"#001f63";

/**
 * Three core attributes from the data array to be used.
 */
const objectAttributeName = ["State", "Year", "Total"];

/**
 * An integer array storing all the available year.
 * Will be modified and **sorted** when the data is imported.
 */
var allYear = [];

/**
 * An string array storing all the state name.
 * Will be modified and **sorted** when the data is imported.
 */
var allStateName = [];

/**
 * Highest number of incoming students.
 * Will be changed throughout the operation.
 */
var highestIncomingStudent = 0;

/**
 * A color scale for the number of students
 */
const studentColourScale = d3.scaleLinear()
  .domain([1, 1000])
  .range([startColour, endColour]);

/**
 * A function to transform number of students to colour.
 * @param {Number} number number of students.
 */
const studentNumberToColour = function(number) {
  if (number < 1000) {
    return studentColourScale(number)
  }
  return "red";
}

/**
 * Year variable that record the scrollbar input.
 * drawMap() should respond to this variables.
 */
var yearPrev = 2005;
var year = yearPrev;

/**
 * JQuery starting point to start visualising data.
 */
$(function() {
  d3.csv("data-modified.csv").then(function(data) {
    /* parse the year and the total number of incoming student from string to integer */
    /* push all the available year in the year array */
    /* push all the state name in the stateName array */
    data.forEach(element => {
      element.Year = parseInt(element.Year);
      element.Total = parseInt(element.Total);
      if (!allStateName.includes(element.State)) {
        allStateName.push(element.State);
      }
      if (!allYear.includes(element.Year)) {
        allYear.push(element.Year)
      }
      if (element["Total"] > highestIncomingStudent) {
        highestIncomingStudent = element["Total"];
      }
    });
    allYear.sort();
    allStateName.sort();

    d3.select("#visualisation")
        .append("svg")
          .attr("id", "mapSVGFramework")
          .attr("width", mapSVGWidth + mapSVGMargin.left + mapSVGMargin.right)
          .attr("height", height)
        .append("g")
          .attr("transform", "translate(" + mapSVGMargin.left + "," + mapSVGMargin.top + ")")
          .attr("id", "mapSVG");

    d3.select("#visualisation")
        .append("svg")
          .attr("id", "chartSVGFramework")
          .attr("width", chartSVGWidth + chartSVGMargin.left + chartSVGMargin.right)
          .attr("height", height)
        .append("g")
          .attr("transform", "translate(" + chartSVGMargin.left + "," + chartSVGMargin.top + ")")
          .attr("id", "chartSVG");

    initialiseMap();
    drawMap(allYear[0], data);
    drawScrollBar(data);
    initialiseChart(data);
  });
});
