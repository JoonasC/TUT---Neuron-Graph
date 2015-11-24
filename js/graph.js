//Copyright © TUT 2015
var lastElement = "";
var physics = "on";
function unsuppressClick()
{
	$(lastElement).children(".main").removeClass("suppress-click")
}
$(document).ready(function()
{
	$(".link-help").click(function()
	{
		$(this).parent().parent().parent().css("height", "");
		$(".link-help-text").fadeToggle();
	});
	$(".neuron-box").draggable({ containment: ".site-content", start: function(event, ui){ if(typeof $(this).children(".main").attr("style") == typeof undefined){ $(this).children(".main").addClass("suppress-click") } }, stop: function(event, ui){ if($(this).children(".main").hasClass("suppress-click")){ lastElement = $(this); setTimeout(unsuppressClick, 100); } } });
	$(".second").click(function()
	{
		if(typeof $(this).parent().parent().attr("hidden") == typeof undefined)
		{
			$(this).parent().parent().fadeOut(function()
			{
				$(this).parent().css("width", "10px");
				$(this).parent().css("height", "10px");
				$(this).parent().css("border", "none");
				$(this).parent().children(".main").fadeIn(function()
				{
					$(this).parent().children(".main").removeAttr("style");
				});
				$(this).attr("hidden", "true");
			});
		}
	});
	$(".main").click(function()
	{
		if(!$(this).hasClass("suppress-click"))
		{
			if(typeof $(this).parent().children().children().parent().attr("hidden") !== typeof undefined)
			{
				$(this).parent().css("width", "");
				$(this).parent().css("height", "");
				$(this).parent().css("border", "");
				$(this).parent().children(".main").css("display", "none");
				$(this).parent().children().children().parent().fadeIn(function()
				{
					$(this).removeAttr("hidden");
				});
			}
		}
	});
});
function gCreate()
{
	
}
function togglePhysics()
{
	if(physics == "on")
	{
		d3.selectAll(".neuron")
			.classed("fixed", function(d){ d.fixed = true });
		$(".checkbox-button").removeClass("checkbox-button-on");
		$(".checkbox-button").addClass("checkbox-button-off");
		$(".indicator").fadeOut(250, function()
		{
			$(".indicator").text("X");
			$(".indicator").fadeIn(250);
		});
		physics = "off";
	}
	else if(physics == "off")
	{
		d3.selectAll(".neuron")
			.classed("fixed", function(d){ d.fixed = false });
		$(".checkbox-button").removeClass("checkbox-button-off");
		$(".checkbox-button").addClass("checkbox-button-on");
		$(".indicator").fadeOut(250, function()
		{
			$(".indicator").text("\u2713");
			$(".indicator").fadeIn(250);
		});
		physics = "on";
	}
}
function gOpen()
{
	var fLocation = window.prompt("Please enter the name of the json file(make sure the file is in the same directory):");
	if(fLocation !== null)
	{
		$(".site-content").css("height", "500px");
		var width = $(".graph").width();
		var height = $(".graph").height();
		var color = d3.scale.category20();
		$(".start").css("display", "none");
		$(".neuron-graph").removeAttr("style");
		var force = d3.layout.force()
			.charge(-1550)
			.linkDistance(300)
			.size([width, height]);
		var svg = d3.select(".graph");
		d3.json(fLocation, function(error, graph)
		{
			if(error){ throw error; }
			force
				.nodes(graph.id)
				.links(graph.Links)
				.start();
			var link = svg.selectAll(".link")
				.data(graph.Links)
				.enter().append("line")
				.attr("class", "link")
				.style("stroke-width", 1);
			var neuron = svg.selectAll(".neuron")
				.data(graph.id)
				.enter().append("circle")
					.attr("class", "neuron")
					.attr("r", 10)
					.style("fill", color(1))
					.call(force.drag);
			neuron.append("title")
				.text(function(d){ return d.name; });
			force.on("tick", function()
			{
				link.attr("x1", function(d) { return d.source.x; })
					.attr("y1", function(d) { return d.source.y; })
					.attr("x2", function(d) { return d.target.x; })
					.attr("y2", function(d) { return d.target.y; });
				neuron.attr("cx", function(d) { return d.x; })
					.attr("cy", function(d) { return d.y; });
			});
		});
	}
}