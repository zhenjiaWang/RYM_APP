define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $keyManager = require('manager/key');
	var $templete = require('core/templete');
	var queryMap = parseURL();
	var id = queryMap.get('id');
	var userId=queryMap.get('userId');
	var nextIndex = 0;
	var currentWindow;
	reset = function() {
		var commentFooterWin = $windowManager.getById('product_commentFooter');
		if (commentFooterWin) {
			commentFooterWin.evalJS('reset()');
		}
	};
	sendComment = function(content, replyUserId, uid,callback) {
		$nativeUIManager.watting('请稍等...');
		$common.refreshToken(function(tokenId) {
			$.ajax({
				type: 'POST',
				url: $common.getRestApiURL() + '/product/info/addComment',
				dataType: 'json',
				data: {
					id: id,
					userId:uid,
					content: content,
					replyUserId: replyUserId,
					'org.guiceside.web.jsp.taglib.Token': tokenId
				},
				success: function(jsonData) {
					if (jsonData) {
						if (jsonData['result'] == '0') {
							var commentObj = jsonData['commentObj'];
							if (commentObj) {
								if (!$('#commentUL').is(':visible')) {
									$('#commentUL').show();
								}
								$('#commentUL').prepend(String.formatmodel($templete.commentItem(commentObj['replyFlag']), {
									userId: commentObj['userId'],
									headImgUrl: commentObj['headImgUrl'],
									userName: commentObj['userName'],
									dateTime: commentObj['dateTime'],
									content: commentObj['content'],
									replyFlag: commentObj['replyFlag'],
									replyUserName: commentObj['replyUserName']
								}));
								$nativeUIManager.wattingTitle('评论成功!');
								bindEvent();
								window.setTimeout(function() {
									if (typeof callback == 'function') {
										callback();
									}
									var commentCount=$('em','#commentCount').text();
									if(commentCount){
										commentCount=parseInt(commentCount);
										$('em','#commentCount').text(commentCount+1);
									}
									$nativeUIManager.wattingClose();
								}, 1000);
							}
						} else {
							$nativeUIManager.wattingClose();
							$nativeUIManager.alert('提示', '发表评论失败', 'OK', function() {});
						}
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					$nativeUIManager.wattingClose();
					$nativeUIManager.alert('提示', '发表评论失败', 'OK', function() {});
				}
			});
		});
	}
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
		$common.touchSE($('li', '#commentUL'), function(event, startTouch, o) {}, function(event, o) {
			var userName = $(o).attr('userName');
			var userId = $(o).attr('userId');
			if (userId && userName) {
				var commentFooterWin = $windowManager.getById('product_commentFooter');
				if (commentFooterWin) {
					commentFooterWin.evalJS('reply("' + userId + '","' + userName + '")');
				}
			}
		});

		$common.touchSE($('#likeAction'), function(event, startTouch, o) {}, function(event, o) {
			$nativeUIManager.watting('请稍等...');
			$(o).hide();
			$common.refreshToken(function(tokenId) {
				$.ajax({
					type: 'POST',
					url: $common.getRestApiURL() + '/product/info/addLike',
					dataType: 'json',
					data: {
						id: id,
						userId:userId,
						'org.guiceside.web.jsp.taglib.Token': tokenId
					},
					success: function(jsonData) {
						if (jsonData) {
							if (jsonData['result'] == '0') {
								var currentLikeCount = $('#likeSpan').find('em').text();
								if (currentLikeCount) {
									currentLikeCount = parseInt(currentLikeCount);
									currentLikeCount += 1;
									$('#likeSpan').addClass('current');
									$('#likeSpan').find('em').text(currentLikeCount);
									$(o).remove();
									$nativeUIManager.wattingTitle('谢谢亲给的赞!');
									window.setTimeout(function(){
										$nativeUIManager.wattingClose();
									},1000);
								}
							} else if (jsonData['result'] == '1') {
								$nativeUIManager.wattingClose();
								$nativeUIManager.alert('提示', '请不要重复点赞!', 'OK', function() {});
							} else {
								$nativeUIManager.wattingClose();
								$nativeUIManager.alert('提示', '点赞失败咯', 'OK', function() {});
							}
						}
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						$nativeUIManager.wattingClose();
						$nativeUIManager.alert('提示', '点赞失败咯', 'OK', function() {});
					}
				});
			});
		});
		document.addEventListener("plusscrollbottom", function() {
			var next = $('#commentUL').attr('nextIndex');
			if (next) {
				if (next > 0) {
					nextIndex = next;
					$nativeUIManager.watting('正在加载更多...');
					$('#commentUL').attr('nextIndex', 0);
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
			$nativeUIManager.watting('正在加载评论...');
		}
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/product/info/commentView',
			dataType: 'json',
			data: {
				id: id,
				userId:userId
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						$nativeUIManager.wattingClose();
						var likeCount = jsonData['likeCount'];
						likeCount = parseInt(likeCount);
						if (likeCount > 0) {
							$('#likeSpan').addClass('current');
							$('#likeSpan').find('em').text(likeCount);
						}
						var myLikeCount = jsonData['myLikeCount'];
						if (myLikeCount == 0) {
							$('#likeAction').show();
						}
						$('.commentTop').show();
						var commentArray = jsonData['commentArray'];
						var sb = new StringBuilder();
						if (commentArray && $(commentArray).size() > 0) {
							$(commentArray).each(function(i, o) {
								sb.append(String.formatmodel($templete.commentItem(o['replyFlag']), {
									userId: o['userId'],
									headImgUrl: o['headImgUrl'],
									userName: o['userName'],
									dateTime: o['dateTime'],
									content: o['content'],
									replyFlag: o['replyFlag'],
									replyUserName: o['replyUserName']
								}));
							});
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
							$('em','#commentCount').text(page['totalRecord']);
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
		loadData();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});