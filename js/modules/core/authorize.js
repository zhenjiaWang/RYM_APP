define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $windowManager = require('manager/window');
	var $nativeUIManager = require('manager/nativeUI');
	var $webSQLManager = require('manager/webSQL');
	var $pushManager = require('manager/push');
	var $controlWindow = require('manager/controlWindow');
	checkTimeout = function(callback) {
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/common/authorize/timeout',
			dataType: 'json',
			data: {
				appCheck: '1215'
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '-2') {
						if (typeof callback == 'function') {
							callback();
						}
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				if (typeof callback == 'function') {
					callback();
				}
			}
		});
	}
	exports.loginWechat = function(unionId, successCallback, errorCallback, openCallback) {
		var pushInfo = $pushManager.pushInfo();
		var deviceToken = pushInfo['token'];
		var clientId = pushInfo['clientid']
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/common/authorize/loginWeChat',
			dataType: 'json',
			data: {
				unionId: unionId,
				deviceToken: deviceToken,
				clientId: clientId,
				osName: plus.os.name
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						$userInfo.putJson(jsonData);
						$userInfo.put('authorize', '0');
						if (typeof successCallback == 'function') {
							successCallback(jsonData);
						}
					} else if (jsonData['result'] == '1') {
						$userInfo.put('authorize', '-1');
						if (typeof openCallback == 'function') {
							openCallback(jsonData['unionId'], jsonData['mobilePhone']);
						}
					} else {
						$userInfo.put('authorize', '-1');
						if (typeof errorCallback == 'function') {
							errorCallback(jsonData['errorMsg']);
						}
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				if (typeof errorCallback == 'function') {
					$userInfo.put('authorize', '-1');
					errorCallback('网络错误');
				}
			}
		});
	};
	exports.login = function(mobilePhone, password, successCallback, errorCallback) {
		var pushInfo = $pushManager.pushInfo();
		var deviceToken = pushInfo['token'];
		var clientId = pushInfo['clientid']
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/common/authorize',
			dataType: 'json',
			data: {
				mobilePhone: mobilePhone,
				password: password,
				deviceToken: deviceToken,
				clientId: clientId,
				osName: plus.os.name
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						$userInfo.putJson(jsonData);
						if (typeof successCallback == 'function') {
							successCallback(jsonData);
						}
					} else {
						$userInfo.put('authorize', '-1');
						if (typeof errorCallback == 'function') {
							errorCallback(jsonData['errorMsg']);
						}
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				if (typeof errorCallback == 'function') {
					$userInfo.put('authorize', '-1');
					errorCallback('网络错误');
				}
			}
		});
	};
	exports.logout = function() {
		if ($userInfo.isAuthorize()) {
			$nativeUIManager.watting('正在登出...', false);
			window.setTimeout(function() {
				$.ajax({
					type: 'POST',
					url: $common.getRestApiURL() + '/common/authorize/quit',
					dataType: 'json',
					data: {
						oaToken: $userInfo.get('token')
					},
					success: function(jsonData) {
						if (jsonData) {
							if (jsonData['result'] == '0') {
								$common.switchOS(function() {
									plus.runtime.setBadgeNumber(0);
								}, function() {});
								plus.push.clear();
								$userInfo.clear();
								$controlWindow.activeWindowClose();
								$nativeUIManager.wattingClose();
								$windowManager.close();
								$windowManager.loadOtherWindow($windowManager.getLaunchWindowId(), '../login.html', true);
							} else {
								$nativeUIManager.wattingTitle('错误,请稍后再试');
								window.setTimeout(function() {
									$nativeUIManager.wattingClose();
								}, 1500);
							}
						}
					},
					error: function(jsonData) {
						$nativeUIManager.wattingTitle('错误,请稍后再试');
						window.setTimeout(function() {
							$nativeUIManager.wattingClose();
						}, 1500);
					}
				});
			}, 1000);
		}
	};
	exports.timeout = function() {
		checkTimeout(function() {
			$controlWindow.lunchWindowShow();
			$windowManager.getLaunchWindow().loadURL('timeout.html');
			$windowManager.closeAll();
		});
	};
});