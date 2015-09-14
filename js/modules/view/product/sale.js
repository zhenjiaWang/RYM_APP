define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var $templete = require('core/templete');
	var server = "/common/common/uploadData";
	var files = [];
	onRefresh = function() {
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
	upload = function() {
		if (files.length <= 0) {
			plus.nativeUI.alert("没有添加上传文件！");
			return;
		}
		var task = plus.uploader.createUpload($common.getRestApiURL() + server, {
				method: "POST"
			},
			function(t, status) { //上传完成
				if (status == 200) {
					var resText = JSON.parse(t.responseText);
					if (resText) {
						var src = resText['message'] + '!plannerBgImg';
						$common.refreshToken(function(tokenId) {
							$.ajax({
								type: 'POST',
								url: $common.getRestApiURL() + '/sys/planner/edit',
								dataType: 'json',
								data: {
									'org.guiceside.web.jsp.taglib.Token': tokenId,
									code: 'bgImgUrl',
									codeValue: src
								},
								success: function(jsonData) {
									if (jsonData) {
										if (jsonData['result'] == '0') {
											$('img', '#uploadBgImgBtn').attr('src', src);
											$nativeUIManager.wattingClose();
										} else {
											$nativeUIManager.wattingClose();
											$nativeUIManager.alert('提示', '保存失败', 'OK', function() {});
										}
									}
								},
								error: function(XMLHttpRequest, textStatus, errorThrown) {
									$nativeUIManager.wattingClose();
									$nativeUIManager.alert('提示', '保存失败', 'OK', function() {});
								}
							});
						});
					}
				} else {
					$nativeUIManager.wattingClose();
				}
			}
		);
		for (var i = 0; i < files.length; i++) {
			var f = files[i];
			task.addFile(f.path, {
				key: f.name
			});
		}
		task.start();
	};
	showAddTools = function() {
		$('.footerMask').css('bottom', '0px');
		$('#bottomPop').addClass('current');
	};
	hideAddTools = function() {
		$('.footerMask').css('bottom', '-99px');
		$('#bottomPop').removeClass('current');
	};
	bindEvent = function() {
		$common.touchSE($('#addProductBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.create('product_add', 'add.html', false, true, function(show) {
				show();
				var lunchWindow = $windowManager.getLaunchWindow();
				if (lunchWindow) {
					lunchWindow.evalJS('plusRest()');
				}
			});
		});
		$common.touchSE($('#relationProductBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.create('product_relation', 'send.html', false, true, function(show) {
				show();
				var lunchWindow = $windowManager.getLaunchWindow();
				if (lunchWindow) {
					lunchWindow.evalJS('plusRest()');
				}
			});
		});
		$common.touchSE($('#uploadBgImgBtn'), function(event, startTouch, o) {}, function(event, o) {
			window.setTimeout(function() {
				files = [];
				$nativeUIManager.confactionSheetirm('请选择上传方式操作', '取消', [{
						title: '从照片选取'
					}, {
						title: '拍摄'
					}],
					function(index) {
						if (index > 0) {
							if (index == 1) {
								plus.gallery.pick(function(p) {
									plus.io.resolveLocalFileSystemURL(p, function(entry) {
										$nativeUIManager.watting('正在压缩图片...');
										window.setTimeout(function() {
											plus.zip.compressImage({
													src: entry.toLocalURL(),
													dst: '_www/wzj.jpg',
													quality: 80
												},
												function(event) {
													files.push({
														name: "uploadkey" + index,
														path: event.target
													});
													index++;
													$nativeUIManager.wattingTitle('正在上传...');
													window.setTimeout(function() {
														upload();
													}, 500);
												}, function(error) {});
										}, 500);
									});
								});
							} else if (index == 2) {
								plus.camera.getCamera().captureImage(function(p) {
									plus.io.resolveLocalFileSystemURL(p, function(entry) {
										$nativeUIManager.watting('正在压缩图片...');
										plus.zip.compressImage({
												src: entry.toLocalURL(),
												dst: '_www/wzj.jpg',
												quality: 80
											},
											function(event) {
												files.push({
													name: "uploadkey" + index,
													path: event.target
												});
												index++;
												$nativeUIManager.wattingTitle('正在上传...');
												upload();
											}, function(error) {
												$nativeUIManager.wattingTitle('图片压缩失败...');
												window.setTimeout(function() {
													$nativeUIManager.wattingClose();
												}, 1000);
											});
									});
								});
							}
						}
					});
			}, 100);
		});
	};
	loadData = function(callback) {
		if (!callback) {
			$nativeUIManager.watting('正在加载...');
		}
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/product/info',
			dataType: 'json',
			data: {
				userId: $userInfo.get('userId')
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
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
							var productArray = jsonData['productArray'];
							if (productArray && $(productArray).size() > 0) {
								$('#blank').hide();
								var sb = new StringBuilder();
								$(productArray).each(function(i, o) {
									var typeId = o['typeId'];
									var relationYn = o['relationYn'];
									if (typeId && relationYn) {
										if (typeId == 1) {

										} else if (typeId == 2) {
											var fundObj = o['fund'];
											if (fundObj) {
												sb.append(String.formatmodel($templete.fundItem(relationYn), {
													typeName: o['typeName'],
													name: o['name'],
													updateTime: o['updateTime'],
													fundType: fundObj['fundType']
												}));
											}
										} else if (typeId == 3) {
											var trustObj = o['trust'];
											if (trustObj) {
												sb.append(String.formatmodel($templete.trustItem(relationYn), {
													typeName: o['typeName'],
													name: o['name'],
													updateTime: o['updateTime'],
													yield: trustObj['yield'],
													dayLimit:trustObj['dayLimit']
												}));
											}
										}
									}

								});
								$('.cardBox').empty().append(sb.toString());
							} else {
								$('#blank').show();
							}
						}
						pullToRefreshEvent();
						bindEvent();
						window, setTimeout(function() {
							$('.main').show();
							if (!callback) {
								$nativeUIManager.wattingClose();
							} else {
								if (typeof callback == 'function') {
									callback();
								}
							}
						}, 500);

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