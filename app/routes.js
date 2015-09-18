module.exports = {
  bind : function (app) {

  	var fs = require('fs');

	var services =  {
  		services:[
	    	{ url: "property-possession", name: "Repossess a property" },
	    	{ url: "renew-passport", name: "Renew your passport"  },
	    	{ url: "apprenticeships", name: "Apply for an apprenticeship"  },
	    	{ url: "prison-visits", name: "Visit someone in prison"  },
	    	{ url: "registered-traveller", name: "Apply to be a registered traveller" },
	    	{ url: "redundancy-payments", name: "Claim redundancy payments"  },
	    	{ url: "vehicle-operators", name: "Apply for a vehicle operator’s licence" },
	    	{ url: "childminder", name: "Become a childminder" }
		]
	}

	var getServiceData = function(service, callback){
    	var data = JSON.parse(fs.readFileSync('app/data/' + service + '.json', 'utf8'));
    	return callback(null, data);
	}




		// Serve index page
	    app.get('/', function (req, res) {
	      res.render('index', services);
	    });


	    // Serve check pages
	    app.get("/service/:service/check", function (req, res) {
	      
	      var service = req.params.service;

	      getServiceData(service, function(error, data){

	      	data.verb = "Check";
	      	data.isCheck = true;

	      	return res.render('examples/summary', data);
	      })

	    });

	   	// Serve overview pages
	    app.get("/service/:service/overview", function (req, res) {
	      
	      var service = req.params.service;

	      getServiceData(service, function(error, data){

	      	data.verb = "Complete";
	      	data.isOverview = true;

	      	return res.render('examples/summary', data);
	      })

	    });









  }
};
