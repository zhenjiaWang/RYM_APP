define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var $templete = require('core/templete');
	goSearch = function(value) {
		value=encodeURIComponent(value);
		$windowManager.load('plannerList.html?keyword=' + value);
	};
	bindEvent = function() {
		$('#keyword').off('keydown').on('keydown', function(e) {
			e = (e) ? e : ((window.event) ? window.event : "")
			var keyCode = e.keyCode ? e.keyCode : (e.which ? e.which : e.charCode);
			if (keyCode == 13) {
				var value = $(this).val();
				if (value != '') {
					goSearch(value);
				}
				$('#keyword').trigger('blur');
			}
		});
		$('#keyword').off('blur').on('blur', function(e) {
			var value = $(this).val();
			if (value != '') {
				goSearch(value);
			}
		});
		$common.touchSE($('#addPhoneContacts'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.create('friend_phoneList_header', 'phoneListHeader.html', false, true, function(show) {
				show();
			});
		});
		$common.touchSE($('.userPhoto', '#followUL'), function(event, startTouch, o) {}, function(event, o) {
			event.stopPropagation();
			var li = $(o).closest('li');
			var userId = $(li).attr('userId');
			var userName = $(li).attr('userName');
			if (userId&&userName) {
				$windowManager.create('product_footer_pop', '../product/footerPop.html?userId=' + userId + '&userName=' + userName, false, true, function(show) {
					show();
				});
			}
		});

		$common.touchSE($('.addBtn', '#followUL'), function(event, startTouch, o) {}, function(event, o) {
			if (!$(o).hasClass('nobg') && !$(o).hasClass('addDone')) {
				var li = $(o).closest('li');
				var friendId = $(li).attr('userId');
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
										var followTipCount = jsonData['followTipCount'];
										$userInfo.put('followTipCount', followTipCount.toString());
										var homeWin = $windowManager.getById($windowManager.getLaunchWindowId());
										if (homeWin) {
											homeWin.evalJS('loadTip()');
										}
										var friendHeaderWin = $windowManager.getById('friend_header');
										if (friendHeaderWin) {
											friendHeaderWin.evalJS('loadTip()');
										}
										$nativeUIManager.wattingTitle('关注成功!');
										$(o).text(jsonData['text']).addClass('addDone');
										window.setTimeout(function() {
											$nativeUIManager.wattingClose();
											var friendListWin = $windowManager.getById('friend_list');
											if (friendListWin) {
												friendListWin.evalJS('onRefresh()');
											}
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
		});
	};
	loadContactsTip = function(unAddCount) {
		if (unAddCount) {
			unAddCount = parseInt(unAddCount);
			if (unAddCount > 0) {
				$('.icon-p', '#addPhoneContacts').show().text(unAddCount);
			} else {
				$('.icon-p', '#addPhoneContacts').hide();
			}
		}
	};
	loadData = function(callback) {
		$nativeUIManager.watting('请稍等...');
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/social/friendPlanner/followList',
			dataType: 'json',
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						loadContactsTip(jsonData['unAddCount']);
						var friendFollowArray = jsonData['friendFollowArray'];
						if (friendFollowArray && $(friendFollowArray).size() > 0) {
							$('#blank').hide();
							var sb = new StringBuilder();
							$(friendFollowArray).each(function(i, o) {
								sb.append(String.formatmodel($templete.contactPlannerItem(true), {
									name: o['userName'],
									mobilePhone: o['mobilePhone'],
									userId: o['userId'],
									headImgUrl: o['headImgUrl'],
									text: '加关注'
								}));
							});
							$('#followUL').empty().append(sb.toString()).show();
							$('#newFollow').show();
						} else {
							$('#blank').show();
						}
						bindEvent();
						$nativeUIManager.wattingClose();
					} else {
						bindEvent();
						$nativeUIManager.wattingClose();
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				bindEvent();
				$nativeUIManager.wattingClose();
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
		$common.androidBack(function() {
			$windowManager.close();
		});

	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});