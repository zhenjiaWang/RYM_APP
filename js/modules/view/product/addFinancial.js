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
		}
	};
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
								var footerWin = $windowManager.getById('product_add_footer');
								if (footerWin) {
									footerWin.close();
								}
								var addWin = $windowManager.getById('product_add');
								if (addWin) {
									addWin.close();
								}
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
		$windowManager.create('selectOrg', 'selectOrg.html?title=' + orgCompany + '&controlId=productOrgId_' + index + '&controlValue=' + controlValue + '&win=product_add_product', false, true, function(show) {
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
							$windowManager.create('select', 'select.html?title=收益类型&controlId=payOffType_' + index + '&controlValue=' + controlValue + '&win=product_add_product', false, true, function(show) {
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
	getProductSize=function(){
		return $('.productDataUL').size();
	};
	addProduct = function() {
		var size = $('.productDataUL').size();
		if (size) {
			var index = (size + 1);
			var ul = $('.productDataUL').eq(0).clone(false);
			if (ul) {
				$('.delProduct').hide();
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
			$('#descUL').before('<p class="productTitle title font14 clearfix alignright" style="position:relative;bottom:-5px;"><span class="floatleft marl10">第' + index + '个理财产品</span><span class="marr10 delProduct" style="color:red;display:none;">删 除</span></p>');
			$('#descUL').before(ul);
			addValidate(index);
			$('.delProduct').last().show();
			$common.touchSE($('.delProduct'), function(event, startTouch, o) {}, function(event, o) {
				$nativeUIManager.confirm('提示', '你确定删除当前产品吗!', ['确定', '取消'], function() {
					removeValidate($('.productDataUL').size());
					$('.productDataUL').last().remove();
					$('.productTitle').last().remove();
					$('.delProduct').last().show();
				}, function() {

				});
			});
		}
	};
	bindEvent = function() {
		

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
						$windowManager.create('product_send', 'send.html?productName=' + productName + '&saveWinId=product_add_product&saveFunction=saveData', false, true, function(show) {
							show();
							$nativeUIManager.wattingClose();
						});
					}, 1500);
				} else {
					$nativeUIManager.alert('提示', '请检查信息是否填写完毕', 'OK', function() {});
				}
			}, 500);
		});

		dynamicEvent(1);
	};
	removeValidate=function(index){
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
			}]
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
		$('#attToken').val(attToken);
		autosize(document.querySelectorAll('.textBox'));
		bindValidate();
		bindEvent();
		loadData();
		$common.touchSE($('#backBtn'), function(event, startTouch, o) {}, function(event, o) {
			var footerWin = $windowManager.getById('product_add_footer');
			if (footerWin) {
				footerWin.close();
			}
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