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
	onRefresh = function() {
		nextIndex = 0;
		$('#commentUL').attr('nextIndex', 0);
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
		
		
	};
	loadData = function(callback, append) {
		if (!callback) {
			$nativeUIManager.watting('正在加载评论...');
		}
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/product/info/commentView',
			dataType: 'json',
			data: {
				id: id,
				tab: tab,
				userId: userId
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						$nativeUIManager.wattingClose();
						productUserId = jsonData['productUserId'];
						var likeCount = jsonData['likeCount'];
						likeCount = parseInt(likeCount);
						if (likeCount > 0) {
							$('#likeSpan').addClass('current');
							$('#likeSpan').find('em').text(likeCount);
						}
						var myLikeCount = jsonData['myLikeCount'];
						if (myLikeCount == 0) {
							$('#likeAction').text('赞一个').attr('action', 'addLike');
						} else {
							$('#likeAction').text('取消赞').attr('action', 'cancelLike');
						}
						$('.commentTop').show();
						var commentArray = jsonData['commentArray'];
						var sb = new StringBuilder();
						if (commentArray && $(commentArray).size() > 0) {
							$(commentArray).each(function(i, o) {
								sb.append(String.formatmodel($templete.commentContentItem(o['replyFlag']), {
									uid: o['uid'],
									userId: o['userId'],
									headImgUrl: o['headImgUrl'],
									userName: o['userName'],
									dateTime: o['dateTime'],
									content: o['content'],
									replyFlag: o['replyFlag'],
									replyUserName: o['replyUserName']
								}));
							});
							$('#blank').hide();
							$('#commentUL').show();
						} else {
							$('#blank').show();
						}
						if (append) {
							$('#commentUL').append(sb.toString());
						} else {
							$('#commentUL').empty().append(sb.toString());
						}
						nextIndex = 0;
						$('#commentUL').attr('nextIndex', 0);
						var page = jsonData['page'];
						if (page) {
							$('em', '#commentCount').text(page['totalRecord']);
							if (page['hasNextPage'] == true) {
								$('#commentUL').attr('nextIndex', page['nextIndex']);
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
						$nativeUIManager.alert('提示', '加载评论失败', 'OK', function() {});
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
				$nativeUIManager.alert('提示', '加载评论失败', 'OK', function() {});
			}
		});
	};
	plusReady = function() {
		$common.switchOS(function() {
			$('body').addClass('Ios_scroll');
		}, function() {

		});
		var obj=$windowManager.current();
		if(obj){
			obj.setStyle({'softinputMode':'adjustResize'});
		}
		//loadData();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});