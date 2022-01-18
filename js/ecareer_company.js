$(function(){
	/* fix nav
	================================================================ */
	$(window).on('load resize orientationchange',function(){
		var wh = $(window).height();
		var ww = $(window).width();
		var docH = $(document).height();
		var btmH = $('#siteFooter').outerHeight();
		var asideH = $('#siteAside').outerHeight();
		if((ww < 1250)||(wh < asideH + 50)){
			$('body').removeClass('allowFix');
		}else{
			$('body').addClass('allowFix');
		}
	});
	$(window).on('scroll', function(){
		var fixPos = $('#siteHeader').height() + $('#siteAside header').outerHeight();
		var scrlH = $(window).scrollTop();
		var wh = $(window).height();
		var docH = $(document).height();
		var btmH = $('#siteFooter').outerHeight();
		var asideH = $('#siteAside').outerHeight();
		if($('body').hasClass('allowFix')){
			if(scrlH > fixPos){
				$('#siteAside nav').addClass('fixed');
			}else{
				$('#siteAside nav').removeClass('fixed');				
			}
			if(scrlH + wh > docH -btmH){
				$('#siteFooter .pgTop').addClass('stop');
			}else{
				$('#siteFooter .pgTop').removeClass('stop');
			}
		};
	});
		
	/* activate nav
	================================================================ */
	var actvNav = $('body').attr('data-active-nav');
	var currNav = $('body').attr('data-current-nav');
	$('#siteAside nav li').each(function(){
		if($(this).attr('data-nav-index')==actvNav){
			$(this).addClass('active');
			$(this).find('ul').show();
		}
		if($(this).attr('data-nav-index')==currNav){
			$(this).children('a').addClass('active');
		}
	});
	// applicant notice
	if($('body').attr('data-applicant-notice') == 'true'){
		$('#siteAside li.applicant > a').append('<i>!</i>')
	}
	
	/* scroll smoosing
	================================================================ */	
	var offsetY = -20;
	var time = 500;
	$('a[href^="#"]').click(function() {
		var target = $(this.hash);
		if(!target.length) return ;
		var targetY = target.offset().top+offsetY;
		$('html,body').animate({scrollTop: targetY}, time, 'swing');
		window.history.pushState(null, null, this.hash);
		return false;
	});

	/* form > button linkage
	================================================================ */
	$(document).on('change','input.rel',function(){
		if($(this).hasClass('on')){
			$('.relTo').removeClass('disabled');
		}else{
			$('.relTo').addClass('disabled');
		}
	});
	/* form > required if checked 
	================================================================ */
	$('input.conditionIf').each(function(){
		$(this).on('click',function(){
			var num = $(this).attr('data-rel');
			var tgt = $('.requiredIf[data-rel-to='+ num +']');
			if($(this).is(':checked')){
				$(tgt).addClass('required');
			}else{
				$(tgt).removeClass('required');				
			}
		});
	});
	/* form > required if checked
	================================================================ */
	$('input.conditionIfAny').each(function(){
		$(this).on('click',function(){
			var num = $(this).attr('data-rel');
			var tgt = $('.requiredIfAny[data-rel-to='+ num +']');

			var anyChecked = false;
			$('input.conditionIfAny').each(function(){
                if ($(this).is(':checked')) {
                    anyChecked = true;
                }
            });

			if(anyChecked){
				$(tgt).addClass('required');
			}else{
				$(tgt).removeClass('required');
			}
		});
	});
	/* custom radio
	================================================================ */
	$(window).load(function(){
		$('label.radio').each(function(){
			$(this).find('input').is(':checked')?$(this).addClass('checked'):null;
			$(this).find('input').is(':disabled')?$(this).addClass('disabled'):null;
		});
	});
	$('label.radio input').change(function(){
		$('label.radio input[type=radio][name=' + $(this).attr('name').replace(/[ !"#$%&'()*+,.\/:;<=>?@\[\\\]^`{|}~]/g, '\\$&') + ']').closest('label').removeClass('checked');
		$(this).is(':checked')==true?$(this).closest('label').addClass('checked'):$(this).closest('label').removeClass('checked');
	});
	/* form > active if checked 
		================================================================ */
	$('label.activateIf').each(function(){
		$(this).on('click',function(){
			var num = parseInt($(this).attr('data-rel'));
			var tgt = $('.activeIf[data-rel-to='+ num +']');
			if($(this).hasClass('trig')){	
				$(tgt).attr('disabled',false);
			}else{
				$(tgt).attr('disabled',true);
			}
		});
	});
	$('label.activateIf').each(function(){
		$(this).on('click',function(){
			var num2 = parseInt($(this).attr('data-rel2'));
			var tgt2 = $('.activeIf[data-rel2-to='+ num2 +']');
			if($(this).hasClass('trig2')){	
				$(tgt2).attr('disabled',false);
			}else{
				$(tgt2).attr('disabled',true);
			}
		});
	});
	/* form > text count
	================================================================ */
	$('.countElm').each(function(){
		$(this).on('keydown keyup keypress change focus blur',function(){
			var len = $(this).val().replace(/\n/g, "改行").length;
			$(this).closest('.count').find('.counter').html(len);
		 });
	});
	$('.countElm').each(function(){
			var len = $(this).val().replace(/\n/g, "改行").length;
			$(this).closest('.count').find('.counter').html(len);
	});
	
	/* form > select all
	================================================================ */
	$('.selectAll').on('change', function(){
		if($(this).is(':checked')){
			$('input.rel').prop('checked',true);
		}else{
			$('input.rel').prop('checked',false);		
		}
	});
	/* form > insert to caret position
	================================================================ */
	$.fn.extend({
		insertAtCaret: function(v) {
			var o = this.get(0);
			//o.focus();
			if(navigator.userAgent.match(/MSIE/)) {
				var r = document.selection.createRange();
				r.text = str;
				r.select();
			}else{
				var s = o.value;
				var p = o.selectionStart;
				var np = p + v.length;
				o.value = s.substr(0, p) + v + s.substr(p);
				o.setSelectionRange(np, np);
			}
		}
	});	
	$('.insert').on('click',function(){
		var text = $(this).attr('data-text')
		$(this).closest('.insertWrap').find('.target').insertAtCaret(text);
		$(this).closest('.insertWrap').find('.target').blur().focus();
		return false;
	});
});

