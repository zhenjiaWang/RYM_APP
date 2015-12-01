define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var queryMap = parseURL();
	var userId = queryMap.get('userId');
	var userName = queryMap.get('userName');
	bindEvent = function() {
		$common.touchSE($('#backBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.close();
		});
		$common.androidBack(function() {
			$windowManager.close();
		});
	};
	loadWebview = function() {
		var friendListWin = plus.webview.create("friendFollowList.html?userId="+userId, "friendFollow_list", {
			top: "50px",
			bottom: "0px",
			scrollIndicator: 'vertical'
		});
		if (friendListWin) {
			friendListWin.addEventListener("loaded", function() {
				$windowManager.current().append(friendListWin);
			}, false);
		}
	}
	plusReady = function() {
		loadWebview();
		bindEvent();
		$('h1').text(userName+'的同业好友');
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});