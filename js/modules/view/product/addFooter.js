define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $templete = require('core/templete');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var $productCommon = require('view/product/productCommon');
	var $scrollEvent = require('manager/scrollEvent');
	var queryMap = parseURL();
	var typeId = queryMap.get('typeId');
	var typeName = queryMap.get('typeName');
	var server = "/common/common/uploadData";
	var files = [];
	var uploadAttToken;
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
								attToken: uploadAttToken
							},
							success: function(jsonData) {
								if (jsonData) {
									if (jsonData['result'] == '0') {
										$nativeUIManager.wattingClose();
										$userInfo.put('uploadFiles', JSON.stringify(jsonData));
										var productAddWin = $windowManager.getById('product_add_product');
										if (productAddWin) {
											productAddWin.evalJS('addFileSuccess("' + src + '")');
										}
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
	bindEvent = function() {
		$common.touchSE($('#addBtn'), function(event, startTouch, o) {}, function(event, o) {
			var productAddWin = $windowManager.getById('product_add_product');
			if (productAddWin) {
				productAddWin.evalJS('addProduct()');
			}
			$nativeUIManager.watting('请填写新增理财产品', 1500);
		});
		$common.touchSE($('#uploadBtn'), function(event, startTouch, o) {}, function(event, o) {
			var imgCount = $userInfo.get('attCount');
			imgCount = parseInt(imgCount);
			if (imgCount < 20) {
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
											plus.zip.compressImage({
													src: entry.toLocalURL(),
													dst: '_documents/wzj.jpg',
													quality: 20,
													overwrite: true
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
												},
												function(error) {
													$nativeUIManager.wattingTitle('图片压缩失败...code:'+error.code+',message:'+error.message);
													window.setTimeout(function() {
														$nativeUIManager.wattingClose();
													}, 1000);
												});
										});
									});
								} else if (index == 2) {
									plus.camera.getCamera().captureImage(function(p) {
										plus.io.resolveLocalFileSystemURL(p, function(entry) {
											$nativeUIManager.watting('正在压缩图片...');
											plus.zip.compressImage({
													src: entry.toLocalURL(),
													dst: '_documents/wzj.jpg',
													quality: 20,
													overwrite: true
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
												},
												function(error) {
													$nativeUIManager.wattingTitle('图片压缩失败...code:'+error.code+',message:'+error.message);
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
				$nativeUIManager.alert('提示', '最多只能上传20张图片', 'OK', function() {});
			}
		});
	};
	loadWebview = function() {
		var viewUrl = '';
		if (typeId) {
			if (typeId == '1') {
				viewUrl = 'addFinancial.html';
			} else if (typeId == '2') {
				viewUrl = 'addFund.html';
			} else if (typeId == '3') {
				viewUrl = 'addTrust.html';
			}

			$.ajax({
				type: 'POST',
				url: $common.getRestApiURL() + '/common/common/getAttToken',
				dataType: 'json',
				data: {},
				success: function(jsonData) {
					if (jsonData) {
						if (jsonData['result'] == '0') {
							if (typeId == '1') {
								$('body').append($templete.addFooterImgProductItem());
							} else {
								$('body').append($templete.addFooterImgItem());
							}
							uploadAttToken = jsonData['attToken'];
							var windowURL = encodeURI(viewUrl + '?typeName=' + typeName + '&attToken=' + jsonData['attToken'] + '&typeId=' + typeId);
							var productAddWin = plus.webview.create(windowURL, "product_add_product", {
								top: "0px",
								bottom: "50px",
								scrollIndicator: 'vertical'
							});
							if (productAddWin) {
								productAddWin.addEventListener("loaded", function() {
									$windowManager.current().append(productAddWin);
								}, false);
							}
							$('#footerTools').show();
							bindEvent();
						}
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {}
			});
		}
	}
	plusReady = function() {
		loadWebview();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});