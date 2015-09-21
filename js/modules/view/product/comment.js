define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $keyManager = require('manager/key');
	var $templete = require('core/templete');
	var queryMap = parseURL();
	var id = queryMap.get('id');
	var editor = false;
	bindEvent = function() {
		$common.touchSE($('.btnSend'), function(event, startTouch, o) {}, function(event, o) {
			var content = $('#content').text();
			if (content && content != '') {
				$nativeUIManager.watting('请稍等...');
				$common.refreshToken(function(tokenId) {
					$.ajax({
						type: 'POST',
						url: $common.getRestApiURL() + '/product/info/addComment',
						dataType: 'json',
						data: {
							id: id,
							content: content,
							userId: $('#content').attr('replyUserId'),
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
										window.setTimeout(function() {
											$('#content').attr('replyUserId', '').text('');
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
			} else {
				$nativeUIManager.alert('提示', '请先输入评论内容', 'OK', function() {});
			}
		});


		$common.touchSE($('li', '#commentUL'), function(event, startTouch, o) {}, function(event, o) {
			var userName = $(o).attr('userName');
			var userId = $(o).attr('userId');
			if (userId && userName) {
				$keyManager.openSoftKeyboard(function() {
					$('#replyTip').text('回复 ' + userName).show();
					$('#content').attr('replyUserId', userId).text('').get(0).focus();
				});
			}
		});
		$('#content').off('keydown').on('keydown', function(e) {
			e = (e) ? e : ((window.event) ? window.event : "")
			var keyCode = e.keyCode ? e.keyCode : (e.which ? e.which : e.charCode);
			if (keyCode) {
				var value = $(this).text();
				if (value && value != '') {
					$('#replyTip').hide();
				}
			}
		});
		$('#content').off('keyup').on('keyup', function(e) {
			e = (e) ? e : ((window.event) ? window.event : "")
			var keyCode = e.keyCode ? e.keyCode : (e.which ? e.which : e.charCode);
			if (keyCode) {
				var value = $(this).text();
				if (value == '') {
					$('#replyTip').show();
				}
			}
		});


		$common.touchSE($('#likeAction'), function(event, startTouch, o) {}, function(event, o) {
			$(o).hide();
			$common.refreshToken(function(tokenId) {
				$.ajax({
					type: 'POST',
					url: $common.getRestApiURL() + '/product/info/addLike',
					dataType: 'json',
					data: {
						id: id,
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
									$nativeUIManager.watting('谢谢亲给的赞!', 1000);
								}
							} else if (jsonData['result'] == '1') {
								$nativeUIManager.alert('提示', '请不要重复点赞!', 'OK', function() {});
							} else {
								$nativeUIManager.alert('提示', '点赞失败咯', 'OK', function() {});
							}
						}
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						$nativeUIManager.alert('提示', '点赞失败咯', 'OK', function() {});
					}
				});
			});
		});
	};
	loadData = function() {
		$nativeUIManager.watting('正在加载评论');
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/product/info/commentView',
			dataType: 'json',
			data: {
				id: id
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
						} else {
							$('#likeAction').show();
						}
						var commentArray = jsonData['commentArray'];
						if (commentArray && $(commentArray).size() > 0) {
							var sb = new StringBuilder();
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
							$('#commentUL').empty().append(sb.toString());
						} else {
							$('#blank').show();
						}
						bindEvent();
					} else {
						$nativeUIManager.wattingClose();
						$nativeUIManager.alert('提示', '加载评论失败', 'OK', function() {});
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				$nativeUIManager.wattingClose();
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
		$common.touchSE($('#backBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.close();
		});
		//autosize($('#content'));
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});