define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $templete = require('core/templete');
	var queryMap = parseURL();
	var id = queryMap.get('id');
	var tab = queryMap.get('tab');
	bindEvent = function() {
		
	};
	loadData = function() {
		$nativeUIManager.watting('请稍等...');
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/product/info/view',
			dataType: 'json',
			data:{
				id:id,
				tab:tab
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						var trust=jsonData['trust'];
						var productInfo=jsonData['productInfo'];
						if(productInfo&&trust){
							$('#name').text(productInfo['name']);
							$('#updateTime').text(productInfo['updateTime']+'前更新');
							$('#viewCount').text(productInfo['viewCount']);
							$('#orgName').text(productInfo['orgName']);
							$('#remarks').text(productInfo['remarks']);
							
							$('#dayLimit').text(trust['dayLimit']+'天');
							$('#yieldDesc').text(trust['yield']);
							$('#yield').text(trust['yield']+'%');
							$('#purchaseAmount').text(trust['purchaseAmount']);
							$('#payOffType').text(trust['payOffType']);
							$('#startDate').text(trust['startDate']);
							$('#endDate').text(trust['endDate']);
							$('#accrualDay').text(trust['accrualDay']);
							$('#expireDate').text(trust['expireDate']);
							$('#remarks').text(productInfo['remarks']);
							$('.main').show();
						}
						$nativeUIManager.wattingClose();
						bindEvent();
					} else {
						$nativeUIManager.wattingClose();
						$nativeUIManager.alert('提示', '获取产品信息失败', 'OK', function() {});
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				$nativeUIManager.wattingClose();
				$nativeUIManager.alert('提示', '获取产品信息失败', 'OK', function() {});
			}
		});
	};
	plusReady = function() {
		$common.switchOS(function() {
			$('body').addClass('Ios_scroll');
		}, function() {

		});
		loadData();
		$common.touchSE($('#backBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.close();
		});
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});