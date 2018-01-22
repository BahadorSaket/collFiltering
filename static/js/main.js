(function() {
	main = {};

	/*
	 * initialize the web page
	 */
	main.init = function() {
		$(document).ready(function() {
	        // mar.loadTable("static/data/collegeOffAndDefSmaller.csv");
            console.log("loading app");
			raw.call_backend();
			comp.loadData();
	    });
	}
})();



