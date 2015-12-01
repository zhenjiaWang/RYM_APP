define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	bindEvent = function() {
		$common.touchSE($('#backBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.close();
		});
		$common.androidBack(function() {
			$windowManager.close();
		});
	};
	loadWebview = function() {
		var phoneListWin = plus.webview.create("phoneList.html", "friend_phoneList", {
			top: "50px",
			bottom: "0px",
			scrollIndicator: 'vertical'
		});
		if (phoneListWin) {
			phoneListWin.addEventListener("loaded", function() {
				$windowManager.current().append(phoneListWin);
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