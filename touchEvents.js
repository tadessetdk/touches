//Written by Tadesse D. Feyissa. July 29, 2013.

//-provides events for touch-screen devices including swipe, longTap, and doubleTap
//-requires jQuery 1.4 or later

$(function(){

	var jBind = jQuery.prototype.bind;

	jQuery.prototype.bind = function(){
		
		switch(arguments[0]){
			
			case 'swipe':

				jBind.call(this, 'touchstart', swipeStart);
				jBind.call(this, 'touchend', swipeEnd);
				break;
				
			case 'longTap':
			
				jBind.call(this, 'touchstart',  setLongTap);
				jBind.call(this, 'touchend', clearLongTap);
				break;
			
			case 'doubleTap':
				
				jBind.call(this, 'touchstart',  doubleTap);
				break;
		}
		
		jBind.apply(this, arguments);
		
		return this;
	};
	
	var jUnbind = jQuery.prototype.unbind;

	jQuery.prototype.unbind = function(){
		
		switch(arguments[0]){
			
			case 'swipe':

				jUnbind.call(this, 'touchstart', swipeStart);
				jUnbind.call(this, 'touchend', swipeEnd);
				break;
				
			case 'longTap':
			
				jUnbind.call(this, 'touchstart',  setLongTap);
				jUnbind.call(this, 'touchend', clearLongTap);
				break;
			
			case 'doubleTap':
				
				jUnbind.call(this, 'touchstart',  doubleTap);
				break;
		}
		
		jUnbind.apply(this, arguments);
		
		return this;
	};
	
	function swipeStart(e){
	
		e.preventDefault();
		var et = e.originalEvent || e;
		$(this).data('startpos', et.changedTouches[0].pageX);
		
	}
	
	function swipeEnd(e){
		
		e.preventDefault();
		var et = e.originalEvent || e;
		var dist = et.changedTouches[0].pageX - $(this).data('startpos');
		
		if(Math.abs(dist) > (0.1 * $(this).width())){
			
			$(this).trigger({
				type: "swipe",
				toRight: dist > 0
			});
			
			console.log('swipe fired: ' + new Date().valueOf());
		
		}
	
	}

	function setLongTap(e){
		
		e.preventDefault();
		var el = $(e.target);
		var id = el.attr('id');
		el.data('long-tap-started', 1);
		var pos = (e.originalEvent || e).changedTouches[0];
		
		var th = window.setTimeout(function(){
			
			var el1 = $('#' + id);
			
			if(el1.data('long-tap-started')){
				
				el.trigger({
					type: "longTap",
					position: pos
				});
				
				console.log('long-tap fired: ' + new Date().valueOf());
				
			}
			
			el1.data('long-tap-started', 0);
			
		}, 500);
		
		el.data('long-tap-th', th);
	}

	function clearLongTap(e){

		e.preventDefault();
		var el = $(e.target);
		var th = el.data('long-tap-th');
		
		if(th){
		
			window.clearTimeout(th);
		
		}
		
		el.data('long-tap-started', 0); 

	}

	function doubleTap(e){

		e.preventDefault();
		var el = $(e.target);
		var curTime = new Date().valueOf();
		var prevTime = el.data('double-tap') || curTime;
		var diff = curTime - prevTime;
		
		if(diff > 0 && diff < 500) {
		
			el.data('double-tap', 0);
			el.trigger({
				type: "doubleTap",
				position: (e.originalEvent || e).changedTouches[0]
			});
			
			console.log('double-tap fired: ' + curTime);
			
		}
		else{
		
			el.data('double-tap', curTime);
		
		}

	}

});