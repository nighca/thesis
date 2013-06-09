<?php
require_once('../../php/db.class.php');			          //引入info.class.php

@$action = $_POST['action'];				              //获取提交的action值
switch($action){
	case 'insert'					: insert(); break;
	case 'delete'					: delete(); break;
	case 'create_period'			: create_period(); break;
	case 'create_zone'				: create_zone(); break;
    default 						: echo 'null'; break;
}

function insert(){
	@$idarti = $_POST['objId'];
	@$begin = $_POST['begin'];
	@$end = $_POST['end'];
	@$description = $_POST['description'];
	@$type = $_POST['type'];
	@$space = $_POST['space'];


    @$idtemporal = uniqid($idarti, true);
    @$idgeo = $idtemporal;
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

function delete(){
	@$idarti = $_POST['objId'];

	$db = new DB();
	$db->open();

	$sql = "select idgeo from timea where idarti = $idarti;";
	@$geoIDs = $db->getObjListBySql($sql);

	$db = new DB();
	$db->open();
    
    pg_query($db->conn, "delete from timea where idarti = $idarti;");
   
    foreach ($geoIDs as $geoID) {
    	@$idgeo = $geoID->idgeo;
    	pg_query($db->conn, "delete from point where idgeo = '$idgeo';");
    	pg_query($db->conn, "delete from polyline where idgeo = '$idgeo';");
    	pg_query($db->conn, "delete from polygon where idgeo = '$idgeo';");
    	pg_query($db->conn, "delete from geo where idgeo = '$idgeo';");
    }

    echo "null";
}

function create_period(){
	@$name = $_POST['name'];
	@$begin = $_POST['begin'];
	@$end = $_POST['end'];
	@$description = $_POST['description'];

	$db = new DB();
	$db->open();
    pg_query($db->conn, "insert into period values ('$name', '$begin', '$end', '$description');");

    echo "null";
}

function create_zone(){
	@$name = $_POST['name'];
	@$description = $_POST['description'];
	@$space = $_POST['space'];

	$db = new DB();
	$db->open();
    pg_query($db->conn, "insert into zone(id, description, space) values ('$name', '$description', ST_GeomFromText('$space',4326));");

    echo "null";
}

?>
