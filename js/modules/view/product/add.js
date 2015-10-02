define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	bindEvent = function() {
		$common.touchSE($('#backBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.close();
		});
		$common.touchSE($('#selectProductType'), function(event, startTouch, o) {}, function(event, o) {
			$nativeUIManager.confactionSheetirm('请选择产品类型', '取消', [{
					title: '理财'
				}, {
					title: '基金'
				}, {
					title: '信托|资管'
				}],
				function(index) {
					if (index > 0) {
						if (index == 1) {
							$nativeUIManager.alert('提示', '理财产品添加多个逻辑有变化，微信显示出现问题，过两天开放', 'OK', function() {});
							//$windowManager.load('addFinancial.html?typeId=1&typeName=理财');
						} else if (index == 2) {
							$windowManager.load('addFund.html?typeId=2&typeName=基金');
						} else if (index == 3) {
							$windowManager.load('addTrust.html?typeId=3&typeName=信托|资管');
						}
					}
				});
		});
	};
	plusReady = function() {
		$common.switchOS(function() {
			$('body').addClass('Ios_scroll');
		}, function() {

		});
		//		bindValidate();
		bindEvent();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});