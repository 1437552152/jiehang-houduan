			$(document).ready(function(){				
				var textHeight=$('.top').offset().top;				
				$(window).scroll(function(){
					var winHeight=$(this).scrollTop()
					if(winHeight>textHeight){
						$('.top').addClass('xg')
					}else{
						$('.top').removeClass("xg")
					}
				})
				
			})