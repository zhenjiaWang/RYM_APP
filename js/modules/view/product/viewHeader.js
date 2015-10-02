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
	onAction = function(numSeq) {
		$productCommon.onProductSale(id, numSeq);
	};
	newOnAction = function(numSeq) {
		alert('newOnAction');
		$productCommon.newOnProductSale(id, numSeq);
	};
	bindEvent = function() {
		$common.touchSE($('#moreBtn'), function(event, startTouch, o) {}, function(event, o) {
			$productCommon.showMoreAction(id, tab, productName, productId, userId);
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
							$userInfo.put('productView', JSON.stringify(jsonData));
							var viewUrl='';
							if(typeId){
								if(typeId=='1'){
									viewUrl='viewFinancial.html';
								}else if(typeId=='2'){
									viewUrl='viewFund.html';
								}else if(typeId=='3'){
									viewUrl='viewTrust.html';
								}
							}
							loadWebview(viewUrl);
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
	loadWebview = function(url) {
		var productUserWin = plus.webview.create(url, "product_view", {
			top: "50px",
			bottom: "0px",
			scrollIndicator: 'vertical'
		});
		if (productUserWin) {
			productUserWin.addEventListener("loaded", function() {
				$windowManager.current().append(productUserWin);
			}, false);
		}
	}
	plusReady = function() {
		loadData();
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