define(function(require, exports, module) {
	var $common = require('core/common');
	var $windowManager = require('manager/window');
	var $nativeUIManager = require('manager/nativeUI');
	var $authorize = require('core/authorize');
	var $userInfo = require('core/userInfo');
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
			var mobilePhone=$.trim($('#mobilePhone').val());
			var password=$.trim($('#password').val());
			if (mobilePhone.length > 0 && password.length > 0) {
				login(mobilePhone,password);
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
				var auth = false;
				for (var i in services) {
					var service = services[i];
					if (service) {
						auth = service;
					}
					alert(service.id + ": " + service.authResult + ", " + service.userInfo);
				}
				if (auth) {
					$nativeUIManager.watting('请等待...');
					var w = plus.nativeUI.showWaiting();
					document.addEventListener("pause", function() {
						setTimeout(function() {
							$nativeUIManager.wattingClose();
						}, 2000);
					}, false);
					auth.login(function() {
						$nativeUIManager.wattingClose();
						alert("登录认证成功：");
						alert(JSON.stringify(auth.authResult));
						auth.getUserInfo(function() {
							alert("获取用户信息成功：");
							alert(JSON.stringify(auth.userInfo));
							var nickname = auth.userInfo.nickname || auth.userInfo.name;
							alert("欢迎“" + nickname + "”登录！");
						}, function(e) {
							alert("获取用户信息失败：");
							alert("[" + e.code + "]：" + e.message);
							alert("获取用户信息失败！", null, "登录");
						});
					}, function(e) {
						$nativeUIManager.wattingClose();
						alert("登录认证失败:[" + e.code + "]：" + e.message);
						plus.nativeUI.alert("详情错误信息请参考授权登录(OAuth)规范文档：http://www.html5plus.org/#specification#/specification/OAuth.html", null, "登录失败[" + e.code + "]：" + e.message);
					});
				} else {
					plus.nativeUI.alert("无效的登录认证通道！", null, "登录");
				}
			}, function(e) {});
		});
		plus.navigator.closeSplashscreen();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});