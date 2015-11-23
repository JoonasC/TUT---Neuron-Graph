//Copyright © TUT 2015
var lastElement = "";
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
function gOpen()
{
	
}