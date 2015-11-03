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
		$('#commentDIV').attr('nextIndex', 0);
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
		
		$('#content').off('valuechange').on('valuechange', function(e) {
			var value = $(this).text();
			if (value) {
				if (value != '') {
					$('#replyTip').hide();
				} else {
					$('#replyTip').show();
				}
			} else {
				$('#replyTip').show();
			}
		});
		$common.touchSE($('#replyTip'), function(event, startTouch, o) {}, function(event, o) {
			$keyManager.openSoftKeyboard(function() {
				$('#content').get(0).focus();
			});
		});
		$common.touchSE($('.userPhoto', '#commentDIV'), function(event, startTouch, o) {}, function(event, o) {
			event.stopPropagation();
			var section = $(o).closest('section');
			if (section) {
				var commentType = $(section).attr('commentType');
				if (commentType) {
					if (commentType == 'app') {
						var userId = $(section).attr('userId');
						var userName = $(section).attr('userName');
						if (userId && userName) {
							$windowManager.create('product_footer_pop', 'footerPop.html?userId=' + userId + '&userName=' + userName, false, true, function(show) {
								show();
							});
						}
					} else {
						$nativeUIManager.watting('客户没有理财室信息供给查看', 1000);
					}
				}
			}
		});
		$common.touchSE($('.personBoard', '#commentDIV'), function(event, startTouch, o) {}, function(event, o) {
			var productId = $(o).attr('productId');
			var replyId = $(o).attr('uid');
			var userName = $(o).attr('userName');
			var commentType = $(o).attr('commentType');
			if (productId&&replyId&&userName&&commentType) {
				$windowManager.create('product_commentHeader', '../product/commentHeader.html?id=' + productId + '&userId=' + $userInfo.get('userId')+'&replyId='+replyId+'&commentType='+commentType+'&userName='+userName, false, true, function(show) {
					show();
				});
			}
		});
	
		document.addEventListener("plusscrollbottom", function() {
			var next = $('#commentDIV').attr('nextIndex');
			if (next) {
				if (next > 0) {
					nextIndex = next;
					$nativeUIManager.watting('正在加载更多...');
					$('#commentDIV').attr('nextIndex', 0);
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
			url: $common.getRestApiURL() + '/product/info/replyList',
			dataType: 'json',
			data: {
				start: nextIndex > 0 ? nextIndex : ''
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						var tipListWin = $windowManager.getById('tip_list');
						if (tipListWin) {
							$userInfo.put('replyCount', '0');
							tipListWin.evalJS('loadTip()');
						}
						var replyArray = jsonData['replyArray'];
						var sb = new StringBuilder();
						if (replyArray && $(replyArray).size() > 0) {
							$('#blank').hide();
							$(replyArray).each(function(i, o) {
								sb.append(String.formatmodel($templete.commentItem(), {
									userId: o['userId'],
									userName: o['userName'],
									headImgUrl: o['headImgUrl'],
									uid: o['uid'],
									commentType: o['commentType'],
									productUserId: o['productUserId'],
									type: o['type'],
									updateTime: o['updateTime'],
									productName: o['productName'],
									productId: o['productId'],
									content: o['content']
								}));
							});
						} else {
							$('#blank').show();
						}
						if (append) {
							$('#commentDIV').append(sb.toString());
						} else {
							$('#commentDIV').empty().append(sb.toString());
						}
						nextIndex = 0;
						$('#commentDIV').attr('nextIndex', 0);
						var page = jsonData['page'];
						if (page) {
							if (page['hasNextPage'] == true) {
								$('#commentDIV').attr('nextIndex', page['nextIndex']);
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
		var obj = $windowManager.current();
		if (obj) {
			obj.setStyle({
				'softinputMode': 'adjustResize'
			});
		}
		loadData();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});