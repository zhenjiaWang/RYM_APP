define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var userId;
	bindEvent = function() {
		$common.touchSE($('#myBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.create('my_info', '../my/info.html', false, true, function(show) {
				show();
			});
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
		userId = $userInfo.get('userId');
		var productUserWin = plus.webview.create("sale.html?userId=" + userId, "product_user", {
			top: "50px",
			bottom: "0px",
			scrollIndicator: 'vertical'
		});
		bindEvent();
		if (productUserWin) {
			productUserWin.addEventListener("loaded", function() {
				$windowManager.current().append(productUserWin);
			}, false);
		}
	}
	plusReady = function() {
		loadWebview();
		
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});