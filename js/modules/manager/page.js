define(function(require, exports, module) {
	var totalPage = 0;
	var everyPage = 0;
	var currentPage = 0;
	var preIndex = 0;
	var nextIndex = 0;
	var beginIndex = 0;
	var totalRecord = 0;
	var pageBeginIndex = 0;
	getBeginIndex = function() {
		return (currentPage - 1) * everyPage;
	};
	getTotalPage = function() {
		totalPage = 0;
		if (totalRecord % everyPage == 0) {
			totalPage = totalRecord / everyPage;
		} else {
			totalPage = totalRecord / everyPage + 1;
		}
		totalPage=parseInt(totalPage);
		return totalPage;
	};
	hasPrePage = function() {
		return currentPage == 1 ? false : true;
	};
	hasNextPage = function() {
		return currentPage == totalPage || totalPage == 0 ? false : true;
	};
	getPageBeginIndex = function() {
		if (currentPage / everyPage == 0 && currentPage % everyPage < everyPage) {
			return 0;
		} else if (currentPage / everyPage > 0 & currentPage % everyPage == 0) {
			return currentPage / everyPage - 1;
		} else if (currentPage / everyPage > 0 && currentPage % everyPage < 10) {
			return currentPage / everyPage;
		}
		return 0;
	};
	getPreIndex = function() {
		return beginIndex <= 0 ? 0 : beginIndex - everyPage;
	};
	getNextIndex = function() {
		return beginIndex + everyPage;
	};
	exports.getCurrentPage = function(everyP, start) {
		if(start==0){
			return 1;
		}else{
			return parseInt((start/everyP))+1;
		}
	};
	exports.createPage = function(everyP, currentP, totalR) {
		everyPage = everyP;
		currentPage = currentP == 0 ? 1 : currentP;
		totalRecord = totalR;
		beginIndex = getBeginIndex();
		totalPage = getTotalPage();
		pageBeginIndex = getPageBeginIndex();
		return {
			everyPage: everyPage,
			currentPage: currentPage,
			beginIndex: beginIndex,
			totalPage: totalPage,
			hasNextPage: hasNextPage(),
			hasPrePage: hasPrePage(),
			pageBeginIndex: pageBeginIndex,
			preIndex: getPreIndex(),
			nextIndex: getNextIndex()
		};
	};
});