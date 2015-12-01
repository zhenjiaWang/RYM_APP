define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	bindEvent = function() {
		$common.androidBack(function() {
			$windowManager.close();
		});
		$common.touchSE($('#backBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.close();
		});
	};
	loadWebview = function() {
		var addNewWin = plus.webview.create("addNew.html", "customer_addNew", {
			top: "50px",
			bottom: "0px",
			scrollIndicator: 'vertical'
		});
		if (addNewWin) {
			addNewWin.addEventListener("loaded", function() {
				$windowManager.current().append(addNewWin);
			}, false);
		}
	}
	plusReady = function() {
		loadWebview();
		bindEvent();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});