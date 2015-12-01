define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var queryMap = parseURL();
	var id = queryMap.get('id');
	var tab = queryMap.get('tab');
	var productName = queryMap.get('productName');
	bindEvent = function() {
		$common.touchSE($('#backBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.close();
		});
		$common.androidBack(function() {
			$windowManager.close();
		});
	};
	loadWebview = function() {
		var productViewListWin = plus.webview.create("productViewList.html?id="+id+"&tab="+tab, "product_view_list", {
			top: "50px",
			bottom: "0px",
			scrollIndicator: 'vertical'
		});
		if (productViewListWin) {
			productViewListWin.addEventListener("loaded", function() {
				$windowManager.current().append(productViewListWin);
			}, false);
		}
	}
	plusReady = function() {
		loadWebview();
		bindEvent();
		$('h1').text(productName+'浏览记录');
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});