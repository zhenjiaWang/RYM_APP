define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	bindEvent = function() {
		$common.touchSE($('#backBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.close();
		});
		$common.touchSE($('#saveBtn'), function(event, startTouch, o) {}, function(event, o) {
			var size = $('li.current', '.photoList').size();
			if (size == 0) {
				$nativeUIManager.alert('提示', '请选择头像', 'OK', function() {});
			} else {
				var img = $('li.current', '.photoList').find('img');
				if (img) {
					$nativeUIManager.watting('正在保存...');
					$common.refreshToken(function(tokenId) {
						$.ajax({
							type: 'POST',
							url: $common.getRestApiURL() + '/sys/planner/edit',
							dataType: 'json',
							data: {
								'org.guiceside.web.jsp.taglib.Token': tokenId,
								code: 'headImgUrl',
								codeValue: $(img).attr('src')
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
			}
		});
		$common.touchSE($('li', '.photoList'), function(event, startTouch, o) {}, function(event, o) {
			if ($(o).hasClass('current')) {
				$(o).removeClass('current');
			} else {
				$('li', '.photoList').removeClass('current');
				$(o).addClass('current');
			}
		});

	};
	plusReady = function() {
		$common.switchOS(function() {
			$('body').addClass('Ios_scroll');
		}, function() {

		});
		bindEvent();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});