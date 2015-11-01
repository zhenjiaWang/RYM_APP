define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $keyManager = require('manager/key');
	var $templete = require('core/templete');
	var queryMap = parseURL();
	var targetId = queryMap.get('targetId');
	var nextIndex = 0;
	var currentWindow;
	var productUserId = false;
	toBottom = function() {
		var div = $('.main').get(0);
		div.scrollTop = div.scrollHeight;
	};
	onRefresh = function() {
		nextIndex = 0;
		$('.main').attr('nextIndex', 0);
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
	sendComment = function(content) {
		$common.refreshToken(function(tokenId) {
			$.ajax({
				type: 'POST',
				url: $common.getRestApiURL() + '/social/friendPm/send',
				dataType: 'json',
				data: {
					targetId: targetId,
					content: content,
					'org.guiceside.web.jsp.taglib.Token': tokenId
				},
				success: function(jsonData) {
					if (jsonData) {
						if (jsonData['result'] == '0') {} else {
							$nativeUIManager.alert('提示', '私信发送失败', 'OK', function() {});
						}
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					$nativeUIManager.alert('提示', '私信发送失败', 'OK', function() {});
				}
			});
		});
	};
	bindEvent = function() {
		$common.touchSE($('.btnSend'), function(event, startTouch, o) {}, function(event, o) {
			var content = $('#content').html();
			if (content && content != '') {
				$('#content').html('');
				var now = new Date();
				var dateKey = now.getFullYear() + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate();
				if (dateKey) {
					var dateKeyCount = $('.timeBar[dir="' + dateKey + '"]').size();
					var sb = new StringBuilder();
					if (dateKeyCount == 0) {
						sb.append('<p class="aligncenter"><span class="timeBar" dir="' + dateKey + '">' + dateKey + '</span></p>');
					}
					sb.append(String.formatmodel($templete.pmItem('me'), {
						headImgUrl: $userInfo.get('headImgUrl'),
						content: content,
						feedRight: 'feedRight'
					}));
					$('.main').append(sb.toString());
					toBottom();
				}
				sendComment(content);
			} else {
				$nativeUIManager.alert('提示', '请先输入内容', 'OK', function() {});
			}
		});

		$common.touchSE($('.userPhoto', '.main'), function(event, startTouch, o) {}, function(event, o) {
			var section = $(o).closest('section');
			if (section) {
				if (!$(section).hasClass('feedRight')) {
					var userId = $(section).attr('userId');
					var userName = $(section).attr('userName');
					if (userId && userName) {
						$windowManager.create('product_footer_pop', '../product/footerPop.html?userId=' + userId + '&userName=' + userName, false, true, function(show) {
							show();
						});
					}
				}
			}
		});
	};
	loadData = function(callback, append) {
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/social/friendPm',
			dataType: 'json',
			data: {
				targetId: targetId
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						$nativeUIManager.wattingClose();
						var dateArray = jsonData['dateArray'];
						var sb = new StringBuilder();
						if (dateArray && $(dateArray).size() > 0) {
							$(dateArray).each(function(i, datekey) {
								var pmArray = jsonData[datekey];
								if (pmArray && $(pmArray).size() > 0) {
									sb.append('<p class="aligncenter"><span class="timeBar" dir="' + datekey + '">' + datekey + '</span></p>');
									$(pmArray).each(function(j, pm) {
										var type = pm['type'];
										sb.append(String.formatmodel($templete.pmItem(type), {
											userId: pm['sendUserId'],
											userName: pm['sendUserName'],
											sendType:'app',
											headImgUrl: pm['headImgUrl'],
											content: pm['content'],
											feedRight: type == 'me' ? 'feedRight' : ''
										}));
									});
								}
							});
							$('#blank').hide();
							$('.main').append(sb.toString());
							toBottom();
						} else {
							$('#blank').show();
						}
						nextIndex = 0;
						$('.main').attr('nextIndex', 0);
						var page = jsonData['page'];
						if (page) {
							if (page['hasNextPage'] == true) {
								$('.main').attr('nextIndex', page['nextIndex']);
							}
						}
						pullToRefreshEvent();
						bindEvent();
						if (typeof callback == 'function') {
							callback();
						}
					} else {
						if (typeof callback == 'function') {
							callback();
						}
						$nativeUIManager.alert('提示', '加载评论失败', 'OK', function() {});
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				if (typeof callback == 'function') {
					callback();
				}
				$nativeUIManager.alert('提示', '加载评论失败', 'OK', function() {});
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