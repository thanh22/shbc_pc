$(function(){
	$(window).on('load resize',function(){
		var setHeight = $(window).height() - ($('#siteHeader').height() + $('.breadcrumbs').height() + $('#pageBody > header').height() + $('#siteFooter').height()+40);
		$('div.careerSheet,div.person').css('height',setHeight)
	});
});