var tm;
var map;
var e; //select area on map
var et; //select area on timeline
var es; //select area on map while search

var rightList;

var useResult;

/**
 * main -------------------------------------------------------
 */

$(function() {
    // make a custom map style
    var simpleMapType = new google.maps.StyledMapType([{
        featureType: "road",
        elementType: "all",
        stylers: [{
        }]
    }], {
        name: "simple"
    });

    var theme = Timeline.ClassicTheme.create();
    theme.mouseWheel = 'scroll';
    var eventSource = new Timeline.DefaultEventSource();
    var bands = [
    Timeline.createBandInfo({
        //date: "Jun 28 2006 00:00:00 GMT",
        width: "70%",
        intervalUnit: Timeline.DateTime.YEAR,
        intervalPixels: 100,
        eventSource: eventSource,
        theme: theme,
        zoomIndex: 6,
        zoomSteps: new Array(
        {
            pixelsPerInterval: 200,
            unit: Timeline.DateTime.DAY
        }, {
            pixelsPerInterval: 100,
            unit: Timeline.DateTime.DAY
        }, {
            pixelsPerInterval: 500,
            unit: Timeline.DateTime.DAY
        }, {
            pixelsPerInterval: 25,
            unit: Timeline.DateTime.DAY
        }, {
            pixelsPerInterval: 200,
            unit: Timeline.DateTime.MONTH
        }, {
            pixelsPerInterval: 100,
            unit: Timeline.DateTime.MONTH
        }, {
            pixelsPerInterval: 50,
            unit: Timeline.DateTime.MONTH
        }, {
            pixelsPerInterval: 400,
            unit: Timeline.DateTime.YEAR
        }, {
            pixelsPerInterval: 200,
            unit: Timeline.DateTime.YEAR
        }, {
            pixelsPerInterval: 100,
            unit: Timeline.DateTime.YEAR
        }, {
            pixelsPerInterval: 400,
            unit: Timeline.DateTime.DECADE
        }, {
            pixelsPerInterval: 200,
            unit: Timeline.DateTime.DECADE
        }, {
            pixelsPerInterval: 100,
            unit: Timeline.DateTime.DECADE
        }, {
            pixelsPerInterval: 400,
            unit: Timeline.DateTime.CENTURY
        })
    }),
    Timeline.createBandInfo({
        //date: "Jun 28 2006 00:00:00 GMT",
        width: "30%",
        intervalUnit: Timeline.DateTime.CENTURY,
        intervalPixels: 200,
        showEventText: false,
        trackHeight: 0.5,
        trackGap: 0.2,
        theme: theme,
        eventSource: eventSource,
        overview: true
    })];

    tm = TimeMap.init({
        mapId: "map", // Id of map div element (required)
        timelineId: "timeline", // Id of timeline div element (required)
        options: {
            eventIconPath: "../images/"
        },
        datasets: [dataset],
        bandIntervals: [
        Timeline.DateTime.DECADE,
        Timeline.DateTime.CENTURY],
        bands: bands
    });

    // set the map to our custom style
    tm.map.enableScrollWheelZoom();
    map = tm.getNativeMap();
    map.mapTypes.set("simple", simpleMapType);
    map.setMapTypeId("simple");
});

