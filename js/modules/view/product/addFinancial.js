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
		var financialCount = $('.productDataUL').size();
		if (financialCount <= 0) {
			$nativeUIManager.alert('提示', '没有理财产品无法保存', 'OK', function() {});
			return false;
		}
		$common.refreshToken(function(tokenId) {
			$('#org\\.guiceside\\.web\\.jsp\\.taglib\\.Token').val(tokenId);
			$('#numSeq').val(numSeq);
			$('#financialCount').val(financialCount);
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
	selectItem = function(controlId, uid, text) {
		var li = $('#' + controlId).closest('li');
		if (li) {
			$('.placeTxt', li).text(text);
			$('#' + controlId).val(uid);
			$validator.check(controlId);
		}
	};
	loadOrg = function(orgCompany, index) {
		$nativeUIManager.watting('请稍等...');
		var controlValue = $('#productOrgId_' + index).val();
		$windowManager.create('selectOrg', 'selectOrg.html?title=' + orgCompany + '&controlId=productOrgId_' + index + '&controlValue=' + controlValue + '&win=product_add', false, true, function(show) {
			show();
			$nativeUIManager.wattingClose();
		});
	};
	loadPayoffType = function(index) {
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
							var controlValue = $('#payOffType_' + index).val();
							$windowManager.create('select', 'select.html?title=收益类型&controlId=payOffType_' + index + '&controlValue=' + controlValue + '&win=product_add', false, true, function(show) {
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

	dynamicEvent = function(productIndex) {
		$common.touchSE($('#selectProductOrg_' + productIndex), function(event, startTouch, o) {}, function(event, o) {
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
												loadOrg(orgCompany, productIndex);
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

		$common.touchSE($('#selectPayOffType_' + productIndex), function(event, startTouch, o) {}, function(event, o) {
			loadPayoffType(productIndex);
		});
		$common.touchSE($('#selectDate_' + productIndex), function(event, startTouch, o) {}, function(event, o) {
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
								$('#startDate_' + productIndex).val('');
								$('#endDate_' + productIndex).val('');
								return false;
							}
							$('#startDate_' + productIndex).val(startDateStr);
							$('#endDate_' + productIndex).val(endDateStr);
							$('.placeTxt', '#selectDate_' + productIndex).text(startDateStr + ' 至 ' + endDateStr);
							$validator.check('startDate_' + productIndex);
							$validator.check('endDate_' + productIndex);
						}, function() {});
					}, 1000);
				}, function() {});
			}, 1000);
		});

		$common.touchSE($('#selectExpireDate_' + productIndex), function(event, startTouch, o) {}, function(event, o) {
			$nativeUIManager.pickDate(function(date) {
				var dateStr = date.Format('yyyy-MM-dd');
				$('#expireDate_' + productIndex).val(dateStr);
				$('.placeTxt', '#selectExpireDate_' + productIndex).text(dateStr);
				$validator.check('expireDate_' + productIndex);
			}, function() {});
		});
	};
	bindEvent = function() {
		$common.touchSE($('#addBtn'), function(event, startTouch, o) {}, function(event, o) {
			var size = $('.productDataUL').size();
			if (size) {
				var index = (size + 1);
				var ul = $('.productDataUL').eq(0).clone(false);
				if (ul) {
					$('li', ul).removeClass('has-error');
					$(ul).attr('index', index);
					var codeObj = $('input[name="code_1"]', ul);
					if (codeObj) {
						$(codeObj).attr('name', 'code_' + index).attr('id', 'code_' + index);
					}
					var nameObj = $('input[name="name_1"]', ul);
					if (nameObj) {
						$(nameObj).attr('name', 'name_' + index).attr('id', 'name_' + index);
					}
					var selectProductOrgObj = $('li[name="selectProductOrg_1"]', ul);
					if (selectProductOrgObj) {
						$(selectProductOrgObj).attr('name', 'selectProductOrg_' + index).attr('id', 'selectProductOrg_' + index);
					}
					var productOrgIdObj = $('input[name="productOrgId_1"]', ul);
					if (productOrgIdObj) {
						$(productOrgIdObj).attr('name', 'productOrgId_' + index).attr('id', 'productOrgId_' + index);
					}
					var selectPayOffTypeObj = $('li[name="selectPayOffType_1"]', ul);
					if (selectPayOffTypeObj) {
						$(selectPayOffTypeObj).attr('name', 'selectPayOffType_' + index).attr('id', 'selectPayOffType_' + index);
					}
					var payOffTypeObj = $('input[name="payOffType_1"]', ul);
					if (payOffTypeObj) {
						$(payOffTypeObj).attr('name', 'payOffType_' + index).attr('id', 'payOffType_' + index);
					}
					var purchaseAmountObj = $('input[name="purchaseAmount_1"]', ul);
					if (purchaseAmountObj) {
						$(purchaseAmountObj).attr('name', 'purchaseAmount_' + index).attr('id', 'purchaseAmount_' + index);
					}
					var selectDateObj = $('li[name="selectDate_1"]', ul);
					if (selectDateObj) {
						$(selectDateObj).attr('name', 'selectDate_' + index).attr('id', 'selectDate_' + index);
					}
					var startDateObj = $('input[name="startDate_1"]', ul);
					if (startDateObj) {
						$(startDateObj).attr('name', 'startDate_' + index).attr('id', 'startDate_' + index);
					}
					var endDateObj = $('input[name="endDate_1"]', ul);
					if (endDateObj) {
						$(endDateObj).attr('name', 'endDate_' + index).attr('id', 'endDate_' + index);
					}
					var accrualDayObj = $('input[name="accrualDay_1"]', ul);
					if (accrualDayObj) {
						$(accrualDayObj).attr('name', 'accrualDayObj_' + index).attr('id', 'accrualDayObj_' + index);
					}
					var selectExpireDateObj = $('li[name="selectExpireDate_1"]', ul);
					if (selectExpireDateObj) {
						$(selectExpireDateObj).attr('name', 'selectExpireDate_' + index).attr('id', 'selectExpireDate_' + index);
					}
					var expireDateObj = $('input[name="expireDate_1"]', ul);
					if (expireDateObj) {
						$(expireDateObj).attr('name', 'expireDate_' + index).attr('id', 'expireDate_' + index);
					}
					var yieldObj = $('input[name="yield_1"]', ul);
					if (yieldObj) {
						$(yieldObj).attr('name', 'yield_' + index).attr('id', 'yield_' + index);
					}
				}
				$('#descUL').before('<p class="title font14 clearfix alignright" style="position:relative;bottom:-5px;"><span class="floatleft marl10">第' + index + '个理财产品</span><span class="marr10">删 除</span></p>');
				$('#descUL').before(ul);
				addValidate(index);
				$nativeUIManager.watting('请填写第' + index + '个理财产品', 1500);
			}
		});
		$common.touchSE($('span', '#imgUL'), function(event, startTouch, o) {}, function(event, o) {
			var uid = $(o).attr('uid');
			var type = $(o).attr('type');
			if (uid && type) {
				$nativeUIManager.confirm('提示', '你确定删除此图片?删除将无法恢复!', ['确定', '取消'], function() {
					deleteAtt(uid, type);
				}, function() {

				});
			}
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
		dynamicEvent(1);
	};
	addValidate = function(index) {
		$validator.addMode({
			id: 'code_' + index,
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请填写代码'
			}]
		}, true);
		$validator.addMode({
			id: 'name_' + index,
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请填写名词'
			}]
		}, true);
		$validator.addMode({
			id: 'productOrgId_' + index,
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请选择发行机构'
			}]
		}, true);
		$validator.addMode({
			id: 'payOffType_' + index,
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请选择收益类型'
			}]
		}, true);
		$validator.addMode({
			id: 'purchaseAmount_' + index,
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
		}, true);
		$validator.addMode({
			id: 'startDate_' + index,
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请选择募集开始日期'
			}]
		}, true);
		$validator.addMode({
			id: 'endDate_' + index,
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请选择募集结束日期'
			}]
		}, true);
		$validator.addMode({
			id: 'accrualDay_' + index,
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
		}, true);
		$validator.addMode({
			id: 'expireDate_' + index,
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请选择到期日'
			}]
		}, true);
		$validator.addMode({
			id: 'yield_' + index,
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
		}, true);
		dynamicEvent(index);
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
			id: 'remarks',
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请输入产品描述'
			}]
		}]);
		$validator.setUp();
		window.setTimeout(function() {
			addValidate(1);
		}, 500);
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
		autosize(document.querySelectorAll('.textBox'));
		bindValidate();
		bindEvent();
		loadData();
		$common.touchSE($('#backBtn'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.close();
		});
		var obj = $windowManager.current();
		if (obj) {
			obj.setStyle({
				'softinputMode': 'adjustResize'
			});
		}
		var height = document.body.clientHeight;
		var minHeight = (height / 2) + (height / 2 / 2);
		window.addEventListener('resize', function() {
			document.getElementById("footerTools").style.display = document.body.clientHeight <= minHeight ? 'none' : 'block';
		}, false);
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});