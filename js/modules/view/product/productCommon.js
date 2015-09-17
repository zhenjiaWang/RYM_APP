define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var ID;
	var productName;
	var productId;
	var userId;
	onActionCommon = function() {
		$nativeUIManager.watting('请选择发布栏位...');
		window.setTimeout(function() {
			$windowManager.create('product_send', 'send.html?productName=' + productName + '&saveWinId=product_view&saveFunction=onAction', false, true, function(show) {
				show();
				$nativeUIManager.wattingClose();
			});
		}, 1500);

	};
	favoritesActionCommon = function() {
		$nativeUIManager.watting('请稍等...');
		$common.refreshToken(function(tokenId) {
			$.ajax({
				type: 'POST',
				url: $common.getRestApiURL() + '/product/info/favoritesAction',
				dataType: 'json',
				data: {
					id: productId,
					userId: userId,
					'org.guiceside.web.jsp.taglib.Token': tokenId
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
		});
	};
	favoritesCancelActionCommon = function() {
		$nativeUIManager.watting('请稍等...');
		$common.refreshToken(function(tokenId) {
			$.ajax({
				type: 'POST',
				url: $common.getRestApiURL() + '/product/info/favoritesCancelAction',
				dataType: 'json',
				data: {
					id: productId,
					'org.guiceside.web.jsp.taglib.Token': tokenId
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
							$nativeUIManager.alert('提示', '取消收藏产品失败', 'OK', function() {});
						}
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					$nativeUIManager.wattingClose();
					$nativeUIManager.alert('提示', '取消收藏产品失败', 'OK', function() {});
				}
			});
		});
	};
	favoritesExist = function() {
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/product/info/favoritesExist',
			dataType: 'json',
			data: {
				id: productId
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						favoritesActionCommon();
					} else if (jsonData['result'] == '1') {
						$nativeUIManager.confirm('提示', '与您收藏夹里的是同一个产品，收藏后覆盖?', ['确定', '取消'], function() {
							favoritesActionCommon();
						}, function() {

						});
					} else {
						$nativeUIManager.alert('提示', '收藏产品失败', 'OK', function() {});
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				$nativeUIManager.alert('提示', '收藏产品失败', 'OK', function() {});
			}
		});
	};
	offActionCommon = function() {
		$nativeUIManager.watting('请稍等...');
		$common.refreshToken(function(tokenId) {
			$.ajax({
				type: 'POST',
				url: $common.getRestApiURL() + '/product/info/offAction',
				dataType: 'json',
				data: {
					id: ID,
					'org.guiceside.web.jsp.taglib.Token': tokenId
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
		});
	};
	exports.onProductSale = function(id, numSeq) {
		$nativeUIManager.watting('请稍等...');
		$common.refreshToken(function(tokenId) {
			$.ajax({
				type: 'POST',
				url: $common.getRestApiURL() + '/product/info/onAction',
				dataType: 'json',
				data: {
					id: id,
					numSeq: numSeq,
					'org.guiceside.web.jsp.taglib.Token': tokenId
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
		});
	};
	exports.showMoreAction = function(id, tab, name, pid, uid) {
		ID = id;
		productName = name;
		productId = pid;
		userId = uid;
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
											} else if (moreAction == 'favorites') {
												$nativeUIManager.confirm('提示', '你确定要收藏当前产品吗?', ['确定', '取消'], function() {
													favoritesExist();
												}, function() {});
											}else if (moreAction == 'favoritesCancel') {
												$nativeUIManager.confirm('提示', '你确定要取消收藏当前产品吗?', ['确定', '取消'], function() {
													favoritesCancelActionCommon();
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