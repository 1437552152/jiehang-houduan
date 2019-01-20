$(function(){

var swiper = new Swiper('.swiper-container', {
	pagination: '.swiper-pagination',
	paginationClickable: true,
	speed: 2000,
	loop: false,
	observer: true,
	observeParents: true,
	autoplayDisableOnInteraction: false,
	autoplay: 2000,
	effect: 'fade'
});
var swiper = new Swiper('.swiper-container1', {
	slidesPerView: 4,
	spaceBetween: 60,
	autoplayDisableOnInteraction: false,
	autoplay:5000,
	pagination: {
		el: '.swiper-pagination',
		clickable: true,
		
	},
});

  var swiper = new Swiper('.swiper-container2', {
    slidesPerView: 3,
      spaceBetween: 30,
      slidesPerGroup: 3,
      loop: true,
      loopFillGroupWithBlank: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
   });









})

