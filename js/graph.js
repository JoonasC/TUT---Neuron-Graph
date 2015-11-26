//Copyright © TUT 2015
var currNumber = 0;
var currNumber2 = 0;
var firstTime = true;
var firstTime2 = true;
var gScale = 0.1;
var gTranslate = "390, 195";
function zoomSlider(scale)
{
	var zoomElement = d3.select(".graph");
	var zoomContainer = d3.select(".graph").select("g").select("g");
	zoomContainer.attr("transform", "translate(" + gTranslate + ")scale(" + scale + ")");
	gScale = scale;
}
function neuronClick(id)
{
	alert("You clicked neuron number: " + id);
}
$(document).ready(function()
{
	$(".slider").slider({ orientation: "horizontal", range: "min", min: 100, max: 10000, value: 100, width: 100, slide: function(event, ui){ zoomSlider(ui.value/1000); } });
});
function gOpen()
{
	var fLocation = window.prompt("Please enter the name of the json file(make sure the file is in the same directory):");
	if(fLocation !== null)
	{
		$(".site-content").css("height", "800px");
		var color = d3.scale.category20();
		$(".start").css("display", "none");
		$(".neuron-graph").removeAttr("style");
		var svg = d3.select(".graph");
		function panGraph()
		{
			gTranslate = d3.event.translate;
			d3.select(".graph").select("g").select("g").attr("transform", "translate(" + d3.event.translate + ")scale(" + gScale + ")");
		}
		var zoom = d3.behavior.zoom()
				.translate([390, 195])
				.on("zoom", panGraph);
		d3.json(fLocation, function(error, graph)
		{
			if(error){ alert(error); throw error; }
			svg.append("g")
				.call(zoom)
				.append("rect")
				.attr("width", $(".graph").width())
				.attr("height", $(".graph").height())
				.style("fill", "none")
				.style("pointer-events", "all");
			svg.select("g")
				.append("g")
				.attr("transform", "translate(" + gTranslate + ")scale(0.1)");
			var svgContainer = d3.select(".graph").select("g").select("g");
			var link = svgContainer.selectAll(".link")
				.data(graph.Links)
				.enter().append("line")
					.attr("class", "link")
					.style("stroke-width", 1);
			var neuron = svgContainer.selectAll(".neuron")
				.data(graph.id)
				.enter().append("circle")
					.attr("class", "neuron")
					.attr("r", 10)
					.style("fill", function(d){ return color(d.Group); })
					.attr("cx", function(d){ return d.x; })
					.attr("cy", function(d){ return d.y; })
					.attr("id", function(d){ if(firstTime == true){ firstTime = false; return currNumber; }else if(firstTime == false){ currNumber += 1; return currNumber; } })
					.attr("onclick", function(d){ if(firstTime2 == true){ firstTime2 = false; return "neuronClick(id=" + currNumber2 + ");"; }else if(firstTime2 == false){ currNumber2 += 1; return "neuronClick(id=" + currNumber2 + ");"; } });
			link.attr("x1", function(d) { return $("#" + d.source).attr("cx"); })
				.attr("x2", function(d) { return $("#" + d.target).attr("cx"); })
				.attr("y1", function(d) { return $("#" + d.source).attr("cy"); })
				.attr("y2", function(d) { return $("#" + d.target).attr("cy"); });
			neuron.append("title")
				.text(function(d){ return d.name; });
		});
	}
}