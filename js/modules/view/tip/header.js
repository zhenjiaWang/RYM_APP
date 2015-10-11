define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	loadWebview = function() {
		var tipListWin = plus.webview.create("tipList.html", "tip_list", {
			top: "50px",
			bottom: "0px",
			scrollIndicator: 'vertical'
		});
		if (tipListWin) {
			tipListWin.addEventListener("loaded", function() {
				$windowManager.current().append(tipListWin);
			}, false);
		}
	};
	plusReady = function() {
		loadWebview();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});