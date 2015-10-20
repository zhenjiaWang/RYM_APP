define(function(require, exports, module) {
	var $common = require('core/common');
	var topValue = 0;
	var current = false;
	exports.bindEvent = function(startEvent, endEvent) {
		$common.touchSME($('body'), false, function() {
			if (current != 'start') {
				current = 'start';
				if (typeof startEvent == 'function') {
					startEvent();
				}
			}
		}, false);
		if (typeof endEvent == 'function') {
			endEvent();
		}
		window.setInterval(function() {
			if ($('body').scrollTop() == topValue) {
				if (current != 'stop') {
					current = 'stop';
					window.setTimeout(function() {
						if (typeof endEvent == 'function') {
							endEvent();
						}
					}, 1000);
				}
			}
		}, 800);
	};
});