<?php

class player_model
{

	private $database;
	private $log;

	public function __construct($dbh, $log)
	{
		$this->database = $dbh;
		$this->log = $log;
	}

	/**
	 * Get the player's ID from their display name.
	 */
	public function getPID($name)
	{
		$query = $this->database->prepare("SELECT PlayerUID FROM player_data WHERE PlayerName = ?;");
		$raw = $query->execute(array($name));
		if ($raw->rowCount() > 0)
		{
			$data = $raw->fetch(PDO::FETCH_ASSOC);
			return $data['PlayerUID'];
		}
		else
		{
			return 0;
		}
	}

	/**
	 * Get the player's statistics for zombie kills.
	 */
	public function getZombieStats($pid)
	{
		$query = $this->database->prepare("SELECT KillsZ, HeadshotsZ FROM character_data WHERE PlayerUID = ? AND Alive = 1 LIMIT 1;");
		$raw = $query->execute(array($pid));
		if ($raw->rowCount() > 0)
		{
			$data = $raw->fetch(PDO::FETCH_ASSOC);
			return array(
				'kills' => $data['KillsZ'],
				'headshots' => $data['HeadshotsZ']
				);
		}		
		else
		{
			return 0;
		}
	}

	/**
	 * Get the player's current humanity level.
	 */
	public function getHumanity($pid)
	{
		$query = $this->database->prepare("SELECT Humanity FROM character_data WHERE PlayerUID = ? AND Alive = 1 LIMIT 1;");
		$raw = $query->execute(array($pid));
		if ($raw->rowCount() > 0)
		{
			$data = $raw->fetch(PDO::FETCH_ASSOC);
			return $data['Humanity'];
		}
		else
		{
			return 0;
		}
	}

	/**
	 * Get the player's general information on their current life.
	 */
	public function getLifeStats($pid)
	{
		$query = $this->database->prepare("SELECT DistanceFoot, Duration, Generation FROM character_data WHERE PlayerUID = ? AND Alive = 1 LIMIT 1;");
		$raw = $query->execute(array($pid));
		if ($raw->rowCount() > 0)
		{
			$data = $raw->fetch(PDO::FETCH_ASSOC);
			return array(
				'Distance' => $data['DistanceFoot'],
				'Duration' => $data['Duration'],
				'Attempt' => $data['Generation']
				);
		}
		else
		{
			return 0;
		}
	}

	/**
	 * Get the player's statistic of kills on non-zombies.
	 */
	public function getPlayerKillStatus($pid)
	{
		$query = $this->database->prepare("SELECT KillsH, KillsB FROM character_data WHERE PlayerUID = ? AND Alive = 1 LIMIT 1;");
		$raw = $query->execute(array($pid));
		if ($raw->rowCount() > 0)
		{
			$data = $raw->fetch(PDO::FETCH_ASSOC);
			return array(
				'Suvivors' => $data['KillsH'],
				'Bandits' => $data['KillsB']
				);
		}
		else
		{
			return 0;
		}
	}
}

?>