define(function(require, exports, module) {
	var $common = require('core/common');
	var $windowManager = require('manager/window');
	var $nativeUIManager = require('manager/nativeUI');
	var $authorize = require('core/authorize');
	var $userInfo = require('core/userInfo');
	var $validator = require('core/validator');
	var intervalObj = false;
	getVerifyCode = function(mobilePhone, callback) {
		$nativeUIManager.watting('请稍等...');
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/common/reg/verifyCode',
			dataType: 'json',
			data: {
				mobilePhone: mobilePhone
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						if (typeof callback == 'function') {
							callback();
							$nativeUIManager.wattingTitle('验证码已发送!');
							window.setTimeout(function() {
								$nativeUIManager.wattingClose();
							}, 1000);
						}
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {

			}
		});
	};
	bindValidate = function() {
		successCount = 0;
		$validator.init([{
			id: 'mobilePhone',
			required: true,
			pattern: [{
				type: 'reg',
				exp: '_mobile',
				msg: '格式不正确'
			}],
			callback: function(t) {
				if (t) {
					$.ajax({
						type: 'POST',
						url: $common.getRestApiURL() + '/common/reg/validateMobilePhone',
						dataType: 'json',
						data: {
							mobilePhone: $('#mobilePhone').val()
						},
						success: function(jsonData) {
							if (jsonData) {
								if (jsonData['result'] == '0') {
									if ($('#verifyCodeBtn').hasClass('waitNum')) {
										$('#verifyCodeBtn').removeClass('waitNum').text('点击获取验证码');
									}
								} else {
									$nativeUIManager.alert('提示', '该手机号已经注册过 请直接登录！', 'OK', function() {
										$('#mobilePhone').val('');
									});
								}
							}
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) {
							$nativeUIManager.alert('提示', '该手机号已经注册过 请直接登录！', 'OK', function() {
								$('#mobilePhone').val('');
							});
						}
					});
				}
			}
		}, {
			id: 'verifyCode',
			required: true,
			pattern: [{
				type: 'int',
				exp: '==',
				msg: '请输入验证码'
			}],
			callback: function(t) {
				if (t) {
					$.ajax({
						type: 'POST',
						url: $common.getRestApiURL() + '/common/reg/validateCode',
						dataType: 'json',
						data: {
							mobilePhone: $('#mobilePhone').val(),
							verifyCode: $('#verifyCode').val()
						},
						success: function(jsonData) {
							if (jsonData) {
								if (jsonData['result'] == '0') {
									$('#verifyCode').attr('readonly', 'readonly');
									window.clearInterval(intervalObj);
									$('#verifyCodeBtn').text('验证码正确').attr('wait', 'Y').addClass('waitNum');
								} else {
									$nativeUIManager.alert('提示', '验证码错误!', '重新输入', function() {
										$('#verifyCode').val('');
									});
								}
							}
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) {
							$nativeUIManager.alert('提示', '验证码错误!', '重新输入', function() {
								$('#verifyCode').val('');
							});
						}
					});
				}
			}
		}, {
			id: 'userName',
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请输入姓名'
			}]
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
	bindEvent = function() {
		$common.touchSE($('#backBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.close();
		});
		$common.touchSE($('#verifyCodeBtn'), function(event, startTouch, o) {}, function(event, o) {
			if (!$(o).hasClass('waitNum')) {
				var wait = $(o).attr('wait');
				var mobilePhone = $('#mobilePhone').val();
				if (wait == 'N' && mobilePhone != '') {
					getVerifyCode(mobilePhone, function() {
						var sec = 59;
						$(o).text('重新获取验证码(' + sec + ')').attr('wait', 'Y').addClass('waitNum');
						intervalObj = window.setInterval(function() {
							$(o).text('重新获取验证码(' + sec + ')');
							sec--;
							if (sec == 0) {
								window.clearInterval(intervalObj);
								$(o).text('获取短信验证码').attr('wait', 'N').removeClass('waitNum');
							}
						}, 1000);
					});
				} else {
					$nativeUIManager.alert('提示', '请耐心等待验证码!', 'ok', function() {

					});
				}
			}
		});
		$common.touchSE($('#saveBtn'), function(event, startTouch, o) {}, function(event, o) {
			$validator.checkAll();
			window.setTimeout(function() {
				var passed = $validator.isPassed();
				if (passed) {
					$.ajax({
						type: 'POST',
						url: $common.getRestApiURL() + '/common/reg/planner',
						dataType: 'json',
						data: {
							mobilePhone: $('#mobilePhone').val(),
							verifyCode: $('#verifyCode').val(),
							userName: $('#userName').val(),
							password: $('#password').val()
						},
						success: function(jsonData) {
							if (jsonData) {
								if (jsonData['result'] == '0') {
									$windowManager.close();
									$windowManager.loadOtherWindow($windowManager.getLaunchWindowId(), 'home.html', false);
								} else {
									$nativeUIManager.alert('提示', '注册失败', '重新注册', function() {});
								}
							}
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) {
							$nativeUIManager.alert('提示', '注册失败', '重新注册', function() {});
						}
					});
				} else {
					$nativeUIManager.alert('提示', '请检查申请信息是否填写完毕', 'OK', function() {});
				}
			}, 500);
		});
	};
	plusReady = function() {
		bindEvent();
		bindValidate();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});