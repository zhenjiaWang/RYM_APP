define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $templete = require('core/templete');
	var showImgFlag = false;
	bindEvent = function() {
		$common.touchSE($('#showImgBtn'), function(event, startTouch, o) {}, function(event, o) {
			$nativeUIManager.watting('请稍等...');
			$windowManager.create('product_img', 'img.html', 'slide-in-bottom', true, function(show) {
				$nativeUIManager.wattingClose();
				show();
			});
		});
	};
	loadData = function() {
		var productView = $userInfo.get('productView');
		if (productView) {
			var jsonData = JSON.parse(productView);
			if (jsonData) {
				if (jsonData['result'] == '0') {
					var planner = jsonData['planner'];
					if (planner) {
						$('#userName').text(planner['userName']);
						$('#plannerNo').text(planner['plannerNo']);
						$('#orgName').text(planner['orgName']);
						$('#signature').text(planner['signature']);
						$('#follow').text(planner['follow']);
						$('#friends').text(planner['friends']);
						var bgImgUrl = planner['bgImgUrl'];
						if (!bgImgUrl) {
							bgImgUrl = '../../img/2.jpg';
						}
						$('img', '#uploadBgImgBtn').attr('src', bgImgUrl);
						var headImgUrl = planner['headImgUrl'];
						if (headImgUrl) {
							$('img', '.userPhoto').attr('src', headImgUrl);
						}
					}
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