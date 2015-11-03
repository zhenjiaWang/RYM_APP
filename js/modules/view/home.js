define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var $updateManager = require('manager/update');
	showUpdate = function() {
		$('.mask').show();
	};
	closeUpdate = function() {
		$('.mask').hide();
	};
	plusRest = function() {
		if ($('#plusBtn').hasClass('current')) {
			$('#plusBtn').removeClass('current');
			var dir = $('span.current', '#footerAction').attr('dir');
			if (dir) {
				var currentProductWinId = false;
				if (dir == 'room') {
					currentProductWinId = 'product_user';
				} else if (dir == 'friend') {
					currentProductWinId = 'friend_list';
				} else if (dir == 'tip') {
					currentProductWinId = 'tip_list';
				}else if (dir == 'customer') {
					currentProductWinId = 'customer_list';
				}
				var productWindow = $windowManager.getById(currentProductWinId);
				if (productWindow) {
					productWindow.evalJS('hideAddTools()');
				}
			}

		}
	};
	bindEvent = function() {
		$common.androidBack(function() {
			$nativeUIManager.confirm('提示', '你确定登出理财任意门?', ['确定', '取消'], function() {
				plus.runtime.quit();
			}, function() {});
		});
		$common.touchSE($('span', '#footerAction'), function(event, startTouch, o) {

		}, function(event, o) {
			var dir = $(o).attr('dir');
			if (dir) {
				if (dir == 'plusBtn') {
					var currentDir = $('#footerAction').attr('current');
					var plusWinId = false;
					if (currentDir) {
						if (currentDir == 'room') {
							plusWinId = 'product_user';
						} else if (currentDir == 'friend') {
							plusWinId = 'friend_list';
						} else if (currentDir == 'tip') {
							plusWinId = 'tip_list';
						}else if (currentDir == 'customer') {
							plusWinId = 'customer_list';
						}
					}
					if (plusWinId) {
						if (!$(o).hasClass('current')) {
							$(o).addClass('current');
							var productSaleWindow = $windowManager.getById(plusWinId);
							if (productSaleWindow) {
								productSaleWindow.evalJS('showAddTools()');
							}
						} else {
							$(o).removeClass('current');
							var productSaleWindow = $windowManager.getById(plusWinId);
							if (productSaleWindow) {
								productSaleWindow.evalJS('hideAddTools()');
							}
						}
					}
				} else {
					if (!$('#plusBtn').hasClass('current')) {
						var oldDir = $('span.current', '#footerAction').attr('dir');
						if (oldDir != dir) {
							if (dir == 'friend') {
								var friendHead = plus.webview.create("friend/header.html", "friend_header", {
									top: "0px",
									bottom: "50px"
								});
								friendHead.addEventListener("loaded", function() { //叶面加载完成后才显示
									$windowManager.current().append(friendHead);
									$('span[dir!="plusBtn"]', '#footerAction').removeClass('current');
									$('span[dir="' + dir + '"]', '#footerAction').addClass('current');
									$('#footerAction').attr('current', dir);
								}, false);
							} else if (dir == 'room') {
								var productHead = plus.webview.create("product/header.html", "product_header", {
									top: "0px",
									bottom: "50px",
									scrollIndicator: 'vertical'
								});
								productHead.addEventListener("loaded", function() { //叶面加载完成后才显示
									$windowManager.current().append(productHead);
									$('span[dir!="plusBtn"]', '#footerAction').removeClass('current');
									$('span[dir="' + dir + '"]', '#footerAction').addClass('current');
									$('#footerAction').attr('current', dir);
								}, false);
							} else if (dir == 'tip') {
								var productHead = plus.webview.create("tip/header.html", "tip_header", {
									top: "0px",
									bottom: "50px",
									scrollIndicator: 'vertical'
								});
								productHead.addEventListener("loaded", function() { //叶面加载完成后才显示
									$windowManager.current().append(productHead);
									$('span[dir!="plusBtn"]', '#footerAction').removeClass('current');
									$('span[dir="' + dir + '"]', '#footerAction').addClass('current');
									$('#footerAction').attr('current', dir);
								}, false);
							}else if (dir == 'customer') {
								var customerHead = plus.webview.create("customer/header.html", "customer_header", {
									top: "0px",
									bottom: "50px"
								});
								customerHead.addEventListener("loaded", function() { //叶面加载完成后才显示
									$windowManager.current().append(customerHead);
									$('span[dir!="plusBtn"]', '#footerAction').removeClass('current');
									$('span[dir="' + dir + '"]', '#footerAction').addClass('current');
									$('#footerAction').attr('current', dir);
								}, false);
							}
							if (oldDir) {
								if (oldDir == 'room') {
									$controlWindow.windowHide('product_header');
									$controlWindow.windowHide('product_user');
									window.setTimeout(function() {
										$windowManager.closeById('product_header', 'none');
										$windowManager.closeById('product_user', 'none');
									}, 200);
								} else if (oldDir == 'friend') {
									$controlWindow.windowHide('friend_header');
									$controlWindow.windowHide('friend_list');
									window.setTimeout(function() {
										$windowManager.closeById('friend_header', 'none');
										$windowManager.closeById('friend_list', 'none');
									}, 500);
								}else if (oldDir == 'customer') {
									$controlWindow.windowHide('customer_header');
									$controlWindow.windowHide('customer_list');
									window.setTimeout(function() {
										$windowManager.closeById('customer_header', 'none');
										$windowManager.closeById('customer_list', 'none');
									}, 500);
								} else if (oldDir == 'tip') {
									$controlWindow.windowHide('tip_header');
									$controlWindow.windowHide('tip_list');
									window.setTimeout(function() {
										$windowManager.closeById('tip_header', 'none');
										$windowManager.closeById('tip_list', 'none');
									}, 500);
								}
							}
						}
					}
				}
			}
		});
	};
	loadWebview = function() {
		var workHead = plus.webview.create("product/header.html", "product_header", {
			top: "0px",
			bottom: "50px",
			scrollIndicator: 'vertical'
		});
		workHead.addEventListener("loaded", function() { //叶面加载完成后才显示
			$windowManager.current().append(workHead);
			if ($('span.current', '#footerAction').size() == 0) {
				$('span', '#footerAction').first().addClass('current');
				$('#footerAction').attr('current', 'room');
				window.setTimeout(function(){
					$updateManager.execute();
				},1000);
			}
		}, false);
	};
	loadTip = function() {
		var badgeNumber = 0;
		var followTipCount = $userInfo.get('followTipCount');
		if (followTipCount) {
			followTipCount = parseInt(followTipCount);
			if (followTipCount > 0) {
				$('span[dir="friend"]', '#footerAction').find('.icon-p').show();
			} else {
				$('span[dir="friend"]', '#footerAction').find('.icon-p').hide();
			}
			badgeNumber += followTipCount;
		}
		var messageTipCount = 0;
		var visitCount = $userInfo.get('visitCount');
		if (visitCount) {
			visitCount = parseInt(visitCount);
			messageTipCount += visitCount;
		}
		var likeCount = $userInfo.get('likeCount');
		if (likeCount) {
			likeCount = parseInt(likeCount);
			messageTipCount += likeCount;
		}
		var commentCount = $userInfo.get('commentCount');
		if (commentCount) {
			commentCount = parseInt(commentCount);
			messageTipCount += commentCount;
		}
		
		if (messageTipCount > 0) {
			$('span[dir="tip"]', '#footerAction').find('.icon-p').show();
		} else {
			$('span[dir="tip"]', '#footerAction').find('.icon-p').hide();
		}
		badgeNumber += messageTipCount;
		$common.switchOS(function() {
			if (badgeNumber > 0) {
				plus.runtime.setBadgeNumber(badgeNumber);
			} else {
				plus.runtime.setBadgeNumber(0);
			}
		}, function() {

		});
	};
	plusReady = function() {
		loadWebview();
		loadTip();
		bindEvent();
		document.addEventListener("resume", function() {
			$authorize.timeout();
		}, false);
		plus.navigator.closeSplashscreen();
		
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});