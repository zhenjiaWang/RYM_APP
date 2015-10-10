define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $templete = require('core/templete');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var $productCommon = require('view/product/productCommon');
	var queryMap = parseURL();
	var typeId = queryMap.get('typeId');
	bindEvent = function() {
		$common.touchSE($('span', '#footerTools'), function(event, startTouch, o) {}, function(event, o) {
			var dir = $(o).attr('dir');
			if (dir) {
				var productViewHeaderWin = $windowManager.getById('product_view_header');
				if (productViewHeaderWin) {
					productViewHeaderWin.evalJS('doAction("' + dir + '")');
				}
			}
		});
	};
	loadData = function() {
		var actionArrayJson = $userInfo.get('actionArray');
		var actionActionObjJson = $userInfo.get('actionActionObj');
		if (actionArrayJson && actionActionObjJson) {
			var actionArray = JSON.parse(actionArrayJson);
			var actionActionObj = JSON.parse(actionActionObjJson);
			if (actionArray && actionActionObj) {
				var actionCount = $(actionArray).size();
				if (actionCount) {
					if (actionCount == 1) {
						$('body').append(String.formatmodel($templete.footer1(), {
							action1: actionActionObj[1 + ''],
							text1: actionArray[0 + '']['title']
						}));
					} else if (actionCount == 2) {
						$('body').append(String.formatmodel($templete.footer2(), {
							action1: actionActionObj[1 + ''],
							text1: actionArray[0 + '']['title'],
							action2: actionActionObj[2 + ''],
							text2: actionArray[1 + '']['title']
						}));
					} else if (actionCount == 3) {
						$('body').append(String.formatmodel($templete.footer3(), {
							action1: actionActionObj[1 + ''],
							text1: actionArray[0 + '']['title'],
							action2: actionActionObj[2 + ''],
							text2: actionArray[1 + '']['title'],
							action3: actionActionObj[3 + ''],
							text3: actionArray[2 + '']['title']
						}));
					} else if (actionCount == 4) {
						$('body').append(String.formatmodel($templete.footer4(), {
							action1: actionActionObj[1 + ''],
							text1: actionArray[0 + '']['title'],
							action2: actionActionObj[2 + ''],
							text2: actionArray[1 + '']['title'],
							action3: actionActionObj[3 + ''],
							text3: actionArray[2 + '']['title'],
							action4: actionActionObj[4 + ''],
							text4: actionArray[3 + '']['title']
						}));
					}
					bindEvent();
				}
			}
		}
	};
	loadWebview = function() {
		var viewUrl = '';
		if (typeId) {
			if (typeId == '1') {
				viewUrl = 'viewFinancial.html';
			} else if (typeId == '2') {
				viewUrl = 'viewFund.html';
			} else if (typeId == '3') {
				viewUrl = 'viewTrust.html';
			}
			var productViewWin = plus.webview.create(viewUrl, "product_view", {
				top: "0px",
				bottom: "50px",
				scrollIndicator: 'vertical'
			});
			if (productViewWin) {
				productViewWin.addEventListener("loaded", function() {
					$windowManager.current().append(productViewWin);
				}, false);
			}
		}
	}
	plusReady = function() {
		loadData();
		loadWebview();
		bindEvent();
		$common.touchSE($('#backBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.close();
		});
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});