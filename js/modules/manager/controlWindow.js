define(function(require, exports, module) {
	var $windowManager = require('manager/window');
	exports.lunchWindowShow = function() {
		var lunchWindow = $windowManager.getLaunchWindow();
		if (lunchWindow) {
			if (!lunchWindow.isVisible()) {
				lunchWindow.show();
			}
		}
	};
	exports.lunchWindowHide = function() {
		var lunchWindow = $windowManager.getLaunchWindow();
		if (lunchWindow) {
			if (lunchWindow.isVisible()) {
				lunchWindow.hide();
			}
		}
	};
	exports.windowHide = function(winId) {
		var hideWindow = $windowManager.getById(winId);
		if (hideWindow) {
			if (hideWindow.isVisible()) {
				hideWindow.hide();
			}
		}
	};
	exports.windowShow = function(winId) {
		var showWindow = $windowManager.getById(winId);
		if (showWindow) {
			if (!showWindow.isVisible()) {
				showWindow.show();
			}
		}
	};
	exports.historyWindowHide = function(type) {
		var listTypeId = '';
		if (type) {
			if (type == 'req') {
				listTypeId = 'history_reqList';
			} else if (type == 'task') {
				listTypeId = 'history_taskList';
			} else if (type == 'manage') {
				listTypeId = 'history_manageList';
			} else if (type == 'share') {
				listTypeId = 'history_shareList';
			}
		}
		var historyHeadWindow = $windowManager.getById('history_head');
		var historyListWindow = $windowManager.getById(listTypeId);
		if (historyHeadWindow) {
			if (historyHeadWindow.isVisible()) {
				historyHeadWindow.hide();
			}
		}
		if (historyListWindow) {
			if (historyListWindow.isVisible()) {
				historyListWindow.hide();
			}
		}
	};
	exports.historyWindowShow = function(type) {
		var listTypeId = '';
		if (type) {
			if (type == 'req') {
				listTypeId = 'history_reqList';
			} else if (type == 'task') {
				listTypeId = 'history_taskList';
			} else if (type == 'manage') {
				listTypeId = 'history_manageList';
			} else if (type == 'share') {
				listTypeId = 'history_shareList';
			}
		}
		var historyHeadWindow = $windowManager.getById('history_head');
		var historyListWindow = $windowManager.getById(listTypeId);
		if (historyHeadWindow) {
			if (!historyHeadWindow.isVisible()) {
				historyHeadWindow.show();
			}
		}
		if (historyListWindow) {
			if (!historyListWindow.isVisible()) {
				historyListWindow.show();
			}
		}
	};
	exports.historyListWindowHide = function(type) {
		var listTypeId = '';
		if (type) {
			if (type == 'req') {
				listTypeId = 'history_reqList';
			} else if (type == 'task') {
				listTypeId = 'history_taskList';
			} else if (type == 'manage') {
				listTypeId = 'history_manageList';
			} else if (type == 'share') {
				listTypeId = 'history_shareList';
			}
		}
		var historyListWindow = $windowManager.getById(listTypeId);
		if (historyListWindow) {
			if (historyListWindow.isVisible()) {
				historyListWindow.hide();
			}
		}
	};
	exports.historyListWindowShow = function(type) {
		var listTypeId = '';
		if (type) {
			if (type == 'req') {
				listTypeId = 'history_reqList';
			} else if (type == 'task') {
				listTypeId = 'history_taskList';
			} else if (type == 'manage') {
				listTypeId = 'history_manageList';
			} else if (type == 'share') {
				listTypeId = 'history_shareList';
			}
		}
		var historyListWindow = $windowManager.getById(listTypeId);
		if (historyListWindow) {
			if (!historyListWindow.isVisible()) {
				historyListWindow.show();
			}
		}
	};
	exports.activeWindowClose = function() {
		var productHeaderWindow = $windowManager.getById('product_header');
		var productUserWindow = $windowManager.getById('product_user');
		var friendHeaderWindow = $windowManager.getById('friend_header');
		var friendListListWindow = $windowManager.getById('friend_list');
		
		if (productHeaderWindow) {
			productHeaderWindow.close();
		}
		if (productUserWindow) {
			productUserWindow.close();
		}
		if (friendHeaderWindow) {
			friendHeaderWindow.close();
		}
		if (friendListListWindow) {
			friendListListWindow.close();
		}
		
	};

	exports.attListWindowHide = function() {
		var attListWindow = $windowManager.getById('req_attList');
		if (attListWindow) {
			if (attListWindow.isVisible()) {
				attListWindow.hide();
			}
		}
	};
	exports.attListWindowShow = function() {
		var attListWindow = $windowManager.getById('req_attList');
		if (attListWindow) {
			if (!attListWindow.isVisible()) {
				attListWindow.show();
			}
		}
	};
	exports.sendWindowHide = function() {
		var sendHeadWindow = $windowManager.getById('send_head');
		var sendApplyWindow = $windowManager.getById('send_apply');
		if (sendHeadWindow) {
			if (sendHeadWindow.isVisible()) {
				sendHeadWindow.hide();
			}
		}
		if (sendApplyWindow) {
			if (sendApplyWindow.isVisible()) {
				sendApplyWindow.hide();
			}
		}
	};
	exports.sendWindowShow = function() {
		var sendHeadWindow = $windowManager.getById('send_head');
		var sendApplyWindow = $windowManager.getById('send_apply');
		if (sendHeadWindow) {
			if (!sendHeadWindow.isVisible()) {
				sendHeadWindow.show();
			}
		}
		if (sendApplyWindow) {
			if (!sendApplyWindow.isVisible()) {
				sendApplyWindow.show();
			}
		}
	};
	exports.sendApplyWindowHide = function() {
		var sendApplyWindow = $windowManager.getById('send_apply');
		if (sendApplyWindow) {
			if (sendApplyWindow.isVisible()) {
				sendApplyWindow.hide();
			}
		}
	};
	exports.sendApplyWindowShow = function() {
		var sendApplyWindow = $windowManager.getById('send_apply');
		if (sendApplyWindow) {
			if (!sendApplyWindow.isVisible()) {
				sendApplyWindow.show();
			}
		}
	};
	
	exports.searchWindowHide = function() {
		var searchHeadWindow = $windowManager.getById('search_head');
		var searchResultWindow = $windowManager.getById('search_result');
		if (searchHeadWindow) {
			if (searchHeadWindow.isVisible()) {
				searchHeadWindow.hide();
			}
		}
		if (searchResultWindow) {
			if (searchResultWindow.isVisible()) {
				searchResultWindow.hide();
			}
		}
	};
	exports.searchWindowShow = function() {
		var searchHeadWindow = $windowManager.getById('search_head');
		var searchResultWindow = $windowManager.getById('search_result');
		if (searchHeadWindow) {
			if (!searchHeadWindow.isVisible()) {
				searchHeadWindow.show();
			}
		}
		if (searchResultWindow) {
			if (!searchResultWindow.isVisible()) {
				searchResultWindow.show();
			}
		}
	};
});