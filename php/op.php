<?php
require_once('../../php/db.class.php');			          //引入info.class.php

@$action = $_POST['action'];				              //获取提交的action值
switch($action){
	case 'insertTimeSpace'			: insertTimeSpace(); break;
    default 						: echo 'null'; break;
}

function insertTimeSpace(){
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


?>
