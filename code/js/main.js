var tm;
var map;
var e;
var et;

var objList = [];
var rightList;

/**
 * main -------------------------------------------------------
 */

$(function() {
    // make a custom map style
    var simpleMapType = new google.maps.StyledMapType([{
        featureType: "road",
        elementType: "all",
        stylers: [{
            visibility: "off"
        }]
    }], {
        name: "simple"
    });

    var theme = Timeline.ClassicTheme.create();
    theme.mouseWheel = 'scroll';
    var eventSource = new Timeline.DefaultEventSource();
    var bands = [
    Timeline.createBandInfo({
        date: "Jun 28 2006 00:00:00 GMT",
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
        }, {
            pixelsPerInterval: 200,
            unit: Timeline.DateTime.CENTURY
        }, {
            pixelsPerInterval: 100,
            unit: Timeline.DateTime.CENTURY
        })
    }),
    Timeline.createBandInfo({
        date: "Jun 28 2006 00:00:00 GMT",
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
        datasets: [
        dataset],
        bandIntervals: [
        Timeline.DateTime.DECADE,
        Timeline.DateTime.CENTURY],
        bands: bands
    });

    // set the map to our custom style
    map = tm.getNativeMap();
    map.mapTypes.set("simple", simpleMapType);
    map.setMapTypeId("simple");
});

/**
 * bindings -------------------------------------------------------
 */

 $(function(){
    var maper, timeliner;
    rightList = $("#objs").checkList(".head", ".body", null, function(obj){
        obj.find(".cnt").hide(200);
        $(this).find(".more-mark").show();
        $(this).find(".no-more-mark").hide();

        var name = obj.find("[name=name]").text();

        var chosenObj;
        for (var i = objList.length - 1; i >= 0; i--) {
            if(objList[i].name == name){
                chosenObj = objList[i];
                break;
            }
        };

        maper && maper.clean && maper.clean();
        timeliner && timeliner.clean && timeliner.clean();
        maper = showTimeZones(tm.timeline, chosenObj.timeZone.zones, function(){});
        timeliner = showSpaceZones(map, chosenObj.spaceZone.zones, function(){});
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

    var addObj = function(obj){
        objList.push(obj);
        rightList.addNode(template.render('obj-template', obj));
    };
    $.each(localStorage, function(name, cnt){
        var obj = (new TimeSpaceObj()).load(name)
        addObj(obj);
    });

    //show title
    var recorder = 0;

    var spaceForm = $("#space-vals-in");
    var timeForm = $("#time-vals-in");
    var nameIn = spaceForm.find("[name=name]");
    var typeIn = spaceForm.find("[name=type]");

    var createObj = $("#create-obj");
    var mapSelect = $("#map-select");
    var timelineSelect = $("#timeline-select");
    var mapSelectOk = $("#map-select-ok");
    var timelineSelectOk = $("#timeline-select-ok");
    var createOk = $("#obj-create-ok");

    var currentObj = new TimeSpaceObj();

    var enableSpaceSelect = function(type){
        var e;
        switch(type){
            case 0:
                return null;
                break;
            case 1:
                e = enablePointSelect(map, function(){
                    mapSelectOk.enable();
                });
                break;
            case 2:
                e = enableLineSelect(map, function(){
                    mapSelectOk.enable();
                });
                break;
            case 3:
                e = enableBorderSelect(map, function(){
                    mapSelectOk.enable();
                });
                break;
            case 4:
                e = enablePolygonSelect(map, function(){
                    mapSelectOk.enable();
                });
                break;
            default:
                return null;
        }
        mapSelect.find("i").removeClass("icon-edit").addClass("icon-trash");
        return e;
    };

    var init = function(){
        createOk.disable();
        timelineSelectOk.disable();
        mapSelectOk.disable();
        timelineSelect.disable();
        mapSelect.disable().find("i").removeClass("icon-trash").addClass("icon-edit");
        typeIn.disable().val(0);
        nameIn.val("");

        currentObj = new TimeSpaceObj();

        maper && maper.clean && maper.clean();
        timeliner && timeliner.clean && timeliner.clean();

        e = disableSpaceSelect(e);
        et = disablePeriodSelect(et);
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

    createObj.click(function(){
        var i = $(this).find("i");
        spaceForm.toggle();
        timeForm.toggle();
        init();
        if(i.hasClass("icon-pencil")){
            i.removeClass("icon-pencil").addClass("icon-remove");
        }else{
            i.removeClass("icon-remove").addClass("icon-pencil");
        }
    });

    nameIn.keyup(function(){
        var hasName = $(this).val();
        typeIn.setable(hasName);
        timelineSelect.setable(hasName);
    });

    typeIn.change(function(){
        var type = parseInt($(this).val());

        e = disableSpaceSelect(e);
        mapSelect.setable(type!=0).find("i").removeClass("icon-trash").addClass("icon-edit").trigger("click");
    });

    timelineSelect.click(function(){
        if(et){
            et = disablePeriodSelect(et);
        }
        et = enablePeriodSelect(tm.timeline, function(){
            //log(et.getPeriod());
            timelineSelectOk.enable();
        });
    });

    mapSelect.click(function() {
        if($(this).hasClass("disabled")) return false;

        if(e){
            e = disableSpaceSelect(e);
        }

        var type = parseInt(typeIn.val());
        e = enableSpaceSelect(type);
    });

    mapSelectOk.click(function() {
        if($(this).hasClass("disabled")) return false;

        mapSelect.setable(type!=0).find("i").removeClass("icon-trash").addClass("icon-edit");

        var type = parseInt(typeIn.val());
        var spaceZone = parseOverLay(type, e.getOverLays());

        currentObj.addSpaceZone(spaceZone);
        createOk.enable();
        console.log(spaceZone);//----------------------------
    });

    timelineSelectOk.click(function() {
        if($(this).hasClass("disabled")) return false;

        var timeZone = parsePeriod(et.getPeriod());

        currentObj.addTimeZone(timeZone);
        createOk.enable();
        console.log(timeZone);//----------------------------
    });

    createOk.click(function() {
        if($(this).hasClass("disabled")) return false;

        var name = nameIn.val();

        currentObj.name = name;
        console.log(currentObj);
        currentObj.save();

        addObj(currentObj);

        init();
    });

    $("#timeline-in").click(function(){
        zoomIn(tm.timeline, 0);
    });
    $("#timeline-out").click(function(){
        zoomOut(tm.timeline, 0);
    });
    
});
