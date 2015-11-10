define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $keyManager = require('manager/key');
	var $templete = require('core/templete');
	var queryMap = parseURL();
	var targetId = queryMap.get('targetId');
	var type = queryMap.get('type');
	var nextIndex = 0;
	var currentWindow;
	var productUserId = false;
	toBottom = function() {
		var div = $('.main').get(0);
		div.scrollTop = div.scrollHeight;
	};
	onRefresh = function() {
		var next = $('.main').attr('nextIndex');
		if (next) {
			console.info(next);
			if (next > 0) {
				nextIndex = next;
				$('.main').attr('nextIndex', 0);
				loadData(function() {
					currentWindow.endPullToRefresh();
				}, true);
			} else {
				$nativeUIManager.watting('没有历史记录了!', 1500);
				currentWindow.endPullToRefresh();
			}
		}
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
				url: $common.getRestApiURL() + '/social/friendPm/sendCustomer',
				dataType: 'json',
				data: {
					targetId: targetId,
					content: content,
					'org.guiceside.web.jsp.taglib.Token': tokenId
				},
				success: function(jsonData) {
					if (jsonData) {
						if (jsonData['result'] == '0') {
							
						}else {
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
					var sendType = $(section).attr('sendType');
					if (sendType && userId && userName) {
						if (sendType == 'app') {
							$windowManager.create('product_footer_pop', '../product/footerPop.html?userId=' + userId + '&userName=' + userName, false, true, function(show) {
								show();
							});
						}
					}
				}
			}
		});
	};
	loadData = function(callback, before) {
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/social/friendPm/customer',
			dataType: 'json',
			data: {
				targetId: targetId,
				type: type,
				start: nextIndex > 0 ? nextIndex : ''
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						$nativeUIManager.wattingClose();
						var dateArray = jsonData['dateArray'];
						var sb = new StringBuilder();
						var status=jsonData['status'];
						if(status!='ok'){
							$('.main').css('bottom','0px');
							$('.footer').hide();
							if(status=='notMyPlanner'){
								$nativeUIManager.alert('提示', '你已被对方取消关注', 'OK', function() {});
							}else if(status=='blackList'){
									$nativeUIManager.alert('提示', '你已被对方拉黑', 'OK', function() {});
							}
						}
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
											sendType: pm['sendType'],
											headImgUrl: pm['headImgUrl'],
											content: pm['content'],
											feedRight: type == 'me' ? 'feedRight' : ''
										}));
									});
								}
							});
							$('#blank').hide();
							if (before) {
								$('p', '.main').first().before(sb.toString());
							} else {
								$('.main').append(sb.toString());
								toBottom();
							}
						} else {
							$('#blank').show();
						}
						nextIndex = 0;
						$('.main').attr('nextIndex', 0);
						var page = jsonData['page'];
						if (page) {
							console.info(JSON.stringify(page))
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
						$nativeUIManager.alert('提示', '加载消息失败', 'OK', function() {});
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				if (typeof callback == 'function') {
					callback();
				}
				$nativeUIManager.alert('提示', '加载消息失败', 'OK', function() {});
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