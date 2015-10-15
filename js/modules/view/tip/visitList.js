define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var $keyManager = require('manager/key');
	var $templete = require('core/templete');
	var queryMap = parseURL();
	var id = queryMap.get('id');
	var tab = queryMap.get('tab');
	var nextIndex = 0;
	var currentWindow;
	onRefresh = function() {
		nextIndex = 0;
		$('#visitDIV').attr('nextIndex', 0);
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
	bindEvent = function() {

		$common.touchSE($('.personBoard', '#visitDIV'), function(event, startTouch, o) {}, function(event, o) {
			var userId = $(o).attr('userId');
			var visitType = $(o).attr('visitType');
			var userName = $(o).attr('userName');
			if (visitType && visitType == 'app') {
				if (userId && userName) {
					$windowManager.create('product_header_pop', '../product/headerPop.html?userId=' + userId + '&userName=' + userName, false, true, function(show) {
						show();
					});
				}
			}else{
				$nativeUIManager.watting('客户没有理财室信息供给查看',1000);
			}

		});
		document.addEventListener("plusscrollbottom", function() {
			var next = $('#visitDIV').attr('nextIndex');
			if (next) {
				if (next > 0) {
					nextIndex = next;
					$nativeUIManager.watting('正在加载更多...');
					$('#visitDIV').attr('nextIndex', 0);
					window.setTimeout(function() {
						loadData(function() {
							$nativeUIManager.wattingClose();
						}, true);
					}, 500);
				}
			}
		});
	};
	loadData = function(callback, append) {
		if (!callback) {
			$nativeUIManager.watting('正在加载...');
		}
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/product/info/visitList',
			dataType: 'json',
			data: {
				start: nextIndex > 0 ? nextIndex : ''
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						var tipListWin = $windowManager.getById('tip_list');
						if (tipListWin) {
							$userInfo.put('visitCount', '0');
							tipListWin.evalJS('loadTip()');
						}
						var visitArray = jsonData['visitArray'];
						var sb = new StringBuilder();
						if (visitArray && $(visitArray).size() > 0) {
							$('#blank').hide();
							$(visitArray).each(function(i, o) {
								sb.append(String.formatmodel($templete.visitItem(), {
									userId: o['userId'],
									visitType: o['visitType'],
									userName: o['userName'],
									headImgUrl: o['headImgUrl'],
									type: o['type'],
									updateTime: o['updateTime']
								}));
							});
						} else {
							$('#blank').show();
						}
						if (append) {
							$('#visitDIV').append(sb.toString());
						} else {
							$('#visitDIV').empty().append(sb.toString());
						}
						nextIndex = 0;
						$('#visitDIV').attr('nextIndex', 0);
						var page = jsonData['page'];
						if (page) {
							if (page['hasNextPage'] == true) {
								$('#visitDIV').attr('nextIndex', page['nextIndex']);
							}
						}
						pullToRefreshEvent();
						bindEvent();
						if (!callback) {
							$nativeUIManager.wattingClose();
						}
						if (typeof callback == 'function') {
							callback();
						}
					} else {
						if (!callback) {
							$nativeUIManager.wattingClose();
						}
						if (typeof callback == 'function') {
							callback();
						}
						$nativeUIManager.alert('提示', '获取信息失败', 'OK', function() {});
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				if (!callback) {
					$nativeUIManager.wattingClose();
				}
				if (typeof callback == 'function') {
					callback();
				}
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