var hasElement = function(arr, e){for(var i in arr){if(arr[i]==e) return true;}return false;};

var isArray = function(obj){
	if(typeof obj !== "object") return false;
	if(obj.constructor == Array) return true;
	return false;
};

var log = function(){
	console.log.apply(console, arguments);
};

template.helper('stringify', function (content) {
	return JSON.stringify(content);
});

template.helper('getSpaceType', function(type){
	return spaceZoneTypes[type] || "*****";
});

template.helper('isArray', isArray);

jQuery.fn.extend({
	setable: function (val) {
		val = val ? true : false;
		var withDisableAttrEles = ["SELECT","INPUT"]; 
		$(this).each(function(){
			if(hasElement(withDisableAttrEles, this.tagName)){
				this.disabled = !val;
			}else{
				if(val) $(this).removeClass("disabled");
				else $(this).addClass("disabled");
			}
		});
		return $(this);
	},
	disable: function () {
		return $(this).setable(false);
	},
	enable: function () {
		return $(this).setable(true);
	},
	checkList: function(checkHandler, checkHandlee, className, afterCheck) {
		className = className || "active";
		var list = this;
		var speed = 200;

		list.set = function(obj){
			if(obj.hasClass(className)){
	            obj.removeClass(className).find(checkHandlee).slideUp(speed);
	        }else{
	            list.children("."+className).removeClass(className).find(checkHandlee).slideUp(speed);
	            obj.addClass(className).find(checkHandlee).slideDown(speed);
	        }
	        return this;
		};

		list.get = function(i){
			return list.children().eq(i);
		};

		list.getByName = function(name){
			var t = null;
			list.children().each(function(i, l){
				l = $(l);
				if(l.find("[name=name]").text() == name){
					t = l;
				}
			});
			return t;
		};

		list.addNode = function(obj){
			list.append(obj);
		};

		list.delegate(checkHandler, "click", function(){
	        var obj = $(this).parent();
	        list.set(obj);
	        afterCheck && afterCheck(obj);
	    });

	    return this;
	}
});