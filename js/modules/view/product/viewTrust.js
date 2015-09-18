define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $templete = require('core/templete');
	bindEvent = function() {

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
						$('.main').show();
					}
					bindEvent();
				}
			}
		}
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