//Written by Tadesse D. Feyissa. July 29, 2013.

//-provides touch-screen events including swipe, swipeLeft, swipeRight, swipeUp, swipeDown, longTap, singleTap and doubleTap 
//-requires jQuery 1.4 or later

$(function(){

	var SWIPE = 'swipe', SWIPE_LEFT = 'swipeleft', SWIPE_RIGHT = 'swiperight', SWIPE_UP = 'swipeup', SWIPE_DOWN = 'swipedown';
	var	SINGLE_TAP = 'singletap', DOUBLE_TAP = 'doubletap', LONG_TAP = 'longtap';
		
	var jBind = jQuery.prototype.bind;
	var jUnbind = jQuery.prototype.unbind;
	
	var jOn = jQuery.prototype.on;
	var jOff = jQuery.prototype.off;

	jQuery.prototype.bind = function(){
		
		var obj = this;
		bindTouchEvents({ obj: obj, args: arguments });
		jBind.apply(this, arguments);
		
		return this;
		
	};
	
	jQuery.prototype.unbind = function(){
		
		var obj = this;
		bindTouchEvents({ obj: obj, args: arguments, detach: true });
		jUnbind.apply(this, arguments);
		
		return this;
		
	};
	
	/*jQuery.prototype.on = function(){
		
		var obj = this;
		bindTouchEvents({ obj: obj, args: arguments, onType: true });
		jOn.apply(this, arguments);
		
		return this;
		
	};
	
	jQuery.prototype.off = function(){
		
		var obj = this;
		bindTouchEvents({ obj: obj, args: arguments, onType: true, detach: true });
		jOff.apply(this, arguments);
		
		return this;
		
	};*/
	
	function bindTouchEvents(props){
	
		var obj = props.obj;
		var arguments = props.args;
		var onType = props.onType;
		var detach = props.detach;
		
		var fn = onType ? ( detach ? jOff : jOn ) : ( detach ? jUnbind : jBind );
		
		var touchEvents = getTouchEvents(arguments[0]);
		
		for(var i = touchEvents.length - 1; i >= 0 ; i--){
			
			var tEvent = touchEvents[i];
			
			switch(tEvent){
				
				case SWIPE:
				case SWIPE_LEFT:
				case SWIPE_RIGHT:
				case SWIPE_UP:
				case SWIPE_DOWN:
					
					fn.call(obj, 'touchstart', swipeStart);
					fn.call(obj, 'touchend', swipeEnd);
					break;
					
				case LONG_TAP:
				
					fn.call(obj, 'touchstart',  setLongTap);
					fn.call(obj, 'touchend touchmove', clearLongTap);
					break;
				
				case SINGLE_TAP:
				
					fn.call(obj, 'touchstart',  singleTap);
					break;
					
				case DOUBLE_TAP:
					
					fn.call(obj, 'touchstart',  doubleTap);
					break;
			}
			
		}
		
	}
	
	var Touch_Events = [SWIPE, SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN, SINGLE_TAP, DOUBLE_TAP, LONG_TAP];
	
	function getTouchEvents(tEvents){
		
		if(!tEvents) return [];
		
		var evts = tEvents.toLowerCase().split(' ');
		
		var result = {};
		
		for(var i = evts.length - 1 ; i >= 0 ; i--){
			
			var evt = evts[i].replace(/\s+/g, '');
			
			if(Touch_Events.indexOf(evt) != -1){
			
				result[evt] = 1;
			
			}
		
		}
		
		var distinctEvents = [];
		
		for(var e in result){
			
			distinctEvents.push(e);
		
		}
		
		return distinctEvents;
		
	}
	
	function swipeStart(e){
	
		e.preventDefault();
		
		var et = e.originalEvent || e;
		var el = $(e.target);
		var startPos = et.changedTouches[0];
		el.data('startpos', { x: startPos.pageX, y: startPos.pageY });
		
	}
	
	function swipeEnd(e){
		
		e.preventDefault();
		
		var et = e.originalEvent || e;
		var el = $(e.target);
		var startPos = el.data('startpos');
		
		if(!startPos) return;
		
		var endPos = et.changedTouches[0];
		var distx = endPos.pageX - startPos.x;
		
		var xSwipe = Math.abs(distx) > (0.1 * el.width());
		
		if(xSwipe){
			
			if(distx > 0){
			
				el.trigger({type: SWIPE_RIGHT});
				console.log('swiperight event fired: ' + new Date().valueOf());
				
			}
			else{
			
				el.trigger({type: SWIPE_LEFT});
				console.log('swipeleft event fired: ' + new Date().valueOf());
			
			}
		
		}
		
		var disty = endPos.pageY - startPos.y;
		var ySwipe = Math.abs(disty) > (0.1 * el.height());
		
		if(ySwipe){
			
			if(disty > 0){
				
				el.trigger({ type: SWIPE_DOWN });
				console.log('swipedown event fired: ' + new Date().valueOf());
				
			}
			else{
				
				el.trigger({ type: SWIPE_UP });
				console.log('swipeup event fired: ' + new Date().valueOf());
				
			}
		
		}
		
		if(xSwipe || ySwipe){
		
			el.trigger({ type: SWIPE });
			console.log('swipe event fired: ' + new Date().valueOf());
				
		}
		
		el.removeData('startpos');
	
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
				
				console.log('long-tap event fired: ' + new Date().valueOf());
				
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

	function singleTap(e){

		e.preventDefault();
		
		$(e.target).trigger({
			type: "singleTap",
			position: (e.originalEvent || e).changedTouches[0]
		});
		
		console.log('single-tap event fired: ' + new Date().valueOf());
		
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
			
			console.log('double-tap event fired: ' + curTime);
			
		}
		else{
		
			el.data('double-tap', curTime);
		
		}

	}

});