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
				var fund = jsonData['fund'];
				var productInfo = jsonData['productInfo'];
				if (productInfo && fund) {
					$('#name').text(productInfo['name']);
					$('#updateTime').text(productInfo['updateTime'] + '前更新');
					$('#viewCount').text(productInfo['viewCount']);
					$('#relationCount').text(productInfo['relationCount']);
					$('#orgName').text(productInfo['orgName']);
					$('#remarks').text(productInfo['remarks']);
					$('#fundTypeDesc').text(fund['fundType']);
					$('#fundType').text(fund['fundType']);
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
	};
	pullToRefreshEvent = function() {
		currentWindow = $windowManager.current();
		currentWindow.setPullToRefresh({
			support: true,
			height: "50px",
			range: "200px",
			contentdown: {
				caption: ""
			},
			contentover: {
				caption: ""
			},
			contentrefresh: {
				caption: ""
			}
		}, function() {
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