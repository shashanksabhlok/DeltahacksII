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

	function getNewPicture(){
		var flickrUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=9b18b1255294c4fcd50c0d852e57e66d&tags=sexy%2Chot&sort=relevance&safe_search=3&content_type=1&per_page=500&format=json&nojsoncallback=1&auth_token=72157663647929405-c20ae865be786cbb&api_sig=3e2e1d230ff446a338fe2d54d052daeb"
		$.ajax({ 
		    type: "GET",
		    dataType: "json",
		    url: flickrUrl,
		    success: function(data){
		      var index = Math.floor(Math.random()*500);
		      var photo = data.photos.photo[index];
		      pullNewPicture(photo);
		    },
		    error: function(data){
		      console.log(data);
		    }
		});
	}

	function pullNewPicture(photo){
		var picUrl = "https://farm"+photo.farm+".staticflickr.com/"+ photo.server+"/"+photo.id+"_"+photo.secret+".jpg";
		panes.eq(current_pane).find("img")[0].src = picUrl;
		console.log(picUrl);
		
	}

	function getTags(img,token,status){
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
	        var tags = data.results[0].result.tag.classes[0];
	        sendTags(tags,status);
	        console.log(data);
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

	function sendTags(tags,status){
		 var url = "http://172.17.73.212:8080/" + status;
		 console.log(url);
		$.ajax({ 
		    type: "POST",
		    dataType: "json",
		    contentType:"json",
		    url: url,
		    data: {
		    	"tags":tags
		    },
		    success: function(data){
		      console.log(data);
		    },
		    error: function(data){
		      console.log(data);
		    }
		});
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
			getTags(panes.eq(current_pane).find("img")[0],token,"rejectedtags");
			getNewPicture();
		},

		like: function() {

			getTags(panes.eq(current_pane).find("img")[0],token,"acceptedtags");
			getNewPicture();
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
