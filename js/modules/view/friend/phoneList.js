define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var $templete = require('core/templete');
	var $dbData = require('manager/dbData');
	var $page = require('manager/page');
	var staticKeyWordResult = false;
	var currentWindow;
	var nextIndex = 0;
	buildContact = function(dbResult, keyWordResult, append, callback) {
		if (dbResult && keyWordResult) {
			staticKeyWordResult = keyWordResult;
			var sb = new StringBuilder();
			var keyWordResultRows = keyWordResult.rows.length;
			if (keyWordResultRows && keyWordResultRows > 0) {
				$('.checkWord').show();
				$('td', '.wordList').addClass('noData');
				$('td', '.wordList').each(function() {
					$(this).attr('dir', $('span', this).text());
				});
				for (var i = 0; i < keyWordResultRows; i++) {
					var row = keyWordResult.rows.item(i);
					if (row) {
						var jp = row['JP'];
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
									if (append) {
										$('#phoneListUL').append(sb.toString());
									} else {
										$('#phoneListUL').empty().append(sb.toString());
									}
									nextIndex = 0;
									$('#phoneListUL').attr('nextIndex', 0);
									bindEvent();
									pullToRefreshEvent();
									$nativeUIManager.wattingClose();
									if (typeof callback == 'function') {
										callback();
									}
								} else {
									$nativeUIManager.wattingClose();
									if (typeof callback == 'function') {
										callback();
									}
								}
							}
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) {
							$nativeUIManager.wattingClose();
							if (typeof callback == 'function') {
								callback();
							}
						}
					});
				} else {
					$('#phoneListUL').empty().attr('nextIndex', 0);
					$nativeUIManager.wattingClose();
					if (typeof callback == 'function') {
						callback();
					}
				}
			} else {
				$nativeUIManager.wattingClose();
				if (typeof callback == 'function') {
					callback();
				}
			}
		}
	};
	onRefresh = function() {
		window.setTimeout(function() {
			$dbData.refreshContacts(function(dbResult, keyWordResult, totalCount) {
				buildContact(dbResult, keyWordResult, false, function() {
					if (totalCount && totalCount > 0) {
						var page = $page.createPage(20, 1, totalCount);
						if (page) {
							if (page['hasNextPage'] == true) {
								$('#phoneListUL').attr('nextIndex', page['nextIndex']);
							}
						}
					}
					currentWindow.endPullToRefresh();
				});
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
		$('.checkWord').hide();
		$nativeUIManager.watting('正在搜索...');
		$dbData.searchContactsByKeyword(key, function(dbResult) {
			buildContact(dbResult, staticKeyWordResult);
		});
	};
	bindEvent = function() {
		$('#keyword').off('keydown').on('keydown', function(e) {
			e = (e) ? e : ((window.event) ? window.event : "")
			var keyCode = e.keyCode ? e.keyCode : (e.which ? e.which : e.charCode);
			if (keyCode == 13) {
				var value = $(this).val();
				if (value == '') {
					search(value);
				}
				$('#keyword').trigger('blur');
			}
		});
		$('#keyword').off('blur').on('blur', function(e) {
			var value = $(this).val();
			if (value == '') {
				search(value);
			}
		});
		$('#keyword').off('keyup').on('keyup', function(e) {
			var value = $(this).val();
			if (value && value != '') {
				search(value);
			}
		});

		$common.touchSE($('.addBtn'), function(event, startTouch, o) {}, function(event, o) {
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
						buildContact(dbResult, staticKeyWordResult, false, false);
						$('.checkWord').text(dir);
					});
					$('.wordList').removeClass('current');
				}
			} else {
				$('span', o).removeClass('current');
				$('.wordList').removeClass('current');
				$nativeUIManager.watting('正在加载...');
				$dbData.getContactsList(function(dbResult, keyWordResult) {
					buildContact(dbResult, keyWordResult, false, false);
					$('.checkWord').text('筛选');
				}, function() {
					$nativeUIManager.wattingClose();
				});
			}
		});
		document.addEventListener("plusscrollbottom", function() {
			var next = $('#phoneListUL').attr('nextIndex');
			if (next) {
				if (next > 0) {
					$nativeUIManager.watting('正在加载更多...');
					$('#phoneListUL').attr('nextIndex', 0);
					window.setTimeout(function() {
						$dbData.getContactsList(function(dbResult, keyWordResult, totalCount) {
							buildContact(dbResult, keyWordResult, true, function() {
								if (totalCount && totalCount > 0) {
									var currentPage = $page.getCurrentPage(20, next);
									if (currentPage) {
										var page = $page.createPage(20, currentPage, totalCount);
										if (page) {
											if (page['hasNextPage'] == true) {
												$('#phoneListUL').attr('nextIndex', page['nextIndex']);
											}
										}
									}
								}
							});
						}, function() {
							$nativeUIManager.wattingClose();
						},next);
					}, 500);
				}
			}
		});
	};
	loadData = function() {
		$nativeUIManager.watting('正在加载...');
		$dbData.getContactsList(function(dbResult, keyWordResult, totalCount) {
			buildContact(dbResult, keyWordResult, false, function() {
				if (totalCount && totalCount > 0) {
					var page = $page.createPage(20, 1, totalCount);
					if (page) {
						if (page['hasNextPage'] == true) {
							$('#phoneListUL').attr('nextIndex', page['nextIndex']);
						}
					}
				}
			});
		}, function() {
			$nativeUIManager.wattingClose();
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