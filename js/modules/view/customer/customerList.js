define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var $keyManager = require('manager/key');
	var $templete = require('core/templete');
	var $scrollEvent = require('manager/scrollEvent');
	var nextIndex = 0;
	var currentWindow;
	onRefresh = function() {
		nextIndex = 0;
		$('#friendUL').attr('nextIndex', 0);
		window.setTimeout(function() {
			loadData(function() {
				currentWindow.endPullToRefresh();
			});
		}, 500);
	};
	pullToRefreshEvent = function() {
		currentWindow = $windowManager.current();
		currentWindow.setPullToRefresh({
			support: true,
			height: "50px",
			range: "200px",
			contentdown: {
				caption: "下拉可以刷新"
			},
			contentover: {
				caption: "释放立即刷新"
			},
			contentrefresh: {
				caption: "正在刷新..."
			}
		}, onRefresh);
	};
	showAddTools = function() {
		$('#bottomPop').addClass('current');
	};
	hideAddTools = function() {
		$('#bottomPop').removeClass('current');
	};
	bindEvent = function() {
		$('#keyword').off('keydown').on('keydown', function(e) {
			e = (e) ? e : ((window.event) ? window.event : "")
			var keyCode = e.keyCode ? e.keyCode : (e.which ? e.which : e.charCode);
			if (keyCode == 13) {
				var value = $(this).val();
				if (value == '') {
					loadData();
				}
				$('#keyword').trigger('blur');
			}
		});
		$('#keyword').off('blur').on('blur', function(e) {
			var value = $(this).val();
			if (value == '') {
				loadData();
			}
		});
		$('#keyword').off('valuechange').on('valuechange', function(e) {
			var value = $(this).val();
			if (value && value != '') {
				loadData();
			}
		});
		
		$scrollEvent.bindEvent(function() {
			$('#addProductBtn').off('touchstart').off('touchstart');
			$('#relationProductBtn').off('touchstart').off('touchstart');
		}, function() {
			$common.touchSE($('#addProductBtn'), function(event, startTouch, o) {}, function(event, o) {
				$windowManager.create('product_add', '../product/add.html', false, true, function(show) {
					show();
					var lunchWindow = $windowManager.getLaunchWindow();
					if (lunchWindow) {
						lunchWindow.evalJS('plusRest()');
					}
				});
			});
			$common.touchSE($('#relationProductBtn'), function(event, startTouch, o) {}, function(event, o) {
				$windowManager.create('relation_header', '../relation/header.html', false, true, function(show) {
					show();
					var lunchWindow = $windowManager.getLaunchWindow();
					if (lunchWindow) {
						lunchWindow.evalJS('plusRest()');
					}
				});
			});
		});
		
		$common.touchSE($('.checkWord'), function(event, startTouch, o) {}, function(event, o) {
			if (!$('.wordList').hasClass('current')) {
				$('.wordList').addClass('current');
			} else {
				$('.wordList').removeClass('current');
			}
		});
		$common.touchSE($('td', '.wordList'), function(event, startTouch, o) {}, function(event, o) {
			if (!$('span', o).hasClass('current')) {
				$('td', '.wordList').find('span').removeClass('current');
				$('span', o).addClass('current');
				var dir = $(o).attr('dir');
				if (dir) {
					loadData();
					$('.wordList').removeClass('current');
					$('.checkWord').text('dir');
				}
			} else {
				$('span', o).removeClass('current');
				$('.wordList').removeClass('current');
				$('.checkWord').text('筛选');
				loadData();
			}
		});
		document.addEventListener("plusscrollbottom", function() {
			var next = $('#friendUL').attr('nextIndex');
			if (next) {
				if (next > 0) {
					nextIndex = next;
					$nativeUIManager.watting('正在加载更多...');
					$('#friendUL').attr('nextIndex', 0);
					window.setTimeout(function() {
						loadData(function() {
							$nativeUIManager.wattingClose();
						}, true);
					}, 500);
				}
			}
		});
	};
	loadData = function(callback, append) {
		$('.checkWord').hide();
		if (!callback) {
			$nativeUIManager.watting('正在加载...');
		}
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/social/friendInvestor',
			dataType: 'json',
			data: {
				start: nextIndex > 0 ? nextIndex : '',
				keyword: $('#keyword').val(),
				userFirst: $('span.current', '.wordList').closest('td').attr('dir')
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						$('td', '.wordList').addClass('noData');
						$('td', '.wordList').each(function() {
							$(this).attr('dir', $('span', this).text());
						});
						var firstArray = jsonData['firstArray'];
						if (firstArray && $(firstArray).size() > 0) {
							$(firstArray).each(function(i, jp) {
								$('td[dir="' + jp + '"]', '.wordList').removeClass('noData');
							});
						}
						var friendInvestorArray = jsonData['friendInvestorArray'];
						var sb = new StringBuilder();
						if (friendInvestorArray && $(friendInvestorArray).size() > 0) {
							$('#blank').hide();
							$('.checkWord').show();
							$('#friendUL').show();
							$(friendInvestorArray).each(function(i, o) {
								sb.append(String.formatmodel($templete.friendInvestorItem(o['status']), {
									userId: o['userId'],
									userName: o['userName'],
									headImgUrl: o['headImgUrl']
								}));
							});
						} else {
							$('#blank').show();
							$('#friendUL').hide();
						}
						if (append) {
							$('#friendUL').append(sb.toString());
						} else {
							$('#friendUL').empty().append(sb.toString());
						}
						nextIndex = 0;
						$('#friendUL').attr('nextIndex', 0);
						var page = jsonData['page'];
						if (page) {
							if (page['hasNextPage'] == true) {
								$('#friendUL').attr('nextIndex', page['nextIndex']);
							}
						}
						pullToRefreshEvent();
						bindEvent();
						if (!callback) {
							$nativeUIManager.wattingClose();
						}
						if (typeof callback == 'function') {
							callback();
						}
					} else {
						if (!callback) {
							$nativeUIManager.wattingClose();
						}
						if (typeof callback == 'function') {
							callback();
						}
						$nativeUIManager.alert('提示', '获取信息失败', 'OK', function() {});
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				if (!callback) {
					$nativeUIManager.wattingClose();
				}
				if (typeof callback == 'function') {
					callback();
				}
				$nativeUIManager.alert('提示', '获取信息失败', 'OK', function() {});
			}
		});
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