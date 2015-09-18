define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var $templete = require('core/templete');
	var $dbData = require('manager/dbData');
	buildContact = function(dbResult) {
		if (dbResult) {
			var resultRows = dbResult.rows.length;
			if (resultRows && resultRows > 0) {
				var sb = new StringBuilder();
				for (var i = 0; i < resultRows; i++) {
					var row = dbResult.rows.item(i);
					if (row) {
						sb.append(String.formatmodel($templete.contactItem(), {
							name: row['NAME'],
							phone: row['MOBILE_PHONE']
						}));
					}
				}
			}
			$('#phoneListUL').empty().append(sb.toString());
			$nativeUIManager.wattingClose();
		}
	};
	onRefresh = function() {
		window.setTimeout(function() {
			$dbData.refreshContacts(function(dbResult) {
				buildContact(dbResult);
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
	bindEvent = function() {
		//		$common.touchSE($('#addPhoneContacts'), function(event, startTouch, o) {}, function(event, o) {
		//			$windowManager.create('friend_phoneList', 'phoneList.html', false, true, function(show) {
		//				show();
		//			});
		//		});
	};
	loadData = function() {
		$nativeUIManager.watting('正在加载...');
		$dbData.getContactsList(function(dbResult) {
			buildContact(dbResult);
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