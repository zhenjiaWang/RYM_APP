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
	var keyword = queryMap.get('keyword');
	var nextIndex = 0;
	var currentWindow;
	onRefresh = function() {
		nextIndex = 0;
		$('#friendUL').attr('nextIndex', 0);
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
	goAdd = function() {
		$windowManager.load('addNew.html');
	};
	bindEvent = function() {
		$('#keyword').off('keydown').on('keydown', function(e) {
			e = (e) ? e : ((window.event) ? window.event : "")
			var keyCode = e.keyCode ? e.keyCode : (e.which ? e.which : e.charCode);
			if (keyCode == 13) {
				var value = $(this).val();
				if (value == '') {
					goAdd();
				} else {
					loadData();
				}
				$('#keyword').trigger('blur');
			}
		});
		$('#keyword').off('blur').on('blur', function(e) {
			var value = $(this).val();
			if (value != '') {
				loadData();
			} else {
				goAdd();
			}
		});
		$common.touchSE($('.UserCard', '#friendUL'), function(event, startTouch, o) {}, function(event, o) {
			var userId = $(o).attr('userId');
			var userName = $(o).attr('userName');
			if (userId && userName) {
				$windowManager.create('product_header_pop', '../product/headerPop.html?userId=' + userId + '&userName=' + userName, false, true, function(show) {
					show();
				});
			}
		});
		$common.touchSE($('.rightBtnAdd'), function(event, startTouch, o) {
			event.stopPropagation();
		}, function(event, o) {
			event.stopPropagation();
			var section = $(o).closest('section');
			var friendId = $(section).attr('userId');
			if (friendId) {
				$nativeUIManager.watting('请稍等...');
				$common.refreshToken(function(tokenId) {
					$.ajax({
						type: 'POST',
						url: $common.getRestApiURL() + '/social/friendPlanner/addFriend',
						dataType: 'json',
						data: {
							'org.guiceside.web.jsp.taglib.Token': tokenId,
							friendId: friendId
						},
						success: function(jsonData) {
							if (jsonData) {
								if (jsonData['result'] == '0') {
									$nativeUIManager.wattingTitle('关注成功!');
									$('.icon-new', section).remove();
									$(o).text('已关注').removeClass('rightBtnAdd').off('touchstart').off('touchend');
									window.setTimeout(function() {
										var friendListWin = $windowManager.getById('friend_list');
										if (friendListWin) {
											friendListWin.evalJS('onRefresh()');
										}
										$nativeUIManager.wattingClose();
									}, 1000);
								} else {
									$nativeUIManager.wattingClose();
									$nativeUIManager.alert('提示', '关注失败', 'OK', function() {});
								}
							}
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) {
							$nativeUIManager.wattingClose();
							$nativeUIManager.alert('提示', '关注失败', 'OK', function() {});
						}
					});
				});
			}
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
			url: $common.getRestApiURL() + '/sys/planner/friendList',
			dataType: 'json',
			data: {
				start: nextIndex > 0 ? nextIndex : '',
				keyword: $('#keyword').val()
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						var friendArray = jsonData['friendArray'];
						var sb = new StringBuilder();
						if (friendArray && $(friendArray).size() > 0) {
							$('#blank').hide();
							$(friendArray).each(function(i, o) {
								var productInfo = o['productInfo'];
								sb.append(String.formatmodel($templete.friendFollowPlannerItem(o['state'] == '-1'), {
									userId: o['userId'],
									userName: o['userName'],
									headImgUrl: o['headImgUrl'],
									saleCount: o['saleCount'],
									orgName: o['orgName'],
									financialContent: productInfo['financialContent'],
									trustContent: productInfo['trustContent'],
									fundContent: productInfo['fundContent']
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
		$('#keyword').val(keyword);
		loadData();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});