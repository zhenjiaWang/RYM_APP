define(function(require, exports, module) {
	getBeginIndex = function(everyPage, currentPage) {
		return (currentPage - 1) * everyPage;
	};
	getTotalPage = function(everyPage, totalRecords) {
		var totalPage = 0;
		if (totalRecords % everyPage == 0) {
			totalPage = totalRecords / everyPage;
		} else {
			totalPage = totalRecords / everyPage + 1;
		}
		return totalPage;
	};
	hasPrePage = function(currentPage) {
		return currentPage == 1 ? false : true;
	};
	hasNextPage = function(currentPage, totalPage) {
		return currentPage == totalPage || totalPage == 0 ? false : true;
	};
	getPageBeginIndex = function(currentPage, everyPage) {
		if (currentPage / everyPage == 0 && currentPage % everyPage < everyPage) {
			return 0;
		} else if (currentPage / everyPage > 0 & currentPage % everyPage == 0) {
			return currentPage / everyPage - 1;
		} else if (currentPage / everyPage > 0 && currentPage % everyPage < 10) {
			return currentPage / everyPage;
		}
		return 0;
	};
	exports.createPage = function(everyPage, currentPage, totalRecord) {
		return {
			everyPage: everyPage,
			currentPage: currentPage == 0 ? 1 : currentPage,
			beginIndex: getBeginIndex(everyPage, currentPage),
			totalPage: getTotalPage(everyPage, totalRecord),
			hasNextPage: hasNextPage(currentPage, totalPage),
			hasPrePage: hasPrePage(currentPage),
			pageBeginIndex: getPageBeginIndex(currentPage, everyPage)
		};
	};
});