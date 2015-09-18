define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	plusRest = function() {
		if ($('#plusBtn').hasClass('current')) {
			$('#plusBtn').removeClass('current');
			var productSaleWindow = $windowManager.getById('product_user');
			if (productSaleWindow) {
				productSaleWindow.evalJS('hideAddTools()');
			}
		}
	};
	bindEvent = function() {
		$common.androidBack(function() {
			$nativeUIManager.confirm('提示', '你确定登出理财任意门?', ['确定', '取消'], function() {
				plus.runtime.quit();
			}, function() {});
		});
		$common.touchSE($('span', '#footerAction'), function(event, startTouch, o) {}, function(event, o) {
			var dir = $(o).attr('dir');
			if (dir) {
				if (dir == 'plusBtn') {
					var currentDir = $('span.current', '#footerAction').attr('dir');
					var plusWinId = false;
					if (currentDir) {
						if (currentDir == 'room') {
							plusWinId = 'product_user';
						} else if (currentDir == 'friend') {
							plusWinId = 'friend_list';
						}
					}
					if (plusWinId) {
						if (!$(o).hasClass('current')) {
							$(o).addClass('current');
							var productSaleWindow = $windowManager.getById(plusWinId);
							if (productSaleWindow) {
								productSaleWindow.evalJS('showAddTools()');
							}
						} else {
							$(o).removeClass('current');
							var productSaleWindow = $windowManager.getById(plusWinId);
							if (productSaleWindow) {
								productSaleWindow.evalJS('hideAddTools()');
							}
						}
					}
				} else {
					if (!$('#plusBtn').hasClass('current')) {
						if (dir == 'friend') {
							$windowManager.loadOtherWindow('header', 'friend/header.html');
							$('span.current', '#footerAction').removeClass('current');
							$('span[dir="' + dir + '"]', '#footerAction').addClass('current');
						} else if (dir == 'customer') {
							$('span.current', '#footerAction').removeClass('current');
							$('span[dir="' + dir + '"]', '#footerAction').addClass('current');
						} else if (dir == 'tip') {
							$('span.current', '#footerAction').removeClass('current');
							$('span[dir="' + dir + '"]', '#footerAction').addClass('current');
						} else if (dir == 'room') {
							$windowManager.loadOtherWindow('header', 'product/header.html');
							$('span.current', '#footerAction').removeClass('current');
							$('span[dir="' + dir + '"]', '#footerAction').addClass('current');
						}
					}
				}
			}
		});
	};
	loadWebview = function() {
		var workHead = plus.webview.create("product/header.html", "header", {
			top: "0px",
			bottom: "50px",
			scrollIndicator: 'vertical'
		});
		workHead.addEventListener("loaded", function() { //叶面加载完成后才显示
			$windowManager.current().append(workHead);
			if ($('span.current', '#footerAction').size() == 0) {
				$('span', '#footerAction').first().addClass('current');
			}
		}, false);
	}
	plusReady = function() {
		loadWebview();
		bindEvent();
		//		document.addEventListener("resume", function() {
		//			$authorize.timeout();
		//		}, false);
		plus.navigator.closeSplashscreen();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});