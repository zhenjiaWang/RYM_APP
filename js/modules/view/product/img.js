define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $templete = require('core/templete');
	bindEvent = function() {
		$common.touchSE($('.goTop', '#imgMain'), function(event, startTouch, o) {}, function(event, o) {
			$('body').scrollTop(0);
		});
	};
	loadData = function() {
		var attImg = $userInfo.get('attImg');
		if (attImg) {
			var attArray = JSON.parse(attImg);
			if (attArray) {
				$(attArray).each(function(i, o) {
					$('.imgDetail', '#imgMain').append('<p><img src="' + o['imgSrc'] + '"></p>\n');
				});
				pullToRefreshEvent();
				bindEvent();
			}
		}
	};
	pullToRefreshEvent = function() {
		currentWindow = $windowManager.current();
		currentWindow.setPullToRefresh({
			support: true,
			height: "50px",
			range: "200px",
			contentdown: {
				caption: "下拉回到产品详情"
			},
			contentover: {
				caption: "释放回到产品详情"
			},
			contentrefresh: {
				caption: "正在关闭..."
			}
		}, function() {
			currentWindow.endPullToRefresh();
			$windowManager.close('slide-out-bottom');
		});
	};
	plusReady = function() {
		$common.switchOS(function() {
			$('body').addClass('Ios_scroll');
		}, function() {

		});
		loadData();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});