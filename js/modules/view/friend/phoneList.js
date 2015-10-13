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
	var again = 0;
	var regObj = {
		"_pwd": /^[a-zA-Z][a-zA-Z0-9]{7,19}/,
		"_require": /.+/,
		"_email": /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
		"_phone": /(\d{2,5}-\d{7,8}?)/,
		"_mobile": /^0{0,1}(13[0-9]|15[0-9]|18[0-9])[0-9]{8}$/,
		"_url": /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/,
		"_idCard": /^(\d{18,18}|\d{15,15}|\d{17,17}x)$/,
		"_currency": /^\d+(\.\d+)?$/,
		"_number": /^\d+$/,
		"_number1": /^[0-9]\d*([.][1-9]{1})?$/,
		"_zip": /^[1-9]\d{5}$/,
		"_qq": /^[1-9]\d{4,8}$/,
		"_integer": /^[-\+]?\d+$/,
		"_double": /^[-\+]?\d+(\.\d+)?$/,
		"_english": /^[A-Za-z]+$/,
		"_chinese": /^[\u0391-\uFFE5]+$/,
		"_unSafe": /^(([A-Z]*|[a-z]*|\d*|[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]*)|.{0,5})$|\s/,
		"_upload": /[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]+/,
		"_date": /(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)/
	}
	putData = function(sb, callback) {
		$common.refreshToken(function(tokenId) {
			$.ajax({
				type: 'POST',
				url: $common.getRestApiURL() + '/social/contacts/loadPhone',
				dataType: 'json',
				data: {
					phoneData: sb.toString(),
					'org.guiceside.web.jsp.taglib.Token': tokenId
				},
				success: function(jsonData) {
					if (jsonData) {
						if (jsonData['result'] == '0') {
							$nativeUIManager.wattingTitle('加载手机通讯录列表...');
							if (typeof callback == 'function') {
								callback();
							}
						} else {
							$nativeUIManager.wattingClose();
							$nativeUIManager.alert('提示', '扫描通讯录失败', 'OK', function() {});
						}
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					$nativeUIManager.wattingClose();
					$nativeUIManager.alert('提示', '扫描通讯录失败', 'OK', function() {});
				}
			});
		});
	}
	loadPhone = function(callback) {
		plus.contacts.getAddressBook(plus.contacts.ADDRESSBOOK_PHONE, function(addressbook) {
			addressbook.find(["id", "displayName", "phoneNumbers"], function(contacts) {
				var sb = new StringBuilder();
				if (contacts && $(contacts).size() > 0) {
					var contactsSize = $(contacts).size();
					var _index = 0;
					var _unkownIndex = 1;
					var sb = new StringBuilder();
					$(contacts).each(function(i, c) {
						var name = c.displayName;
						var photo = '../../img/photodf.png';
						var id = c.id;
						var mobilePhone = false;
						var QP = '';
						var JP = '';
						if (!name) {
							name = '未知联系人' + _unkownIndex;
							_unkownIndex += 1;
						}
						if (c.phoneNumbers) {
							$(c.phoneNumbers).each(function(pi, phone) {
								mobilePhone = phone['value'];
								if (mobilePhone) {
									mobilePhone = mobilePhone.replaceAll('\\+86', '');
									mobilePhone = mobilePhone.replaceAll('-', '');
									mobilePhone = mobilePhone.replaceAll(' ', '');
									if (regObj['_mobile'].test(mobilePhone)) {
										if (name && mobilePhone && id) {
											sb.append(name + '|' + mobilePhone + ",");
										}
									}
								}
							});
							if (name && mobilePhone && id) {
								_index += 1;
								if (_index == contactsSize) {
									putData(sb, callback);
								}
							} else {
								contactsSize -= 1;
							}
						}
					});
				} else {
					if (typeof errorback == 'function') {
						errorback();
					}
					$nativeUIManager.alert('提示', '手机通讯录暂无数据', 'OK', function() {});
				}
			}, function() {
				if (typeof errorback == 'function') {
					errorback();
				}
				$nativeUIManager.alert('提示', '获取手机通讯录失败', 'OK', function() {});
			}, {
				multiple: true
			});
		}, function(e) {
			if (typeof errorback == 'function') {
				errorback();
			}
			$nativeUIManager.alert('提示', '获取手机通讯录失败', 'OK', function() {});
		});
	};
	onRefresh = function() {
		loadPhone(function() {
			loadData(function() {
				currentWindow.endPullToRefresh();
			});
		});
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
	bindEvent = function() {
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
										$(o).text(jsonData['text']).addClass('nobg noboder color-b');
										window.setTimeout(function() {
											$nativeUIManager.wattingClose();
											var addNewWin = $windowManager.getById('friend_addNew');
											if (addNewWin) {
												addNewWin.evalJS('loadContactsTip('+jsonData['unAddCount']+')');
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
	loadData = function(callback) {
		if (!callback) {
			$nativeUIManager.watting('正在加载...');
		}
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/social/contacts',
			dataType: 'json',
			data: {},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						var flagPhone = false;
						var phoneArray = jsonData['phoneArray'];
						var sb = new StringBuilder();
						if (phoneArray && $(phoneArray).size() > 0) {
							$(phoneArray).each(function(i, o) {
								if ($userInfo.get('mobilePhone') != o['mobilePhone']) {
									sb.append(String.formatmodel($templete.contactPlannerItem(o['add'] == 'Y'), {
										name: o['name'] + '(' + o['contactName'] + ')',
										mobilePhone: o['mobilePhone'],
										userId: o['userId'],
										headImgUrl: o['headImgUrl'],
										text: o['add'] == 'Y' ? '关注' : '已关注'
									}));
								}
							});
						} else {
							if (again == 0) {
								$nativeUIManager.wattingTitle('正在访问通讯录...');
								flagPhone = true;
								loadPhone(function() {
									loadData(function() {
										$nativeUIManager.wattingClose();
									});
								});
								again += 1;
							} else {
								$('#blank').show();
							}
						}
						if (!flagPhone) {
							$('#phoneListUL').empty().append(sb.toString());
							pullToRefreshEvent();
							bindEvent();
							if (!callback) {
								$nativeUIManager.wattingClose();
							}
							if (typeof callback == 'function') {
								callback();
							}
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