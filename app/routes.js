module.exports = {
  bind : function (app) {

  var fs = require('fs');


  // This builds the index navigation
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


  // Render a page
  var renderPage = function(service, sectionArray, page, callback){

      // Read the data file for the relevant service
      var data = JSON.parse(fs.readFileSync('app/data/' + service + '.json', 'utf8'));

      // Get the section-level data for the page
      var pageData = data;

      // Find the relevant section in the service
      if (sectionArray.length == 0){
        pageData.lastItem2 = true;
      } else {
        for(var i = 0; i < sectionArray.length; i++){

          sectionIndex = Number(sectionArray[i]) - 1;

          // If it's the last section, add a flag so we can 
          // send people on to the next section
          var lastItem = false;
          if(sectionIndex + 1 == pageData.sections.length){
            lastItem = true;
          }

          pageData = pageData.sections[sectionIndex];
          pageData.lastItem = lastItem;

        }
      }

      // Number the current, previous and next pages
      var currentSection = Number(sectionArray[sectionArray.length - 1]);
      pageData.number = currentSection;
      pageData.next = currentSection + 1;
      pageData.prev = currentSection - 1;


      if (pageData.sections){

        // Number the sections
        for(var i = 0; i < pageData.sections.length; i++){

          // Number each section
          pageData.sections[i].number = i + 1;

          // Flag the last section
          if (i == pageData.sections.length - 1){
            pageData.sections[i].lastItem = true;
          } else {
            pageData.sections[i].lastItem = false; 
          }

          // If there are subsections
          if(pageData.sections[i].sections){
            for(var j = 0; j < pageData.sections[i].sections.length; j++){
              // Number each subsection
              pageData.sections[i].sections[j].number2 = j + 1;
            }    
          }  
        }  

        // If 1st section has subsections, assume they all do and
        // set flag so we can display the check page correctly
        if(pageData.sections[0].sections){
          pageData.subsections = true;
        }  

      }


      // Get the service-level data for the page
      pageData.service = data.service;


      // Don't show the service name in the header at the top level
      if(sectionArray.length == 0){
        pageData.service.name = "";
      } else {
        pageData.service.name = data.name;
        pageData.service.section = sectionArray.join(".");
      }

      return callback(null, pageData);

  }

  // ROUTES ================================== //


	// Index page

  app.get('/', function (req, res) {

    console.log("index");
    res.render('index', services);
  });


  // Service index page

  app.get("/service/:service/", function (req, res, next) {
    var service = req.params.service;
    renderPage(service, "", "start", function(error, data){
      return res.render('transaction-pages/start-page', data);
    })
  });


  // Service pages

  app.get("/service/:service/:page-page", function (req, res, next) {
    var service = req.params.service;
    var page = req.params.page;
    renderPage(service, "", page, function(error, data){

      return res.render('transaction-pages/' + page + '-page', data);

    })
  });


  // Section pages

  app.get("/service/:service/:section/*-page", function (req, res, next) {
    var service = req.params.service;
    var sections = [req.params.section];

    var path = req.params[0].split("/");
    var page = path.pop();
    sections = sections.concat(path);

    console.log(page);
    console.log(sections);

    renderPage(service, sections, page, function(error, data){
      return res.render('transaction-pages/' + page + '-page', data);
    })

  });

  }
};
