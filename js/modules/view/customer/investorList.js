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
		$('#phoneListUL').attr('nextIndex', 0);
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

		$common.touchSE($('.addBtn', '#phoneListUL'), function(event, startTouch, o) {}, function(event, o) {
			if (!$(o).hasClass('nobg')) {
				var li = $(o).closest('li');
				if (li) {
					var friendId = $(li).attr('userId');
					var status = $(li).attr('status');
					if (friendId && status) {
						$nativeUIManager.watting('请稍等...');
						$common.refreshToken(function(tokenId) {
							$.ajax({
								type: 'POST',
								url: $common.getRestApiURL() + '/social/friendInvestor/addFriend',
								dataType: 'json',
								data: {
									'org.guiceside.web.jsp.taglib.Token': tokenId,
									friendId: friendId,
									status: status
								},
								success: function(jsonData) {
									if (jsonData) {
										if (jsonData['result'] == '0') {
											$nativeUIManager.wattingTitle('已发送好友邀请!');
											$(o).text(jsonData['text']).addClass('nobg noboder color-b');
											window.setTimeout(function() {
												var customerListWin = $windowManager.getById('customer_list');
												if (customerListWin) {
													customerListWin.evalJS('onRefresh()');
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
				}
			}
		});

		document.addEventListener("plusscrollbottom", function() {
			var next = $('#phoneListUL').attr('nextIndex');
			if (next) {
				if (next > 0) {
					nextIndex = next;
					$nativeUIManager.watting('正在加载更多...');
					$('#phoneListUL').attr('nextIndex', 0);
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
			url: $common.getRestApiURL() + '/sys/investor/list',
			dataType: 'json',
			data: {
				start: nextIndex > 0 ? nextIndex : '',
				keyword: $('#keyword').val()
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						var investorArray = jsonData['investorArray'];
						var sb = new StringBuilder();
						if (investorArray && $(investorArray).size() > 0) {
							$('#blank').hide();
							$('#phoneListUL').show();
							$(investorArray).each(function(i, o) {
								var addFlag = false;
								if (o['status'] == '-1') {
									addFlag = true;
								} else if (o['status'] == '2') {
									addFlag = true;
								}
								sb.append(String.formatmodel($templete.contactPlannerItem(addFlag), {
									name: o['userName'],
									mobilePhone: o['mobilePhone'],
									userId: o['userId'],
									status: o['status'],
									headImgUrl: o['headImgUrl'],
									text: o['text']
								}));
							});
						} else {
							$('#blank').show();
							$('#phoneListUL').hide();
						}
						if (append) {
							$('#phoneListUL').append(sb.toString());
						} else {
							$('#phoneListUL').empty().append(sb.toString());
						}
						nextIndex = 0;
						$('#phoneListUL').attr('nextIndex', 0);
						var page = jsonData['page'];
						if (page) {
							if (page['hasNextPage'] == true) {
								$('#phoneListUL').attr('nextIndex', page['nextIndex']);
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