define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var $keyManager = require('manager/key');
	var $templete = require('core/templete');
	var nextIndex = 0;
	var currentWindow;
	showAddTools = function() {
		$('.footerMask').css('bottom', '0px');
		$('#bottomPop').addClass('current');
	};
	hideAddTools = function() {
		$('.footerMask').css('bottom', '-99px');
		$('#bottomPop').removeClass('current');
	};
	bindEvent = function() {
		$common.touchSE($('li', '#tipCountUL'), function(event, startTouch, o) {}, function(event, o) {
			var dir = $(o).attr('dir');
			if (dir) {
				if (dir == 'visit') {
					$windowManager.create('visit_header', 'visitHeader.html', false, true, function(show) {
						show();
					});
				}
			}
		});
		$common.touchSE($('#addProductBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.create('product_add', '../product/add.html', false, true, function(show) {
				show();
				var lunchWindow = $windowManager.getLaunchWindow();
				if (lunchWindow) {
					lunchWindow.evalJS('plusRest()');
				}
			});
		});
		$common.touchSE($('#relationProductBtn'), function(event, startTouch, o) {}, function(event, o) {
			$nativeUIManager.alert('提示', '需要等忆星的短信验证码 后台变更过 线上服务器不支持了', 'OK', function() {});
			//			$windowManager.create('relation_header', '../relation/header.html', false, true, function(show) {
			//				show();
			//				var lunchWindow = $windowManager.getLaunchWindow();
			//				if (lunchWindow) {
			//					lunchWindow.evalJS('plusRest()');
			//				}
			//			});
		});
	};
	loadData = function(callback, append) {
		bindEvent();
	};
	loadTip = function() {
		var visitCount = $userInfo.get('visitCount');
		if (visitCount) {
			visitCount = parseInt(visitCount);
			if (visitCount > 0) {
				$('li[dir="visit"]', '#tipCountUL').find('.icon-p').show().text(visitCount);
			} else {
				$('li[dir="visit"]', '#tipCountUL').find('.icon-p').hide();
			}
		}

		var homeWin = $windowManager.getById($windowManager.getLaunchWindowId());
		if (homeWin) {
			homeWin.evalJS('loadTip()');
		}
	};
	plusReady = function() {
		$common.switchOS(function() {
			$('body').addClass('Ios_scroll');
		}, function() {

		});
		loadTip();
		loadData();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});