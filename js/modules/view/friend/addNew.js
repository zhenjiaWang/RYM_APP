define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var $templete = require('core/templete');
	bindEvent = function() {
		$common.touchSE($('#addPhoneContacts'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.create('friend_phoneList_header', 'phoneListHeader.html', false, true, function(show) {
				show();
			});
		});
		$common.touchSE($('#investorBtn'), function(event, startTouch, o) {}, function(event, o) {
			$nativeUIManager.alert('提示', '和微信一起开放', 'OK', function() {});
		});
		$common.touchSE($('.addBtn'), function(event, startTouch, o) {}, function(event, o) {
			if (!$(o).hasClass('nobg')&&!$(o).hasClass('addDone')) {
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
										$nativeUIManager.wattingTitle('关注成功!');
										$(o).text(jsonData['text']).addClass('addDone');
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
		});
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
						var friendFollowArray = jsonData['friendFollowArray'];
						if (friendFollowArray && $(friendFollowArray).size() > 0) {
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
						}else{
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

	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});