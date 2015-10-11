define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	bindEvent = function() {
		$common.touchSE($('#plusBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.create('friend_addNew_header', 'addNewHeader.html', false, true, function(show) {
				show();
			});
		});
	};
	loadWebview = function() {
		var friendListWin = plus.webview.create("friendList.html", "friend_list", {
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
	loadTip = function() {
		var followTipCount = $userInfo.get('followTipCount');
		if (followTipCount) {
			followTipCount = parseInt(followTipCount);
			if (followTipCount > 0) {
				$('#plusBtn').find('.icon-p').show();
			} else {
				$('#plusBtn').find('.icon-p').hide();
			}
		}
	};
	plusReady = function() {
		loadTip();
		loadWebview();
		bindEvent();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});