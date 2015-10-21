define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var $validator = require('core/validator');
	var queryMap = parseURL();
	var typeId = queryMap.get('typeId');
	var typeName = queryMap.get('typeName');
	var server = "/common/common/uploadData";
	var files = [];
	saveData = function() {
		$nativeUIManager.watting('正在保存产品...');
		$common.refreshToken(function(tokenId) {
			$('#org\\.guiceside\\.web\\.jsp\\.taglib\\.Token').val(tokenId);
			$.ajax({
				type: 'POST',
				url: $common.getRestApiURL() + '/product/info/edit',
				dataType: 'json',
				data: $('#editForm').serialize().replace(/\+/g, " "),
				success: function(jsonData) {
					if (jsonData) {
						if (jsonData['result'] == '0') {
							$nativeUIManager.wattingTitle('保存成功 重新加载产品');
							var productViewHeader = $windowManager.getById('product_view_header');
							if (productViewHeader) {
								productViewHeader.evalJS('loadViewData()');
								window.setTimeout(function() {
									$windowManager.reloadOtherWindow('product_view', true);
									window.setTimeout(function() {
										$nativeUIManager.wattingClose();
										$windowManager.close();
									}, 300);
								}, 1000);
							}
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
						var src = resText['message'] + '!productEdit';
						$.ajax({
							type: 'POST',
							url: $common.getRestApiURL() + '/common/common/uploadCallbackMobile',
							dataType: 'json',
							data: {
								fileKey: resText['message'],
								attToken: $('#attToken').val()
							},
							success: function(jsonData) {
								if (jsonData) {
									if (jsonData['result'] == '0') {
										$nativeUIManager.wattingClose();
										if (!$('#imgUL').is(':visible')) {
											$('#imgUL').show();
										}
										$('div', '#imgUL').append('<span type="' + jsonData['type'] + '" uid="' + jsonData['id'] + '"><img src="' + src + '"><em>删 除</em></span>\n');
										bindEvent();
									} else {
										$nativeUIManager.wattingClose();
										$nativeUIManager.alert('提示', '图片保存失败', 'OK', function() {});
									}
								}
							},
							error: function(XMLHttpRequest, textStatus, errorThrown) {
								$nativeUIManager.wattingClose();
								$nativeUIManager.alert('提示', '图片保存失败', 'OK', function() {});
							}
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
	deleteAtt = function(attId, type) {
		$nativeUIManager.watting('请稍等...');
		$common.refreshToken(function(tokenId) {
			$.ajax({
				type: 'POST',
				url: $common.getRestApiURL() + '/product/info/deleteAtt',
				dataType: 'json',
				data: {
					id: attId,
					type: type,
					attIgnore: 'Y',
					'org.guiceside.web.jsp.taglib.Token': tokenId
				},
				success: function(jsonData) {
					if (jsonData) {
						if (jsonData['result'] == '0') {
							$nativeUIManager.wattingTitle('删除成功!');
							$('span[uid="' + attId + '"]', '#imgUL').remove();
							$nativeUIManager.wattingClose();
						} else {
							$nativeUIManager.wattingClose();
							$nativeUIManager.alert('提示', '删除失败', 'OK', function() {});
						}
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					$nativeUIManager.wattingClose();
					$nativeUIManager.alert('提示', '删除失败', 'OK', function() {});
				}
			});
		});
	};
	bindEvent = function() {
		$common.touchSE($('span', '#imgUL'), function(event, startTouch, o) {}, function(event, o) {
			var uid = $(o).attr('uid');
			var type = $(o).attr('type');
			if (uid && type) {
				$nativeUIManager.confirm('提示', '你确定删除此图片?删除将无法恢复!', ['确定', '取消'], function() {
					deleteAtt(uid, type);
				}, function() {});
			}
		});

		$common.touchSE($('#saveBtn'), function(event, startTouch, o) {}, function(event, o) {
			$validator.checkAll();
			window.setTimeout(function() {
				var passed = $validator.isPassed();
				if (passed) {
					saveData();
				} else {
					$nativeUIManager.alert('提示', '请检查信息是否填写完毕', 'OK', function() {});
				}
			}, 500);
		});


		$common.touchSE($('#uploadBtn'), function(event, startTouch, o) {}, function(event, o) {
			var imgCount = $('div', '#imgUL').find('img').size();
			if (imgCount < 6) {
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
														quality: 40
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
													quality: 40
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
			} else {
				$nativeUIManager.alert('提示', '最多只能上传6张图片', 'OK', function() {});
			}
		});
	};
	bindValidate = function() {
		$validator.init([{
			id: 'remarks',
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请输入产品描述'
			}]
		}]);
		$validator.setUp();
	};
	loadData = function() {
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/common/common/getAttToken',
			dataType: 'json',
			data: {},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						$('#attToken').val(jsonData['attToken']);
						var editJsonStr = $userInfo.get('editJson');
						if (editJsonStr) {
							var editJson = JSON.parse(editJsonStr);
							if (editJson) {
								var productInfo = editJson['productInfo'];
								var fund = editJson['fund'];
								if (productInfo && fund) {
									$('#id').val(editJson['id']);
									$('#productName').val(productInfo['name']);
									$('#productOrgId').val(productInfo['productOrgId']);
									$('#orgName').val(productInfo['orgName']);
									$('#remarks').val(productInfo['remarks']);
									$('#fundType').val(fund['fundType']);

									var attArray = editJson['attArray'];
									if (attArray && $(attArray).size() > 0) {
										if (!$('#imgUL').is(':visible')) {
											$('#imgUL').show();
										}
										$(attArray).each(function(i, o) {
											var src = o['imgSrc'] + '!productEdit';
											$('div', '#imgUL').append('<span type="' + o['type'] + '" uid="' + o['id'] + '"><img src="' + src + '"><em>删 除</em></span>\n');
										});
									}
									bindEvent();
								}
							}
						}
						$('#footerTools').show();
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {}
		});
	};
	plusReady = function() {
		$common.switchOS(function() {
			$('body').addClass('Ios_scroll');
		}, function() {

		});

		bindValidate();
		loadData();
		autosize(document.querySelectorAll('.textBox'));
		$common.touchSE($('#backBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.close();
		});
		var obj = $windowManager.current();
		if (obj) {
			obj.setStyle({
				'softinputMode': 'adjustResize'
			});
		}
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});