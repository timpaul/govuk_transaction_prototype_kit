module.exports = {
  bind : function (app) {

  	var fs = require('fs');

	var services =  {
  		"services":[
	    	{ url: "property-possession", name: "Repossess a property" },
	    	{ url: "renew-passport", name: "Renew your passport"  },
	    	{ url: "apprenticeships", name: "Apply for an apprenticeship"  },
	    	{ url: "prison-visits", name: "Visit someone in prison"  },
	    	{ url: "registered-traveller", name: "Apply to be a registered traveller" },
	    	{ url: "redundancy-payments", name: "Claim redundancy payments"  },
	    	{ url: "vehicle-operators", name: "Apply for a vehicle operator’s licence" },
	    	{ url: "childminder", name: "Become a childminder" },
	    	{ url: "pip", name: "Personal Independence Payment" }
		]
	}

	var getServiceData = function(service, callback){
    	var data = JSON.parse(fs.readFileSync('app/data/' + service + '.json', 'utf8'));
    	return callback(null, data);
	}


  // Renders a section summary page
  var getSectionData = function(service, section, callback){
      var data = JSON.parse(fs.readFileSync('app/data/' + service + '.json', 'utf8'));
      var sectionArray = data.sections;
      var sectionData;

      sectionArray.forEach( function (i, index, array) {

        // Find the section in the JSON
        if (section == i.number){

          // Create subsection data object
          sectionData = {
            "serviceName" : data.serviceName,
            "actions" : data.actions,
            "meta" : data.meta,
            "noun" : data.noun,
            "section" : i
          }
        }
    });
      return callback(null, sectionData);
  }


	// Renders a question page
	var getQuestionData = function(service, question, callback){

    	var data = JSON.parse(fs.readFileSync('app/data/' + service + '.json', 'utf8'));
    	var questionArray = data.sections[0].questions;
    	var questionData;

    	questionArray.forEach( function (i, index, array) {

    		// Find the question in the JSON
    		if (question == i.number){
    			// Set service name
    			var serviceName = data.serviceName;

    			// Set previous page
    			var prev = i.number -1;

    			// Set next page 
    			var next = i.number + 1;
		    	if (index === array.length - 1){
		    		next = "../check";
		   		}

		   		// Create question data object
		    	questionData = {
		    		"question": i,
		    		"next" : next,
		    		"prev" : i.number - 1,
		    		"serviceName" : serviceName
		    	}
    		}
		});

    	return callback(null, questionData);
	}





	// Serve index page
    app.get('/', function (req, res) {
      res.render('index', services);
    });



    // Service summary page
    app.get("/service/:service", function (req, res) {
      var service = req.params.service;
      getServiceData(service, function(error, data){
        data.verb = "Complete";
        return res.render('transaction-pages/service-summary', data);
      })
    });

    // Serve service check pages
    app.get("/service/:service/check", function (req, res) {
      var service = req.params.service;
      getServiceData(service, function(error, data){
      	return res.render('transaction-pages/service-check', data);
      })
    });

    // Section summary page
    app.get("/service/:service/section-:section/", function (req, res) {
      var service = req.params.service;
      var section = req.params.section;
      getSectionData(service, section, function(error, data){
        return res.render('transaction-pages/section-summary', data);
      })
    });

    // Section check page
    app.get("/service/:service/section-:section/check", function (req, res) {
      var service = req.params.service;
      var section = req.params.section;
      getSectionData(service, section, function(error, data){
        return res.render('transaction-pages/section-check', data);
      })
    });


    // Serve question pages
    app.get("/service/:service/question-:number", function (req, res) {
    
      var service = req.params.service;  
      var number = req.params.number;

      getQuestionData(service, number, function(error, data){

      	return res.render('transaction-pages/question', data);

      })

    });







  }
};
