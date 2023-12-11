// $( document ).ready(function() {
// 	//search bar	
// 	$('header').find('.search-btn').click(function(){
// 		console.log($('header').find('.search-input').hasClass('show'));
// 		if($('header').find('.search-input').hasClass('show')){
// 			$('header').find('.search-input').removeClass('show');
// 			$('header').find('.search-btn').css('marginRight','0px');
// 		}else{
// 			$('header').find('.search-input').addClass('show');
// 			$('header').find('.search-btn').css('marginRight','-50px');
// 		}
// 	});
// });
 
jQuery.fn.searchExpand = function() {
	this.each(function(){
		$t = jQuery(this);
		$searchBarCon = $t.find('.search-input-container');
		$searchBar = $t.find('.search-input');
		$searchBtn = $t.find('.search-btn');
		$searchO = $t.find('.search-o');
		$searchC = $t.find('.search-c');
		//$searchBar.css('display','none');
		//$searchBar.css('width','0px');
		// $searchBtn.css('marginRight','-50px');
		$t.find('.search-btn').click(function(){
			if($searchBtn.hasClass('ani')){
				// console.log('stop');
				return;
			}else{
				// console.log('go');
				if($searchBar.hasClass('show')){
					$searchBtn.addClass('ani');
					$searchBar.animate({
					    width: '0px'
					  }, 500, function() {
						$searchO.removeClass('hidden');
						$searchC.addClass('hidden');
						$searchBarCon.css('display','none');
						jQuery('#st_lv1_nav_fixed').animate({
						    marginLeft: '0%',
					    	opacity: '1'
						  }, 100, function() {
						  	  jQuery('#live-chat-container').css('display','block');
						  	  jQuery('#account-btn').css('display','block');
						  	  jQuery('#language-btn-container').css('display','block');

							  jQuery('#live-chat-container').animate({
							    opacity: '1'
							  }, 100);
							  jQuery('#account-btn').animate({
							    opacity: '1'
							  }, 100);
							  jQuery('#language-btn-container').animate({
							    opacity: '1'
							  }, 100);
							$searchBtn.removeClass('ani');
						});
					});
					$searchBar.removeClass('show');
				}else{
					$searchBtn.addClass('ani');
					jQuery('#live-chat-container').animate({
					    opacity: '0'
					  }, 100, function() {
					  	jQuery(this).css('display','none');
					});
					jQuery('#account-btn').animate({
					    opacity: '0'
					  }, 100, function() {
					  	jQuery(this).css('display','none');
					});
					jQuery('#language-btn-container').animate({
					    opacity: '0'
					  }, 100, function() {
					  	jQuery(this).css('display','none');
					});
					$searchO.addClass('hidden');
					$searchC.removeClass('hidden');
					$searchBarCon.css('display','block');
					jQuery('#st_lv1_nav_fixed').animate({
					    marginLeft: '-100%',
					    opacity: '0'
					  }, 100, function() {
					});
					// jQuery('#dsfnav').animate({
					//     marginLeft: '-100%',
					//     opacity: '0'
					//   }, 100, function() {
					// });
					$searchBar.animate({
					    width: '40vw'
					  }, 500, function() {
						$searchBtn.removeClass('ani');
					});
					$searchBar.addClass('show');
				}
			}
		});
	})
};

var highest = {};
var num = {};
jQuery.fn.synHeight = function() {
	$t = this;
	// console.log('synHeight');
	jQuery('*[data-synname="'+$t.data('synname')+'"]').each(function(index){
		if(jQuery(this).hasClass('syn-ref')){}else{
			jQuery(this).height(jQuery('.syn-ref*[data-synname="'+$t.data('synname')+'"]').height());
		}
	});
	resizeF($t.data('synname'));
};
function resizeF(synname){
	jQuery(window).resize(function(){
		jQuery('*[data-synname="'+synname+'"]').each(function(index){
			if(jQuery(this).hasClass('syn-ref')){}else{
				jQuery(this).height(jQuery('.syn-ref*[data-synname="'+synname+'"]').height());
			}
		});
	});
}