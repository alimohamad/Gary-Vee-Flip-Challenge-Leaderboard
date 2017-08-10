jQuery(document).ready(function($){
	
	console.log("js is twerking");

 
	$(".site-header__menu-icon").on("click", function(){
		console.log("menu button clicked"); 
		$(".body__main").toggleClass("body__main--active");
		$(".body__side-menu").toggleClass("body__side-menu--active");
	}); 


});