
var API_KEY = '';
var API_ADDRESS = 'https://api.enigma.io/v2/data/' + API_KEY + '/us.gov.dod.salaries.2013';

$(document).ready(function() {
	// console.log('Hi John');
	getData();
});

function getData() {

	$.get(API_ADDRESS).done(function(data) {
		processData(data);
	});

}

function processData(data) {
	// console.log(data.result);

	var newData = {};

	_.each(data.result, function(element) {
		// console.log(element);
		var jobTitle = element.job_title;
		var salary = +element.base_salary;
		// console.log(jobTitle, salary);

		// var temp = {};

		// if newData does not have jobTitle in it:
		if (!_.has(newData, jobTitle)) {
			newData[jobTitle] = salary;

		} else {
			newData[jobTitle] += salary;
			// newData does have jobTitle in it:
		}

	});
	// console.log(newData);

	var processedData = [];
	_.each(newData, function(value, key) {
		// console.log(key, value);
		var temp = {};
		temp[key] = value;

		processedData.push(temp);
	});

	console.log(processedData);

}


















