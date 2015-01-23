
var API_KEY = '';
var API_ADDRESS = 'https://api.enigma.io/v2/data/' + API_KEY + '/us.gov.dod.salaries.2013';
var LOCAL_DATA = 'data/us-gov-cdc-food.csv';

$(document).ready(function() {
	// console.log('Hi John');
	getData();
});

function getData() {

	// $.get(API_ADDRESS).done(function(data) {
	//  console.log(data);
	// 	processData(data);
	// });
	
	d3.csv(LOCAL_DATA, function(data) {
		// console.log(data);
		processData(data);
	});
}


function processData(data) {

	var newData = {};

	_.each(data, function(element) {

		var year = element.year;
		var month = element.month;
		var totalill = +element.totalill;
		var state = element.state;

		var date = year + '-' + month;
		var format = d3.time.format("%Y-%B");
		var formattedDate = format.parse(date);

		var temp = {};

		if (!_.has(newData, formattedDate)) {

			temp['totalill'] = totalill;
			temp[state] = totalill;

			newData[formattedDate] = temp;

		} else {
			if (!_.has(newData[formattedDate], state)) {
				newData[formattedDate][state] = totalill;
			} else {
				newData[formattedDate][state] += totalill;
			}

			newData[formattedDate]['totalill'] += totalill;
		}
	});
	// console.log(newData);

	// The date needs to be formatted as an array for D3:
	var processedData = [];
	_.each(newData, function(value, key) {
		// console.log(key, value);


		var temp = {};
		temp[key] = value;

		processedData.push(temp);
	});
	// console.log(processedData);

	var sortedData = _.sortBy(processedData, function(d) {
		var key = _.keys(d);
		// console.log(key[0]);

		var tempDate = new Date(key[0]);
		
		return tempDate;
	});
	// console.log('sortedData', sortedData);

	drawBarGraph(processedData);

}

function drawBarGraph(data) {
	// console.log(data);

	var margin = {top: 20, right: 20, bottom: 30, left: 80},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

	var x = d3.time.scale()
		.domain([
			d3.min(data, function(d){ return new Date(d3.keys(d)[0]); }),
			d3.max(data, function(d){ return new Date(d3.keys(d)[0]); })
		])
	    .range([0, width]);

	var y = d3.scale.linear()
		.domain([
			d3.min(data, function(d){ return d3.values(d)[0].totalill; }), 
			d3.max(data, function(d){ return d3.values(d)[0].totalill; })])
		.range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .ticks(10);

	var svg = d3.select("body").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
		.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	svg.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(xAxis);

	  svg.append("g")
	    .attr("class", "y axis")
	    .call(yAxis)
	    .append("text")
	    .attr("transform", "rotate(-90)")
	    .attr("y", 6)
	    .attr("dy", ".71em")
	    .style("text-anchor", "end")
	    .text("Cases of people falling ill from foodborne illness.")
	    ;

	  svg.selectAll(".bar")
	    .data(data)
	    .enter().append("rect")
	    .attr("class", "bar")
	    .attr("x", function(d) { return x(new Date(d3.keys(d)[0])); })
	    .attr("width", '4')
	    .attr("y", function(d) { return y(d3.values(d)[0].totalill); })
	    .attr("height", function(d) {return height - y(d3.values(d)[0].totalill); });
}