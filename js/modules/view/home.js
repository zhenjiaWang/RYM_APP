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
			var dir = $('span.current', '#footerAction').attr('dir');
			if (dir) {
				var currentProductWinId = false;
				if (dir == 'room') {
					currentProductWinId = 'product_user';
				} else if (dir == 'friend') {
					currentProductWinId = 'friend_list';
				}
				var productWindow = $windowManager.getById(currentProductWinId);
				if (productWindow) {
					productWindow.evalJS('hideAddTools()');
				}
			}

		}
	};
	bindEvent = function() {
		$common.androidBack(function() {
			$nativeUIManager.confirm('提示', '你确定登出理财任意门?', ['确定', '取消'], function() {
				plus.runtime.quit();
			}, function() {});
		});
		$common.touchSE($('span', '#footerAction'), function(event, startTouch, o) {

		}, function(event, o) {
			var dir = $(o).attr('dir');
			if (dir) {
				if (dir == 'tip') {
					$nativeUIManager.alert('提示', '和微信一起开放', 'OK', function() {});
					return false;
				}
				if (dir == 'customer') {
					$nativeUIManager.alert('提示', '和微信一起开放', 'OK', function() {});
					return false;
				}
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
						if (oldDir != dir) {
							if (dir == 'friend') {
								var friendHead = plus.webview.create("friend/header.html", "friend_header", {
									top: "0px",
									bottom: "50px"
								});
								friendHead.addEventListener("loaded", function() { //叶面加载完成后才显示
									$windowManager.current().append(friendHead);
									$('span.current', '#footerAction').removeClass('current');
									$('span[dir="' + dir + '"]', '#footerAction').addClass('current');
								}, false);
							} else if (dir == 'room') {
								var productHead = plus.webview.create("product/header.html", "product_header", {
									top: "0px",
									bottom: "50px",
									scrollIndicator: 'vertical'
								});
								productHead.addEventListener("loaded", function() { //叶面加载完成后才显示
									$windowManager.current().append(productHead);
									$('span.current', '#footerAction').removeClass('current');
									$('span[dir="' + dir + '"]', '#footerAction').addClass('current');
								}, false);
							}
							if (oldDir) {
								if (oldDir == 'room') {
									$controlWindow.windowHide('product_header');
									$controlWindow.windowHide('product_user');
									window.setTimeout(function() {
										$windowManager.closeById('product_header', 'none');
										$windowManager.closeById('product_user', 'none');
									}, 200);
								} else if (oldDir == 'friend') {
									$controlWindow.windowHide('friend_header');
									$controlWindow.windowHide('friend_list');
									window.setTimeout(function() {
										$windowManager.closeById('friend_header', 'none');
										$windowManager.closeById('friend_list', 'none');
									}, 500);
								}
							}
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
			}
		}, false);
	}
	plusReady = function() {
		loadWebview();
		bindEvent();
		document.addEventListener("resume", function() {
			$authorize.timeout();
		}, false);
		plus.navigator.closeSplashscreen();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});