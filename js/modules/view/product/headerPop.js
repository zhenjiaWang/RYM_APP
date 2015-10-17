define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $shareManage = require('manager/share');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var queryMap = parseURL();
	var userId = queryMap.get('userId');
	var userName = queryMap.get('userName');
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
							$nativeUIManager.confactionSheetirm('请选择操作', '取消', [{
									title: '分享到微信好友'
								}, {
									title: '分享到微信朋友圈'
								}],
								function(index) {
									if (index > 0) {
										if (index == 1) {
											$shareManage.share('WXSceneSession',{
												url:'http://dev.lcruyimen.com/weixin/entrance/shareEntrance?action=action-room_userId-'+userId,
												content:userName+'的产品更新了，有你感兴趣的吗？',
												title:userName+'的理财室'
											});
										} else if (index == 2) {
											$shareManage.share('WXSceneTimeline',{
												url:'http://dev.lcruyimen.com/weixin/entrance/shareEntrance?action=action-room_userId-'+userId,
												content:userName+'的产品更新了，有你感兴趣的吗？',
												title:userName+'的理财室'
											});
										}
									}
								});
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
		$shareManage.auth('weixin');
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});