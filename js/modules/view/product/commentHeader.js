define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var $productCommon = require('view/product/productCommon');
	var queryMap = parseURL();
	var id = queryMap.get('id');
	loadWebview = function(url) {
		var productCommentWin = plus.webview.create('comment.html?id=' + id, "product_comment", {
			top: "50px",
			bottom: "0px",
			scrollIndicator: 'vertical'
		});
		if (productCommentWin) {
			productCommentWin.addEventListener("loaded", function() {
				$windowManager.current().append(productCommentWin);
			}, false);
		}
	}
	plusReady = function() {
		loadWebview();
		$common.touchSE($('#backBtn'), function(event, startTouch, o) {}, function(event, o) {
			var commentFooterWin = $windowManager.getById('product_commentFooter');
			if (commentFooterWin) {
				commentFooterWin.close();
			}
		});
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});