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
	};
	loadWebview = function() {
		var visitListWin = plus.webview.create("replyList.html", "reply_list", {
			top: "50px",
			bottom: "0px",
			scrollIndicator: 'vertical'
		});
		if (visitListWin) {
			visitListWin.addEventListener("loaded", function() {
				$windowManager.current().append(visitListWin);
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