define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $shareManage = require('manager/share');
	var ID;
	var productName;
	var productId;
	var userId;
	var productTab;
	var productNumSeq;
	onActionCommon = function() {
		$nativeUIManager.watting('请选择发布栏位...');
		window.setTimeout(function() {
			$windowManager.create('product_send', 'send.html?productName=' + productName + '&saveWinId=product_view_header&saveFunction=onAction&onType=on', false, true, function(show) {
				show();
				$nativeUIManager.wattingClose();
			});
		}, 1500);

	};
	newOnActionCommon = function() {
		$nativeUIManager.watting('请选择发布栏位...');
		window.setTimeout(function() {
			$windowManager.create('product_send', 'send.html?productName=' + productName + '&saveWinId=product_view_header&saveFunction=newOnAction&onType=new', false, true, function(show) {
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
							}, 500);
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
							var productUserWin = $windowManager.getById('product_user');
							if (productUserWin) {
								productUserWin.evalJS('onRefresh()');
							}
							window.setTimeout(function() {
								$nativeUIManager.wattingClose();
								$windowManager.close();
							}, 500);
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
	onExist = function() {
		$nativeUIManager.watting('请稍等...');
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/product/info/onExist',
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
							onActionCommon();
						}, function() {});
					} else if (jsonData['result'] == '1') {
						$nativeUIManager.wattingClose();
						$nativeUIManager.alert('提示', '你已有这个产品了', 'OK', function() {});
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
	newOnExist = function() {
		$nativeUIManager.watting('请稍等...');
		alert(ID);
		alert(productTab);
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
						newOnActionCommon();
					} else if (jsonData['result'] == '1') {
						$nativeUIManager.wattingClose();
						$nativeUIManager.alert('提示', '你已有这个产品了', 'OK', function() {});
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
						$nativeUIManager.alert('提示', '你已有这个产品了', 'OK', function() {});
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
						//$nativeUIManager.alert('提示', '该产品已经存在下游关系', 'OK', function() {});
						$nativeUIManager.confirm('提示', '该产品已经存在下游关系，你确定要下架当前产品吗?', ['确定', '取消'], function() {
							offActionCommon();
						}, function() {});
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
							var productUserWin = $windowManager.getById('product_user');
							if (productUserWin) {
								productUserWin.evalJS('onRefresh()');
							}
							window.setTimeout(function() {
								$nativeUIManager.wattingClose();
								$windowManager.close();
							}, 500);
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
	editActionCommon = function() {
		$nativeUIManager.watting('请稍等...');
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/product/info/editData',
			dataType: 'json',
			data: {
				id: ID
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						var editType = jsonData['editType'];
						$userInfo.put('editJson', JSON.stringify(jsonData));
						var editUrl = editType;
						var productInfo = jsonData['productInfo'];
						if (productInfo) {
							var typeId = productInfo['typeId'];
							if (typeId == 1) {
								editUrl += 'Financial.html';
							} else if (typeId == 2) {
								editUrl += 'Fund.html';
							} else if (typeId == 3) {
								editUrl += 'Trust.html';
							}
						}
						$windowManager.create('product_edit_footer', 'editFooter.html?typeId='+typeId+'&editType='+editType, false, true, function(show) {
							show();
							$nativeUIManager.wattingClose();
						});
					} else {
						$nativeUIManager.wattingClose();
						$nativeUIManager.alert('提示', '获取产品信息失败', 'OK', function() {});
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				$nativeUIManager.wattingClose();
				$nativeUIManager.alert('提示', '获取产品信息失败', 'OK', function() {});
			}
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
							var productUserWin = $windowManager.getById('product_user');
							if (productUserWin) {
								productUserWin.evalJS('onRefresh()');
							}
							window.setTimeout(function() {
								$nativeUIManager.wattingClose();
								$windowManager.close();
							}, 500);
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
							var productUserWin = $windowManager.getById('product_user');
							if (productUserWin) {
								productUserWin.evalJS('onRefresh()');
							}
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
	exports.action = function(id, tab, name, pid, numSeq, uid, action) {
		ID = id;
		productName = name;
		productId = pid;
		userId = uid;
		productTab = tab;
		productNumSeq = numSeq;
		if (action) {
			if (action == 'offSale') {
				offExist();
			} else if (action == 'onSale') {
				onExist();
			} else if (action == 'newOnSale') {
				newOnExist();
			} else if (action == 'relation') {
				//$nativeUIManager.alert('提示', '需要等忆星的短信验证码 后台变更过 线上服务器不支持了', 'OK', function() {});
				relationExist(productId, productName, userId, productNumSeq);
			} else if (action == 'favorites') {
				favoritesExist();
			} else if (action == 'delFavorites') {
				$nativeUIManager.confirm('提示', '你确定要取消收藏当前产品吗?', ['确定', '取消'], function() {
					favoritesCancelActionCommon();
				}, function() {});
			} else if (action == 'lock') {
				//$nativeUIManager.alert('提示', '需要等忆星的短信验证码 后台变更过 线上服务器不支持了', 'OK', function() {});
				$nativeUIManager.confirm('提示', '你确定要锁定产品，解除关联关系?', ['确定', '取消'], function() {
					lockActionCommon();
				}, function() {});
			} else if (action == 'comment') {
				$windowManager.create('product_commentHeader', 'commentHeader.html?id=' + ID + '&tab=' + productTab, false, true, function(show) {
					show();
				});
			}
		}
	};
	exports.showMoreAction = function(id, tab, name, pid, numSeq, uid) {
		$shareManage.auth('weixin');
		ID = id;
		productName = name;
		productId = pid;
		userId = uid;
		productTab = tab;
		productNumSeq = numSeq;
		var moreArrayJson = $userInfo.get('moreArray');
		var moreActionObjJson = $userInfo.get('moreActionObj');
		if (moreArrayJson && moreActionObjJson) {
			var moreArray = JSON.parse(moreArrayJson);
			var moreActionObj = JSON.parse(moreActionObjJson);
			if (moreArray && moreActionObj) {
				$nativeUIManager.confactionSheetirm('请选择操作', '取消', moreArray,
					function(index) {
						if (index > 0) {
							var moreAction = moreActionObj[index + ''];
							if (moreAction) {
								if (moreAction == 'share') {
									$nativeUIManager.confactionSheetirm('请选择操作', '取消', [{
											title: '分享到微信好友'
										}, {
											title: '分享到微信朋友圈'
										}],
										function(shareIndex) {
											if (shareIndex > 0) {
												if (shareIndex == 1) {
													$shareManage.share('WXSceneSession', {
														url: 'http://dev.lcruyimen.com/weixin/entrance/shareEntrance?action=action-product_pId-' + ID + '_tab-' + productTab,
														content: productName,
														title: $userInfo.get('userName') + '推荐的产品'
													});
												} else if (shareIndex == 2) {
													$shareManage.share('WXSceneTimeline', {
														url: 'http://dev.lcruyimen.com/weixin/entrance/shareEntrance?action=action-product_pId-' + ID + '_tab-' + productTab,
														content: productName,
														title: $userInfo.get('userName') + '推荐的产品'
													});
												}
											}
										});
								} else if (moreAction == 'edit') {
									editActionCommon();
								}
							}
						}
					});
			}
		}
	};

});