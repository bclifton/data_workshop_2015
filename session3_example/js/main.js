
// I am also including a 'cleaned up' version of the data, without the state field, that would not require the 'processData()' function:
// var LOCAL_DATA = 'data/us-gov-cdc-food_CLEANED.csv';

var LOCAL_DATA = 'data/us-gov-cdc-food.csv';


$(document).ready(function() {
	getData();
});

function getData() {
	
	d3.csv(LOCAL_DATA, function(data) {
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
	_.each(newData, function(value, key) {
		// console.log(key, value);

		// create a simple object where the date is the key, and the totalill is the value:
		var temp = {};
		temp[key] = value;

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
}