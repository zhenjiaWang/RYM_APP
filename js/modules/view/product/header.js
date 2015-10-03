define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var queryMap = parseURL();
	var userId = queryMap.get('userId');
	bindEvent = function() {
		$common.touchSE($('#myBtn'), function(event, startTouch, o) {}, function(event, o) {
			var uid = $userInfo.get('userId');
			if (uid == userId) {
				$windowManager.create('my_info', '../my/info.html', false, true, function(show) {
					show();
				});
			} else {
				$nativeUIManager.confirm('提示', '返回到我的理财师?', ['返回', '暂不'], function() {
					$windowManager.load('header.html');
				}, function() {});
			}
		});
		$common.touchSE($('li', '#plannerSaleTab'), function(event, startTouch, o) {}, function(event, o) {
			if (!$(o).hasClass('current')) {
				$('li', '#plannerSaleTab').removeClass('current');
				$(o).addClass('current');
				var dir = $(o).attr('dir');
				if (dir) {
					if (dir == 'sale') {
						$windowManager.loadOtherWindow('product_user', 'sale.html?userId=' + userId);
					} else if (dir == 'favorites') {
						$windowManager.loadOtherWindow('product_user', 'favorites.html?userId=' + userId);
					} else if (dir == 'saleOff') {
						$windowManager.loadOtherWindow('product_user', 'saleOff.html?userId=' + userId);
					}
				}
			}
		});
		$common.touchSE($('#moreBtn'), function(event, startTouch, o) {}, function(event, o) {
			var uid = $userInfo.get('userId');
			if (uid == userId) {
				$nativeUIManager.confactionSheetirm('请选择操作', '取消', [{
						title: '分享'
					}, {
						title: '调整产品顺序'
					}],
					function(index) {
						if (index > 0) {
							if (index == 1) {
								$nativeUIManager.alert('提示', '微信浏览域名没办法用，暂关闭', 'OK', function() {});
							} else if (index == 2) {
								$nativeUIManager.alert('提示', '调整顺序会变更关联项目，逻辑检查中，暂关闭', 'OK', function() {});
//								$windowManager.create('product_order', 'order.html', false, true, function(show) {
//									show();
//								});
							}
						}
					});
			} else {
				$nativeUIManager.confactionSheetirm('请选择操作', '取消', [{
						title: '分享'
					}],
					function(index) {
						if (index > 0) {
							if (index == 1) {
								$nativeUIManager.alert('提示', '微信浏览域名没办法用，暂关闭', 'OK', function() {});
							}
						}
					});
			}
		});

	};
	loadWebview = function() {
		if (userId == null) {
			userId = $userInfo.get('userId');
			var productUserWin = $windowManager.getById('product_user');
			if (productUserWin) {
				var productUserWin = $windowManager.getById('product_user');
				if (productUserWin) {
					if ($('li.current', '#plannerSaleTab').size() == 0) {
						$('li', '#plannerSaleTab').first().addClass('current');
					}
					productUserWin.evalJS('clear()');
					$windowManager.loadOtherWindow('product_user', 'sale.html?userId=' + userId, function() {
						$controlWindow.windowShow('product_user');
					});
				}
			} else {
				var productUserWin = plus.webview.create("sale.html?userId=" + userId, "product_user", {
					top: "50px",
					bottom: "0px",
					scrollIndicator: 'vertical'
				});
				if (productUserWin) {
					if ($('li.current', '#plannerSaleTab').size() == 0) {
						$('li', '#plannerSaleTab').first().addClass('current');
					}
					productUserWin.addEventListener("loaded", function() {
						$windowManager.current().append(productUserWin);
					}, false);
				}
			}
		} else {
			var productUserWin = $windowManager.getById('product_user');
			if (productUserWin) {
				if ($('li.current', '#plannerSaleTab').size() == 0) {
					$('li', '#plannerSaleTab').first().addClass('current');
				}
				productUserWin.evalJS('clear()');
				$windowManager.loadOtherWindow('product_user', 'sale.html?userId=' + userId, function() {
					$controlWindow.windowShow('product_user');
				});
			}
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