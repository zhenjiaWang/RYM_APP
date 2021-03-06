define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $templete = require('core/templete');
	var showImgFlag = false;
	var queryMap = parseURL();
	var id = queryMap.get('id');
	var tab = queryMap.get('tab');
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
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/product/info/viewRemarks',
			dataType: 'json',
			data: {
				id: id,
				tab: tab
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						var remarks = jsonData['remarks'];
						if (remarks) {
							$('#remarks').html(remarks);
						}
					} else {
						$nativeUIManager.alert('提示', '获取产品描述失败', 'OK', function() {});
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				$nativeUIManager.alert('提示', '获取产品描述失败', 'OK', function() {});
			}
		});
		var productView = $userInfo.get('productView');
		if (productView) {
			var jsonData = JSON.parse(productView);
			if (jsonData) {
				if (jsonData['result'] == '0') {
					var planner = jsonData['planner'];
					if (planner) {
						$('#userName').text(planner['userName']);
						$('#plannerNo').text(planner['plannerNo']);
						$('#plannerOrgName').text(planner['orgName']);
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
						$('#updateTime').text(productInfo['updateTime']);
						$('#viewCount').text(productInfo['viewCount']);
						$('#relationCount').text(productInfo['relationCount']);
						$('#orgName').text(productInfo['orgName']);

						$('#dayLimit').text(trust['dayLimit'] + '天');
						$('#yieldDesc').text(trust['yield']);
						$('#yield').text(trust['yield'] + '%');
						$('#purchaseAmount').text(trust['purchaseAmount']+'万元');
						$('#payOffType').text(trust['payOffType']);
						$('#startDate').text(trust['startDate']);
						$('#endDate').text(trust['endDate']);
						$('#accrualDay').text(trust['accrualDay']+'天');
						$('#expireDate').text(trust['expireDate']);
						var attArray = jsonData['attArray'];
						if (attArray && $(attArray).size() > 0) {
							$('#productImg').show();
							$(attArray).each(function(i, o) {
								$('.imgDetail').append('<p><img src="' + o['imgSrc'] + '"></p>\n');
							});
						}
						$('#contentMain').show();
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