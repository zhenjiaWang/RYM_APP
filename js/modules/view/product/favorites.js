define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var $templete = require('core/templete');
	onRefresh = function() {
		window.setTimeout(function() {
			loadData(function() {
				currentWindow.endPullToRefresh();
			});
		}, 500);
	};
	pullToRefreshEvent = function() {
		currentWindow = $windowManager.current();
		currentWindow.setPullToRefresh({
			support: true,
			height: "50px",
			range: "200px",
			contentdown: {
				caption: "下拉可以刷新"
			},
			contentover: {
				caption: "释放立即刷新"
			},
			contentrefresh: {
				caption: "正在刷新..."
			}
		}, onRefresh);
	};
	showAddTools = function() {
		$('.footerMask').css('bottom', '0px');
		$('#bottomPop').addClass('current');
	};
	hideAddTools = function() {
		$('.footerMask').css('bottom', '-99px');
		$('#bottomPop').removeClass('current');
	};
	bindEvent = function() {
		$common.touchSE($('.oneCard', '.cardBox'), function(event, startTouch, o) {}, function(event, o) {
			var typeId = $(o).attr('typeId');
			var uid = $(o).attr('uid');
			if (typeId && uid) {
				if (typeId == '1') {
					$windowManager.create('product_view', 'viewFinancial.html?id=' + uid + '&tab=favorites', false, true, function(show) {
						show();
					});
				} else if (typeId == '2') {
					$windowManager.create('product_view', 'viewFund.html?id=' + uid + '&tab=favorites', false, true, function(show) {
						show();
					});
				} else if (typeId == '3') {
					$windowManager.create('product_view', 'viewTrust.html?id=' + uid + '&tab=favorites', false, true, function(show) {
						show();
					});
				}
			}
		});
		$common.touchSE($('#addProductBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.create('product_add', 'add.html', false, true, function(show) {
				show();
				var lunchWindow = $windowManager.getLaunchWindow();
				if (lunchWindow) {
					lunchWindow.evalJS('plusRest()');
				}
			});
		});
		$common.touchSE($('#relationProductBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.create('product_relation', 'send.html', false, true, function(show) {
				show();
				var lunchWindow = $windowManager.getLaunchWindow();
				if (lunchWindow) {
					lunchWindow.evalJS('plusRest()');
				}
			});
		});
	};
	loadData = function(callback) {
		if (!callback) {
			$nativeUIManager.watting('正在加载...');
		}
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/product/info/favoritesListData',
			dataType: 'json',
			data: {
				userId: $userInfo.get('userId')
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						var productArray = jsonData['productArray'];
						if (productArray && $(productArray).size() > 0) {
							$('#blank').hide();
							var sb = new StringBuilder();
							$(productArray).each(function(i, o) {
								var relationYn = o['relationYn'];
								var typeId = o['typeId'];
								var relationYn = o['relationYn'];
								var uid = o['uid'];
								if (typeId && relationYn) {
									if (typeId == 1) {

									} else if (typeId == 2) {
										var fundObj = o['fund'];
										if (fundObj) {
											sb.append(String.formatmodel($templete.fundItem(relationYn), {
												productId: o['productId'],
												userId: o['userId'],
												viewCount:o['viewCount'],
												relationCount:o['relationCount'],
												typeId: typeId,
												uid: uid,
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
												userId: o['userId'],
												viewCount:o['viewCount'],
												relationCount:o['relationCount'],
												typeId: typeId,
												uid: uid,
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
						pullToRefreshEvent();
						bindEvent();
						window, setTimeout(function() {
							$('.main').show();
							if (!callback) {
								$nativeUIManager.wattingClose();
							} else {
								if (typeof callback == 'function') {
									callback();
								}
							}
						}, 500);
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