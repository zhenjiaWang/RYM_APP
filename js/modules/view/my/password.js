define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $validator = require('core/validator');
	var errorMsg = '';
	bindEvent = function() {
		$common.touchSE($('#backBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.close();
		});
		$common.touchSE($('#saveBtn'), function(event, startTouch, o) {}, function(event, o) {
			$validator.checkAll();
			window.setTimeout(function() {
				var passed = $validator.isPassed();
				if (passed) {
					$nativeUIManager.watting('正在重置密码...');
					$common.refreshToken(function(tokenId) {
						$.ajax({
							type: 'POST',
							url: $common.getRestApiURL() + '/sys/planner/password',
							dataType: 'json',
							data: {
								'org.guiceside.web.jsp.taglib.Token': tokenId,
								password: $('#password').val()
							},
							success: function(jsonData) {
								if (jsonData) {
									if (jsonData['result'] == '0') {
										$nativeUIManager.wattingClose();
										$nativeUIManager.alert('提示', '重置密码成功，请重新登录！', 'OK', function() {
											$windowManager.close();
											var myInfoWin=$windowManager.getById('my_info');
											if(myInfoWin){
												myInfoWin.evalJS('logout()');
											}
										});
									} else {
										$nativeUIManager.wattingClose();
										$nativeUIManager.alert('提示', '重置密码', 'OK', function() {});
									}
								}
							},
							error: function(XMLHttpRequest, textStatus, errorThrown) {
								$nativeUIManager.wattingClose();
								$nativeUIManager.alert('提示', '重置密码', 'OK', function() {});
							}
						});
					});
				}
			}, 500);
		});
	};
	bindValidate = function() {
		$validator.init([{
			id: 'oldPassword',
			required: true,
			pattern: [{
				type: 'reg',
				exp: '_pwd',
				msg: '以英文开头,必须包含数字,8-20位'
			}],
			callback: function(t) {
				if (t) {
					var oldPassword = $('#oldPassword').val();
					if (oldPassword) {
						$nativeUIManager.watting('正在校验原密码...');
						$.ajax({
							type: 'POST',
							url: $common.getRestApiURL() + '/sys/planner/checkPassword',
							dataType: 'json',
							data: {
								oldPassword: oldPassword
							},
							success: function(jsonData) {
								if (jsonData) {
									if (jsonData['result'] == '0') {
										$nativeUIManager.wattingTitle('请输入新密码');
										window.setTimeout(function(){
											$('#password').removeAttr('readonly');
											$('#confirmPassword').removeAttr('readonly');
											$nativeUIManager.wattingClose();
										},1000);
									} else {
										$nativeUIManager.wattingClose();
										$nativeUIManager.alert('提示', '原密码错误!请重现输入', 'OK', function() {
											 $('#oldPassword').val('').get(0).focus();
										});
									}
								}
							},
							error: function(XMLHttpRequest, textStatus, errorThrown) {
								$nativeUIManager.wattingClose();
								$nativeUIManager.alert('提示', '校验失败', 'OK', function() {});
							}
						});
					}
				}
			}
		}, {
			id: 'password',
			required: true,
			pattern: [{
				type: 'reg',
				exp: '_pwd',
				msg: '以英文开头,必须包含数字,8-20位'
			}],
			callback: function(t) {
				if (t) {
					var p1 = $('#password').val();
					var p2 = $('#confirmPassword').val();
					if ((p1 && p2) && (p1 == p2)) {} else if (p1 && p2) {
						$nativeUIManager.alert('提示', '两次密码不一致!', '重新输入', function() {
							$('#password').val('');
							$('#confirmPassword').val('');
						});
					}
				}
			}
		}, {
			id: 'confirmPassword',
			required: true,
			pattern: [{
				type: 'reg',
				exp: '_pwd',
				msg: '以英文开头,必须包含数字,8-20位'
			}],
			callback: function(t) {
				if (t) {
					var p1 = $('#password').val();
					var p2 = $('#confirmPassword').val();
					if ((p1 && p2) && (p1 == p2)) {} else if (p1 && p2) {
						$nativeUIManager.alert('提示', '两次密码不一致!', '重新输入', function() {
							$('#password').val('');
							$('#confirmPassword').val('');
						});
					}
				}
			}
		}]);
	};
	plusReady = function() {
		$common.switchOS(function() {
			$('body').addClass('Ios_scroll');
		}, function() {

		});
		bindValidate();
		bindEvent();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});