define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var $keyManager = require('manager/key');
	var $scrollEvent = require('manager/scrollEvent');
	var $templete = require('core/templete');
	var nextIndex = 0;
	var currentWindow;
	showAddTools = function() {
		$('#bottomPop').addClass('current');
	};
	hideAddTools = function() {
		$('#bottomPop').removeClass('current');
	};
	bindEvent = function() {
		$common.touchSE($('li', '#messageUL'), function(event, startTouch, o) {}, function(event, o) {
			var type = $(o).attr('type');
			var targetId = $(o).attr('targetId');
			var userName = $(o).attr('userName');
			if (type && targetId && userName) {
				if (type == 'apps') {
					$windowManager.create('pmPlanner_header', '../pmPlanner/header.html?targetId=' + targetId + '&targetName=' + userName + '&tip=1', false, true, function(show) {
						show();
					});
				} else if (type == 'app') {
					$windowManager.create('pmInvestor_header', '../pmInvestor/header.html?targetId=' + targetId + '&targetName=' + userName + '&tip=1&type='+type, false, true, function(show) {
						show();
					});
				}else if (type == 'wx') {
					$windowManager.create('pmInvestor_header', '../pmInvestor/header.html?targetId=' + targetId + '&targetName=' + userName + '&tip=1&type='+type, false, true, function(show) {
						show();
					});
				}
			}
		});
		$common.touchSE($('li', '#tipCountUL'), function(event, startTouch, o) {}, function(event, o) {
			var dir = $(o).attr('dir');
			if (dir) {
				if (dir == 'visit') {
					$windowManager.create('visit_header', 'visitHeader.html', false, true, function(show) {
						show();
					});
				} else if (dir == 'like') {
					$windowManager.create('like_header', 'likeHeader.html', false, true, function(show) {
						show();
					});
				} else if (dir == 'comment') {
					$windowManager.create('comment_header', 'commentHeader.html', false, true, function(show) {
						show();
					});
				}
			}
		});

		$scrollEvent.bindEvent(function() {
			$('#addProductBtn').off('touchstart').off('touchstart');
			$('#relationProductBtn').off('touchstart').off('touchstart');
		}, function() {
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
				$windowManager.create('relation_header', '../relation/header.html', false, true, function(show) {
					show();
					var lunchWindow = $windowManager.getLaunchWindow();
					if (lunchWindow) {
						lunchWindow.evalJS('plusRest()');
					}
				});
			});
		});
	};
	loadData = function() {
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/social/friendPm/message',
			dataType: 'json',
			data: {},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						var contactArray = jsonData['contactArray'];
						if (contactArray && $(contactArray).size() > 0) {
							var sb = new StringBuilder();
							$('#messageUL').show();
							$(contactArray).each(function(i, o) {
								sb.append(String.formatmodel($templete.pmContactItem(o['unRead']), {
									targetId: o['targetId'],
									headImgUrl: o['headImgUrl'],
									userName: o['userName'],
									dateTime: o['dateTime'],
									content: o['content'],
									unRead: o['unRead'],
									type: o['type']
								}));
							});
							$('#messageUL').empty().append(sb.toString());
						} else {
							$('#messageUL').hide();
						}
						bindEvent();
					} else {
						$nativeUIManager.alert('提示', '加载评论失败', 'OK', function() {});
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				$nativeUIManager.alert('提示', '加载评论失败', 'OK', function() {});
			}
		});
	};
	loadTip = function() {
		var visitCount = $userInfo.get('visitCount');
		if (visitCount) {
			visitCount = parseInt(visitCount);
			if (visitCount > 0) {
				$('li[dir="visit"]', '#tipCountUL').find('.icon-p').show().text(visitCount);
			} else {
				$('li[dir="visit"]', '#tipCountUL').find('.icon-p').hide();
			}
		}
		var likeCount = $userInfo.get('likeCount');
		if (likeCount) {
			likeCount = parseInt(likeCount);
			if (likeCount > 0) {
				$('li[dir="like"]', '#tipCountUL').find('.icon-p').show().text(likeCount);
			} else {
				$('li[dir="like"]', '#tipCountUL').find('.icon-p').hide();
			}
		}
		var commentCount = $userInfo.get('commentCount');
		if (commentCount) {
			commentCount = parseInt(commentCount);
			if (commentCount > 0) {
				$('li[dir="comment"]', '#tipCountUL').find('.icon-p').show().text(commentCount);
			} else {
				$('li[dir="comment"]', '#tipCountUL').find('.icon-p').hide();
			}
		}
		var homeWin = $windowManager.getById($windowManager.getLaunchWindowId());
		if (homeWin) {
			homeWin.evalJS('loadTip()');
		}
	};
	plusReady = function() {
		$common.switchOS(function() {
			$('body').addClass('Ios_scroll');
		}, function() {

		});
		loadTip();
		loadData();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});