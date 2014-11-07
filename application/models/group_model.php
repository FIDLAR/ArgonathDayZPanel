<?php

class group_model
{
    private $database;
    private $log;
    private $squad = array();

    public function __construct($dbh, $log)
    {
        $this->database = $dbh;
        $this->log = $log;
    }

    public function loadSquad($xmlFile)
    {
    	$xml = simplexml_load_file($xmlFile);
    	foreach($xml->member as $member)
    	{
    		$id = $member['id'];
    		array_push($this->squad, $id);
    	}
    }

    public function getSquadKills()
    {
    	$kills = 0;
    	foreach($this->squad as $member)
    	{
    		$query = $this->database->prepare("SELECT KillsZ FROM character_data WHERE PlayerUID = ? AND Alive = 1 LIMIT 1;");
    		$raw = $query->execute(array($member));
    		if ($query->rowCount() > 0)
    		{
    			$data = $query->fetch(PDO::FETCH_ASSOC);
    			$kills = $kills + $data['KillsZ'];
    		}
    		$query = NULL;
    	}
    	return $kills;
    }

    public function getMembers()
    {
    	$members = array();
    	foreach($this->squad as $member)
    	{
    		$query = $this->database->prepare("SELECT PlayerName FROM player_data WHERE PlayerUID = ? LIMIT 1;");
    		$raw = $query->execute(array($member));
    		if ($query->rowCount() > 0)
    		{
    			$data = $query->fetch(PDO::FETCH_ASSOC);
    			array_push($members, $data['PlayerName']);
    		}
    		$query = NULL;
    	}
    	sort($members);
    	return $members;
    }
}
?>