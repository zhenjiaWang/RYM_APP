define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var $validator = require('core/validator');
	var queryMap = parseURL();
	var attToken = queryMap.get('attToken');
	addFileSuccess = function(src) {
		var jsonDataStr = $userInfo.get('uploadFiles');
		if (jsonDataStr) {
			var jsonData = JSON.parse(jsonDataStr);
			if (!$('#imgUL').is(':visible')) {
				$('#imgUL').show();
			}
			$('div', '#imgUL').append('<span type="' + jsonData['type'] + '" uid="' + jsonData['id'] + '"><img src="' + src + '"><em>删 除</em></span>\n');
			bindEvent();
			$userInfo.removeItem('uploadFiles');
			$userInfo.put('attCount', $('div', '#imgUL').find('img').size() + '');
		}
	};
	saveData = function(numSeq) {
		$nativeUIManager.watting('正在保存产品...');
		var financialCount = $('.productDataUL').size();
		if (financialCount <= 0) {
			$nativeUIManager.alert('提示', '没有理财产品无法保存', 'OK', function() {});
			return false;
		}
		var productIndex='';
		$('.productDataUL').each(function(i,o){
			var index=$(o).attr('index');
			if(index){
				productIndex+=index+',';
			}
		});
		$('#productIndex').val(productIndex);
		$common.refreshToken(function(tokenId) {
			$('#org\\.guiceside\\.web\\.jsp\\.taglib\\.Token').val(tokenId);
			$('#numSeq').val(numSeq);
			$('#financialCount').val(financialCount);
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
									$nativeUIManager.wattingClose();
										var footerWin = $windowManager.getById('product_edit_footer');
										if (footerWin) {
											footerWin.close();
										}
								}, 1500);
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
		$windowManager.create('selectOrg', 'selectOrg.html?title=' + orgCompany + '&controlId=productOrgId_' + index + '&controlValue=' + controlValue + '&win=product_edit_product', false, true, function(show) {
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
							$windowManager.create('select', 'select.html?title=收益类型&controlId=payOffType_' + index + '&controlValue=' + controlValue + '&win=product_edit_product', false, true, function(show) {
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
	removeValidate = function(index) {
		$validator.removeMode('code_' + index);
		$validator.removeMode('name_' + index);
		$validator.removeMode('productOrgId_' + index);
		$validator.removeMode('payOffType_' + index);
		$validator.removeMode('purchaseAmount_' + index);
		$validator.removeMode('startDate_' + index);
		$validator.removeMode('endDate_' + index);
		$validator.removeMode('accrualDay_' + index);
		$validator.removeMode('expireDate_' + index);
		$validator.removeMode('yield_' + index);
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
		});
		$validator.addMode({
			id: 'name_' + index,
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请填写名词'
			}]
		});
		$validator.addMode({
			id: 'productOrgId_' + index,
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请选择发行机构'
			}]
		});
		$validator.addMode({
			id: 'payOffType_' + index,
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请选择收益类型'
			}],
			callback: function(t) {
				if (t) {
					if ($('#payOffType_' + index).val() == '保本固定收益') {
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
						});
						$validator.setUp();
					} else {
						$validator.removeMode('yield_' + index);
					}
				}
			}
		});
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
		});
		$validator.addMode({
			id: 'startDate_' + index,
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请选择募集开始日期'
			}]
		});
		$validator.addMode({
			id: 'endDate_' + index,
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请选择募集结束日期'
			}]
		});
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
		});
		$validator.addMode({
			id: 'expireDate_' + index,
			required: true,
			pattern: [{
				type: 'blank',
				exp: '!=',
				msg: '请选择到期日'
			}]
		});
		$validator.setUp();
		dynamicEvent(index);
	};
	addProduct = function() {
		var size = $('.productDataUL').size();
		if (size) {
			var index = (size + 1);
			var ul = $('.productDataUL').eq(0).clone(false);
			if (ul) {
				$('li', ul).removeClass('has-error');
				$(ul).attr('index', index);
				var codeObj = $('input[name="code_1"]', ul);
				if (codeObj) {
					$(codeObj).attr('name', 'code_' + index).attr('id', 'code_' + index).val('');
				}
				var nameObj = $('input[name="name_1"]', ul);
				if (nameObj) {
					$(nameObj).attr('name', 'name_' + index).attr('id', 'name_' + index).val('');
				}
				var selectProductOrgObj = $('li[name="selectProductOrg_1"]', ul);
				if (selectProductOrgObj) {
					$(selectProductOrgObj).attr('name', 'selectProductOrg_' + index).attr('id', 'selectProductOrg_' + index).find('.placeTxt').text('请选择');
				}
				var productOrgIdObj = $('input[name="productOrgId_1"]', ul);
				if (productOrgIdObj) {
					$(productOrgIdObj).attr('name', 'productOrgId_' + index).attr('id', 'productOrgId_' + index).val('');
				}
				var selectPayOffTypeObj = $('li[name="selectPayOffType_1"]', ul);
				if (selectPayOffTypeObj) {
					$(selectPayOffTypeObj).attr('name', 'selectPayOffType_' + index).attr('id', 'selectPayOffType_' + index).find('.placeTxt').text('请选择');
				}
				var payOffTypeObj = $('input[name="payOffType_1"]', ul);
				if (payOffTypeObj) {
					$(payOffTypeObj).attr('name', 'payOffType_' + index).attr('id', 'payOffType_' + index).val('');
				}
				var purchaseAmountObj = $('input[name="purchaseAmount_1"]', ul);
				if (purchaseAmountObj) {
					$(purchaseAmountObj).attr('name', 'purchaseAmount_' + index).attr('id', 'purchaseAmount_' + index).val('');
				}
				var selectDateObj = $('li[name="selectDate_1"]', ul);
				if (selectDateObj) {
					$(selectDateObj).attr('name', 'selectDate_' + index).attr('id', 'selectDate_' + index).find('.placeTxt').text('请选择');
				}
				var startDateObj = $('input[name="startDate_1"]', ul);
				if (startDateObj) {
					$(startDateObj).attr('name', 'startDate_' + index).attr('id', 'startDate_' + index).val('');
				}
				var endDateObj = $('input[name="endDate_1"]', ul);
				if (endDateObj) {
					$(endDateObj).attr('name', 'endDate_' + index).attr('id', 'endDate_' + index).val('');
				}
				var accrualDayObj = $('input[name="accrualDay_1"]', ul);
				if (accrualDayObj) {
					$(accrualDayObj).attr('name', 'accrualDay_' + index).attr('id', 'accrualDay_' + index).val('');
				}
				var selectExpireDateObj = $('li[name="selectExpireDate_1"]', ul);
				if (selectExpireDateObj) {
					$(selectExpireDateObj).attr('name', 'selectExpireDate_' + index).attr('id', 'selectExpireDate_' + index).find('.placeTxt').text('请选择');
				}
				var expireDateObj = $('input[name="expireDate_1"]', ul);
				if (expireDateObj) {
					$(expireDateObj).attr('name', 'expireDate_' + index).attr('id', 'expireDate_' + index).val('');
				}
				var yieldObj = $('input[name="yield_1"]', ul);
				if (yieldObj) {
					$(yieldObj).attr('name', 'yield_' + index).attr('id', 'yield_' + index).val('');
				}
			}
			$('#descUL').before('<p class="productTitle title font14 clearfix alignright" style="position:relative;bottom:-5px;"><span class="floatleft marl10">第' + index + '个理财产品</span><span index="' + index + '" class="marr10 delProduct" style="color:red;">删 除</span></p>');
			$('#descUL').before(ul);
			addValidate(index);
			$common.touchSE($('.delProduct'), function(event, startTouch, o) {}, function(event, o) {
				var currentIndex = $(o).attr('index');
				var p = $(o).closest('.productTitle');
				if (currentIndex && p) {
					currentIndex = parseInt(currentIndex);
					$nativeUIManager.confirm('提示', '你确定删除当前产品吗!', ['确定', '取消'], function() {
						removeValidate(currentIndex);
						$('.productDataUL[index="' + currentIndex + '"]').remove();
						$(p).remove();
					}, function() {

					});
				}
			});
		}
	};
	bindEvent = function() {
		$('#remarksDIV').off('valuechange').on('valuechange', function(e) {
			var value = $(this).text();
			if (value) {
				if (value != '') {
					$('#remarks').val($(this).html());
					$validator.check('remarks');
				}
			}
		});
		$common.touchSE($('#addBtn'), function(event, startTouch, o) {}, function(event, o) {
			addProduct();
			$nativeUIManager.watting('请填写第' + $('.productDataUL').size() + '个理财产品', 1500);
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
					saveData();
				} else {
					$nativeUIManager.alert('提示', '请检查信息是否填写完毕', 'OK', function() {});
				}
			}, 500);
		});


		dynamicEvent(1);
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
		var editJsonStr = $userInfo.get('editJson');
		if (editJsonStr) {
			var editJson = JSON.parse(editJsonStr);
			if (editJson) {
				var productInfo = editJson['productInfo'];
				var financial = editJson['financial'];
				if (productInfo && financial) {
					$('#id').val(editJson['id']);
					$('#typeId').val(productInfo['typeId']);
					$('#productName').val(productInfo['name']);
					var financialArray = financial['financialArray'];
					if (financialArray && $(financialArray).size() > 0) {
						var index = 1;
						$(financialArray).each(function(i, financialObj) {
							if (i > 0) {
								addProduct();
							}
						});
						window.setTimeout(function() {
							$(financialArray).each(function(i, financialObj) {
								$('#code_' + index).val(financialObj['code']);
								$('#name_' + index).val(financialObj['name']);
								$('#productOrgId_' + index).val(financialObj['orgId']);
								$('.placeTxt', '#selectProductOrg_' + index).text(financialObj['orgName']);

								$('#payOffType_' + index).val(financialObj['payOffType']);
								$('.placeTxt', '#selectPayOffType_' + index).text(financialObj['payOffType']);

								$('#yield_' + index).val(financialObj['yield']);
								$('#purchaseAmount_' + index).val(financialObj['purchaseAmount']);
								$('#startDate_' + index).val(financialObj['startDate']);
								$('#endDate_' + index).val(financialObj['endDate']);

								$('.placeTxt', '#selectDate_' + index).text(financialObj['startDate'] + ' 至 ' + financialObj['endDate']);
								$('#accrualDay_' + index).val(financialObj['accrualDay']);
								$('#expireDate_' + index).val(financialObj['expireDate']);
								$('.placeTxt', '#selectExpireDate_' + index).text(financialObj['expireDate']);
								index++;
							});
						}, 500);
					}
					$('#remarks').val(productInfo['remarks']);
					$('#remarksDIV').html(productInfo['remarks']);
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
	};
	plusReady = function() {
		$common.switchOS(function() {
			$('body').addClass('Ios_scroll');
		}, function() {

		});
		$('#attToken').val(attToken);
		bindValidate();
		loadData();
		autosize(document.querySelectorAll('.textBox'));
		$common.touchSE($('#backBtn'), function(event, startTouch, o) {}, function(event, o) {
			$nativeUIManager.confirm('提示', '是否放弃保存?', ['确定', '取消'], function() {
				var footerWin = $windowManager.getById('product_edit_footer');
				if (footerWin) {
					footerWin.close();
				}
			}, function() {

			});
		});
		$userInfo.put('attCount', $('div', '#imgUL').find('img').size() + '');
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