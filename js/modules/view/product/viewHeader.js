define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var $productCommon = require('view/product/productCommon');
	var queryMap = parseURL();
	var id = queryMap.get('id');
	var tab = queryMap.get('tab');
	var typeId = queryMap.get('typeId');
	var productId;
	var userId;
	var productName;
	var numSeq;
	doAction = function(action) {
		$productCommon.action(id, tab, productName, productId, numSeq, userId, action);
	};
	onAction = function(numSeq) {
		$productCommon.onProductSale(id, numSeq);
	};
	newOnAction = function(numSeq) {
		$productCommon.newOnProductSale(id, numSeq);
	};
	bindEvent = function() {
		$common.touchSE($('#moreBtn'), function(event, startTouch, o) {}, function(event, o) {
			$productCommon.showMoreAction(id, tab, productName, productId, numSeq, userId);
		});
	};
	loadAction = function() {
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
						var actionArray = jsonData['actionArray'];
						var actionActionObj = jsonData['actionActionObj'];
						$userInfo.put('moreArray', JSON.stringify(moreArray));
						$userInfo.put('moreActionObj', JSON.stringify(moreActionObj));
						$userInfo.put('actionArray', JSON.stringify(actionArray));
						$userInfo.put('actionActionObj', JSON.stringify(actionActionObj));
					} else {
						$userInfo.removeItem('moreArray');
						$userInfo.removeItem('moreActionObj');
						$userInfo.removeItem('actionArray');
						$userInfo.removeItem('actionActionObj');
						$nativeUIManager.wattingClose();
						$nativeUIManager.alert('提示', '获取权限失败', 'OK', function() {});
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				$userInfo.removeItem('moreArray');
				$userInfo.removeItem('moreActionObj');
				$userInfo.removeItem('actionArray');
				$userInfo.removeItem('actionActionObj');
				$nativeUIManager.wattingClose();
				$nativeUIManager.alert('提示', '获取权限失败', 'OK', function() {});
			}
		});
	};
	loadViewData = function() {
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/product/info/view',
			dataType: 'json',
			data: {
				id: id,
				tab: tab
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						$userInfo.put('productView', JSON.stringify(jsonData));
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {}
		});
	};
	loadData = function() {
		$nativeUIManager.watting('请稍等...');
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/product/info/view',
			dataType: 'json',
			data: {
				id: id,
				tab: tab
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						var productInfo = jsonData['productInfo'];
						if (productInfo) {
							productName = productInfo['name'];
							productId = productInfo['productId'];
							userId = productInfo['userId'];
							numSeq = productInfo['numSeq'];
							$userInfo.put('productView', JSON.stringify(jsonData));
							var viewUrl = '';
							if (typeId) {
								loadWebview(typeId);
							}
						}
						$nativeUIManager.wattingClose();
						bindEvent();
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
	loadWebview = function(typeId) {
		var productFooterWin = plus.webview.create('viewFooter.html?typeId=' + typeId, "product_view_footer", {
			top: "50px",
			bottom: "0px",
			scrollIndicator: 'vertical'
		});
		if (productFooterWin) {
			productFooterWin.addEventListener("loaded", function() {
				$windowManager.current().append(productFooterWin);
			}, false);
		}
	}
	plusReady = function() {
		loadData();
		loadAction();
		bindEvent();
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