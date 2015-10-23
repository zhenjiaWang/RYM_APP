define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $templete = require('core/templete');
	var showImgFlag = false;
	bindEvent = function() {
		$common.touchSE($('.financialItem'), function(event, startTouch, o) {}, function(event, o) {
			var uid = $(o).attr('uid');
			if (uid) {
				$nativeUIManager.watting('请稍等...');
				$.ajax({
					type: 'POST',
					url: $common.getRestApiURL() + '/product/info/viewFinancialItem',
					dataType: 'json',
					data: {
						id: uid
					},
					success: function(jsonData) {
						if (jsonData) {
							if (jsonData['result'] == '0') {
								$userInfo.put('financialItem',JSON.stringify(jsonData));
								$windowManager.create('product_view_financialItem', 'viewFinancialItem.html', false, true, function(show) {
									show();
									$nativeUIManager.wattingClose();
								});
							} else {
								$nativeUIManager.wattingClose();
								$nativeUIManager.alert('提示', '获取信息失败', 'OK', function() {});
							}
						}
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						$nativeUIManager.wattingClose();
						$nativeUIManager.alert('提示', '获取信息失败', 'OK', function() {});
					}
				});
			}
		});
	};
	loadData = function() {
		var productView = $userInfo.get('productView');
		if (productView) {
			var jsonData = JSON.parse(productView);
			if (jsonData) {
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
				var financial = jsonData['financial'];
				var productInfo = jsonData['productInfo'];
				if (productInfo && financial) {
					$('#name').text(productInfo['name']);
					$('#updateTime').text(productInfo['updateTime']);
					$('#viewCount').text(productInfo['viewCount']);
					$('#relationCount').text(productInfo['relationCount']);
					$('#orgName').text(productInfo['orgName']);
					$('#remarks').text(productInfo['remarks']);
					$('#dayLimit').text(financial['minLimitDay'] + '-' + financial['maxLimitDay'] + '天');
					$('#yieldDesc').text(financial['minYield'] + '-' + financial['maxYield']);
					var financialArray = financial['financialArray'];
					if (financialArray && $(financialArray).size() > 0) {
						var sb = new StringBuilder();
						$(financialArray).each(function(i, o) {
							sb.append(String.formatmodel($templete.financialViewItem(), {
								financialName: o['financialName'],
								purchaseAmount: o['purchaseAmount'],
								yield: o['yield'],
								expireDate: o['expireDate'],
								uid: o['uid']
							}));
						});
						$('#productDesc').before(sb.toString());
					}
					var attArray = jsonData['attArray'];
					if (attArray && $(attArray).size() > 0) {
						$('#productImg').show();
						$(attArray).each(function(i, o) {
							$('.imgDetail').append('<p class="mart5"><img src="' + o['imgSrc'] + '"></p>\n');
						});
					}
					$('#contentMain').show();
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