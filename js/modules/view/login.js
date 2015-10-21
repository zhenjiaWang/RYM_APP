define(function(require, exports, module) {
	var $common = require('core/common');
	var $windowManager = require('manager/window');
	var $nativeUIManager = require('manager/nativeUI');
	var $authorize = require('core/authorize');
	var $userInfo = require('core/userInfo');
	var auths = null;
	login = function(mobilePhone, password) {
		$nativeUIManager.watting('正在登陆...', false);
		$authorize.login(mobilePhone, password, function() {
			$windowManager.load('home.html');
			$nativeUIManager.wattingClose();
		}, function(message) {
			$nativeUIManager.wattingTitle(message);
			window.setTimeout(function() {
				$nativeUIManager.wattingClose();
			}, 1000);
		});
	};
	loginWechat = function(unionId) {
		$nativeUIManager.wattingTitle('微信授权登陆...', false);
		$authorize.loginWechat(unionId, function() {
			$windowManager.load('home.html');
			$nativeUIManager.wattingClose();
		}, function(message) {
			$nativeUIManager.wattingTitle(message);
			window.setTimeout(function() {
				$nativeUIManager.wattingClose();
			}, 1000);
		}, function(unionId, mobilePhone) {
			$nativeUIManager.wattingClose();
			$windowManager.create('reg', 'reg.html?unionId=' + unionId + '&mobilePhone=' + mobilePhone, false, true, function(show) {
				show();
			});
		});
	};

	init = function() {
		if ($userInfo.isSupport()) {
			if ($('#mobilePhone').val() == '') {
				$('#mobilePhone').val($userInfo.get('mobilePhone'));
			}
			if ($('#password').val() == '') {
				$('#password').val($userInfo.get('password'));
			}
		}
	};

	plusReady = function() {
		init();
		$common.touchSE($('#loginBtn'), function(event, startTouch, o) {}, function(event, o) {
			var mobilePhone = $.trim($('#mobilePhone').val());
			var password = $.trim($('#password').val());
			if (mobilePhone.length > 0 && password.length > 0) {
				login(mobilePhone, password);
			} else {
				$nativeUIManager.watting('请输入用户名称和密码', 1500);
			}
		});
		$common.touchSE($('#regBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.create('reg', 'reg.html', false, true, function(show) {
				show();
			});
		});
		$common.touchSE($('#wxBtn'), function(event, startTouch, o) {}, function(event, o) {
			plus.oauth.getServices(function(services) {
				auths = services;
				document.addEventListener("pause", function() {
					setTimeout(function() {
						$nativeUIManager.wattingClose();
					}, 2000);
				}, false);
				$nativeUIManager.watting('请稍等...');
				var s = auths[0];
				s.login(function(e) {
					if (s.authResult) {
						s.getUserInfo(function() {
							value = s.userInfo['unionid'];
							if (value) {
								loginWechat(value);
							}
						}, function(e) {
							$nativeUIManager.wattingClose();
							$nativeUIManager.alert('提示', '无法使用微信登录', 'OK', function() {});
						});
					}
				}, function(e) {
					$nativeUIManager.wattingClose();
					$nativeUIManager.alert('提示', '无法使用微信登录', 'OK', function() {});
				});
			}, function(e) {
				$nativeUIManager.alert('提示', '无法使用微信登录', 'OK', function() {});
			});
		});
		var height = document.body.clientHeight;
		var minHeight = (height / 2) + (height / 2 / 2);
		window.addEventListener('resize', function() {
			document.getElementById("bottomBtn").style.display = document.body.clientHeight <= minHeight ? 'none' : 'block';
		}, false);
		plus.navigator.closeSplashscreen();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});