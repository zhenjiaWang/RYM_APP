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
			$nativeUIManager.confirm('提示', '你确定登出明道OA?', ['确定', '取消'], function() {
				plus.runtime.quit();
			}, function() {});
		});
		$common.touchSE($('#plusBtn'), function(event, startTouch, o) {}, function(event, o) {
			if (!$(o).hasClass('current')) {
				$(o).addClass('current');
				var productSaleWindow = $windowManager.getById('product_user');
				if (productSaleWindow) {
					productSaleWindow.evalJS('showAddTools()');
				}
			} else {
				$(o).removeClass('current');
				var productSaleWindow = $windowManager.getById('product_user');
				if (productSaleWindow) {
					productSaleWindow.evalJS('hideAddTools()');
				}
			}
		});

	};
	loadWebview = function() {
		var workHead = plus.webview.create("header.html", "header", {
			top: "0px",
			bottom: "50px",
			scrollIndicator: 'vertical'
		});
		workHead.addEventListener("loaded", function() { //叶面加载完成后才显示
			$windowManager.current().append(workHead);
			//$('span[dir="platform"]', '#bottomTab').attr('lang', '1');
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