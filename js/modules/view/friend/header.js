define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	bindEvent = function() {
		$common.touchSE($('#plusBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.create('friend_addNew', 'addNew.html', false, true, function(show) {
				show();
			});
		});
	};
	loadWebview = function() {
		var friendListWin = plus.webview.create("list.html", "friend_list", {
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
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});