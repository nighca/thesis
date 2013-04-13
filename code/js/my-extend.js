Array.prototype.has = function(e){for(var i in this){if(this[i]==e) return true;}return false;};

var isArray = function(obj){
	if(typeof obj !== "object") return false;
	if(obj.constructor == Array) return true;
	return false;
};

var log = function(){
	console.log.apply(console, arguments);
};

template.helper('$stringify', function (content) {
	return JSON.stringify(content);
});

jQuery.fn.extend({
	setable: function (val) {
		val = val ? true : false;
		var withDisableAttrEles = ["SELECT","INPUT"]; 
		$(this).each(function(){
			if(withDisableAttrEles.has(this.tagName)){
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
	checkList: function(checkHandler, checkHandlee, className) {
		className = className || "active";
		var list = this;

		list.set = function(obj){
			if(obj.hasClass(className)){
	            obj.removeClass(className).find(checkHandlee).slideUp();
	        }else{
	            list.children("."+className).removeClass(className).find(checkHandlee).slideUp();
	            obj.addClass(className).find(checkHandlee).slideDown();
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
	    });

	    return this;
	}
});