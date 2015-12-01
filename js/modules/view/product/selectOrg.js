define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $templete = require('core/templete');
	var queryMap = parseURL();
	var controlId = queryMap.get('controlId');
	var controlValue = queryMap.get('controlValue');
	var title = queryMap.get('title');
	var win = queryMap.get('win');
	bindEvent = function() {
		$('#keyword').off('keydown').on('keydown', function(e) {
			e = (e) ? e : ((window.event) ? window.event : "")
			var keyCode = e.keyCode ? e.keyCode : (e.which ? e.which : e.charCode);
			if (keyCode == 13) {
				var value = $(this).val();
				if (value == '') {
					loadData();
				}
				$('#keyword').trigger('blur');
			}
		});
		$('#keyword').off('blur').on('blur', function(e) {
			var value = $(this).val();
			if (value == '') {
				loadData();
			}
		});
		$('#keyword').off('valuechange').on('valuechange', function(e) {
			var value = $(this).val();
			if (value && value != '') {
				loadData();
			}
		});
		$common.touchSE($('li', '#selectItemUL'), function(event, startTouch, o) {}, function(event, o) {
			if (!$(o).hasClass('choosed')) {
				$('li', '#selectItemUL').removeClass('choosed');
				$(o).addClass('choosed');
				var productAddWindow = $windowManager.getById(win);
				if (productAddWindow) {
					var uid = $(o).attr('uid');
					var text = $('span', o).text();
					productAddWindow.evalJS('selectItem("' + controlId + '","' + uid + '","' + text + '")');
					$nativeUIManager.watting('已选择:' + text);
					window.setTimeout(function() {
						$windowManager.close();
						$nativeUIManager.wattingClose();
					}, 1000);
				}
			} else {
				$(o).removeClass('choosed');
			}
		});
	};
	loadData = function() {
		$nativeUIManager.watting('请稍等...');
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/common/common/orgList',
			dataType: 'json',
			data: {
				orgCompany: title,
				keyword:$('#keyword').val()
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						var orgList = jsonData['orgList'];
						if (orgList && $(orgList).size() > 0) {
							var sb = new StringBuilder();
							$(orgList).each(function(i, o) {
								sb.append(String.formatmodel($templete.selectItem(), {
									uid: o['uid'],
									text: o['text']
								}));
							});
							$('#selectItemUL').empty().append(sb.toString());
							if (controlValue) {
								$('li[uid="' + controlValue + '"]', '#selectItemUL').addClass('choosed');
							}
						} else {
							$('#selectItemUL').empty();
						}
						bindEvent();
						$nativeUIManager.wattingClose();
					} else {
						$nativeUIManager.wattingClose();
						$nativeUIManager.alert('提示', '获取数据失败', 'OK', function() {});
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				$nativeUIManager.wattingClose();
				$nativeUIManager.alert('提示', '获取数据失败', 'OK', function() {});
			}
		});

	};
	plusReady = function() {
		$common.switchOS(function() {
			$('body').addClass('Ios_scroll');
		}, function() {

		});
		$('h1').text(title);
		loadData();
		$common.touchSE($('#backBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.close();
		});
		$common.androidBack(function() {
			$windowManager.close();
		});
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});