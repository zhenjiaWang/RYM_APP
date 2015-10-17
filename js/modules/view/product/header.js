define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $shareManage = require('manager/share');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var userId;
	showUpdate = function() {
		$('.mask').show();
	};
	closeUpdate = function() {
		$('.mask').hide();
	};
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
												content:$userInfo.get('userName')+'的产品更新了，有你感兴趣的吗？',
												title:$userInfo.get('userName')+'的理财室'
											});
										} else if (index == 2) {
											$shareManage.share('WXSceneTimeline',{
												url:'http://dev.lcruyimen.com/weixin/entrance/shareEntrance?action=action-room_userId-'+userId,
												content:$userInfo.get('userName')+'的产品更新了，有你感兴趣的吗？',
												title:$userInfo.get('userName')+'的理财室'
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
		$shareManage.auth('weixin');
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