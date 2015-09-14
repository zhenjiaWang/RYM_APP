define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	bindEvent = function() {
		$common.touchSE($('#myBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.create('my_info', 'my/info.html', false, true, function(show) {
				show();
			});
		});
		$common.touchSE($('#moreBtn'), function(event, startTouch, o) {}, function(event, o) {
			$nativeUIManager.confactionSheetirm('请选择操作', '取消', [{
					title: '分享'
				}, {
					title: '调整产品顺序'
				}],
				function(index) {
					if (index > 0) {
						if (index == 1) {

						} else if (index == 2) {
							$windowManager.create('product_order', 'product/order.html', false, true, function(show) {
								show();
							});
						}
					}
				});
		});

	};
	loadWebview = function() {
		var productSale = plus.webview.create("product/sale.html", "product_sale", {
			top: "50px",
			bottom: "0px",
			scrollIndicator: 'vertical'
		});
		if (productSale) {
			productSale.addEventListener("loaded", function() {
				$windowManager.current().append(productSale);
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