define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var ID;
	var productName;
	var productId;
	var userId;
	var productTab;
	var productNumSeq;
	onActionCommon = function() {
		$nativeUIManager.watting('请选择发布栏位...');
		window.setTimeout(function() {
			$windowManager.create('product_send', 'send.html?productName=' + productName + '&saveWinId=product_view&saveFunction=onAction', false, true, function(show) {
				show();
				$nativeUIManager.wattingClose();
			});
		}, 1500);

	};
	newOnActionCommon = function() {
		$nativeUIManager.watting('请选择发布栏位...');
		window.setTimeout(function() {
			$windowManager.create('product_send', 'send.html?productName=' + productName + '&saveWinId=product_view&saveFunction=newOnAction', false, true, function(show) {
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
							$nativeUIManager.wattingTitle('收藏成功!');
							window.setTimeout(function() {
								$nativeUIManager.wattingClose();
								$windowManager.close();
							}, 300);
						} else {
							$nativeUIManager.wattingClose();
							$nativeUIManager.alert('提示', '收藏产品失败', 'OK', function() {});
						}
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					$nativeUIManager.wattingClose();
					$nativeUIManager.alert('提示', '收藏产品失败', 'OK', function() {});
				}
			});
		});
	};
	lockActionCommon = function() {
		$nativeUIManager.watting('请稍等...');
		$common.refreshToken(function(tokenId) {
			$.ajax({
				type: 'POST',
				url: $common.getRestApiURL() + '/product/info/lockAction',
				dataType: 'json',
				data: {
					id: ID,
					'org.guiceside.web.jsp.taglib.Token': tokenId
				},
				success: function(jsonData) {
					if (jsonData) {
						if (jsonData['result'] == '0') {
							$nativeUIManager.wattingTitle('锁定成功!');
							$windowManager.reloadOtherWindow('product_user', true);
							window.setTimeout(function() {
								$nativeUIManager.wattingClose();
								$windowManager.close();
							}, 300);
						} else {
							$nativeUIManager.wattingClose();
							$nativeUIManager.alert('提示', '锁定产品失败', 'OK', function() {});
						}
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					$nativeUIManager.wattingClose();
					$nativeUIManager.alert('提示', '锁定产品失败', 'OK', function() {});
				}
			});
		});
	};
	unLockActionCommon = function() {
		$nativeUIManager.watting('请稍等...');
		$common.refreshToken(function(tokenId) {
			$.ajax({
				type: 'POST',
				url: $common.getRestApiURL() + '/product/info/unLockAction',
				dataType: 'json',
				data: {
					id: ID,
					'org.guiceside.web.jsp.taglib.Token': tokenId
				},
				success: function(jsonData) {
					if (jsonData) {
						if (jsonData['result'] == '0') {
							$nativeUIManager.wattingTitle('解锁成功!');
							$windowManager.reloadOtherWindow('product_user', true);
							window.setTimeout(function() {
								$nativeUIManager.wattingClose();
								$windowManager.close();
							}, 300);
						} else {
							$nativeUIManager.wattingClose();
							$nativeUIManager.alert('提示', '解锁产品失败', 'OK', function() {});
						}
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					$nativeUIManager.wattingClose();
					$nativeUIManager.alert('提示', '解锁产品失败', 'OK', function() {});
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
							$nativeUIManager.wattingTitle('取消收藏成功!');
							$windowManager.reloadOtherWindow('product_user', true);
							window.setTimeout(function() {
								$nativeUIManager.wattingClose();
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
	newOnExist = function() {
		$nativeUIManager.watting('请稍等...');
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/product/info/newOnExist',
			dataType: 'json',
			data: {
				id: ID,
				tab: productTab
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						$nativeUIManager.wattingClose();
						$nativeUIManager.confirm('提示', '你确定要上架当前产品吗?', ['确定', '取消'], function() {
							newOnActionCommon();
						}, function() {});
					} else if (jsonData['result'] == '1') {
						$nativeUIManager.wattingClose();
						$nativeUIManager.alert('提示', '该产品已经存在于在售列表', 'OK', function() {});
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
	relationExist = function(productId, productName, userId, numSeq) {
		$nativeUIManager.watting('请稍等...');
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/product/info/relationExist',
			dataType: 'json',
			data: {
				id: productId
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						$nativeUIManager.wattingClose();
						$nativeUIManager.watting('请选择发布栏位...');
						window.setTimeout(function() {
							$windowManager.create('relation_send', '../relation/send.html?productName=' + productName + '&userId=' + userId + '&numSeq=' + numSeq, false, true, function(show) {
								show();
								$nativeUIManager.wattingClose();
							});
						}, 1500);
					} else if (jsonData['result'] == '1') {
						$nativeUIManager.wattingClose();
						$nativeUIManager.alert('提示', '该产品已经存在于在售列表', 'OK', function() {});
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
	};
	offExist = function() {
		$nativeUIManager.watting('请稍等...');
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/product/info/offExist',
			dataType: 'json',
			data: {
				id: ID
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						$nativeUIManager.wattingClose();
						$nativeUIManager.confirm('提示', '你确定要下架当前产品吗?', ['确定', '取消'], function() {
							offActionCommon();
						}, function() {});
					} else if (jsonData['result'] == '1') {
						$nativeUIManager.wattingClose();
						$nativeUIManager.alert('提示', '该产品已经存在下游关系，暂时禁止下架', 'OK', function() {});
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
							$nativeUIManager.wattingTitle('产品已下架!');
							$windowManager.reloadOtherWindow('product_user', true);
							window.setTimeout(function() {
								$nativeUIManager.wattingClose();
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
	exports.newOnProductSale = function(id, numSeq) {
		$nativeUIManager.watting('请稍等...');
		$common.refreshToken(function(tokenId) {
			$.ajax({
				type: 'POST',
				url: $common.getRestApiURL() + '/product/info/newOnAction',
				dataType: 'json',
				data: {
					id: id,
					numSeq: numSeq,
					tab: productTab,
					'org.guiceside.web.jsp.taglib.Token': tokenId
				},
				success: function(jsonData) {
					if (jsonData) {
						if (jsonData['result'] == '0') {
							$nativeUIManager.wattingTitle('产品已上架!');
							$windowManager.reloadOtherWindow('product_user', true);
							window.setTimeout(function() {
								$nativeUIManager.wattingClose();
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
							$nativeUIManager.wattingTitle('产品已上架!');
							$windowManager.reloadOtherWindow('product_user', true);
							window.setTimeout(function() {
								$nativeUIManager.wattingClose();
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
	exports.showMoreAction = function(id, tab, name, pid, numSeq, uid) {
		ID = id;
		productName = name;
		productId = pid;
		userId = uid;
		productTab = tab;
		productNumSeq = numSeq;
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
											if (moreAction == 'offSale') {
												offExist();
											} else if (moreAction == 'onSale') {
												$nativeUIManager.confirm('提示', '你确定要上架当前产品吗?', ['确定', '取消'], function() {
													onActionCommon();
												}, function() {});
											} else if (moreAction == 'newOnSale') {
												newOnExist();
											} else if (moreAction == 'relation') {
												relationExist(productId, productName, userId, productNumSeq);
											} else if (moreAction == 'favorites') {
												$nativeUIManager.confirm('提示', '你确定要收藏当前产品吗?', ['确定', '取消'], function() {
													favoritesExist();
												}, function() {});
											} else if (moreAction == 'delFavorites') {
												$nativeUIManager.confirm('提示', '你确定要取消收藏当前产品吗?', ['确定', '取消'], function() {
													favoritesCancelActionCommon();
												}, function() {});
											} else if (moreAction == 'lock') {
												$nativeUIManager.confirm('提示', '你确定要锁定产品，解除关联关系?', ['确定', '取消'], function() {
													lockActionCommon();
												}, function() {});
											} else if (moreAction == 'unLock') {
												$nativeUIManager.confirm('提示', '你确定要解锁产品，恢复关联关系?', ['确定', '取消'], function() {
													unLockActionCommon();
												}, function() {});
											} else if (moreAction == 'share') {
												$nativeUIManager.alert('提示', '微信浏览域名没办法用，暂关闭', 'OK', function() {});
											} else if (moreAction == 'edit') {
												$nativeUIManager.alert('提示', '测试需要监控原始数据，暂关闭', 'OK', function() {});
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