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

    public function getSquadZombieStats()
    {
    	$kills = 0;
    	$headshots = 0;
    	foreach($this->squad as $member)
    	{
    		$query = $this->database->prepare("SELECT KillsZ,HeadshotsZ FROM character_data WHERE PlayerUID = ? AND Alive = 1 LIMIT 1;");
    		$raw = $query->execute(array($member));
    		if ($query->rowCount() > 0)
    		{
    			$data = $query->fetch(PDO::FETCH_ASSOC);
    			$kills += $data['KillsZ'];
    			$headshots += $data['HeadshotsZ'];
    		}
    		$query = NULL;
    	}
    	return array(
    		'kills'=>$kills, 
    		'headshots'=>$headshots
    		);
    }

    public function getSquadHumanityAverage()
    {
    	$humanity = 0;
    	foreach($this->squad as $member)
    	{
    		$query = $this->database->prepare("SELECT Humanity FROM character_data WHERE PlayerUID = ? AND Alive = 1 LIMIT 1;");
    		$raw = $query->execute(array($member));
    		if ($query->rowCount() > 0)
    		{
    			$data = $query->fetch(PDO::FETCH_ASSOC);
    			$humanity += $data['Humanity'];
    		}
    		$query = NULL;
    	}
    	return ($humanity/count($this->squad));
    }

    public function getSquadPVPStats()
    {
    	$suvivors = 0;
    	$bandits = 0;
    	foreach ($this->squad as $member)
    	{
    		$query = $this->database->prepare("SELECT KillsH, KillsB FROM character_data WHERE PlayerUID = ? AND Alive = 1 LIMIT 1;");
    		$raw = $query->execute(array($member));
    		if ($query->rowCount() > 0)
    		{
    			$data = $query->fetch(PDO::FETCH_ASSOC);
    			$bandits += $data['KillsB'];
    			$suvivors += $data['KillsH'];
    		}
    		$query = NULL;
    	}
    	return array(
    		'suvivors' => $suvivors,
    		'bandits' => $bandits
    		);
    }

    public function getSquadLifeStats()
    {
    	$life = array(
    		'distance' => 0,
    		'duration' => 0,
    		'attempt' => 0,
    		);

 		foreach ($this->squad as $member)
 		{
 			$query = $this->database->prepare("SELECT DistanceFoot, Duration, Generation FROM character_data WHERE PlayerUID = ? AND Alive = 1 LIMIT 1;");
 			$raw = $query->execute(array($member));
 			if ($query->rowCount() > 0)
 			{
 				$data = $query->fetch(PDO::FETCH_ASSOC);
 				$life['distance'] += $data['DistanceFoot'];
 				$life['duration'] += $data['Duration'];
 				$life['attempt'] += $data['Generation'];
 			}
 			$query = NULL;
 		}
 		return array(
 			'distance' => ($life['distance']/count($this->squad))/1000,
 			'duration' => ($life['duration']/count($this->squad))/60,
 			'attempt' => ($life['attempt']/count($this->squad))
 			);
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