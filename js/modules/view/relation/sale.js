define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var $templete = require('core/templete');
	var currentWindow;
	bindEvent = function() {
		$common.touchSE($('.oneCard', '.cardBox'), function(event, startTouch, o) {}, function(event, o) {
			var numSeq = $(o).attr('numSeq');
			var userId = $(o).attr('userId');
			var productName = $(o).attr('productName');
			if (numSeq && userId&&productName) {
				$nativeUIManager.watting('请选择发布栏位...');
				window.setTimeout(function() {
					$windowManager.create('relation_send', 'send.html?productName=' + productName + '&userId='+userId+'&numSeq='+numSeq, false, true, function(show) {
						show();
						$nativeUIManager.wattingClose();
					});
				}, 1500);
			}
		});
	};
	loadData = function() {
		var relationSale = $userInfo.get('relationSale');
		if (relationSale) {
			var jsonData = JSON.parse(relationSale);
			if (jsonData) {
				if (jsonData['result'] == '0') {
					var productArray = jsonData['productArray'];
					if (productArray && $(productArray).size() > 0) {
						$('#blank').hide();
						var sb = new StringBuilder();
						$(productArray).each(function(i, o) {
							var typeId = o['typeId'];
							var relationYn = o['relationYn'];
							var uid = o['uid'];
							if (typeId && relationYn && uid) {
								if (typeId == 1) {

								} else if (typeId == 2) {
									var fundObj = o['fund'];
									if (fundObj) {
										sb.append(String.formatmodel($templete.fundItem(relationYn), {
											productId: o['productId'],
											numSeq:o['numSeq'],
											userId: o['userId'],
											relationUserName:o['relationUserName'],
											viewCount: o['viewCount'],
											relationCount: o['relationCount'],
											uid: uid,
											typeId: typeId,
											typeName: o['typeName'],
											name: o['name'],
											updateTime: o['updateTime'],
											fundType: fundObj['fundType']
										}));
									}
								} else if (typeId == 3) {
									var trustObj = o['trust'];
									if (trustObj) {
										sb.append(String.formatmodel($templete.trustItem(relationYn), {
											productId: o['productId'],
											numSeq:o['numSeq'],
											userId: o['userId'],
											relationUserName:o['relationUserName'],
											viewCount: o['viewCount'],
											relationCount: o['relationCount'],
											uid: uid,
											typeId: typeId,
											typeName: o['typeName'],
											name: o['name'],
											updateTime: o['updateTime'],
											yield: trustObj['yield'],
											dayLimit: trustObj['dayLimit']
										}));
									}
								}
							}
						});
						$('.cardBox').empty().append(sb.toString());
					} else {
						$('#blank').show();
					}
					bindEvent();
				} else {
					$nativeUIManager.alert('提示', '获取信息失败', 'OK', function() {});
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