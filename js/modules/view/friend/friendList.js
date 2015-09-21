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
	onRefresh = function() {
		nextIndex = 0;
		$('.workData').attr('nextIndex', 0);
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
		$common.touchSE($('#addProductBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.create('product_add', '../product/add.html', false, true, function(show) {
				show();
				var lunchWindow = $windowManager.getLaunchWindow();
				if (lunchWindow) {
					lunchWindow.evalJS('plusRest()');
				}
			});
		});
		$common.touchSE($('#relationProductBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.create('product_relation', '../product/send.html', false, true, function(show) {
				show();
				var lunchWindow = $windowManager.getLaunchWindow();
				if (lunchWindow) {
					lunchWindow.evalJS('plusRest()');
				}
			});
		});
		document.addEventListener("plusscrollbottom", function() {
			var next = $('#friendUL').attr('nextIndex');
			if (next) {
				if (next > 0) {
					nextIndex = next;
					$nativeUIManager.watting('正在加载更多...');
					$('#friendUL').attr('nextIndex', 0);
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
			url: $common.getRestApiURL() + '/social/friendPlanner',
			dataType: 'json',
			data: {
				start: nextIndex > 0 ? nextIndex : ''
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						var friendPlannerArray = jsonData['friendPlannerArray'];
						var sb = new StringBuilder();
						if (friendPlannerArray && $(friendPlannerArray).size() > 0) {
							$(friendPlannerArray).each(function(i, o) {
								var textClass = '';
								if (o['state'] == '1') {
									textClass = 'icon-8';
								} else if (o['state'] == '2') {
									textClass = 'icon-7';
								}
								sb.append(String.formatmodel($templete.friendPlannerItem(), {
									userId: o['userId'],
									userName: o['userName'],
									headImgUrl: o['headImgUrl'],
									orgName: o['orgName'],
									text: o['text'],
									follow: o['follow'],
									friends: o['friends'],
									signature: o['signature'],
									textClass: textClass
								}));
							});
						} else {
							$('#blank').show();
						}
						if (append) {
							$('#friendUL').append(sb.toString());
						} else {
							$('#friendUL').empty().append(sb.toString());
						}
						nextIndex = 0;
						$('#friendUL').attr('nextIndex', 0);
						var page = jsonData['page'];
						if (page) {
							if (page['hasNextPage'] == true) {
								$('#friendUL').attr('nextIndex', page['nextIndex']);
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