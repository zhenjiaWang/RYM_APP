define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var $templete = require('core/templete');
	var $dbData = require('manager/dbData');
	var staticKeyWordResult = false;
	var currentWindow;
	buildContact = function(dbResult, keyWordResult, wordFlag) {
		if (dbResult && keyWordResult) {
			staticKeyWordResult = keyWordResult;
			var sb = new StringBuilder();
			var keyWordResultRows = keyWordResult.rows.length;
			if (keyWordResultRows && keyWordResultRows > 0) {
				$('td', '.wordList').addClass('noData');
				$('td', '.wordList').each(function() {
					$(this).attr('dir', $('span', this).text());
				});
				for (var i = 0; i < keyWordResultRows; i++) {
					var row = keyWordResult.rows.item(i);
					if (row) {
						var jp = row['JP'];
						if (wordFlag) {
							if (i == 0) {
								$('.checkWord').text(jp);
							}
						}
						if (jp) {
							$('td[dir="' + jp + '"]', '.wordList').removeClass('noData');
						}
					}
				}
				var resultRows = dbResult.rows.length;
				var mobilePhones = '';
				if (resultRows && resultRows > 0) {
					for (var i = 0; i < resultRows; i++) {
						var row = dbResult.rows.item(i);
						if (row) {
							mobilePhones += row['MOBILE_PHONE'] + ',';
						}
					}
					$nativeUIManager.wattingTitle('正在匹配...');
					$.ajax({
						type: 'POST',
						url: $common.getRestApiURL() + '/social/friendPlanner/getRegPlanner',
						dataType: 'json',
						data: {
							mobilePhones: mobilePhones
						},
						success: function(jsonData) {
							if (jsonData) {
								if (jsonData['result'] == '0') {
									for (var i = 0; i < resultRows; i++) {
										var row = dbResult.rows.item(i);
										if (row) {
											var contact = jsonData[row['MOBILE_PHONE']];
											if (contact) {
												var planner = contact['planner'];
												var text = contact['text'];
												var addFlag = contact['addFlag'];
												if ($userInfo.get('mobilePhone') != row['MOBILE_PHONE']) {
													sb.append(String.formatmodel($templete.contactPlannerItem(addFlag == '0'), {
														name: row['NAME'],
														mobilePhone: row['MOBILE_PHONE'],
														userId: contact['userId'],
														headImgUrl: contact['headImgUrl'],
														text: text
													}));
												}

											}
										}
									}
									$('#phoneListUL').empty().append(sb.toString());
									bindEvent();
									$nativeUIManager.wattingClose();
								} else {
									$nativeUIManager.wattingClose();
								}
							}
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) {
							$nativeUIManager.wattingClose();
						}
					});
				} else {
					$nativeUIManager.wattingClose();
				}
			}
		}
	};
	onRefresh = function() {
		window.setTimeout(function() {
			$dbData.refreshContacts(function(dbResult, keyWordResult) {
				buildContact(dbResult, keyWordResult, true);
				currentWindow.endPullToRefresh();
			}, function() {
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
				caption: "下拉重新获取通讯录"
			},
			contentover: {
				caption: "释放立即获取"
			},
			contentrefresh: {
				caption: "正在刷新..."
			}
		}, onRefresh);
	};
	search = function(key) {
		$nativeUIManager.watting('正在搜索...');
		$dbData.searchContactsByKeyword(key, function(dbResult) {
			buildContact(dbResult, staticKeyWordResult, true);
		});
	};
	bindEvent = function() {
		$('#keyword').off('keydown').on('keydown', function(e) {
			e = (e) ? e : ((window.event) ? window.event : "")
			var keyCode = e.keyCode ? e.keyCode : (e.which ? e.which : e.charCode);
			if (keyCode == 13) {
				var value = $(this).val();
				if (value && value != '') {
					search(value);
				}
				$('#keyword').trigger('blur');
			}
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
		$common.touchSE($('.checkWord'), function(event, startTouch, o) {}, function(event, o) {
			if (!$('.wordList').hasClass('current')) {
				$('.wordList').addClass('current');
			} else {
				$('.wordList').removeClass('current');
			}
		});
		$common.touchSE($('td', '.wordList'), function(event, startTouch, o) {}, function(event, o) {
			if (!$('span', o).hasClass('current')) {
				$('td', '.wordList').find('span').removeClass('current');
				$('span', o).addClass('current');
				var dir = $(o).attr('dir');
				if (dir) {
					$nativeUIManager.watting('正在加载...');
					$dbData.searchContactsByJP(dir, function(dbResult) {
						buildContact(dbResult, staticKeyWordResult, false);
						$('.checkWord').text(dir);
					});
					$('.wordList').removeClass('current');
				}
			} else {
				$('span', o).removeClass('current');
				$('.wordList').removeClass('current');
				$nativeUIManager.watting('正在加载...');
				$dbData.getContactsList(function(dbResult, keyWordResult) {
					buildContact(dbResult, keyWordResult, true);
				}, function() {
					$nativeUIManager.wattingClose();
				});
			}
		});
	};
	loadData = function() {
		$nativeUIManager.watting('正在加载...');
		$dbData.getContactsList(function(dbResult, keyWordResult) {
			buildContact(dbResult, keyWordResult, true);
		}, function() {
			$nativeUIManager.wattingClose();
		});
		pullToRefreshEvent();
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