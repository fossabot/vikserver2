"use-strict";
$("#index-menu-btn").on("click", event=>{
	$("#float-parent").toggle();
	$("#index-menu").toggle("drop", 200);
});
$("#float-parent").on("click", function(){
	$(this).children().hide("drop", 200);
	$(this).hide(200);
});
