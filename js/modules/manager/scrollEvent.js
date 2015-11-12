define(function(require, exports, module) {
	var $common = require('core/common');
	var topValue = 0;
	var current = false;
	var interval=null;
	exports.bindEvent = function(startEvent, endEvent) {
		$common.touchSME($('body'), false, function() {
			if (current != 'start') {
				current = 'start';
				topValue = $('body').scrollTop();
				if (typeof startEvent == 'function') {
					startEvent();
				}
			}
		}, function() {
			interval=window.setInterval(function() {
				topValue = $('body').scrollTop();
				if ($('body').scrollTop() == topValue) {
					if (current != 'stop') {
						current = 'stop';
						window.clearInterval(interval);
						if (typeof endEvent == 'function') {
							endEvent();
						}
					}
				}
			}, 500);
		});
		if (typeof endEvent == 'function') {
			endEvent();
		}
	};
});