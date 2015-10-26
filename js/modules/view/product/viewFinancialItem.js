define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $templete = require('core/templete');
	var showImgFlag = false;
	bindEvent = function() {
		$common.touchSE($('#backBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.close();
		});
	};
	loadData = function() {
		var financialItem = $userInfo.get('financialItem');
		if (financialItem) {
			var jsonData = JSON.parse(financialItem);
			if (jsonData) {
				if (jsonData['result'] == '0') {
					var financialObj = jsonData['financial'];
					if (financialObj) {
						$('#code').text(financialObj['code']);
						$('#name').text(financialObj['name']);
						$('#orgName').text(financialObj['orgName']);
						$('#dayLimit').text(financialObj['dayLimit'] + '天');
						$('#yieldDesc').text(financialObj['yield']);
						$('#yield').text(financialObj['yield'] + '%');
						$('#purchaseAmount').text(financialObj['purchaseAmount']+'万元');
						$('#payOffType').text(financialObj['payOffType']);
						$('#startDate').text(financialObj['startDate']);
						$('#endDate').text(financialObj['endDate']);
						$('#accrualDay').text(financialObj['accrualDay']+ '天');
						$('#expireDate').text(financialObj['expireDate']);
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