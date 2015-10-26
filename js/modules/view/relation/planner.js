define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $templete = require('core/templete');
	var nextIndex = 0;
	var currentWindow;
	onRefresh = function() {
		nextIndex = 0;
		$('#plannerUL').attr('nextIndex', 0);
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
	loadData = function(callback, append) {
		if (!callback) {
			$nativeUIManager.watting('正在加载...');
		}
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/social/friendPlanner',
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
						var friendPlannerArray = jsonData['friendPlannerArray'];
						var sb = new StringBuilder();
						if (friendPlannerArray && $(friendPlannerArray).size() > 0) {
							$('.checkWord').show();
							$(friendPlannerArray).each(function(i, o) {
								var productInfo = o['productInfo'];
								var textClass = '';
								if (o['state'] == '1') {
									textClass = 'icon-8';
								} else if (o['state'] == '2') {
									textClass = 'icon-7';
								}
								sb.append(String.formatmodel($templete.relationPlannerItem(), {
									userId: o['userId'],
									userName: o['userName'],
									headImgUrl: o['headImgUrl'],
									saleCount: o['saleCount'],
									orgName: o['orgName'],
									financialContent: productInfo['financialContent'],
									trustContent: productInfo['trustContent'],
									fundContent: productInfo['fundContent']
								}));
							});
						} else {
							$('#blank').show();
						}
						if (append) {
							$('#plannerUL').append(sb.toString());
						} else {
							$('#plannerUL').empty().append(sb.toString());
						}
						nextIndex = 0;
						$('#plannerUL').attr('nextIndex', 0);
						var page = jsonData['page'];
						if (page) {
							if (page['hasNextPage'] == true) {
								$('#plannerUL').attr('nextIndex', page['nextIndex']);
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
	bindEvent = function() {
		$common.touchSE($('.UserCard', '#plannerUL'), function(event, startTouch, o) {}, function(event, o) {
			var saleCount = $(o).attr('saleCount');
			if (saleCount) {
				saleCount = parseInt(saleCount);
				if (saleCount > 0) {
					$nativeUIManager.watting('请稍等...');
					var userId = $(o).attr('userId');
					if (userId) {
						$.ajax({
							type: 'POST',
							url: $common.getRestApiURL() + '/product/info/saleListData',
							dataType: 'json',
							data: {
								userId: userId
							},
							success: function(jsonData) {
								if (jsonData) {
									if (jsonData['result'] == '0') {
										$userInfo.put('relationSale', JSON.stringify(jsonData));
										$windowManager.create('relation_sale', 'sale.html', false, true, function(show) {
											$nativeUIManager.wattingClose();
											show();
										});
									} else {
										$nativeUIManager.wattingClose();
										$nativeUIManager.alert('提示', '获取信息失败', 'OK', function() {});
									}
								}
							},
							error: function(XMLHttpRequest, textStatus, errorThrown) {
								$nativeUIManager.wattingClose();
								$nativeUIManager.alert('提示', '获取信息失败', 'OK', function() {});
							}
						});
					}
				} else {
					$nativeUIManager.alert('提示', '该理财师并没上架任何产品', 'OK', function() {});
				}
			}

		});

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

		$('#keyword').off('valuechange').on('valuechange', function(e, previous) {
			var value = $(this).val();
			if (value && value != '') {
				loadData();
			}
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
			var next = $('#plannerUL').attr('nextIndex');
			if (next) {
				if (next > 0) {
					nextIndex = next;
					$nativeUIManager.watting('正在加载更多...');
					$('#plannerUL').attr('nextIndex', 0);
					window.setTimeout(function() {
						loadData(function() {
							$nativeUIManager.wattingClose();
						}, true);
					}, 500);
				}
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