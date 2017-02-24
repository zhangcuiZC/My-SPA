require("../css/spa.css");
var spa_shell=require("./spa.shell.js");
var spa_model=require("./spa.model.js");

module.exports = (function(){
	'use strict';
	var initModule = function($container){
		spa_model.initModule();
		spa_shell.initModule($container);

		// var peopleDb = spa_model.people.get_db();
		// var peopleList = peopleDb().get();

		// console.log(peopleList);
		// peopleDb().each(function(person, idx) {
		// 	console.log(person.name);
		// });
	};

	return {
		initModule: initModule
	};
}());