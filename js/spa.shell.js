require("../css/spa.shell.css");
var spa_chat = require("./spa.chat.js");
var spa_model = require("./spa.model.js");

module.exports = (function(){
	// --------------------------------begin module scope variables
	var configMap = {
		anchor_schema_map : {
			chat : {opened : true, closed : true}
		},
		main_html : String()
		 + '<div class="spa-shell-head">'
		  + '<div class="spa-shell-head-logo"></div>'
		  + '<div class="spa-shell-head-acct"></div>'
		  + '<div class="spa-shell-head-search"></div>'
		 + '</div>'
		 + '<div class="spa-shell-main">'
		  + '<div class="spa-shell-main-nav"></div>'
		  + '<div class="spa-shell-main-content"></div>'
		 + '</div>'
		 + '<div class="spa-shell-footer"></div>'
		 + '<div class="spa-shell-modal"></div>',
		 resize_interval : 200,
	},
	stateMap = {
		$container : undefined,
		anchor_map : {},
		resize_idto : undefined
	},
	jqueryMap = {},

	copyAnchorMap, setJqueryMap, changeAnchorPart, onHashchange, onResize, setChatAnchor, initModule;
	// --------------------------------end module scope variables

	// --------------------------------begin utility methods
	copyAnchorMap = function(){
		return $.extend(true, {}, stateMap.anchor_map);
	};
	// --------------------------------end utility methods

	// --------------------------------begin DOM methods
	setJqueryMap = function(){
		var $container = stateMap.$container;
		jqueryMap = {
			$container : $container
		};
	};

	changeAnchorPart = function(arg_map){
		var anchor_map_revise = copyAnchorMap(),
			bool_return = true,
			key_name,
			key_name_dep;

		KEYVAL:
		for(key_name in arg_map){
			if(arg_map.hasOwnProperty(key_name)){
				if(key_name.indexOf("_") === 0){continue KEYVAL;}

				anchor_map_revise[key_name] = arg_map[key_name];

				key_name_dep = "_" + key_name;
				if(arg_map[key_name_dep]){
					anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
				}else{
					delete anchor_map_revise[key_name_dep];
					delete anchor_map_revise["_s" + key_name_dep];
				}
			}
		}

		try{
			$.uriAnchor.setAnchor(anchor_map_revise);
		}catch(error){
			$.uriAnchor.setAnchor(stateMap.anchor_map, null, true);
			bool_return = false;
		}

		return bool_return;
	};
	// --------------------------------end DOM methods

	// --------------------------------begin event handlers
	onHashchange = function(event){
		var anchor_map_previous = copyAnchorMap(),
			anchor_map_proposed,
			_s_chat_previous,
			_s_chat_proposed,
			s_chat_proposed,
			is_ok = true;

		try{
			anchor_map_proposed = $.uriAnchor.makeAnchorMap();
		}catch(error){
			$.uriAnchor.setAnchor(anchor_map_previous, null, true);
			return false;
		}
		stateMap.anchor_map = anchor_map_proposed;

		_s_chat_previous = anchor_map_previous._s_chat;
		_s_chat_proposed = anchor_map_proposed._s_chat;

		if(!anchor_map_previous || _s_chat_previous !== _s_chat_proposed){
			s_chat_proposed = anchor_map_proposed.chat;
			switch(s_chat_proposed){
				case 'opened' :
					is_ok = spa_chat.setSliderPosition('opened');
					break;
				case 'closed' :
					is_ok = spa_chat.setSliderPosition('closed');
					break;
				default :
					spa_chat.setSliderPosition('closed');
					delete anchor_map_proposed.chat;
					$.uriAnchor.setAnchor(anchor_map_proposed, null, true);
			}
		}

		if (!is_ok) {
			if (anchor_map_previous) {
				$.uriAnchor.setAnchor(anchor_map_previous, null, true);
				stateMap.anchor_map = anchor_map_previous;
			}else{
				delete anchor_map_proposed.chat;
				$.uriAnchor.setAnchor(anchor_map_proposed, null, true);
			}
		}	

		return false;
	};

	onResize = function(){
		if (stateMap.resize_idto) {
			return true;
		}

		spa_chat.handleResize();
		stateMap.resize_idto = setTimeout(function(){
			stateMap.resize_idto = undefined;
		}, configMap.resize_interval);

		return true;
	};
	// --------------------------------end event handlers

	// --------------------------------begin callbacks
	setChatAnchor = function(position_type){
		return changeAnchorPart({chat : position_type});
	};
	// --------------------------------end callbacks

	// --------------------------------begin public methods
	initModule = function($container){
		$container.html(configMap.main_html);
		stateMap.$container = $container;
		setJqueryMap();

		$.uriAnchor.configModule({
			schema_map : configMap.anchor_schema_map
		});
		$(window).bind('hashchange', onHashchange).bind('resize', onResize).trigger('hashchange');

		spa_chat.configModule({
			set_chat_anchor : setChatAnchor,
			chat_model : spa_model.chat,
			people_model : spa_model.people
		});
		spa_chat.initModule(jqueryMap.$container);
	};

	return {initModule : initModule};
	// --------------------------------end public methods
}());