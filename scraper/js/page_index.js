jQuery(document).ready(function($) {
	//console.log('index_img?',$('.item-thumb .img','.handset-thumb img'));
	/* Testing Code */
	/*
	$('.item-thumb .colors .color[data-image!=""]').each(function(child,idx) {
	//console.log(idx,child,$(child).attr('data-image'),$(child).prop('data-image'));
		if ($(child).prop('data-image'))
			$(child).on('click',function(evt) {
				var target = evt.target;
				var thumb = $(target).attr('data-image');
				var mainThumb = $(target).parents('.section').find('.thumbnail .img');
				$(mainThumb[0]).attr('src',thumb);
			});
	});
	*/

	if (! bStoreMobilePhone) { /* Execute only in desktop mode */

	/* News Ticker for index page */

		/* get the height of longest item of LI */
		var max = Math.max.apply(Math, $("#msgTicker ul li").map(
	        function(){
	          return $(this).innerHeight();
	        }
	    ));

	   

	    //$("#msgTicker").hide();


	    //$("#msgTickerWrapper").height('auto');
    	$("#msgTicker ul li").height(max);

        

        $('#msgTicker ul').newsTicker({
        	row_height: max,
        	max_rows: 1,
        	duration: 4000
        });

        //$("#msgTicker").show();

        $("#msgTickerWrapper").height('auto');

        
	
	}
	
	/* Color Swatch Effect */
	//Del by San 2016-01-28


	
	

	/*$('#msgTicker').vTicker({ 
		speed: 500,
		pause: 3000,
		animation: 'fade',
		mousePause: true,
		showItems: 1,
		padding: 6
	});*/
	
	$('.color-choice').matchHeight();
	
	
	$('.has-st-promo-tile .tile-inner').matchHeight();
	
	
	/* Rolling Msg */
	
	try {
	var iCurMsg = 0;
	var aryMsg = new Array(
		"Check out the Best Valued Combo (save up to 40%)",
		"Get HK$100 off on your 1<sup>st</sup> purchase over HK$500",
		"Free delivery on order over HK$150"
	);
	setInterval(
		function() {
			$('.sf-msg-roller p').slideToggle(500, function() {
				iCurMsg = (iCurMsg+1) % aryMsg.length;
				$('.sf-msg-roller p').html(aryMsg[iCurMsg]);
				$('.sf-msg-roller p').slideToggle(250);
			});
		},
		5000
	);
	} catch (err) {
	//console.log('rolling_err:',err);
	}
});