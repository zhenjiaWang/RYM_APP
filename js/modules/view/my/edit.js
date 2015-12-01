define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $validator = require('core/validator');
	var queryMap = parseURL();
	var code = queryMap.get('code');
	var value = queryMap.get('value');
	var errorMsg = '';
	bindEvent = function() {
		$common.touchSE($('#backBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.close();
		});
		$common.androidBack(function() {
			$windowManager.close();
		});
		$common.touchSE($('#saveBtn'), function(event, startTouch, o) {}, function(event, o) {
			$validator.checkAll();
			window.setTimeout(function() {
				var passed = $validator.isPassed();
				if (passed) {
					$nativeUIManager.watting('正在保存...');
					$common.refreshToken(function(tokenId) {
						$.ajax({
							type: 'POST',
							url: $common.getRestApiURL() + '/sys/planner/edit',
							dataType: 'json',
							data: {
								'org.guiceside.web.jsp.taglib.Token': tokenId,
								code: code,
								codeValue: $('#codeValue').val()
							},
							success: function(jsonData) {
								if (jsonData) {
									if (jsonData['result'] == '0') {
										$nativeUIManager.wattingClose();
										$windowManager.close();
										$windowManager.reloadOtherWindow('my_info', false);
									} else {
										$nativeUIManager.wattingClose();
										$nativeUIManager.alert('提示', '保存失败', 'OK', function() {});
									}
								}
							},
							error: function(XMLHttpRequest, textStatus, errorThrown) {
								$nativeUIManager.wattingClose();
								$nativeUIManager.alert('提示', '保存失败', 'OK', function() {});
							}
						});
					});
				}
			}, 500);
		});
	};
	bindValidate = function() {
		if (code == 'signature') {
			$validator.init([{
				id: 'codeValue',
				required: false,
				pattern: [{
					type: 'length',
					exp: '<=40',
					msg: '签名字数不能大于40字'
				}]
			}]);
		} else {
			$validator.init([{
				id: 'codeValue',
				required: true,
				pattern: [{
					type: 'blank',
					exp: '!=',
					msg: errorMsg
				}, {
					type: 'length',
					exp: '<=15',
					msg: '字数不能大于15字'
				}]
			}]);
		}
	};
	plusReady = function() {
		$common.switchOS(function() {
			$('body').addClass('Ios_scroll');
		}, function() {

		});
		if (code) {
			if (code == 'userName') {
				$('h1').text('个人信息-修改姓名');
				errorMsg = '请输入姓名';
			} else if (code == 'plannerNo') {
				$('h1').text('个人信息-修改工号');
				errorMsg = '请输入工号';
			} else if (code == 'signature') {
				$('h1').text('个人信息-修改签名');
			} else if (code == 'orgName') {
				$('h1').text('个人信息-所在机构');
			}
			if (value) {
				$('#codeValue').val(value);
			}
		}
		bindValidate();
		bindEvent();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});