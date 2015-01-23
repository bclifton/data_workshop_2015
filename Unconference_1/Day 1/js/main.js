var KEY = "fcdTp4HyqXQ4QnrwpXa08F7HwUwvOTKqlXwPEGU5I3xuPcOS4vAqA";
var API_ADDRESS = "https://api.enigma.io/v2/data/" + KEY + "/us.gov.cdc.food?page=";


$(document).ready(function(){
	getData();
});

function getData() {
	
	$.get(API_ADDRESS + 1).done(function(data) {
		// console.log(data);
		processData(data.result);
	});

}

function processData(data) {

	var newData = {};
	_.each(data, function(horseshitum) {
		// console.log(horseshit);
		var year = horseshitum.year;
		var month = horseshitum.month;
		var date = year + "-" + month;

		if (_.has(newData, date)) {
			newData[date] += +horseshitum.totalill;
		} else {
			newData[date] = +horseshitum.totalill;
			// console.log(horseshit.month);
		}
	});
	console.log(newData);

}


