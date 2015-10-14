define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $templete = require('core/templete');
	var queryMap = parseURL();
	var productName = queryMap.get('productName');
	var numSeq = queryMap.get('numSeq');
	var userId = queryMap.get('userId');
	var selectNumSeq = -1;
	var oldProductName = false;
	saveData = function(num) {
		$nativeUIManager.watting('正在发布产品...');
		$common.refreshToken(function(tokenId) {
			$('#org\\.guiceside\\.web\\.jsp\\.taglib\\.Token').val(tokenId);
			$('#numSeq').val(num);
			$('#relationUserId').val(userId);
			$('#relationNumSeq').val(numSeq);
			$.ajax({
				type: 'POST',
				url: $common.getRestApiURL() + '/product/info/relationAction',
				dataType: 'json',
				data: $('#editForm').serialize().replace(/\+/g, " "),
				success: function(jsonData) {
					if (jsonData) {
						if (jsonData['result'] == '0') {
							$nativeUIManager.watting('关联产品成功!');
							window.setTimeout(function() {
								$nativeUIManager.wattingClose();
								$windowManager.close();
							}, 500);
						} else {
							$nativeUIManager.wattingClose();
							$nativeUIManager.alert('提示', '关联产品失败', 'OK', function() {});
						}
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					$nativeUIManager.wattingClose();
					$nativeUIManager.alert('提示', '关联产品失败', 'OK', function() {});
				}
			});
		});
	};
	bindEvent = function() {
		$common.touchSE($('#sendBtn'), function(event, startTouch, o) {}, function(event, o) {
			if (selectNumSeq == -1) {
				$nativeUIManager.alert('提示', '请选择产品发布栏位', 'OK', function() {});
			} else {
				$nativeUIManager.confirm('提示', '确定按照现在的产品栏位发布产品?', ['确定', '取消'], function() {
					saveData(selectNumSeq);
				}, function() {});
			}
		});
		$common.touchSE($('li', '#productSaleNumUL'), function(event, startTouch, o) {}, function(event, o) {
			var type = $(o).attr('type');
			var index = $(o).attr('index');
			if (type == 'add') {
				if (selectNumSeq == index) {
					$nativeUIManager.confirm('提示', '你确定取消放入栏位' + index + '?', ['确定', '取消'], function() {
						selectNumSeq = -1;
						$('span', o).eq(1).text('空').addClass('color-a');
					}, function() {});
				} else {
					if (selectNumSeq == -1) {
						$nativeUIManager.confirm('提示', '你确定将产品放入栏位' + index + '?', ['确定', '取消'], function() {
							selectNumSeq = index;
							$('span', o).eq(1).text(productName).removeClass('color-a');
						}, function() {});
					} else {
						$nativeUIManager.alert('提示', '要放入这个栏位请先清空上一选择栏位', 'OK', function() {});
					}
				}

			} else if (type == 'replace') {
				if (selectNumSeq == index) {
					$nativeUIManager.confirm('提示', '你确定还原栏位' + index + '?', ['确定', '取消'], function() {
						selectNumSeq = -1;
						$('span', o).eq(1).text(oldProductName).removeClass('color-a');
					}, function() {});
				} else {
					if (selectNumSeq == -1) {
						$nativeUIManager.confirm('提示', '你确定将产品替换栏位' + index + '?', ['确定', '取消'], function() {
							selectNumSeq = index;
							oldProductName = $('span', o).eq(1).text();
							$('span', o).eq(1).text(productName).removeClass('color-a');
						}, function() {});
					} else {
						$nativeUIManager.alert('提示', '要放入这个栏位请先清空上一选择栏位', 'OK', function() {});
					}
				}
			}
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
									sb.append(String.formatmodel($templete.saleNumItem(false), {
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