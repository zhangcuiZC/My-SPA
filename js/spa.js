require("../css/spa.css");
var spa_shell=require("./spa.shell.js");
var spa_model=require("./spa.model.js");

module.exports = (function(){
	'use strict';
	var initModule = function($container){
		spa_model.initModule();
		spa_shell.initModule($container);
	};

	return {
		initModule: initModule
	};
}());