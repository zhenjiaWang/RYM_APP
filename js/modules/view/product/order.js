define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $templete = require('core/templete');
	var queryMap = parseURL();
	var productName = queryMap.get('productName');
	var finalTop = 0;
	bindEvent = function() {
		$common.touchSME($('.icon-move', '#productSaleNumUL'), function(startX, startY, endX, endY, event, startTouch, o) {
				var li = $(o).closest('li');
				if (li) {
					var top = $(li).css('top');
					top = top.replaceAll('px', '');
					top = parseInt(top);
					finalTop = top;
				}
			},
			function(startX, startY, endX, endY, event, moveTouch, o) {
				var li = $(o).closest('li');
				if (li) {
					if (startY != endY) {
						var top=finalTop + (endY-startY);
						$(li).css('top', top + 'px');
					}
				}

			},
			function(startX, startY, endX, endY, event, o) {

			});
	};
	loadData = function() {
		$nativeUIManager.watting('正在加载理财室栏位');
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/product/info/getCurrentSaleNum',
			dataType: 'json',
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						$nativeUIManager.wattingClose();
						var maxNum = jsonData['maxNum'];
						maxNum = parseInt(maxNum);
						if (maxNum > 0) {
							var numObjArray = jsonData['numObjArray'];
							if (numObjArray) {
								var top = 0;
								var baseAdd = 46;
								var sb = new StringBuilder();
								$(numObjArray).each(function(i, o) {
									sb.append(String.formatmodel($templete.saleNumItem(true), {
										action: o['action'],
										name: o['name'],
										index: o['index'],
										top: top
									}));
									top = top + baseAdd;
								});
								$('#productSaleNumUL').empty().append(sb.toString());
								$('li[type="add"]', '#productSaleNumUL').each(function(i, o) {
									$('span', o).addClass('color-a');
								});
							}
						}
						bindEvent();
					} else {
						$nativeUIManager.wattingClose();
						$nativeUIManager.alert('提示', '获取栏位失败', 'OK', function() {});
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				$nativeUIManager.wattingClose();
				$nativeUIManager.alert('提示', '获取栏位失败', 'OK', function() {});
			}
		});
	};
	plusReady = function() {
		$common.switchOS(function() {
			$('body').addClass('Ios_scroll');
		}, function() {

		});
		loadData();
		$common.touchSE($('#backBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.close();
		});
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});