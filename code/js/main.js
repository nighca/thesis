var tm;
var map;
var e;

/**
 * bindings -------------------------------------------------------
 */

$(function() {

    //show title
    var recorder = 0;

    var form = $("#vals-in");
    var nameIn = form.find("[name=name]");
    var typeIn = form.find("[name=type]");

    var createObj = $("#create-obj");
    var mapSelect = $("#map-select");
    var selectOk = $("#map-select-ok");

    var disableSelect = function(e){
        var funcs = [null, disablePointSelect, disableLineSelect, disableBorderSelect, disablePolygonSelect];

        try{
            var func = funcs[e.type];
            e = func(e);
        }catch(err){
            console.log(err);
        }

        return e;
    };

    var enableSelect = function(type){
        var e;
        switch(type){
            case 0:
                return null;
                break;
            case 1:
                e = enablePointSelect(map, function(){
                    selectOk.enable();
                });
                break;
            case 2:
                e = enableLineSelect(map, function(){
                    selectOk.enable();
                });
                break;
            case 3:
                e = enableBorderSelect(map, function(){
                    selectOk.enable();
                });
                break;
            case 4:
                e = enablePolygonSelect(map, function(){
                    selectOk.enable();
                });
                break;
            default:
                return null;
        }
        mapSelect.find("i").removeClass("icon-edit").addClass("icon-trash");
        return e;
    }

    var init = function(){
        selectOk.disable();
        mapSelect.disable().find("i").removeClass("icon-trash").addClass("icon-edit");
        typeIn.disable().val(0);
        nameIn.val("");

        e = disableSelect(e);
    };

    $("[ntitle]").hover(function(){
        var title = $(this).attr("ntitle");
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
            },500);
        }
    }, function(){
        $("#title_block").fadeOut(200);
        clearTimeout(recorder);
    });

    createObj.click(function(){
        var i = $(this).find("i");
        form.toggle();
        if(i.hasClass("icon-pencil")){
            i.removeClass("icon-pencil").addClass("icon-remove");
        }else{
            i.removeClass("icon-remove").addClass("icon-pencil");
        }
    });

    nameIn.keyup(function(){
        typeIn.setable($(this).val());
    });

    typeIn.change(function(){
        var type = parseInt($(this).val());

        e = disableSelect(e);
        mapSelect.setable(type!=0).find("i").removeClass("icon-trash").addClass("icon-edit");
    });


    mapSelect.click(function() {
        if($(this).hasClass("disabled")) return false;

        if(e){
            e = disableSelect(e);
        }

        var type = parseInt(typeIn.val());
        e = enableSelect(type);
    });

    selectOk.click(function() {
        if($(this).hasClass("disabled")) return false;

        var obj = new TimeSpaceObj();
        
        var name = nameIn.val();
        var type = parseInt(typeIn.val());
        var spaceZone = parseOverLay(type, e.getOverLays());

        obj.init({
            name: name,
            type: type,
            spaceZone: spaceZone
        });
        console.log(obj);
        obj.save();

        init();
    });

    $("#timeline-in").click(function(){
        zoomIn(tm, 0);
    });
    $("#timeline-out").click(function(){
        zoomOut(tm, 0);
    });
});

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