define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $webSQLManager = require('manager/webSQL');
	var $nativeUIManager = require('manager/nativeUI');
	loadContacts = function(callback, i, c,totalCount,start) {
		if (i == c) {
			if(!start){
				start=0;
			}
			$webSQLManager.query('SELECT  DISTINCT(JP)  FROM  PHONE_CONTACTS', [], function(keyWordResult) {
				if (keyWordResult) {
					$webSQLManager.query('SELECT  ID, NAME,PHOTO,MOBILE_PHONE,QP,JP  FROM  PHONE_CONTACTS ORDER BY QP limit ?,20', [start], function(dbResult) {
						if (dbResult) {
							if (typeof callback == 'function') {
								callback(dbResult, keyWordResult,totalCount);
							}
						}
					}, function(msg) {
						$nativeUIManager.alert('提示', msg, 'OK', function() {});
					});
				}
			}, function(msg) {
				$nativeUIManager.alert('提示', msg, 'OK', function() {});
			});
		}
	};
	exports.searchContactsByKeyword = function(searchKey, callback) {
		$webSQLManager.connect();
		if ($webSQLManager.isSupport()) {
			$webSQLManager.query("SELECT  ID, NAME,PHOTO,MOBILE_PHONE,QP,JP  FROM  PHONE_CONTACTS WHERE NAME LIKE ?   ORDER BY  NAME", ['%' + searchKey + '%'], function(dbResult) {
				if (dbResult) {
					if (typeof callback == 'function') {
						callback(dbResult);
					}
				}
			}, function(msg) {
				$nativeUIManager.alert('提示', msg, 'OK', function() {});
			});
		}
	};
	exports.searchContactsByJP = function(searchKey, callback) {
		$webSQLManager.connect();
		if ($webSQLManager.isSupport()) {
			$webSQLManager.query("SELECT  ID, NAME,PHOTO,MOBILE_PHONE,QP,JP  FROM  PHONE_CONTACTS WHERE JP = ?  ORDER BY  NAME", [searchKey], function(dbResult) {
				if (dbResult) {
					if (typeof callback == 'function') {
						callback(dbResult);
					}
				}
			}, function(msg) {
				$nativeUIManager.alert('提示', msg, 'OK', function() {});
			});
		}
	};
	exports.refreshContacts = function(callback, errorback) {
		$webSQLManager.connect();
		if ($webSQLManager.isSupport()) {
			$webSQLManager.del('delete from PHONE_CONTACTS', [], function() {
				plus.contacts.getAddressBook(plus.contacts.ADDRESSBOOK_PHONE, function(addressbook) {
					addressbook.find(["id", "displayName", "phoneNumbers"], function(contacts) {
						var sb = new StringBuilder();
						if (contacts && $(contacts).size() > 0) {
							var contactsSize = $(contacts).size();
							var _index = 0;
							var _unkownIndex=1;
							$(contacts).each(function(i, c) {
								var name = c.displayName;

								var photo = '../../img/photodf.png';
								var id = c.id;
								var mobilePhone = false;
								var QP = '';
								var JP = '';
								if (c.phoneNumbers) {
									$(c.phoneNumbers).each(function(pi, phone) {
										if (phone['type'] == 'mobile') {
											mobilePhone = phone['value'];
											if (mobilePhone) {
												mobilePhone = mobilePhone.replaceAll('\\+86', '');
												mobilePhone = mobilePhone.replaceAll('-', '');
												mobilePhone = mobilePhone.replaceAll(' ', '');
												return false;
											}
										} else if (phone['type'] == 'other') {
											mobilePhone = phone['value'];
											if (mobilePhone) {
												mobilePhone = mobilePhone.replaceAll('\\+86', '');
												mobilePhone = mobilePhone.replaceAll('-', '');
												mobilePhone = mobilePhone.replaceAll(' ', '');
												return false;
											}
										}
									});
								}
								if (name) {
									var QPS = makePy(name);
									if (QPS && QPS.length > 0) {
										QP = QPS[0];
										if (QP && QP.length > 0) {
											JP = QP.substring(0, 1);
											JP = JP.toUpperCase();
											var jpAscii = JP.charCodeAt();
											if (jpAscii >= 48 && jpAscii <= 57) {
												JP = '0~9';
											}
										}
									}
								}
								if(!name){
									name='未知联系人'+_unkownIndex;
									_unkownIndex+=1;
									var QPS = makePy(name);
									if (QPS && QPS.length > 0) {
										QP = QPS[0];
										if (QP && QP.length > 0) {
											JP = QP.substring(0, 1);
											JP = JP.toUpperCase();
											var jpAscii = JP.charCodeAt();
											if (jpAscii >= 48 && jpAscii <= 57) {
												JP = '0~9';
											}
										}
									}
								}
								if(!mobilePhone){
									mobilePhone='13800138000';
								}
								if (name && mobilePhone && id) {
									$webSQLManager.insert('insert  into  PHONE_CONTACTS (ID, NAME,PHOTO,MOBILE_PHONE,QP,JP ) values(?,?,?,?,?,?)', [
										id, name, photo, mobilePhone, QP, JP
									], function() {
										_index += 1;
										loadContacts(callback, _index, contactsSize,contactsSize);
									}, function(msg) {
										alert(msg)
									});
								} else {
									contactsSize -= 1;
								}
							});
						} else {
							if (typeof errorback == 'function') {
								errorback();
							}
							$nativeUIManager.alert('提示', '手机通讯录暂无数据', 'OK', function() {});
						}
					}, function() {
						if (typeof errorback == 'function') {
							errorback();
						}
						$nativeUIManager.alert('提示', '获取手机通讯录失败', 'OK', function() {});
					}, {
						multiple: true
					});
				}, function(e) {
					if (typeof errorback == 'function') {
						errorback();
					}
					$nativeUIManager.alert('提示', '获取手机通讯录失败', 'OK', function() {});
				});
			}, function(msg) {
				if (typeof errorback == 'function') {
					errorback();
				}
				$nativeUIManager.alert('提示', msg, 'OK', function() {});
			});
		}
	};
	exports.getContactsList = function(callback, errorback,start) {
		$webSQLManager.connect();
		if ($webSQLManager.isSupport()) {
			$webSQLManager.createTable('create table if not exists PHONE_CONTACTS (id TEXT, NAME TEXT,PHOTO TEXT,MOBILE_PHONE TEXT, QP TEXT,JP TEXT)', function() {
				$webSQLManager.query('SELECT COUNT(*) T FROM PHONE_CONTACTS', [], function(dbResult) {
					if (dbResult) {
						var resultRows = dbResult.rows.length;
						var count = dbResult.rows.item(0)['T'];
						count = parseInt(count);
						if (count == 0) {
							exports.refreshContacts(callback, errorback);
						} else {
							plus.contacts.getAddressBook(plus.contacts.ADDRESSBOOK_PHONE, function(addressbook) {
								addressbook.find(["id", "displayName", "phoneNumbers"], function(contacts) {
									if (contacts && $(contacts).size() > 0) {
										if($(contacts).size()!=count){
											exports.refreshContacts(callback, errorback);
										}else{
											loadContacts(callback, 1, 1,count,start);
										}
									}
								},function(){});
							},
							function(){
							});
						}
					}
				}, function(msg) {
					if (typeof errorback == 'function') {
						errorback();
					}
					$nativeUIManager.alert('提示', msg, 'OK', function() {});
				});
			}, function(msg) {
				if (typeof errorback == 'function') {
					errorback();
				}
				$nativeUIManager.alert('提示', msg, 'OK', function() {});
			});
		}
	};
});