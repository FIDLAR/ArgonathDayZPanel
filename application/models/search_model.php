<?php

class search_model
{
	private $database;
    private $log;

    public function __construct($dbh, $log)
    {
        $this->database = $dbh;
        $this->log = $log;
    }

    public function findPlayerName($name)
    {
    	$query = $this->database->prepare("SELECT PlayerUID, PlayerName FROM player_data WHERE PlayerName LIKE ?");
    	$raw = $query->execute(array("%" . $name . "%"));

    	if ($query->rowCount() == 0)
    	{
    		// Cannot find
    	}
    	else
    	{
    		if ($query->rowCount() > 1) // Found more than one
    		{
    			$name = array();
    			$data = $query->fetchALL(PDO::FETCH_ASSOC);
    			foreach($data as $row)
    			{
    				array_push($name, array(
    					"PlayerName" => $row['PlayerName'],
    					"PlayerUID" => $row['PlayerUID']
    					)
    				);
    			} 
    		}
    		else // Found 1 user
    		{ 
    			$data = $query->fetch(PDO::FETCH_ASSOC);
    			$name = $data['PlayerUID'];
    		}
    		return array(
    			'count' => $query->rowCount(),
    			'name' => $name
    			);
    	}
    }
}

?>