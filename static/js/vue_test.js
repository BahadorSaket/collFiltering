(function () {
    comp = {};
    comp.dataPredicStore = {};
    comp.dataDeltaStore = {};
    /*
     * initialize the web page
     */

    comp.loadData = function () {
        new Vue({
            el: '#app'
            , data: {
                message: 'D3 test Inside Vue Component'
                , todos: [{
                    text: 'Learn JavaScript'
                }, {
                    text: 'Learn Vue'
                }, {
                    text: 'Build something awesome'
                }]
                , dataField: []
            , }
            , created: function () {
                // `this` points to the vm instance
                console.log('created is: ', this.todos)
            }
            , mounted: function () {
                this.getData();
            },

            methods : {
                getData: function() {
                  $("#Vis").height((9.5/10)*$(window ).height()).width($( window ).width());

                  // gets the list of data points from the server
                  $.post("/predictionRatingHistogram", {
                    fileName: JSON.stringify(),
                    index : JSON.stringify()
                  }).done(function(data) {
                     comp.dataPredicStore = JSON.parse(data.predictData); // get the data fro the first chart
                     comp.dataDeltaStore = JSON.parse(data.deltaData); // get the data for the second chart
                     comp.createVue();
                  });
                },
            }
        })
    }

    comp.createVue = function () {

        new Vue({
            el: '#app'
            , data: {
                message: 'D3 test Inside Vue Component'
                , todos: [{
                    text: 'Learn JavaScript'
                }, {
                    text: 'Learn Vue'
                }, {
                    text: 'Build something awesome'
                }]
                , dataField: []
            , }
            , created: function () {
                // `this` points to the vm instance
                console.log('created is: ', this.todos)
            }
            , mounted: function () {
                this.loadVis();
            },

            methods : {

                // creates a div for each model
                loadVis: function() { 
                   for(var i=0;i<(comp.dataPredicStore).length;i++)
                   {
                      $('<div/>', {
                        class:"models models_"+i,
                        id:""+i,
                        width: 350,
                        height: ($("#Vis").height()*9.9/10),
                      }).appendTo(this.$el);

                      $('<div/>', {
                        class:"modelHeader",
                        html: "Model "+ (i+1),
                        height: 30,
                      }).appendTo('.models_'+i);

                      this.createHistogramPrediction(i); // creates the vis on the top

                      this.createHistogramDelta(i); // creates the vis at the bottom
                   }
                },

                visualizeHistogram: function(values, modelID, text, idAppen){
                  var formatCount = d3.format(",.0f");

                  margin = {top: 40, right: 20, bottom: 50, left: 15};
                  var width = 350 - margin.right - margin.left,
                      height = 230- margin.right - margin.left

                  var svg = d3.select(".models_"+modelID).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

                  var tip = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function(d) {
                     return "<strong>Frequency:</strong> <span style='color:red'>" + d.y + "</span>";
                  })

                  svg.call(tip);

                  var x0 = Math.max(-d3.min(values), d3.max(values));

                  var x = d3.scale.linear()
                    .domain([-x0, x0])
                    .range([0, width])
                    .nice();

                  // Generate a histogram using twenty uniformly-spaced bins.
                  var data = d3.layout.histogram()
                    .bins(x.ticks(20))
                    (values);

                  var y = d3.scale.linear()
                    .domain([0, d3.max(data, function(d) { return d.y; })])
                    .range([height, 0]);

                  var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");


                  var bar = svg.selectAll(".bar")
                    .data(data)
                    .enter().append("g")
                    .attr("class", "bar")
                    .attr("id",function(d){return "bar_"+idAppen+"_"+d.x;})
                    .attr("transform", function(d) {return "translate(" + x(d.x) + "," + y(d.y) + ")"; })
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide)
                    .on("click", function(){
                      id = $(this).attr("id");
                      console.log(id);
                      d3.selectAll(".bar").style("fill","steelblue")
                      d3.selectAll("#"+id).style("fill","orangered")
                      tip.show;
                    })

                  bar.append("rect")
                    .attr("x", 1)
                    .attr("width", x(data[0].x  + data[0].dx) - 1)
                    .attr("height", function(d) { return height - y(d.y); });

                  svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .append("text")
                    .attr("x", 0)
                    .attr("y",40)
                    .text(text);
                },

                createHistogramPrediction: function(modelID){            
                    var values = comp.dataPredicStore[modelID]
                    this.visualizeHistogram(values, modelID,"Frequency of items per predicted rating","pred");
                },

                createHistogramDelta: function(modelID){
                   var values = comp.dataDeltaStore[modelID]
                   this.visualizeHistogram(values, modelID,"Frequency of items for (actual rating - predicted rating)","delta");
                }
            }

        })
        console.log("creating vue app ", app)
    }

})();