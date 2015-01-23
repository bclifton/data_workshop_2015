
// I am also including a 'cleaned up' version of the data, without the state field, that would not require the 'processData()' function:
// var LOCAL_DATA = 'data/us-gov-cdc-food_CLEANED.csv';

var LOCAL_DATA = 'data/us-gov-cdc-food.csv';


$(document).ready(function() {
	getData();
});

function getData() {
	
	d3.csv(LOCAL_DATA, function(data) {
		// console.log(data);
		processData(data);
	});
}


function processData(data) {

	// This is where we will store the first round of cleaning the data:
	var newData = {};
	_.each(data, function(element) {

		// Get the elements we want to use:
		var totalill = +element.totalill;
		var date = element.year + '-' + element.month;
		// we won't use this now, but it might be good to have later...
		var state = element.state;

		// Create a time formatter. This will allow us to turn strings into JavaScript Date objects.
		// The "%Y-%B" is the style of the date string. This looks for 4-digit years (%Y), followed by a "-", the followed by a full-length name of the month, like "August" (%B):
		var format = d3.time.format("%Y-%B");
		var formattedDate = format.parse(date);

		var temp = {};

		// Go through the data and create the new data structure (an object) we want to use to group our data by formattedDate:
		if (!_.has(newData, formattedDate)) {

			temp['totalill'] = totalill;
			temp[state] = totalill;

			newData[formattedDate] = temp;

		} else {
			// if there is already an entry for the date in newData, look for a entry for the state, and add a new key if the state isn't there:
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
	_.each(newData, function(value, date) {
		// console.log(key, value);

		// create a simple object where the date is the key, and the totalill is the value:
		var temp = {};
		temp[date] = value;

		// push it into the processedData array:
		processedData.push(temp);
	});
	// console.log(processedData);

	// And lets sort the data before we visualize it:
	var sortedData = _.sortBy(processedData, function(d) {
		
		// Find the keys in the data (which is our date)
		var date = _.keys(d);
		// Turn it into a Javascript Date object:
		var tempDate = new Date(date[0]);

		// and sort the processedData array by the JavaScript date:
		return tempDate;
	});
	// console.log('sortedData', sortedData);



	// AND NOW WE SEND THE DATA INTO THE FUNCTION WE WILL USE TO CREATE OUR GRAPHIC:
	drawBarGraph(processedData);

}

function drawBarGraph(data) {
	console.log(data);

	var margin = {top: 20,
				right: 20,
				bottom: 30,
				left: 80};
	var width = 960 - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;

	var xScale = d3.time.scale()
		.domain([
			d3.min(data, function(d) { return new Date(d3.keys(d)[0]); }),
			d3.max(data, function(d) { return new Date(d3.keys(d)[0]); })
		])
		.range([0, width]);

	var yScale = d3.scale.linear()
		.domain([
			d3.min(data, function(d) { return d3.values(d)[0].totalill; }),
			d3.max(data, function(d) { return d3.values(d)[0].totalill; }),
		])
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient('bottom');

	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient('left')
		.ticks(10);


	var svg = d3.select('body')
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', 'translate('+ margin.left + ',' + margin.top +')');

	svg.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate(0,'+ height +')')
		.call(xAxis);

	svg.append('g')
		.attr('class', 'y axis')
		.call(yAxis)
		.append('text')
		.attr('transform', 'rotate(-90)')
		.attr('y', 6)
		.attr('dy', '0.71em')
		.style('text-anchor', 'end')
		.text('Cases of people falling ill from foodborne illness.');

	svg.selectAll('.bar')
		.data(data)
		.enter()
		.append('rect')
		.attr('class', 'bar')
		.attr('x', function(d) { console.log(d); return xScale(new Date(d3.keys(d)[0]));})
		.attr('y', function(d) { return yScale(d3.values(d)[0].totalill); })
		.attr('width', '4')
		.attr('height', function(d) { return height	- yScale(d3.values(d)[0].totalill);})

}













