define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $keyManager = require('manager/key');
	var $templete = require('core/templete');
	var queryMap = parseURL();
	var id = queryMap.get('id');
	var tab = queryMap.get('tab');
	var userId = queryMap.get('userId');
	var _replyId = queryMap.get('replyId');
	var _userName = queryMap.get('userName');
	var _commentType = queryMap.get('commentType');
	var nextIndex = 0;
	var currentWindow;
	var productUserId = false;
	reset = function() {
		$('#content').attr('replyId', '').attr('commentType', '').html('');
		$('#replyTip').text('').hide();
		$(".main").animate({
			scrollTop: 0
		}, 200);
	};
	reply = function(uid, userName, commentType) {
		$keyManager.openSoftKeyboard(function() {
			$('#replyTip').text('回复 ' + userName).show();
			$('#content').attr('replyId', uid).attr('commentType', commentType).text('').get(0).focus();
		});
	};
	sendComment = function(content, replyId, commentType, callback) {
		$nativeUIManager.watting('请稍等...');
		$common.refreshToken(function(tokenId) {
			$.ajax({
				type: 'POST',
				url: $common.getRestApiURL() + '/product/info/addComment',
				dataType: 'json',
				data: {
					id: id,
					tab: tab,
					userId: userId,
					commentType: commentType,
					content: content,
					replyId: replyId,
					'org.guiceside.web.jsp.taglib.Token': tokenId
				},
				success: function(jsonData) {
					if (jsonData) {
						if (jsonData['result'] == '0') {
							var commentObj = jsonData['commentObj'];
							if (commentObj) {
								if (!$('#commentUL').is(':visible')) {
									$('#commentUL').show();
									$('#blank').hide();
								}
								$('#commentUL').prepend(String.formatmodel($templete.commentContentItem(commentObj['replyFlag']), {
									uid: commentObj['uid'],
									userId: commentObj['userId'],
									headImgUrl: commentObj['headImgUrl'],
									userName: commentObj['userName'],
									dateTime: commentObj['dateTime'],
									content: commentObj['content'],
									replyFlag: commentObj['replyFlag'],
									replyUserName: commentObj['replyUserName'],
									commentType: commentObj['commentType'],
								}));
								$nativeUIManager.wattingTitle('评论成功!');
								bindEvent();
								window.setTimeout(function() {
									if (typeof callback == 'function') {
										callback();
									}
									var commentCount = $('em', '#commentCount').text();
									if (commentCount) {
										commentCount = parseInt(commentCount);
										$('em', '#commentCount').text(commentCount + 1);
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
	};
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
	deleteComment = function(uid) {
		$nativeUIManager.watting('请稍等...');
		$common.refreshToken(function(tokenId) {
			$.ajax({
				type: 'POST',
				url: $common.getRestApiURL() + '/product/info/deleteComment',
				dataType: 'json',
				data: {
					id: uid,
					'org.guiceside.web.jsp.taglib.Token': tokenId
				},
				success: function(jsonData) {
					if (jsonData) {
						if (jsonData['result'] == '0') {
							$nativeUIManager.wattingTitle('删除 成功!');
							$('li[uid="' + uid + '"]', '#commentUL').remove();
							if ($('li', '#commentUL').size() == 0) {
								$('#commentUL').hide();
								$('#blank').show();
							}
							window.setTimeout(function() {
								var commentCount = $('em', '#commentCount').text();
								if (commentCount) {
									commentCount = parseInt(commentCount);
									$('em', '#commentCount').text(commentCount - 1);
								}
								$nativeUIManager.wattingClose();
							}, 1000);
						} else {
							$nativeUIManager.wattingClose();
							$nativeUIManager.alert('提示', '删除评论失败', 'OK', function() {});
						}
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					$nativeUIManager.wattingClose();
					$nativeUIManager.alert('提示', '删除评论失败', 'OK', function() {});
				}
			});
		});
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
				window.setTimeout(function(){
					$("#content").get(0).focus();
				},500);
			});
		});

		$common.touchSE($('.btnSend'), function(event, startTouch, o) {}, function(event, o) {
			var content = $('#content').html();
			if (content && content != '') {
				var replyId = $('#content').attr('replyId');
				var commentType = $('#content').attr('commentType');
				sendComment(content, replyId, commentType, reset);
			} else {
				$nativeUIManager.alert('提示', '请先输入评论内容', 'OK', function() {});
			}
		});
		$common.touchSE($('.userPhoto', '#commentUL'), function(event, startTouch, o) {}, function(event, o) {
			event.stopPropagation();
			var li = $(o).closest('li');
			if (li) {
				var commentType = $(li).attr('commentType');
				if (commentType) {
					if (commentType == 'app') {
						var userId = $(li).attr('userId');
						var userName = $(li).attr('userName');
						if (userId && userName) {
							$windowManager.create('product_footer_pop', 'footerPop.html?userId=' + userId + '&userName=' + userName, false, true, function(show) {
								show();
							});
						}
					}
				}
			}
		});
		$common.touchSE($('li', '#commentUL'), function(event, startTouch, o) {}, function(event, o) {
			var userName = $(o).attr('userName');
			var userID = $(o).attr('userId');
			var uid = $(o).attr('uid');
			var commentType = $(o).attr('commentType');
			if (userID && userName && uid && commentType) {
				if (productUserId && productUserId == $userInfo.get('userId')) {
					$nativeUIManager.confactionSheetirm('请选择操作', '取消', [{
							title: '回复'
						}, {
							title: '删除评论'
						}],
						function(index) {
							if (index > 0) {
								if (index == 1) {
									reply(uid, userName, commentType);
								} else if (index == 2) {
									$nativeUIManager.confirm('提示', '你确定要删除该条评论?', ['确定', '取消'], function() {
										deleteComment(uid);
									}, function() {});
								}
							}
						});
				} else {
					if (userID == $userInfo.get('userId')) {
						$nativeUIManager.confactionSheetirm('请选择操作', '取消', [{
								title: '回复'
							}, {
								title: '删除评论'
							}],
							function(index) {
								if (index > 0) {
									if (index == 1) {
										reply(uid, userName, commentType);
									} else if (index == 2) {
										$nativeUIManager.confirm('提示', '你确定要删除该条评论?', ['确定', '取消'], function() {
											deleteComment(uid);
										}, function() {});
									}
								}
							});
					} else {
						reply(uid, userName, commentType);
					}
				}
			}
		});

		$common.touchSE($('#likeAction'), function(event, startTouch, o) {}, function(event, o) {
			$nativeUIManager.watting('请稍等...');
			var action = $(o).attr('action');
			if (action) {
				$common.refreshToken(function(tokenId) {
					$.ajax({
						type: 'POST',
						url: $common.getRestApiURL() + '/product/info/' + action,
						dataType: 'json',
						data: {
							id: id,
							tab: tab,
							userId: userId,
							'org.guiceside.web.jsp.taglib.Token': tokenId
						},
						success: function(jsonData) {
							if (jsonData) {
								if (jsonData['result'] == '0') {
									if (action == 'addLike') {
										var currentLikeCount = $('#likeSpan').find('em').text();
										if (currentLikeCount) {
											currentLikeCount = parseInt(currentLikeCount);
											currentLikeCount += 1;
											$('#likeSpan').addClass('current');
											$('#likeSpan').find('em').text(currentLikeCount);
											$(o).text('取消赞').attr('action', 'cancelLike');
											$nativeUIManager.wattingTitle('谢谢亲给的赞!');
											window.setTimeout(function() {
												$nativeUIManager.wattingClose();
											}, 1000);
										}
									} else if (action == 'cancelLike') {
										var currentLikeCount = $('#likeSpan').find('em').text();
										if (currentLikeCount) {
											currentLikeCount = parseInt(currentLikeCount);
											currentLikeCount -= 1;
											if (currentLikeCount > 0) {
												$('#likeSpan').addClass('current');
											} else {
												$('#likeSpan').removeClass('current');
											}
											$('#likeSpan').find('em').text(currentLikeCount);
											$(o).text('赞一下').attr('action', 'addLike');
											$nativeUIManager.wattingTitle('希望再得到亲的赞!');
											window.setTimeout(function() {
												$nativeUIManager.wattingClose();
											}, 1000);
										}
									}
								} else if (jsonData['result'] == '1') {
									$nativeUIManager.wattingClose();
									if (action == 'addLike') {
										$nativeUIManager.alert('提示', '请不要重复点赞!', 'OK', function() {});
									} else if (action == 'cancelLike') {
										$nativeUIManager.alert('提示', '请不要重复取消赞!', 'OK', function() {});
									}
								} else {
									$nativeUIManager.wattingClose();
									$nativeUIManager.alert('提示', '操作失败', 'OK', function() {});
								}
							}
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) {
							$nativeUIManager.wattingClose();
							$nativeUIManager.alert('提示', '操作失败', 'OK', function() {});
						}
					});
				});
			}
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
				tab: tab,
				userId: userId
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						var productSb = new StringBuilder();
						var productInfo = jsonData['productInfo'];
						if (productInfo) {
							if (productInfo['typeId'] == 1) {
								var financial = jsonData['financial'];
								if (financial) {
									productSb.append(String.formatmodel($templete.commentProductFinancial(), {
										typeName: productInfo['typeName'],
										name: productInfo['name'],
										minYield: financial['minYield'],
										maxYield: financial['maxYield'],
										minLimitDay: financial['minLimitDay'],
										maxLimitDay: financial['maxLimitDay']
									}));
								}
							} else if (productInfo['typeId'] == 2) {
								var fund = jsonData['fund'];
								if (fund) {
									productSb.append(String.formatmodel($templete.commentProductFund(), {
										typeName: productInfo['typeName'],
										name: productInfo['name'],
										fundType: fund['fundType']
									}));
								}
							} else if (productInfo['typeId'] == 3) {
								var trust = jsonData['trust'];
								if (trust) {
									productSb.append(String.formatmodel($templete.commentProductTrust(), {
										typeName: productInfo['typeName'],
										name: productInfo['name'],
										dayLimit: trust['dayLimit'],
										yield: trust['yield']
									}));
								}
							}
							$('.oneCard').remove();
							$('.commentTop').before(productSb.toString());
						}
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
									replyUserName: o['replyUserName'],
									commentType: o['commentType'],
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
						if (_replyId && _commentType && _userName) {
							reply(_replyId, _userName, _commentType);
						}
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