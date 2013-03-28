Array.prototype.has = function(e){for(var i in this){if(this[i]==e) return true;}return false;};

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
	}
});