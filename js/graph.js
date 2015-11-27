//Copyright © TUT 2015
var currNumber = 0;
var currNumber2 = 0;
var firstTime = true;
var firstTime2 = true;
var gScale = 0.1;
var gTranslate = "390, 195";
var lastClass = null;
function zoomSlider(scale)
{
	//Slider zoom function.
	var zoomElement = d3.select(".graph");
	var zoomContainer = d3.select(".graph").select("g").select("g");
	zoomContainer.attr("transform", "translate(" + gTranslate + ")scale(" + scale + ")");
	gScale = scale;
}
function neuronClick(id)
{
	//Function to highlight links, when neuron is clicked.
	if(id == lastClass && lastClass !== null)
	{
		$("line").removeAttr("style");
		lastClass = null;
	}
	else
	{
		$("line").removeAttr("style");
		$(".conn" + id).css("stroke", "#FF8000");
		lastClass = id;
	}
}
$(document).ready(function()
{
	//Creating the zoom slider using jQuery.
	$(".slider").slider({ orientation: "horizontal", range: "min", min: 100, max: 10000, value: 100, width: 100, slide: function(event, ui){ zoomSlider(ui.value/1000); } });
});
function gOpen()
{
	//Asking user for name of json file.
	var fLocation = window.prompt("Please enter the name of the json file(make sure the file is in the graphs folder):");
	if(fLocation !== null)
	{
		$(".site-content").css("height", "800px");
		var color = d3.scale.category20();
		$(".start").css("display", "none");
		$(".neuron-graph").removeAttr("style");
		var svg = d3.select(".graph");
		function panGraph()
		{
			//Graph panning function.
			gTranslate = d3.event.translate;
			d3.select(".graph").select("g").select("g").attr("transform", "translate(" + d3.event.translate + ")scale(" + gScale + ")");
		}
		var zoom = d3.behavior.zoom()
				.translate([390, 195])
				.on("zoom", panGraph);
		//Opening the json file.
		d3.json("graphs/" + fLocation, function(error, graph)
		{
			if(error){ alert(error); throw error; }
			//Drawing an insvisible rectangle for the panning to work properly.
			svg.append("g")
				.call(zoom)
				.append("rect")
				.attr("width", $(".graph").width())
				.attr("height", $(".graph").height())
				.style("fill", "none")
				.style("pointer-events", "all");
			//Setting the default pan start position for g element.
			svg.select("g")
				.append("g")
				.attr("transform", "translate(" + gTranslate + ")scale(0.1)");
			var svgContainer = d3.select(".graph").select("g").select("g");
			//Drawing links.
			var link = svgContainer.selectAll(".link")
				.data(graph.Links)
				.enter().append("line")
					.attr("id", "link")
					.attr("class", function(d){ return "conn" + d.source + " conn" + d.target; });
			//Drawing neurons.
			var neuron = svgContainer.selectAll(".neuron")
				.data(graph.id)
				.enter().append("circle")
					.attr("id", "neuron")
					.attr("r", 10)
					.style("fill", function(d){ return color(d.Group); })
					.attr("cx", function(d){ return d.x; })
					.attr("cy", function(d){ return d.y; })
					.attr("id", function(d){ if(firstTime == true){ firstTime = false; return currNumber; }else if(firstTime == false){ currNumber += 1; return currNumber; } })//Setting neuron id.
					.attr("onclick", function(d){ if(firstTime2 == true){ firstTime2 = false; return "neuronClick(id=" + currNumber2 + ");"; }else if(firstTime2 == false){ currNumber2 += 1; return "neuronClick(id=" + currNumber2 + ");"; } });//Setting id for highlight function.
			//Setting link start and end positions.
			link.attr("x1", function(d) { return $("#" + d.source).attr("cx"); })
				.attr("x2", function(d) { return $("#" + d.target).attr("cx"); })
				.attr("y1", function(d) { return $("#" + d.source).attr("cy"); })
				.attr("y2", function(d) { return $("#" + d.target).attr("cy"); });
			//Setting titles that will show neuron name.
			neuron.append("title")
				.text(function(d){ return d.name; });
			//Setting titles that will show link connections.
			link.append("title")
				.text(function(d){ return d.value + " connection(s)"; });
		});
	}
}