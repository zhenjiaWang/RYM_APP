define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	bindEvent = function() {
		$common.touchSE($('#backBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.close();
		});
		$common.androidBack(function() {
			$windowManager.close();
		});
		$common.touchSE($('#about'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.create('my_about', 'about.html', false, true, function(show) {
				show();
			});
		});

		$common.touchSE($('.switch'), function(event, startTouch, o) {}, function(event, o) {
			if ($(o).hasClass('off')) {
				$(o).removeClass('off');
			} else {
				$(o).addClass('off');
			}

			$.ajax({
				type: 'POST',
				url: $common.getRestApiURL() + '/sys/planner/nightPush',
				dataType: 'json',
				data: {
					nightPush: $(o).hasClass('off') ? 1 : 0
				},
				success: function(jsonData) {
					if (jsonData) {
						if (jsonData['result'] == '0') {
							if ($(o).hasClass('off')) {
								$nativeUIManager.watting('已关闭夜间防骚扰!', 1500);
							} else {
								$nativeUIManager.watting('已开启夜间防骚扰!', 1500);
							}
						} else {
							$nativeUIManager.alert('提示', '设置失败', 'OK', function() {});
						}
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					$nativeUIManager.alert('提示', '设置失败', 'OK', function() {});
				}
			});
		});

	};
	plusReady = function() {
		$common.switchOS(function() {
			$('body').addClass('Ios_scroll');
		}, function() {

		});
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/sys/planner/nightPush',
			dataType: 'json',
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						var nightPush=jsonData['nightPush'];
						if(nightPush){
							if(nightPush=='0'){
								$('.switch').removeClass('off');
							}else{
								$('.switch').addClass('off');
							}
						}
					} else {
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
			}
		});
		bindEvent();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});