define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $templete = require('core/templete');
	var showImgFlag = false;
	bindEvent = function() {
		$common.switchOS(function() {
			$common.touchSME($('#contentMain'), function(startX, startY, endX, endY, event, startTouch, o) {
					showImgFlag = false;
				},
				function(startX, startY, endX, endY, event, moveTouch, o) {
					if ($('#showImgBtn').is(':visible')) {
						var y = endY - startY;
						if (y != 0) {
							if (y < -40) {
								showImgFlag = true;
							}
						}
					}

				},
				function(startX, startY, endX, endY, event, o) {
					if ($('#showImgBtn').is(':visible')) {
						if (endY < startY && showImgFlag) {
							$nativeUIManager.watting('请稍等...');
							$windowManager.create('product_img', 'img.html', 'slide-in-bottom', true, function(show) {
								$nativeUIManager.wattingClose();
								show();
							});
						}
					}
				});
		}, function() {
			$common.touchSE($('#showImgBtn'), function(event, startTouch, o) {}, function(event, o) {
				$nativeUIManager.watting('请稍等...');
				$windowManager.create('product_img', 'img.html', 'slide-in-bottom', true, function(show) {
					$nativeUIManager.wattingClose();
					show();
				});
			});
		});
	};
	loadData = function() {
		var productView = $userInfo.get('productView');
		if (productView) {
			var jsonData = JSON.parse(productView);
			if (jsonData) {
				if (jsonData['result'] == '0') {
					var trust = jsonData['trust'];
					var productInfo = jsonData['productInfo'];
					if (productInfo && trust) {
						$('#name').text(productInfo['name']);
						$('#updateTime').text(productInfo['updateTime'] + '前更新');
						$('#viewCount').text(productInfo['viewCount']);
						$('#relationCount').text(productInfo['relationCount']);
						$('#orgName').text(productInfo['orgName']);
						$('#remarks').text(productInfo['remarks']);

						$('#dayLimit').text(trust['dayLimit'] + '天');
						$('#yieldDesc').text(trust['yield']);
						$('#yield').text(trust['yield'] + '%');
						$('#purchaseAmount').text(trust['purchaseAmount']);
						$('#payOffType').text(trust['payOffType']);
						$('#startDate').text(trust['startDate']);
						$('#endDate').text(trust['endDate']);
						$('#accrualDay').text(trust['accrualDay']);
						$('#expireDate').text(trust['expireDate']);
						$('#remarks').text(productInfo['remarks']);
						var attArray = jsonData['attArray'];
						if (attArray && $(attArray).size() > 0) {
							$userInfo.put('attImg', JSON.stringify(attArray));
							$common.switchOS(function() {

							}, function() {
								$('p', '#showImgBtn').text('点击查看图片详情');
							});
							$('#showImgBtn').show();
							$('#contentMain').css('bottom', '50px');
						}
						$('#contentMain').show();
						pullToRefreshEvent();
					}
					bindEvent();
				}
			}
		}
	};
	pullToRefreshEvent = function() {
		currentWindow = $windowManager.current();
		currentWindow.setPullToRefresh({
			support: true,
			height: "50px",
			range: "200px",
			contentdown: {
				caption: "下拉回到产品详情"
			},
			contentover: {
				caption: ""
			},
			contentrefresh: {
				caption: ""
			}
		}, function() {
			goTop();
			currentWindow.endPullToRefresh();
		});
	};
	plusReady = function() {
		$common.switchOS(function() {
			$('body').addClass('Ios_scroll');
		}, function() {

		});
		loadData();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});