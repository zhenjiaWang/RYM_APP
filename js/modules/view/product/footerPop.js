define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $templete = require('core/templete');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var $productCommon = require('view/product/productCommon');
	var $scrollEvent = require('manager/scrollEvent');
	var queryMap = parseURL();
	var userId = queryMap.get('userId');
	var userName = queryMap.get('userName');
	toobar = function(uid, friendYn) {
		if (friendYn == 'Y') {
			$('span[dir="delFriend"]', '#footerTools').show();
		} else {
			$('span[dir="addFriend"]', '#footerTools').show();
		}
		$('#footerTools').show().attr('userId', uid);
		bindEvent();
	};
	bindEvent = function() {
		$common.touchSE($('span', '#footerTools'), function(event, startTouch, o) {}, function(event, o) {
			var dir = $(o).attr('dir');
			if (dir) {
				if (dir == 'message') {
					$windowManager.create('pmPlanner_header', '../pmPlanner/header.html?targetId=' + userId + '&targetName=' + userName, false, true, function(show) {
						show();
					});
				} else if (dir == 'addFriend') {
					var friendId = $(o).closest('footer').attr('userId');
					if (friendId) {
						$nativeUIManager.watting('请稍等...');
						$common.refreshToken(function(tokenId) {
							$.ajax({
								type: 'POST',
								url: $common.getRestApiURL() + '/social/friendPlanner/addFriend',
								dataType: 'json',
								data: {
									'org.guiceside.web.jsp.taglib.Token': tokenId,
									friendId: friendId
								},
								success: function(jsonData) {
									if (jsonData) {
										if (jsonData['result'] == '0') {
											$nativeUIManager.wattingTitle('关注成功!');
											$('span[dir="delFriend"]', '#footerTools').show();
											$(o).hide();
											window.setTimeout(function() {
												$nativeUIManager.wattingClose();
												var friendListWin = $windowManager.getById('friend_list');
												if (friendListWin) {
													friendListWin.evalJS('onRefresh()');
												}
											}, 1000);
										} else {
											$nativeUIManager.wattingClose();
											$nativeUIManager.alert('提示', '关注失败', 'OK', function() {});
										}
									}
								},
								error: function(XMLHttpRequest, textStatus, errorThrown) {
									$nativeUIManager.wattingClose();
									$nativeUIManager.alert('提示', '关注失败', 'OK', function() {});
								}
							});
						});
					}
				} else if (dir == 'delFriend') {
					var friendId = $(o).closest('footer').attr('userId');
					if (friendId) {
						$nativeUIManager.watting('请稍等...');
						$common.refreshToken(function(tokenId) {
							$.ajax({
								type: 'POST',
								url: $common.getRestApiURL() + '/social/friendPlanner/delFriend',
								dataType: 'json',
								data: {
									'org.guiceside.web.jsp.taglib.Token': tokenId,
									friendId: friendId
								},
								success: function(jsonData) {
									if (jsonData) {
										if (jsonData['result'] == '0') {
											$nativeUIManager.wattingTitle('取消关注成功!');
											$('span[dir="addFriend"]', '#footerTools').show();
											$(o).hide();
											window.setTimeout(function() {
												$nativeUIManager.wattingClose();
												var friendListWin = $windowManager.getById('friend_list');
												if (friendListWin) {
													friendListWin.evalJS('onRefresh()');
												}
											}, 1000);
										} else {
											$nativeUIManager.wattingClose();
											$nativeUIManager.alert('提示', '取消关注失败', 'OK', function() {});
										}
									}
								},
								error: function(XMLHttpRequest, textStatus, errorThrown) {
									$nativeUIManager.wattingClose();
									$nativeUIManager.alert('提示', '取消关注失败', 'OK', function() {});
								}
							});
						});
					}
				}
			}
		});
	};
	loadWebview = function() {
		var headerPopWin = plus.webview.create('headerPop.html?userId=' + userId + '&userName=' + userName, "product_header_pop", {
			top: "0px",
			bottom: "50px",
			scrollIndicator: 'vertical'
		});
		if (headerPopWin) {
			headerPopWin.addEventListener("loaded", function() {
				$windowManager.current().append(headerPopWin);
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