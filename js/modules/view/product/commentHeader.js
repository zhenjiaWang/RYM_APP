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
	var tab = queryMap.get('tab');
	var userId = queryMap.get('userId');
	var replyId = queryMap.get('replyId');
	var userName = queryMap.get('userName');
	var commentType = queryMap.get('commentType');
	loadWebview = function(url) {
		var	windowURL = encodeURI('comment.html?id=' + id+'&tab='+tab+'&userId='+userId+'&replyId='+replyId+'&userName='+userName+'&commentType='+commentType);
		var productCommentWin = plus.webview.create(windowURL, "product_comment", {
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
			$windowManager.close();
		});
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});