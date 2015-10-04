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
		$common.touchSE($('#backBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.close();
		});
		$common.touchSE($('li', '#plannerSaleTab'), function(event, startTouch, o) {}, function(event, o) {
			if (!$(o).hasClass('current')) {
				$('li', '#plannerSaleTab').removeClass('current');
				$(o).addClass('current');
				var dir = $(o).attr('dir');
				if (dir) {
					if (dir == 'sale') {
						$windowManager.loadOtherWindow('product_user_pop', 'sale.html?userId=' + userId);
					} else if (dir == 'favorites') {
						$windowManager.loadOtherWindow('product_user_pop', 'favorites.html?userId=' + userId);
					} else if (dir == 'saleOff') {
						$windowManager.loadOtherWindow('product_user_pop', 'saleOff.html?userId=' + userId);
					}
				}
			}
		});
		$common.touchSE($('#moreBtn'), function(event, startTouch, o) {}, function(event, o) {
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
		});

	};
	loadWebview = function() {
		var productUserWin = plus.webview.create("sale.html?userId=" + userId, "product_user_pop", {
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