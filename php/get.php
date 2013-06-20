<?php
require_once('../../php/db.class.php');			          //引入info.class.php

@$action = $_GET['limit'];				              //获取提交的action值
switch($action){
    case 'within'                   : getWithin(); break;
    case 'near'                     : getNear(); break;
    case 'period'                   : list_period(); break;
    case 'zone'                     : list_zone(); break;
    default 						: get(); break;
}

function get(){
	$db = new DB();

    $sql = "select obj.*, image.thumbnail, field_data_body.body_summary as description from (";
	$sql .= "select extract(epoch FROM timea.begin) as begin, extract(epoch FROM timea.end) as end, ST_AsGeoJSON(space.item) as space, node.title as name, node.type, node.nid as id from";
	$sql .= " timea join node on timea.idarti=node.nid";
	$sql .= " left join geo on timea.idgeo=geo.idgeo";
	$sql .= " left join (select * from point union select * from polyline union select * from polygon) as space on geo.idgeo=space.idgeo";
    $sql .= ") as obj";
    $sql .= " left join (select uri as thumbnail, field_data_field_small_image.entity_id as id from file_managed join field_data_field_small_image on file_managed.fid=field_data_field_small_image.field_small_image_fid) as image";
    $sql .= " on obj.id=image.id";
    $sql .= " left join field_data_body on field_data_body.entity_id = obj.id";

    @$getInfo = $db->getObjListBySql($sql);
    $ret = count($getInfo)>0 ? json_encode($getInfo) : "null";

    if(isset($_GET['callback']) && !empty($_GET['callback'])){
    	$callback = $_GET['callback'];
    	$ret = $callback."(".$ret.");";
    }

	echo $ret;
}

function getWithin(){
    @$area = $_GET['area'];

    $db = new DB();

    $sql = "select obj.*, image.thumbnail, field_data_body.body_summary as description from (";
    $sql .= "select extract(epoch FROM timea.begin) as begin, extract(epoch FROM timea.end) as end, ST_AsGeoJSON(space.item) as space, node.title as name, node.type, node.nid as id from";
    $sql .= " timea join node on timea.idarti=node.nid";
    $sql .= " left join geo on timea.idgeo=geo.idgeo";
    $sql .= " left join (select * from point union select * from polyline union select * from polygon) as space on geo.idgeo=space.idgeo";
    $sql .= " where ST_Contains(ST_GeomFromText('$area',4326),space.item)";
    $sql .= ") as obj";
    $sql .= " left join (select uri as thumbnail, field_data_field_small_image.entity_id as id from file_managed join field_data_field_small_image on file_managed.fid=field_data_field_small_image.field_small_image_fid) as image";
    $sql .= " on obj.id=image.id";
    $sql .= " left join field_data_body on field_data_body.entity_id = obj.id";

    @$getInfo = $db->getObjListBySql($sql);
    $ret = count($getInfo)>0 ? json_encode($getInfo) : "null";

    if(isset($_GET['callback']) && !empty($_GET['callback'])){
        $callback = $_GET['callback'];
        $ret = $callback."(".$ret.");";
    }

    echo $ret;
}

function getNear(){
    @$area = $_GET['area'];
    @$dist = $_GET['dist'];

    $db = new DB();

    $sql = "select obj.*, image.thumbnail, field_data_body.body_summary as description from (";
    $sql .= "select extract(epoch FROM timea.begin) as begin, extract(epoch FROM timea.end) as end, ST_AsGeoJSON(space.item) as space, node.title as name, node.type, node.nid as id from";
    $sql .= " timea join node on timea.idarti=node.nid";
    $sql .= " left join geo on timea.idgeo=geo.idgeo";
    $sql .= " left join (select * from point union select * from polyline union select * from polygon) as space on geo.idgeo=space.idgeo";
    $sql .= " where ST_DWithin(ST_Transform(ST_GeomFromText('$area',4326),26986),ST_Transform(space.item,26986),$dist)";
    $sql .= ") as obj";
    $sql .= " left join (select uri as thumbnail, field_data_field_small_image.entity_id as id from file_managed join field_data_field_small_image on file_managed.fid=field_data_field_small_image.field_small_image_fid) as image";
    $sql .= " on obj.id=image.id";
    $sql .= " left join field_data_body on field_data_body.entity_id = obj.id";

    @$getInfo = $db->getObjListBySql($sql);
    $ret = count($getInfo)>0 ? json_encode($getInfo) : "null";

    if(isset($_GET['callback']) && !empty($_GET['callback'])){
        $callback = $_GET['callback'];
        $ret = $callback."(".$ret.");";
    }

    echo $ret;
}

function list_period(){
    $db = new DB();

    $sql = 'select * from period;';

    @$getInfo = $db->getObjListBySql($sql);
    $ret = count($getInfo)>0 ? json_encode($getInfo) : "null";

    echo $ret;
}

function list_zone(){
    $db = new DB();

    $sql = 'select id, description, ST_AsGeoJSON(space) as space from zone;';

    @$getInfo = $db->getObjListBySql($sql);
    $ret = count($getInfo)>0 ? json_encode($getInfo) : "null";

    echo $ret;
}

?>
