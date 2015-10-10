define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $templete = require('core/templete');
	var showImgFlag = false;
	bindEvent = function() {
		$common.touchSE($('#showImgBtn'), function(event, startTouch, o) {}, function(event, o) {
			$nativeUIManager.watting('请稍等...');
			$windowManager.create('product_img', 'img.html', 'slide-in-bottom', true, function(show) {
				$nativeUIManager.wattingClose();
				show();
			});
		});
	};
	loadData = function() {
		var productView = $userInfo.get('productView');
		if (productView) {
			var jsonData = JSON.parse(productView);
			if (jsonData) {
				var planner = jsonData['planner'];
				if (planner) {
					$('#userName').text(planner['userName']);
					$('#plannerNo').text(planner['plannerNo']);
					$('#orgName').text(planner['orgName']);
					$('#signature').text(planner['signature']);
					$('#follow').text(planner['follow']);
					$('#friends').text(planner['friends']);
					var bgImgUrl = planner['bgImgUrl'];
					if (!bgImgUrl) {
						bgImgUrl = '../../img/2.jpg';
					}
					$('img', '#uploadBgImgBtn').attr('src', bgImgUrl);
					var headImgUrl = planner['headImgUrl'];
					if (headImgUrl) {
						$('img', '.userPhoto').attr('src', headImgUrl);
					}
				}
				var fund = jsonData['fund'];
				var productInfo = jsonData['productInfo'];
				if (productInfo && fund) {
					$('#name').text(productInfo['name']);
					$('#updateTime').text(productInfo['updateTime']);
					$('#viewCount').text(productInfo['viewCount']);
					$('#relationCount').text(productInfo['relationCount']);
					$('#orgName').text(productInfo['orgName']);
					$('#remarks').text(productInfo['remarks']);
					$('#fundTypeDesc').text(fund['fundType']);
					$('#fundType').text(fund['fundType']);
					var attArray = jsonData['attArray'];
					if (attArray && $(attArray).size() > 0) {
						$('.imgDetail').append('<p class="font14 title color-8d">产品图片</p>\n');
						$(attArray).each(function(i, o) {
							$('.imgDetail').append('<p class="mart10"><img src="' + o['imgSrc'] + '"></p>\n');
						});
					}
					$('#contentMain').show();
					bindEvent();
				}
			}
		}
	};
	plusReady = function() {
		$common.switchOS(function() {
			$('body').addClass('Ios_scroll');
		}, function() {

		});
		loadData();

	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});