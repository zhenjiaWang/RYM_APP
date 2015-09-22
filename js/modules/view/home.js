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
						var oldDir = $('span.current', '#footerAction').attr('dir');
						var lang = $('span[dir="' + dir + '"]', '#footerAction').attr('lang');
						if (lang) {
							$('span.current', '#footerAction').removeClass('current');
							$('span[dir="' + dir + '"]', '#footerAction').addClass('current');
							if (lang == "1") {
								if (dir == 'room') {
									$controlWindow.windowShow('product_header');
									$controlWindow.windowShow('product_user');
								} else if (dir == 'friend') {
									$controlWindow.windowShow('friend_header');
									$controlWindow.windowShow('friend_list');
								}
							} else if (lang == "0") {
								if (dir == 'friend') {
									var historyHead = plus.webview.create("friend/header.html", "friend_header", {
										top: "0px",
										bottom: "50px"
									});
									historyHead.addEventListener("loaded", function() { //叶面加载完成后才显示
										$windowManager.current().append(historyHead);
										$('span[dir="friend"]', '#footerAction').attr('lang', '1');
									}, false);
								}
							}
							window.setTimeout(function() {
								if (oldDir) {
									if (oldDir == 'room') {
										$controlWindow.windowHide('product_header');
										$controlWindow.windowHide('product_user');
									} else if (oldDir == 'friend') {
										$controlWindow.windowHide('friend_header');
										$controlWindow.windowHide('friend_list');
									}

								}
							}, 500);
						}
					}
				}
			}
		});
	};
	loadWebview = function() {
		var workHead = plus.webview.create("product/header.html", "product_header", {
			top: "0px",
			bottom: "50px",
			scrollIndicator: 'vertical'
		});
		workHead.addEventListener("loaded", function() { //叶面加载完成后才显示
			$windowManager.current().append(workHead);
			if ($('span.current', '#footerAction').size() == 0) {
				$('span', '#footerAction').first().addClass('current');
				$('span[dir="room"]', '#footerAction').attr('lang', '1');
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