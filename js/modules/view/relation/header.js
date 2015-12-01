define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	bindEvent = function() {
		
	};
	loadWebview = function() {
		var plannerListWin = plus.webview.create("../relation/planner.html", "relation_planner", {
			top: "50px",
			bottom: "0px",
			scrollIndicator: 'vertical'
		});
		if (plannerListWin) {
			plannerListWin.addEventListener("loaded", function() {
				$windowManager.current().append(plannerListWin);
			}, false);
		}
	}
	plusReady = function() {
		loadWebview();
		bindEvent();
		$common.touchSE($('#backBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.close();
		});
		$common.androidBack(function() {
			$windowManager.close();
		});
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});