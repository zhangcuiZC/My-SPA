require("../css/spa.css");
var spa_shell=require("./spa.shell.js");

module.exports = (function(){
	var initModule = function($container){
		spa_shell.initModule($container);
	};

	return {
		initModule: initModule
	};
}());