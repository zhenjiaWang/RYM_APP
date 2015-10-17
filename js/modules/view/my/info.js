define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var server = "/common/common/uploadData";
	var files = [];
	var auths = null;
	logout = function() {
		$authorize.logout();
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
						var src = resText['message'] + '!userHeadImg';
						$common.refreshToken(function(tokenId) {
							$.ajax({
								type: 'POST',
								url: $common.getRestApiURL() + '/sys/planner/edit',
								dataType: 'json',
								data: {
									'org.guiceside.web.jsp.taglib.Token': tokenId,
									code: 'headImgUrl',
									codeValue: src
								},
								success: function(jsonData) {
									if (jsonData) {
										if (jsonData['result'] == '0') {
											$('img', '.userPhoto').attr('src', src);
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
	bindEvent = function() {
		$common.touchSE($('#settingBtn'), function(event, startTouch, o) {
			$windowManager.create('my_setting', 'setting.html', false, true, function(show) {
				show();
			});
		}, function(event, o) {});
		$common.touchSE($('#logoutBtn'), function(event, startTouch, o) {
			$nativeUIManager.confirm('提示', '你确定要退出登录吗?', ['确定', '取消'], function() {
				$authorize.logout();
			}, function() {});
		}, function(event, o) {});
		$common.touchSE($('li', '#editUL'), function(event, startTouch, o) {}, function(event, o) {
			var dir = $(o).attr('dir');
			if (dir) {
				var value = '';
				if (dir == 'userName') {
					value = $(o).find('span').last().text();
					$windowManager.create('my_edit', 'edit.html?code=' + dir + '&value=' + value, false, true, function(show) {
						show();
					});
				} else if (dir == 'password') {
					$windowManager.create('my_password', 'password.html', false, true, function(show) {
						show();
					});
				} else if (dir == 'plannerNo') {
					value = $(o).find('span').last().text();
					$windowManager.create('my_edit', 'edit.html?code=' + dir + '&value=' + value, false, true, function(show) {
						show();
					});
				} else if (dir == 'signature') {
					value = $(o).find('span').last().text();
					$windowManager.create('my_edit', 'edit.html?code=' + dir + '&value=' + value, false, true, function(show) {
						show();
					});
				} else if (dir == 'orgName') {
					value = $(o).find('span').last().text();
					$windowManager.create('my_edit', 'edit.html?code=' + dir + '&value=' + value, false, true, function(show) {
						show();
					});
				} else if (dir == 'wechat') {
					var lang = $(o).find('span').first().attr('lang');
					if (lang) {
						if (lang == 'bind') {
							$nativeUIManager.confirm('提示', '你确定要绑定微信帐号?', ['确定', '取消'], function() {
								document.addEventListener("pause", function() {
									setTimeout(function() {
										$nativeUIManager.wattingClose();
									}, 2000);
								}, false);
								$nativeUIManager.watting('请稍等...');
								var s = auths[0];
								s.login(function(e) {
									if (s.authResult) {
										s.getUserInfo(function(e) {
											value = s.userInfo['unionid'];
											if (value) {
												$common.refreshToken(function(tokenId) {
													$.ajax({
														type: 'POST',
														url: $common.getRestApiURL() + '/sys/planner/bindWeChat',
														dataType: 'json',
														data: {
															'org.guiceside.web.jsp.taglib.Token': tokenId,
															codeValue: value
														},
														success: function(jsonData) {
															if (jsonData) {
																if (jsonData['result'] == '0') {
																	$nativeUIManager.wattingTitle('绑定成功!');
																	$(o).find('span').first().text('解绑微信号');
																	window.setTimeout(function() {
																		$nativeUIManager.wattingClose();
																	}, 1000);
																} else {
																	$nativeUIManager.wattingClose();
																	$nativeUIManager.alert('提示', '绑定失败', 'OK', function() {});
																}
															}
														},
														error: function(XMLHttpRequest, textStatus, errorThrown) {
															$nativeUIManager.wattingClose();
															$nativeUIManager.alert('提示', '绑定失败', 'OK', function() {});
														}
													});
												});
											} else {
												$nativeUIManager.wattingClose();
											}
										}, function(e) {});
									}
								}, function(e) {
									$nativeUIManager.wattingClose();
								});
							}, function() {});
						} else if (lang == 'unbind') {
							$nativeUIManager.confirm('提示', '你确定要解绑微信帐号?', ['确定', '取消'], function() {
								var s = auths[0];
								s.logout(function(e) {
									$nativeUIManager.watting('请稍等...');
									$common.refreshToken(function(tokenId) {
										$.ajax({
											type: 'POST',
											url: $common.getRestApiURL() + '/sys/planner/unbindWeChat',
											dataType: 'json',
											data: {
												'org.guiceside.web.jsp.taglib.Token': tokenId
											},
											success: function(jsonData) {
												if (jsonData) {
													if (jsonData['result'] == '0') {
														$nativeUIManager.wattingTitle('解绑成功!');
														$(o).find('span').first().text('绑定微信号');
														window.setTimeout(function() {
															$nativeUIManager.wattingClose();
														}, 1000);
													} else {
														$nativeUIManager.wattingClose();
														$nativeUIManager.alert('提示', '解绑失败', 'OK', function() {});
													}
												}
											},
											error: function(XMLHttpRequest, textStatus, errorThrown) {
												$nativeUIManager.wattingClose();
												$nativeUIManager.alert('提示', '解绑失败', 'OK', function() {});
											}
										});
									});
								}, function(e) {
									$nativeUIManager.alert('提示', '解绑失败', 'OK', function() {});
								});
							}, function() {

							});
						}
					}
				} else if (dir == 'headImgUrl') {
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
				}
			}
		});
	};
	loadData = function() {
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/sys/planner',
			dataType: 'json',
			data: {
				userId: $userInfo.get('userId')
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						$('li[dir="mobilePhone"]', '#editUL').find('span').last().text(jsonData['mobilePhone']);
						$('li[dir="userName"]', '#editUL').find('span').last().text(jsonData['userName']);
						$('li[dir="plannerNo"]', '#editUL').find('span').last().text(jsonData['plannerNo']);
						$('li[dir="signature"]', '#editUL').find('span').last().text(jsonData['signature']);
						$('li[dir="orgName"]', '#editUL').find('span').last().text(jsonData['orgName']);
						var unionId = jsonData['unionId'];
						if (unionId) {
							if (unionId == '-1') {
								$('li[dir="wechat"]', '#editUL').find('span').first().text('绑定微信号').attr('lang', 'bind');
							} else {
								$('li[dir="wechat"]', '#editUL').find('span').first().text('解绑微信号').attr('lang', 'unbind');
							}
						}
						var headImgUrl = jsonData['headImgUrl'];
						if (headImgUrl) {
							$('img', '.userPhoto').attr('src', headImgUrl);
						}
						bindEvent();
					} else {
						$nativeUIManager.alert('提示', '获取信息失败', 'OK', function() {});
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
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
		$common.touchSE($('#backBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.close();
			var productUserWin = $windowManager.getById('product_user');
			if (productUserWin) {
				productUserWin.evalJS('reloadMyInfo()');
			}
		});
		plus.oauth.getServices(function(services) {
			auths = services;
		}, function(e) {
			$('li[dir="wechat"]', '#editUL').remove();
		});
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});