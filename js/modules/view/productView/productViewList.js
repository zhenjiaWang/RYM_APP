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
		$('#viewDIV').attr('nextIndex', 0);
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
		$('#keyword').off('keydown').on('keydown', function(e) {
			e = (e) ? e : ((window.event) ? window.event : "")
			var keyCode = e.keyCode ? e.keyCode : (e.which ? e.which : e.charCode);
			if (keyCode == 13) {
				var value = $(this).val();
				if (value == '') {
					loadData();
				}
				$('#keyword').trigger('blur');
			}
		});
		$('#keyword').off('blur').on('blur', function(e) {
			var value = $(this).val();
			if (value == '') {
				loadData();
			}
		});
		$('#keyword').off('valuechange').on('valuechange', function(e) {
			var value = $(this).val();
			if (value && value != '') {
				loadData();
			}
		});
		$common.touchSE($('.personBoard', '#viewDIV'), function(event, startTouch, o) {}, function(event, o) {
			var userId = $(o).attr('userId');
			var viewType = $(o).attr('viewType');
			var userName = $(o).attr('userName');
			if (viewType && viewType == 'app') {
				if (userId && userName) {
					$windowManager.create('product_footer_pop', '../product/footerPop.html?userId=' + userId + '&userName=' + userName, false, true, function(show) {
						show();
					});
				}
			} else {
				$nativeUIManager.watting('客户没有理财室信息供给查看', 1000);
			}

		});
		
		$common.touchSE($('.addBtn', '#viewDIV'), function(event, startTouch, o) {}, function(event, o) {
			if (!$(o).hasClass('nobg') && !$(o).hasClass('addDone')) {
				var li = $(o).closest('section');
				var friendId = $(li).attr('userId');
				var viewType = $(li).attr('viewType');
				if (friendId && viewType) {
					if (viewType == 'app') {
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
											$(o).remove();
											window.setTimeout(function() {
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
					} else if (viewType == 'wx') {
						$nativeUIManager.watting('请稍等...');
						$common.refreshToken(function(tokenId) {
							$.ajax({
								type: 'POST',
								url: $common.getRestApiURL() + '/social/friendInvestor/addFriend',
								dataType: 'json',
								data: {
									'org.guiceside.web.jsp.taglib.Token': tokenId,
									friendId: friendId,
									status: -1
								},
								success: function(jsonData) {
									if (jsonData) {
										if (jsonData['result'] == '0') {
											$nativeUIManager.wattingTitle('已发送好友邀请!');
											$(o).remove();
											window.setTimeout(function() {
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
				}
			}
		});
		document.addEventListener("plusscrollbottom", function() {
			var next = $('#viewDIV').attr('nextIndex');
			if (next) {
				if (next > 0) {
					nextIndex = next;
					$nativeUIManager.watting('正在加载更多...');
					$('#viewDIV').attr('nextIndex', 0);
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
		$('.checkWord').hide();
		if (!callback) {
			$nativeUIManager.watting('正在加载...');
		}
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/product/info/viewList',
			dataType: 'json',
			data: {
				id: id,
				tab: tab,
				start: nextIndex > 0 ? nextIndex : ''
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						var viewArray = jsonData['viewArray'];
						var sb = new StringBuilder();
						if (viewArray && $(viewArray).size() > 0) {
							$('#blank').hide();
							$(viewArray).each(function(i, o) {
								var text = '';
								if (o['viewType'] == 'app') {
									text = '加关注';
								} else if (o['viewType'] == 'wx') {
									text = '加好友';
								}
								sb.append(String.formatmodel($templete.productViewItem(o['addYn']), {
									userId: o['userId'],
									viewType: o['viewType'],
									userName: o['userName'],
									headImgUrl: o['headImgUrl'],
									type: o['type'],
									updateTime: o['updateTime'],
									text: text
								}));
							});
						} else {
							$('#blank').show();
						}
						if (append) {
							$('#viewDIV').append(sb.toString());
						} else {
							$('#viewDIV').empty().append(sb.toString());
						}
						nextIndex = 0;
						$('#viewDIV').attr('nextIndex', 0);
						var page = jsonData['page'];
						if (page) {
							if (page['hasNextPage'] == true) {
								$('#viewDIV').attr('nextIndex', page['nextIndex']);
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