define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $templete = require('core/templete');
	var queryMap = parseURL();
	var controlId = queryMap.get('controlId');
	var controlValue = queryMap.get('controlValue');
	var title = queryMap.get('title');
	var win = queryMap.get('win');
	bindEvent = function() {
		$common.touchSE($('#backBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.close();
		});
		$common.touchSE($('li','#selectItemUL'), function(event, startTouch, o) {}, function(event, o) {
			if(!$(o).hasClass('choosed')){
				$('li','#selectItemUL').removeClass('choosed');
				$(o).addClass('choosed');
				var productAddWindow=$windowManager.getById(win);
				if(productAddWindow){
					var uid=$(o).attr('uid');
					var text=$('span',o).text();
					productAddWindow.evalJS('selectItem("'+controlId+'","'+uid+'","'+text+'")');
					$nativeUIManager.watting('已选择:'+text);
					window.setTimeout(function(){
						$windowManager.close();
						$nativeUIManager.wattingClose();
					},1000);
				}
			}else{
				$(o).removeClass('choosed');
			}
		});
	};
	loadData = function() {
		var selectList=$userInfo.get('selectList');
		var selectArray=JSON.parse(selectList);
		if(selectArray){
			var sb=new StringBuilder();
			$(selectArray).each(function(i,o){
				sb.append(String.formatmodel($templete.selectItem(),{
					uid:o['uid'],
					text:o['text']
				}));
			});
			$('#selectItemUL').append(sb.toString());
			if(controlValue){
				$('li[uid="'+controlValue+'"]','#selectItemUL').addClass('choosed');
			}
		}
		bindEvent();
	};
	plusReady = function() {
		$common.switchOS(function() {
			$('body').addClass('Ios_scroll');
		}, function() {

		});
		$('h1').text(title);
		loadData();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});