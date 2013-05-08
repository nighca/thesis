<?php
require_once('../../php/db.class.php');			          //引入info.class.php

@$action = $_GET['limit'];				              //获取提交的action值
switch($action){
    case 'within'                   : getWithin(); break;
    case 'near'                     : getNear(); break;
    default 						: get(); break;
}

function get(){
	$db = new DB();

	$sql = "select extract(epoch FROM timea.begin) as begin, extract(epoch FROM timea.end) as end, ST_AsGeoJSON(space.item) as space, node.title, node.type, node.nid as id from";
	$sql .= " timea join node on timea.idarti=node.nid";
	$sql .= " left join geo on timea.idgeo=geo.idgeo";
	$sql .= " left join (select * from point union select * from polyline union select * from polygon) as space on geo.idgeo=space.idgeo";

    @$getInfo = $db->getObjListBySql($sql);
    $ret = count($getInfo)>0 ? json_encode($getInfo) : "null";

    if(isset($_GET['callback']) && !empty($_GET['callback'])){
    	$callback = $_GET['callback'];
    	$ret = $callback."(".$ret.");";
    }

	echo $ret;
}

function getWithin(){
    @$polygon = $_POST['polygon'];

    $db = new DB();

    $sql = "select extract(epoch FROM timea.begin) as begin, extract(epoch FROM timea.end) as end, ST_AsGeoJSON(space.item) as space, node.title, node.type, node.nid as id from";
    $sql .= " timea join node on timea.idarti=node.nid";
    $sql .= " left join geo on timea.idgeo=geo.idgeo";
    $sql .= " left join (select * from point union select * from polyline union select * from polygon) as space on geo.idgeo=space.idgeo";
    $sql .= " where ST_Contains(GeomFromText('$polygon'),space.item)";

    @$getInfo = $db->getObjListBySql($sql);
    $ret = count($getInfo)>0 ? json_encode($getInfo) : "null";

    if(isset($_GET['callback']) && !empty($_GET['callback'])){
        $callback = $_GET['callback'];
        $ret = $callback."(".$ret.");";
    }

    echo $ret;
}

function getNear(){
    $db = new DB();

    $sql = "select extract(epoch FROM timea.begin) as begin, extract(epoch FROM timea.end) as end, ST_AsGeoJSON(space.item) as space, node.title, node.type, node.nid as id from";
    $sql .= " timea join node on timea.idarti=node.nid";
    $sql .= " left join geo on timea.idgeo=geo.idgeo";
    $sql .= " left join (select * from point union select * from polyline union select * from polygon) as space on geo.idgeo=space.idgeo";

    @$getInfo = $db->getObjListBySql($sql);
    $ret = count($getInfo)>0 ? json_encode($getInfo) : "null";

    if(isset($_GET['callback']) && !empty($_GET['callback'])){
        $callback = $_GET['callback'];
        $ret = $callback."(".$ret.");";
    }

    echo $ret;
}

?>
