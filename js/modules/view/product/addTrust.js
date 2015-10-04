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
	saveData = function(numSeq) {
		$nativeUIManager.watting('正在发布产品...');
		$common.refreshToken(function(tokenId) {
			$('#org\\.guiceside\\.web\\.jsp\\.taglib\\.Token').val(tokenId);
			$('#numSeq').val(numSeq);
			$.ajax({
				type: 'POST',
				url: $common.getRestApiURL() + '/product/info/saveMobile',
				dataType: 'json',
				data: $('#editForm').serialize().replace(/\+/g, " "),
				success: function(jsonData) {
					if (jsonData) {
						if (jsonData['result'] == '0') {
							$windowManager.reloadOtherWindow('product_user', true);
							window.setTimeout(function() {
								$nativeUIManager.wattingClose();
								$windowManager.close();
							}, 300);
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
										$('div', '#imgUL').append('<img src="' + src + '">');
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
	selectItem = function(controlId, uid, text) {
		var li = $('#' + controlId).closest('li');
		if (li) {
			$('.placeTxt', li).text(text);
			$('#' + controlId).val(uid);
			$validator.check(controlId);
		}
	};
	loadOrg = function(orgCompany) {
		$nativeUIManager.watting('请稍等...');
		var controlValue = $('#productOrgId').val();
		$windowManager.create('selectOrg', 'selectOrg.html?title=' + orgCompany + '&controlId=productOrgId&controlValue=' + controlValue, false, true, function(show) {
			show();
			$nativeUIManager.wattingClose();
		});
	};
	loadPayoffType = function() {
		$nativeUIManager.watting('请稍等...');
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/common/common/payOffTypeList',
			dataType: 'json',
			data: {
				typeId: $('#typeId').val()
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						var payOffTypeList = jsonData['payOffTypeList'];
						if (payOffTypeList && $(payOffTypeList).size() > 0) {
							$userInfo.put("selectList", JSON.stringify(payOffTypeList));
							var controlValue = $('#payOffType').val();
							$windowManager.create('select', 'select.html?title=收益类型&controlId=payOffType&controlValue=' + controlValue, false, true, function(show) {
								show();
								$nativeUIManager.wattingClose();
							});
						}
					} else {
						$nativeUIManager.wattingClose();
						$nativeUIManager.alert('提示', '获取数据失败', 'OK', function() {});
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				$nativeUIManager.wattingClose();
				$nativeUIManager.alert('提示', '获取数据失败', 'OK', function() {});
			}
		});
	};
	bindEvent = function() {
		$common.touchSE($('#backBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.close();
		});
		$common.touchSE($('#saveBtn'), function(event, startTouch, o) {}, function(event, o) {
			$validator.checkAll();
			window.setTimeout(function() {
				var passed = $validator.isPassed();
				if (passed) {
					$nativeUIManager.watting('请选择发布栏位...');
					window.setTimeout(function() {
						var productName = $('#productName').val();
						$windowManager.create('product_send', 'send.html?productName=' + productName + '&saveWinId=product_add&saveFunction=saveData', false, true, function(show) {
							show();
							$nativeUIManager.wattingClose();
						});
					}, 1500);
				} else {
					$nativeUIManager.alert('提示', '请检查信息是否填写完毕', 'OK', function() {});
				}
			}, 500);
		});
		$common.touchSE($('#selectProductType'), function(event, startTouch, o) {}, function(event, o) {
			$nativeUIManager.confactionSheetirm('请选择产品类型', '取消', [{
					title: '理财'
				}, {
					title: '基金'
				}],
				function(index) {
					if (index > 0) {
						if (index == 1) {

						} else if (index == 2) {

						} else if (index == 3) {
							//nothing
						}
					}
				});
		});
		$common.touchSE($('#selectProductOrg'), function(event, startTouch, o) {}, function(event, o) {
			$nativeUIManager.watting('请稍等...');
			$.ajax({
				type: 'POST',
				url: $common.getRestApiURL() + '/common/common/orgCompanyList',
				dataType: 'json',
				data: {},
				success: function(jsonData) {
					if (jsonData) {
						if (jsonData['result'] == '0') {
							$nativeUIManager.wattingClose();
							var orgCompanyList = jsonData['orgCompanyList'];
							if (orgCompanyList && $(orgCompanyList).size() > 0) {
								$nativeUIManager.confactionSheetirm('请选择机构公司', '取消', orgCompanyList,
									function(index) {
										if (index > 0) {
											var orgCompany = orgCompanyList[index - 1]['title'];
											if (orgCompany) {
												loadOrg(orgCompany);
											}
										}
									});
							}
						} else {
							$nativeUIManager.wattingClose();
							$nativeUIManager.alert('提示', '获取数据失败', 'OK', function() {});
						}
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					$nativeUIManager.wattingClose();
					$nativeUIManager.alert('提示', '获取数据失败', 'OK', function() {});
				}
			});
		});

		$common.touchSE($('#selectPayOffType'), function(event, startTouch, o) {}, function(event, o) {
			loadPayoffType();
		});
		$common.touchSE($('#selectDate'), function(event, startTouch, o) {}, function(event, o) {
			$nativeUIManager.watting('请先选择募集开始日期');
			window.setTimeout(function() {
				$nativeUIManager.wattingClose();
				$nativeUIManager.pickDate(function(date1) {
					var startDateStr = date1.Format('yyyy-MM-dd');
					var endDateStr = null;
					$nativeUIManager.watting('募集开始日期是:' + startDateStr + ',选择募集结束时间');
					window.setTimeout(function() {
						$nativeUIManager.wattingClose();
						$nativeUIManager.pickDate(function(date2) {
							endDateStr = date2.Format('yyyy-MM-dd');
							var ckFlag = checkDate(startDateStr, endDateStr);
							if (!ckFlag) {
								$nativeUIManager.alert('错误提示', '结束日期不能小于开始日期', 'OK', function() {});
								$('#startDate').val('');
								$('#endDate').val('');
								return false;
							}
							$('#startDate').val(startDateStr);
							$('#endDate').val(endDateStr);
							$('.placeTxt', '#selectDate').text(startDateStr + ' 至 ' + endDateStr);
							$validator.check('startDate');
							$validator.check('endDate');
						}, function() {});
					}, 1000);
				}, function() {});
			}, 1000);
		});

		$common.touchSE($('#selectExpireDate'), function(event, startTouch, o) {}, function(event, o) {
			$nativeUIManager.pickDate(function(date) {
				var dateStr = date.Format('yyyy-MM-dd');
				$('#expireDate').val(dateStr);
				$('.placeTxt', '#selectExpireDate').text(dateStr);
				$validator.check('expireDate');
			}, function() {});
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
			id: 'productName',
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请输入名称'
			}, {
				type: 'length',
				exp: '<=40',
				msg: '名称不能大于40字'
			}]
		}, {
			id: 'productOrgId',
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请选择发行机构'
			}]
		}, {
			id: 'payOffType',
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请选择收益类型'
			}]
		}, {
			id: 'purchaseAmount',
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请输入起购金额'
			}, {
				type: 'number',
				exp: '==',
				msg: '起购金额格式不正确'
			}, {
				type: 'reg',
				exp: '_number1',
				msg: '正整数或者保留一位小数'
			}]
		}, {
			id: 'startDate',
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请选择募集开始日期'
			}]
		}, {
			id: 'endDate',
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请选择募集结束日期'
			}]
		}, {
			id: 'accrualDay',
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请输入计息天数'
			}, {
				type: 'int',
				exp: '==',
				msg: '计息天数格式不正确'
			}]
		}, {
			id: 'expireDate',
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请选择到期日'
			}]
		}, {
			id: 'yield',
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请输入预期收益率'
			}, {
				type: 'number',
				exp: '==',
				msg: '预期收益率格式不正确'
			}]
		}, {
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
		$('#typeId').val(typeId);
		$('.placeTxt', '#selectProductType').text(typeName);
		bindValidate();
		bindEvent();
		loadData();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});