/**
 * bindings -------------------------------------------------------
 */

 $(function(){
    var refreshList = function(list){
        if(list) objList = list;
        tm.showObjs(objList);
        rightList.clear();
        $.each(objList, function(i, obj){
            rightList.addNode(template.render('obj-template', obj));
        });
    };

    var refreshFromRemote = function(){
        getData("php/get.php", function(ret){
            setData(ret);
            refreshList();
        });
    };

    var maper, timeliner;
    rightList = $("#objs").checkList(".head", ".body", null, function(obj){
        obj.find(".cnt").hide(200);
        obj.find(".more-mark").show();
        obj.find(".no-more-mark").hide();

        var id = obj.find("[name=id]").text();

        var chosenObj;
        for (var i = objList.length - 1; i >= 0; i--) {
            if(objList[i].id == id){
                chosenObj = objList[i];
                break;
            }
        };

        timeliner && timeliner.clean && timeliner.clean();
        maper && maper.clean && maper.clean();
        //timeliner = showTimeZones(tm.timeline, chosenObj.timeZone.zones, function(){});
        maper = showSpaceZones(map, chosenObj.timeZone.zones[0].spaceZone.zones, function(){});
    });
    $("#objs").delegate(".ttl", "click", function(){
        $(this).next(".cnt").slideToggle(200);
        $(this).find(".more-mark").toggle();
        $(this).find(".no-more-mark").toggle();
    });
    $("#objs").delegate("li", "mouseenter", function(){
        $(this).addClass("current");
    });
    $("#objs").delegate("li", "mouseleave", function(){
        $(this).removeClass("current");
    });
    $("#objs").delegate(".remove-item", "click", function(e){
        if(!confirm("确定删除？")) return false;
        var id = $(this).parents(".obj").find("[name=id]").text();
        var i, obj;
        for (i = objList.length - 1; i >= 0; i--) {
            if(objList[i].id == id){
                obj = objList[i];
                break;
            }
        };
        obj && obj.delete(function(){
            refreshFromRemote();
        }, function(){
            refreshFromRemote();
        });
        return false;
    });

    refreshFromRemote();

    //show title
    var recorder = 0;

    var spaceForm = $("#space-vals-in");
    var timeForm = $("#time-vals-in");
    var nameIn = spaceForm.find("[name=name]");
    var typeIn = spaceForm.find("[name=type]");

    var createObj = $("#create-obj");
    var keywordIn = spaceForm.find("[name=keyword]");

    var mapSelect = $("#map-select");
    var timelineSelect = $("#timeline-select");
    var timelineStart = timeForm.find("[name=start]");
    var timelineEnd = timeForm.find("[name=end]");
    var mapSelectOk = $("#map-select-ok");
    var timelineSelectOk = $("#timeline-select-ok");
    var createOk = $("#obj-create-ok");

    var showAll = $("#show-all");
    var searchForm = $("#search-vals-in");
    var searchObjs = $("#search-objs");
    var searchTypeIn = searchForm.find("[name=type]");
    var searchAreaTypeIn = searchForm.find("[name=areatype]");
    var searchDistIn = searchForm.find("[name=dist]");
    var searchSelect = $("#search-select");
    var searchSelectOk = $("#search-select-ok");

    var guide = $("#guide");

    var currentObj = new TimeSpaceObj();
    var currentTimeZone = {};
    //currentObj = new TimeSpaceObj();//----------------------
    
    var showGuide = function(word){
        guide.html(word);
    };

    var getPeriods = function(){
        getData("php/get.php?limit=period", function(ret){
            
        }, function(err){});
    };

    var enableSpaceSelect = function(type, afterSelect){
        var e;
        var after = function(){
            mapSelectOk.enable();
            afterSelect();
        };
        switch(type){
            case 0:
                return null;
                break;
            case 1:
                e = enablePointSelect(map, after);
                break;
            case 2:
                e = enableLineSelect(map, after);
                break;
            case 3:
                e = enablePolygonSelect(map, after);
                break;
            default:
                return null;
        }
        mapSelect.find("i").removeClass("icon-edit").addClass("icon-trash");
        return e;
    };

    var enableSearchSelect = function(type, areaType){
        var e;

        var afterSelect = function(){
            var circle = es.getOverLays()["circle"];
            var showRadius = function() {
                radius = circle.getRadius();
                searchDistIn.val(distFormat(radius, 1).format(" "));
            };
            google.maps.event.addListener(circle, 'radius_changed', showRadius);
            showRadius();
            searchSelectOk.enable();
        };

        switch(areaType){
            case 0:
                return null;
                break;
            case 1:
                e = enablePointSelectWithRadius(map, afterSelect);
                break;
            case 2:
                e = enableLineSelectWithRadius(map, afterSelect);
                break;
            case 3:
                if(type=="within"){
                    e = enablePolygonSelect(map, function(){
                        searchSelectOk.enable();
                    });
                }else{
                    e = enablePolygonSelectWithRadius(map, afterSelect);
                }
                break;
            default:
                return null;
        }
        searchSelect.find("i").removeClass("icon-edit").addClass("icon-trash");
        return e;
    };

    var disableSearchSelect = function(e){
        return disableSpaceSelect(e);
    };

    var init = function(){
	    initSelect();
        timelineStart.disable();
        timelineEnd.disable();
        typeIn.disable();
        nameIn.val("");

        currentObj = new TimeSpaceObj();
        currentTimeZone = {};

        showGuide('点击<i class="icon-pencil"></i>添加时空属性');
    };

    var initSelect = function(){
        timelineSelectOk.disable();
        mapSelectOk.disable();
        timelineSelect.disable();
        timelineStart.val("");
        timelineStart.children("[value=timeline]").text("从时间轴上点选");
        timelineEnd.val("");
        timelineEnd.children("[value=timeline]").text("从时间轴上点选");
        keywordIn.val("").disable().hide();
        mapSelect.show().disable().find("i").removeClass("icon-trash").addClass("icon-edit");
        mapSelectOk.show().disable();
        typeIn.val(0);

        maper && maper.clean && maper.clean();
        timeliner && timeliner.clean && timeliner.clean();

        e = disableSpaceSelect(e);
        et = disablePeriodSelect(et);
    };

    var initSearch = function(){
        searchSelectOk.disable();
        searchSelect.disable().find("i").removeClass("icon-trash").addClass("icon-edit");
        searchDistIn.val("");
        searchAreaTypeIn.disable().val(0);
        searchTypeIn.val(0);

        maper && maper.clean && maper.clean();
        timeliner && timeliner.clean && timeliner.clean();

        es = disableSearchSelect(es);
    };
    
    window.init = function(id, name){
    	createObj.trigger("click");
    	nameIn.val(id).trigger("keyup");
    	keywordIn.val(name);
    };

    $("[ntitle]").hover(function(event){
        var title = $(this).attr("ntitle");
        var delay = parseInt($(this).attr("ntitle-delay")) || 500;
        //var position = parseInt($(this).attr("ntitle-position")) || "element";
        if(title){
            var offset = $(this).offset();

            var width = $(this).width();
            var height = $(this).height();

            var paddingLeft = parseInt($(this).css("padding-left"));
            var paddingBottom = parseInt($(this).css("padding-bottom"));

            recorder = setTimeout(function(){
                $("#title_box").text(title);
                $("#title_block").css({
                    left: offset.left,
                    top: offset.top + height + 5 + 3,
                    marginLeft: width/2 + paddingLeft,
                    marginTop: paddingBottom
                }).fadeIn(200);

                recorder = setTimeout(function(){
                    $("#title_block").fadeOut(200);
                },1000);
            },delay);
        }
    }, function(){
        $("#title_block").fadeOut(200);
        clearTimeout(recorder);
    });

    $(".ops").find("*").click(function(){
        $(this).dishighlight();
    });

    createObj.click(function(){
        var i = $(this).find("i");
        spaceForm.toggle();
        timeForm.toggle();
        init();
        if(i.hasClass("icon-pencil")){
            i.removeClass("icon-pencil").addClass("icon-remove");
            showGuide("输入对象的ID(即node)的ID");
            nameIn.enable();
        }else{
            i.removeClass("icon-remove").addClass("icon-pencil");
        }
    }).highlight();

    nameIn.keyup(function(){
        var hasName = $(this).val();
        timelineSelect.setable(hasName);
        if(hasName){
            timelineStart.enable();
            timelineEnd.enable();
            typeIn.enable();
            currentObj.addTimeZone(currentTimeZone);
        }
        showGuide('在左边选择时段的始末时间，要添加空间信息，在下方选择空间内容类型');
    });

    timelineSelect.click(function(){
        /*if(et){
            et = disablePeriodSelect(et);
        }
        et = enablePeriodSelect(tm.timeline, function(){
            currentObj.addTimeZone(currentTimeZone);
            typeIn.enable();
        });*/
        timelineStart.enable();
        timelineEnd.enable();
        typeIn.enable();
        currentObj.addTimeZone(currentTimeZone);
    });

    var triggerChange = function(){
        if($(this).val() == "timeline"){
            $(this).trigger("change");
        }
    };
    timelineStart.click(triggerChange);
    timelineStart.click(triggerChange);

    timelineStart.change(function(){
        if(et){
            et = disablePeriodSelect(et);
        }
        if($(this).val() == "timeline"){
            et = enableTimeSelect(tm.timeline, function(time){
                if(!currentTimeZone.spaceZone) currentObj.addTimeZone(currentTimeZone);
                currentTimeZone.start = time;
                timelineStart.children("[value=timeline]").text(timeFormat(time)+"(点选)");
            });
            showGuide('在时间轴上点击以选择时间点');
        }
        if($(this).val() == "today"){
            showGuide(timeFormat(today().valueOf()));
        }
    });

    timelineEnd.change(function(){
        if(et){
            et = disablePeriodSelect(et);
        }
        if($(this).val() == "timeline"){
            et = enableTimeSelect(tm.timeline, function(time){
                if(!currentTimeZone.spaceZone) currentObj.addTimeZone(currentTimeZone);
                currentTimeZone.end = time;
                timelineEnd.children("[value=timeline]").text(timeFormat(time)+"(点选)");
            });
            showGuide('在时间轴上点击以选择时间点');
        }
        if($(this).val() == "today"){
            showGuide(timeFormat(today().valueOf()));
        }
    });

    timelineSelectOk.click(function() {
        if($(this).hasClass("disabled")) return false;

        var startType = timelineStart.val();
        var endType = timelineEnd.val();

        switch(startType){
            case "": 
                alert("无法添加，未选择开始时间");
                timelineStart.highlight();
                return false;
            case "timeline": 
                break;
            case "today": 
                currentTimeZone.start = today().valueOf();
                break;
            case "infinity": 
                currentTimeZone.start = -62167334400000;
                break;
        }
        switch(endType){
            case "": 
                alert("无法添加，未选择结束时间");
                timelineEnd.highlight();
                return false;
            case "timeline": 
                break;
            case "today": 
                currentTimeZone.end = today().valueOf();
                break;
            case "infinity": 
                currentTimeZone.end = 2000000000000;
                break;
        }

        log(currentTimeZone);//----------------------
        currentTimeZone = {};
        createOk.enable();
        initSelect();
        showGuide('已添加，点击<i class="icon-save"></i>保存对象，也可以继续添加时段信息');
    });

    typeIn.change(function(){
        var type = parseInt($(this).val());

        e = disableSpaceSelect(e);
        var select = type > 0 && type < 4;
        
        if(type==4){//search
        	keywordIn.show().enable();
        	mapSelect.hide();
        	mapSelectOk.hide();
        }
        
        if(select){
        	keywordIn.disable().hide();
        	mapSelect.enable().show();
        	mapSelectOk.show();
            mapSelect.find("i").removeClass("icon-trash").addClass("icon-edit").trigger("click");
        }
    });
    
    keywordResults = {
    	places: [],
    	markers: [],
    	infowindows: []
    };
	useResult = function(i){
		log(i, keywordResults.places[i]);
		var place = keywordResults.places[i];
		var loc = place.geometry.location;
		var spaceZone = {
		    type: 1,
		    center: new Point(loc.lat(), loc.lng())
		};
		if(!currentTimeZone.spaceZone) currentObj.addTimeZone(currentTimeZone);
        currentTimeZone.spaceZone.add(spaceZone);
        log(spaceZone, currentTimeZone);//-------------------
        timelineSelectOk.enable();
        
        $.each(keywordResults.markers, function(i,marker){
        	destroyOverLay(marker);
        });
	};
    keywordIn.on("keypress", function(e){
    	if(e.keyCode == 13){
    		var keyword = keywordIn.val();
    		
    		var request = {
    			query: keyword
  			};
  			var callback = function(results, status) {
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					keywordResults.places = [];
                    keywordResults.markers = [];
    				keywordResults.infowindows = [];
    				currentResult = null;
					$.each(results, function(i, place){
						keywordResults.places.push(place);
				  		var marker = placeMarker(map, place.geometry.location);
				  		keywordResults.markers.push(marker);
				  		var infowindow = new google.maps.InfoWindow({
							content: '<h4>'+place.name+'</h4><p>'+place.formatted_address+'</p><a id="use-result" href="javascript:useResult('+i+');">使用该地点</span>'
						});
						keywordResults.infowindows.push(infowindow);
				  		google.maps.event.addListener(marker, 'click', function() {
						  	infowindow.open(map,marker);
						});
					});
					autoZoom(map, keywordResults.markers);
			  	}else if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                    alert("无搜索结果");
                }else{
                    alert("搜索请求出错");
                }
			}

  			service = new google.maps.places.PlacesService(map);
  			service.textSearch(request, callback);
    	}
    });

    mapSelect.click(function() {
        if($(this).hasClass("disabled")) return false;

        if(e){
            e = disableSpaceSelect(e);
        }

        var type = parseInt(typeIn.val());
        e = enableSpaceSelect(type, function(){
            showGuide('点击“空间”中的<i class="icon-ok"></i>将选取好的空间信息加入对象');
        });
        showGuide("在地图上选取空间范围");
    });

    mapSelectOk.click(function() {
        if($(this).hasClass("disabled")) return false;

        mapSelect.setable(type!=0).find("i").removeClass("icon-trash").addClass("icon-edit");

        var type = parseInt(typeIn.val());
        var spaceZone = parseOverLay(type, e.getOverLays());

        if(!currentTimeZone.spaceZone) currentObj.addTimeZone(currentTimeZone);
        currentTimeZone.spaceZone.add(spaceZone);
        log(spaceZone, currentTimeZone);//-------------------
        timelineSelectOk.enable();
        $.each(keywordResults.markers, function(i,marker){
        	destroyOverLay(marker);
        });
    });

    createOk.click(function() {
        if($(this).hasClass("disabled")) return false;

        var name = nameIn.val();

        currentObj.name = name;
        currentObj.id = name;
        currentObj.save(function(){
            refreshFromRemote();
            showGuide('保存完毕');
        });

        log(currentObj.timeZone);//------------------

        init();
    });

    $("#timeline-in").click(function(){
        zoomIn(tm.timeline, 0);
    });
    $("#timeline-out").click(function(){
        zoomOut(tm.timeline, 0);
    });

    showAll.click(function(){
        refreshFromRemote();
    });

    searchObjs.click(function(){
        searchForm.toggle();
        //init();
    });

    searchTypeIn.change(function(){
        var type = $(this).val();
        switch(type){
            case "within": 
                searchAreaTypeIn.disable().val(3);
                searchSelect.enable();
                break;
            case "near": 
                searchAreaTypeIn.enable().val(0);
                break;
            default: ;
        }
    });

    searchAreaTypeIn.change(function(){
        if($(this).val()){
            //searchDistIn.enable();
            searchSelect.enable();
        }
    });

    searchDistIn.keyup(function(){
        var val = $(this).val();
        var numPattern = /^\d+(\.\d+)?$/;
        if(numPattern.test(val)){
            searchSelect.enable();
        }
    });

    searchSelect.click(function() {
        if($(this).hasClass("disabled")) return false;

        if(es){
            es = disableSearchSelect(es);
        }

        var type = searchTypeIn.val();
        var areaType = parseInt(searchAreaTypeIn.val());
        es = enableSearchSelect(type, areaType);
    });

    searchSelectOk.click(function() {
        if($(this).hasClass("disabled")) return false;

        searchSelect.disable().find("i").removeClass("icon-trash").addClass("icon-edit");

        var searchType = searchTypeIn.val();
        var searchAreaType = parseInt(searchAreaTypeIn.val());
        var searchArea = spaceZoneToWKT(parseOverLay(searchAreaType, es.getOverLays()), searchType=="near");
        var searchDist;

        if(searchType=="near"){
            searchDist = es.getOverLays()["circle"].radius;
        }

        getData("php/get.php", function(ret){
            setData(ret);
            refreshList();
        }, function(err){
            log(err);
        }, {
            limit : searchType,
            area : searchArea,
            dist : searchDist
        });

        initSearch();
    });

    
});
