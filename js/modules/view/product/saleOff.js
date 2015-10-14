define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var $templete = require('core/templete');
	var nextIndex = 0;
	var currentWindow;
	var queryMap = parseURL();
	var userId = queryMap.get('userId');
	onRefresh = function() {
		window.setTimeout(function() {
			nextIndex = 0;
			$('.cardBox').attr('nextIndex', 0);
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
		$common.touchSE($('.openView', '.cardBox'), function(event, startTouch, o) {}, function(event, o) {
			var typeId = $(o).closest('.oneCard').attr('typeId');
			var uid = $(o).closest('.oneCard').attr('uid');
			if (typeId && uid) {
				$windowManager.create('product_view_header', 'viewHeader.html?id=' + uid + '&tab=saleOff&typeId=' + typeId, false, true, function(show) {
					show();
				});
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
		$common.touchSE($('.viewSpan', '.cardBox'), function(event, startTouch, o) {}, function(event, o) {
			event.stopPropagation();
			var viewCount = $(o).closest('.oneCard').attr('viewCount');
			var uid = $(o).closest('.oneCard').attr('uid');
			var productName = $(o).closest('.oneCard').attr('productName');
			if (viewCount&&uid&&productName) {
				viewCount = parseInt(viewCount);
				if (viewCount > 0) {
					if (userId == $userInfo.get('userId')) {
						$windowManager.create('product_view_list_header', '../productView/header.html?id=' + uid + '&tab=sale&productName='+productName, false, true, function(show) {
							show();
						});
					}
				}
			}
		});
		$common.touchSE($('#relationProductBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.create('relation_header', '../relation/header.html', false, true, function(show) {
				show();
				var lunchWindow = $windowManager.getLaunchWindow();
				if (lunchWindow) {
					lunchWindow.evalJS('plusRest()');
				}
			});
		});
		$common.touchSE($('.commentBtn', '.cardBox'), function(event, startTouch, o) {}, function(event, o) {
			event.stopPropagation();
			var card = $(o).closest('.oneCard');
			if (card) {
				var uid = $(card).attr('uid');
				if (uid) {
					$windowManager.create('product_commentFooter', 'commentFooter.html?id=' + uid+'&tab=saleOff', false, true, function(show) {
						show();
					});
				}
			}
		});
		document.addEventListener("plusscrollbottom", function() {
			var next = $('.cardBox').attr('nextIndex');
			if (next) {
				if (next > 0) {
					nextIndex = next;
					$nativeUIManager.watting('正在加载更多...');
					$('.cardBox').attr('nextIndex', 0);
					window.setTimeout(function() {
						loadData(function() {
							$nativeUIManager.wattingClose();
						}, true);
					}, 500);
				}
			}
		});
	};
	loadData = function(callback,append) {
		if (!callback) {
			$nativeUIManager.watting('正在加载...');
		}
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/product/info/saleOffListData',
			dataType: 'json',
			data: {
				userId: userId,
				start: nextIndex > 0 ? nextIndex : ''
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						if(userId!=$userInfo.get('userId')){
							$('#footerTools').show();
							$('.main').css('padding-bottom','50px');
						}
						var productArray = jsonData['productArray'];
						var sb = new StringBuilder();
						if (productArray && $(productArray).size() > 0) {
							$('#blank').hide();
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
												viewCount: o['viewCount'],
												relationCount: o['relationCount'],
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
												viewCount: o['viewCount'],
												relationCount: o['relationCount'],
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
						} else {
							$('.cardBox').empty();
							$('#blank').show();
						}
						if (append) {
							$('.cardBox').append(sb.toString());
						} else {
							$('.cardBox').empty().append(sb.toString());
						}
						nextIndex = 0;
						$('.cardBox').attr('nextIndex', 0);
						var page = jsonData['page'];
						if (page) {
							if (page['hasNextPage'] == true) {
								$('.cardBox').attr('nextIndex', page['nextIndex']);
							}
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