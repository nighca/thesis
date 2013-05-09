var hasElement = function(arr, e){for(var i in arr){if(arr[i]==e) return true;}return false;};

var isArray = function(obj){
	if(typeof obj !== "object") return false;
	if(obj.constructor == Array) return true;
	return false;
};

var log = function(){
	console.log.apply(console, arguments);
};

var postData = function (data, url, success, fail) {
	$.ajax(url, {
        data: data,
        type: "post", 
        dataType: "json",
        success: success,
        error: fail
    });
};

var getData = function (url, success, fail, data) {
	$.ajax(url, {
        data: data,
        type: "get", 
        dataType: "json",
        success: success,
        error: fail
    });
};

var format = function (num, hex, units, dec) {
	num = num || 0;
	dec = dec || 0;
	var level = 0;
	while(num >= hex){
		num /= hex;
		level++;
	}

	if(level==0) dec = 0;

	return {
		"base" : num.toFixed(dec),
		"unit" : units[level],
		"format" : function(sep){
			sep = sep || "";
			return this.base + sep + this.unit;
		}
	};
};

var distFormat = function(dist, dec){
	var num = dist;
	var hex = 1000;
	var units = ["米", "公里", "千公里"];
	return format(num, hex, units, dec);
};

var dateFormat = function(t, sep){
	var ds = [];
	var y = t.getFullYear();
	ds.push(y);
	var m = t.getMonth() + 1;
	ds.push(m<10 ? "0"+m : "" + m);
	var d = t.getDate();
	ds.push(d<10 ? "0"+d : "" + d);
	sep = sep || "";
	return ds.join(sep);
};

var timeFormat = function(t){
	var d = new Date(t);
	return dateFormat(d, "-");
};

var saveToLocal = function (key, value, nameSpace) {
	if(typeof key !== "string") return false;
	if(nameSpace) key = nameSpace + "$" + key;

	try{
		value = JSON.stringify(value);
		window.localStorage[key] = value;
	}catch(err){
		return false;
	}
	
	return true;
};

var listFromLocal = function(nameSpace) {
	if(typeof nameSpace !== "undefined" && typeof nameSpace !== "string") return null;

	var res = [];
	for(var key in localStorage){
		if(!nameSpace){
			res.push(key)
		}else if(key.indexOf(nameSpace+"$")===0){
			res.push(key.slice(nameSpace.length+1));
		}
	}

	return res;
};

var loadFromLocal = function (key, nameSpace) {
	if(typeof key !== "string") return null;
	if(nameSpace) key = nameSpace + "$" + key;
	var value;
	
	try{
		value = $.parseJSON(window.localStorage[key]);
	}catch(err){
		return null;
	}
	return value;	
};

var removeFromLocal = function (key, nameSpace) {
	if(typeof key !== "string") return false;
	if(nameSpace) key = nameSpace + "$" + key;
	
	return localStorage.removeItem(key);
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
			return list.append(obj);
		};

		list.clear = function(){
			list[0].innerHTML = "";
		};

		list.delegate(checkHandler, "click", function(){
	        var obj = $(this).parent();
	        list.set(obj);
	        afterCheck && afterCheck(obj);
	    });

	    return list;
	}
});