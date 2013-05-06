<?php
require_once('../../php/db.class.php');			          //引入info.class.php

@$action = $_POST['action'];				              //获取提交的action值
switch($action){
	case 'getObjs'					: getObjs(); break;
	case 'insertTimeSpace'			: insertTimeSpace(); break;
    default 						: echo 'null'; break;
}

function getObjs(){
	@$callback = $_POST['callback'];
	$db = new DB();

	$sql = "select timea.begin, timea.end, ST_AsGeoJSON(space.item) as space, node.title, node.type, node.nid as id from";
	$sql .= " timea join node on timea.idarti=node.nid";
	$sql .= " left join geo on timea.idgeo=geo.idgeo";
	$sql .= " left join (select * from point union select * from polyline union select * from polygon) as space on geo.idgeo=space.idgeo";

    @$getInfo = $db->getObjListBySql($sql);

	echo count($getInfo)>0 ? json_encode($getInfo) : null;
}

function insertTimeSpace(){
	@$idarti = $_POST['objId'];
	@$begin = $_POST['begin'];
	@$end = $_POST['end'];
	@$description = $_POST['description'];
	@$type = $_POST['type'];
	@$space = $_POST['space'];


    @$idtemporal = $idarti."_".$begin."_".$end;
    @$idgeo = $idtemporal."_".$type;
	$db = new DB();
	$db->open();
    pg_query($db->conn, "insert into geo(idgeo,description) values('$idgeo', '$description');");
    pg_query($db->conn, "insert into $type(idgeo,item) values('$idgeo', ST_GeomFromText('$space',4326));");
    pg_query($db->conn, "insert into timea values ('$idtemporal', '$begin', '$end', '$idarti', '$idgeo');");

    echo json_encode(array(
		'idtemporal'=>$idtemporal,
		'idgeo'=>$idgeo
	));	
}


?>
