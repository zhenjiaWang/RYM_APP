define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $templete = require('core/templete');
	var queryMap = parseURL();
	var productName = queryMap.get('productName');
	var finalTop = 0;
	var movenNext = false;
	var movenPrev = false;
	var index = -1;
	var maxNum = -1;
	setMoveEndLi = function(o, setTopFlag) {
		var li = $(o).closest('li');
		if (li) {
			if (setTopFlag) {
				var top = (index - 1) * 46;
				$(li).animate({
					'top': top + 'px'
				}).attr('index', index);
				index = -1;
			} else {
				$(li).attr('index', index);
			}
			movenNext = false;
			movenPrev = false;
		}
	};
	bindEvent = function() {
		$common.touchSME($('.icon-move', '#productSaleNumUL'), function(startX, startY, endX, endY, event, startTouch, o) {
				var li = $(o).closest('li');
				if (li) {
					index = $(li).attr('index');
					index = parseInt(index);
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
						var diffY = endY - startY;
						if (diffY > 0) {
							var top = finalTop + diffY;
							$(li).css('top', top + 'px');
							var nextIndex = (index + 1);
							if (nextIndex > maxNum) {
								nextIndex = maxNum;
							}
							if (nextIndex > index) {
								var nextLi = $('li[index="' + nextIndex + '"]', '#productSaleNumUL');
								if (nextLi) {
									var nextTop = $(nextLi).css('top');
									if (nextTop) {
										nextTop = nextTop.replaceAll('px', '');
										nextTop = parseInt(nextTop);
										if (((top + 23) >= nextTop) && !movenNext) {
											movenNext = true;
											index += 1;
											$(nextLi).attr('index', (nextIndex - 1)).animate({
												'top': (nextTop - 46) + 'px'
											}, false, false, function() {
												setMoveEndLi(o, false);
											});
										}
									}
								}
							}
						} else if (diffY < 0) {
							var top = finalTop + diffY;
							$(li).css('top', top + 'px');
							var prevIndex = (index - 1);
							if (prevIndex < 1) {
								prevIndex = 1;
							}
							if (prevIndex < index) {
								var prevLi = $('li[index="' + prevIndex + '"]', '#productSaleNumUL');
								if (prevLi) {
									var prevTop = $(prevLi).css('top');
									if (prevTop) {
										prevTop = prevTop.replaceAll('px', '');
										prevTop = parseInt(prevTop);
										if (((top - 23) <= prevTop) && !movenPrev) {
											movenPrev = true;
											index -= 1;
											$(prevLi).attr('index', (prevIndex + 1)).animate({
												'top': (prevTop + 46) + 'px'
											}, false, false, setMoveEndLi(o, false));
										}
									}
								}
							}
						}
					}
				}
			},
			function(startX, startY, endX, endY, event, o) {
				setMoveEndLi(o, true);
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
						maxNum = jsonData['maxNum'];
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