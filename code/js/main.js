var tm;
var map;
var e;

/**
 * bindings -------------------------------------------------------
 */

$(function() {

    //show title
    var recorder = 0;
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


    $("#map-select").click(function() {
        if($(this).hasClass("disabled")) return false;

        if(e){
            e = disablePolygonSelect(e);
        }
        e = enablePolygonSelect(map, function(){
            $("#map-select-ok").removeClass("disabled");
        });
    });
    $("#map-select-ok").click(function() {
        if($(this).hasClass("disabled")) return false;

        var obj = new TimeSpaceObj();
        var form = $("#new-obj");
        var name = form.find("[name=name]").val();
        var type = form.find("[name=type]").val();

        var ps = e.getOverLays().polygon.getPath().b;
        var points = [];

        for(var i=0,l=ps.length;i<l;i++){
            points.push(new Point(ps[i].kb, ps[i].lb));
        }

        obj.init({
            name: name,
            type: type,
            spaceZone: {
                points: points
            }
        });
        console.log(obj);

        if (e) {
            e = disablePolygonSelect(e);
            $(this).addClass("disabled");
        }
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