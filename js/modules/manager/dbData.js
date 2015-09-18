define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $webSQLManager = require('manager/webSQL');
	var $nativeUIManager = require('manager/nativeUI');
	loadContacts = function(callback, i, c) {
		if (i == c) {
			$webSQLManager.query('SELECT  ID, NAME,PHOTO,MOBILE_PHONE,QP,JP  FROM  PHONE_CONTACTS ORDER BY NAME', [], function(dbResult) {
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
	exports.searchContactsByKeyword = function(searchKey, callback) {
		$webSQLManager.connect();
		if ($webSQLManager.isSupport()) {
			$webSQLManager.query("SELECT  ID, NAME,PHOTO,MOBILE_PHONE,QP,JP  FROM  PHONE_CONTACTS WHERE NAME LIKE ? OR MOBILE_PHONE LIKE ?  ORDER BY  NAME", ['%' + searchKey + '%'], function(dbResult) {
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
					addressbook.find(["id", "displayName", "phoneNumbers", "photos"], function(contacts) {
						var sb = new StringBuilder();
						if (contacts && $(contacts).size() > 0) {
							var contactsSize = $(contacts).size();
							var _index = 0;
							$(contacts).each(function(i, c) {
								var name = c.displayName;
								var photo = '../../img/photodf.png';
								var id = c.id;
								var mobilePhone = false;
								if (c.photos) {
									photo = c.photos[0].value;
									photo = plus.io.convertLocalFileSystemURL(photo);
								}
								if (c.phoneNumbers) {
									$(c.phoneNumbers).each(function(pi, phone) {
										if (phone['type'] == 'mobile') {
											mobilePhone = phone['value'];
										}
									});
								}
								if (name && mobilePhone && id) {
									$webSQLManager.insert('insert  into  PHONE_CONTACTS (ID, NAME,PHOTO,MOBILE_PHONE,QP,JP ) values(?,?,?,?,?,?)', [
										id, name, photo, mobilePhone, '', ''
									], function() {
										_index += 1;
										//console.info('insert into ='+id+'=='+name+'=='+mobilePhone);
										loadContacts(callback, _index, contactsSize);
									}, function(msg) {
										alert(msg)
									});
								}else{
									contactsSize-=1;
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
	exports.getContactsList = function(callback, errorback) {
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
							loadContacts(callback, 1, 1);
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