define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var $productCommon = require('view/product/productCommon');
	var queryMap = parseURL();
	var targetId = queryMap.get('targetId');
	var targetName = queryMap.get('targetName');
	var tip = queryMap.get('tip');
	loadWebview = function(url) {
		var chatWin = plus.webview.create('chat.html?targetId=' + targetId, "pmPlanner_chat", {
			top: "50px",
			bottom: "0px",
			scrollIndicator: 'vertical'
		});
		if (chatWin) {
			chatWin.addEventListener("loaded", function() {
				$windowManager.current().append(chatWin);
			}, false);
		}
	}
	plusReady = function() {
		loadWebview();
		$('h1').text('和'+targetName+'的私信');
		$common.touchSE($('#backBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.close();
			if(tip&&tip=='1'){
				var tipWin=$windowManager.getById('tip_list');
				if(tipWin){
					tipWin.evalJS('loadData()');
					tipWin.evalJS('loadTip()');
				}
			}
		});
		$common.androidBack(function() {
			$windowManager.close();
			if(tip&&tip=='1'){
				var tipWin=$windowManager.getById('tip_list');
				if(tipWin){
					tipWin.evalJS('loadData()');
					tipWin.evalJS('loadTip()');
				}
			}
		});
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});