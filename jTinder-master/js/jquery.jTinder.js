/*
 * jTinder v.1.0.0
 * https://github.com/do-web/jTinder
 * Requires jQuery 1.7+, jQuery transform2d
 *
 * Copyright (c) 2014, Dominik Weber
 * Licensed under GPL Version 2.
 * https://github.com/do-web/jTinder/blob/master/LICENSE
 */

;(function ($, window, document, undefined) {
	var pluginName = "jTinder",
		defaults = {
			onDislike: null,
			onLike: null,
			animationRevertSpeed: 200,
			animationSpeed: 400,
			threshold: 1,
			likeSelector: '.like',
			dislikeSelector: '.dislike'
		};
	var token;

	var container = null;
	var panes = null;
	var $that = null;
	var xStart = 0;
	var yStart = 0;
	var touchStart = false;
	var posX = 0, posY = 0, lastPosX = 0, lastPosY = 0, pane_width = 0, pane_count = 0, current_pane = 0;

	function Plugin(element, options) {
		this.element = element;
		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init(element);
	}

	function getTags(img,token){
		var authbearer = "Bearer " + token;
		console.log(token);
		$.ajax({ 
	      headers : {
	        "Authorization": authbearer
	      },
	      type: "POST",
	      url: "https://api.clarifai.com/v1/tag/",
	      data: {
	        "url": img.src
	      },
	      success: function(data){
	      	console.log(data);       
	        var tags = data.results[0].result.tag.classes;

	        var url = "http://172.17.73.212:3000/" + status;
			$.ajax({ 
			    type: "POST",
			    dataType: "json",
			    contentType: "json",
			    url: url,
			    data: {
			      "tags": tags
			    },
			    async: false,
			    success: function(data){
			      console.log(data);
			    },
			    error: function(data){
			      console.log(data);
			    }
			});
		      },
		      error: function(data){
		        console.log(data);
		      }

		});
	}

	function getToken(){
		$.ajax({ 
		    type: "POST",
		    dataType: "json",
		    url: "https://api.clarifai.com/v1/token/",
		    data: {
		      "client_id" : "iU0QiGaGM3DuvQElMngNPKC9aDeVWwyylKBMk-ry",
			  "client_secret"  :"1juECkTEg3X994JJw-63bXX2D2MXcH51hErCj1zq",
		      "grant_type" : "client_credentials"
		    },
		    async: false,
		    success: function(data){
		      console.log(data);
		      token = data.access_token;
		    },
		    error: function(data){
		      console.log(data);
		    }
		});
	}

	function sendTags(status){
		var tags = getTags(panes.eq(current_pane).find("img")[0],token);

	}

	Plugin.prototype = {


		init: function (element) {

			container = $(">ul", element);
			panes = $(">ul>li", element);
			pane_width = container.width();
			pane_count = panes.length;
			current_pane = panes.length - 1;
			$that = this;
			getToken();



			$(element).bind('touchstart mousedown', this.handler);
			$(element).bind('touchmove mousemove', this.handler);
			$(element).bind('touchend mouseup', this.handler);
		},

		showPane: function (index) {
			// panes.eq(current_pane).hide();
			current_pane = index;
			// panes.eq(current_pane).html("<img  style='position:absolute' src='http://www.elle.co.za/wp-content/uploads/2013/10/miranda-kerrr-co-uk-na-victorias-secret-fashion-show-victoria-secret-1791601470.gif'>")
		},

		next: function () {
			return this.showPane(current_pane);
		},

		dislike: function() {
			sendTags("rejectedtags");
		},

		like: function() {

			sendTags("acceptedtags");
		}

	};

	$.fn[ pluginName ] = function (options) {
		this.each(function () {
			if (!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName, new Plugin(this, options));
			}
			else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, 'plugin_' + pluginName)[options]();
		    }
		});

		return this;
	};

})(jQuery, window, document);
