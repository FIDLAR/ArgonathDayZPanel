<?php

class stats_model
{

	private $database;
	private $log;

	public function __construct($dbh, $log)
	{
		$this->database = $dbh;
		$this->log = $log;
	}

	public function getMostZombieKills()
	{
		$query = $this->database->prepare("SELECT MAX(character_data.KillsZ) as KillsZ, player_data.PlayerName as PlayerName FROM character_data LEFT JOIN player_data ON player_data.PlayerUID = character_data.PlayerUID LIMIT 1;")
		$raw = $query->execute();

		if ($raw->rowCount() > 0)
		{
			$data = $raw->fetch(PDO::FETCH_ASSOC);
			return array(
				'Name' => $data['PlayerName'],
				'Kills' => $data['KillsZ']
				);
		}
		else
		{
			$log->addWarning("Failed to retrive getMostZombieKills(): null rows returned");
			return 0;
		}
	}
}

?>