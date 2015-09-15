define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var ID;
	var productName;
	onActionCommon = function() {
		$nativeUIManager.watting('请选择发布栏位...');
		window.setTimeout(function() {
			$windowManager.create('product_send', 'send.html?productName=' + productName + '&saveWinId=product_view&saveFunction=onAction', false, true, function(show) {
				show();
				$nativeUIManager.wattingClose();
			});
		}, 1500);

	};
	offActionCommon = function() {
		$nativeUIManager.watting('请稍等...');
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/product/info/offAction',
			dataType: 'json',
			data: {
				id: ID
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						$windowManager.reloadOtherWindow('product_user', true);
						window.setTimeout(function() {
							$windowManager.close();
						}, 300);
					} else {
						$nativeUIManager.wattingClose();
						$nativeUIManager.alert('提示', '下架产品失败', 'OK', function() {});
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				$nativeUIManager.wattingClose();
				$nativeUIManager.alert('提示', '下架产品失败', 'OK', function() {});
			}
		});
	};
	exports.onProductSale = function(id, numSeq) {
		$nativeUIManager.watting('请稍等...');
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/product/info/onAction',
			dataType: 'json',
			data: {
				id: id,
				numSeq: numSeq
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						$windowManager.reloadOtherWindow('product_user', true);
						window.setTimeout(function() {
							$windowManager.close();
						}, 300);
					} else {
						$nativeUIManager.wattingClose();
						$nativeUIManager.alert('提示', '上架产品失败', 'OK', function() {});
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				$nativeUIManager.wattingClose();
				$nativeUIManager.alert('提示', '上架产品失败', 'OK', function() {});
			}
		});
	};
	exports.showMoreAction = function(id, tab, name) {
		ID = id;
		productName = name;
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/product/info/viewMore',
			dataType: 'json',
			data: {
				id: id,
				tab: tab
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						var moreArray = jsonData['moreArray'];
						var moreActionObj = jsonData['moreActionObj'];
						if (moreArray) {
							$nativeUIManager.confactionSheetirm('请选择操作', '取消', moreArray,
								function(index) {
									if (index > 0) {
										var moreAction = moreActionObj[index + ''];
										if (moreAction) {
											if (moreAction == 'off') {
												$nativeUIManager.confirm('提示', '你确定要下架当前产品吗?', ['确定', '取消'], function() {
													offActionCommon();
												}, function() {});
											} else if (moreAction == 'on') {
												$nativeUIManager.confirm('提示', '你确定要上架当前产品吗?', ['确定', '取消'], function() {
													onActionCommon();
												}, function() {});
											}
										}
									}
								});
						}
					} else {
						$nativeUIManager.wattingClose();
						$nativeUIManager.alert('提示', '获取权限失败', 'OK', function() {});
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				$nativeUIManager.wattingClose();
				$nativeUIManager.alert('提示', '获取权限失败', 'OK', function() {});
			}
		});
	};

});