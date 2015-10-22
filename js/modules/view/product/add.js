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
							$windowManager.create('product_add_footer', 'addFooter.html?typeId=1&typeName=理财', false, true, function(show) {
								show();
							});
						} else if (index == 2) {
							$windowManager.create('product_add_footer', 'addFooter.html?typeId=2&typeName=基金', false, true, function(show) {
								show();
							});
						} else if (index == 3) {
							$windowManager.create('product_add_footer', 'addFooter.html?typeId=3&typeName=信托|资管', false, true, function(show) {
								show();
							});
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