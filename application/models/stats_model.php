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

	// Rank: Slayer
	public function getMostZombieKills()
	{
		$query = $this->database->prepare("SELECT MAX(character_data.KillsZ) as KillsZ, player_data.PlayerName as PlayerName FROM character_data LEFT JOIN player_data ON (player_data.PlayerUID = character_data.PlayerUID) WHERE character_data.Alive = 1 LIMIT 1;")
		$raw = $query->execute();

		if ($query->rowCount() > 0)
		{
			$data = $query->fetch(PDO::FETCH_ASSOC);
			return array(
				'Name' => $data['PlayerName'],
				'Kills' => $data['KillsZ']
				);
		}
		else
		{
			$log->addWarning("Failed to retrive getMostZombieKills(): null rows returned.");
			return 0;
		}
	}

	// Rank: Headhunter
	public function getMostHeadshots()
	{
		$query = $this->database->prepare("SELECT MAX(character_data.HeadshotsZ) as Headshots, player_data.PlayerName as PlayerName FROM character_data LEFT JOIN player_data ON (player_data.PlayerUID = character_data.PlayerUID) WHERE character_data.Alive = 1 LIMIT 1;")
		$raw = $query->execute();
		if ($query->rowCount() > 0)
		{
			$data = $query->fetch(PDO::FETCH_ASSOC);
			return array(
				'Name' => $data['PlayerName'],
				'Headshots' => $data['Headshots']
				);
		}
		else
		{
			$log->addWarning("Failed to retrive getMostHeadshots(): null rows returned.");
		}
	}

	// Rank: Serial Killer
	public function getMostSurvivorKills()
	{
		$query = $this->database->prepare("SELECT MAX(character_data.KillsH) as Kills, player_data.PlayerName AS PlayerName FROM character_data LEFT JOIN player_data ON (player_data.PlayerUID = character_data.PlayerUID) WHERE character_data.Alive = 1 LIMIT 1;");
		$raw = $query->execute();
		if ($query->rowCount() > 0)
		{
			$data = $query->fetch(PDO::FETCH_ASSOC);
			return array(
				'Name' => $data['PlayerName'],
				'Kills' => $data['Kills']
				);
		}
		else
		{
			$log->addWarning("Failed to retrive getMostSurvivorKills(): null rows returned.");
		}
	}

	// Rank: Bandit Hunter
	public function getMostBanditKills()
	{
		$query = $this->database->prepare("SELECT MAX(character_data.KillsB) as Kills, player_data.PlayerName AS PlayerName FROM character_data LEFT JOIN player_data ON (player_data.PlayerUID = character_data.PlayerUID) WHERE character_data.Alive = 1 LIMIT 1;");
		$raw = $query->execute();
		if ($query->rowCount() > 0)
		{
			$data = $query->fetch(PDO::FETCH_ASSOC);
			return array(
				'Name' => $data['PlayerName'],
				'Kills' => $data['Kills']
				);
		}
		else
		{
			$log->addWarning("Failed to retrive getMostBanditKills(): null rows returned.");
		}
	}

	// Rank: I don't wanna die!
	public function getMostLife()
	{
		$query = $this->database->prepare("SELECT MAX(character_data.Duration) as LifeSpan, player_data.PlayerName as PlayerName FROM character_data LEFT JOIN player_data ON (player_data.PlayerUID = character_data.PlayerUID) WHERE character_data.Alive = 1 LIMIT 1;")
		$raw = $query->execute();
		if ($query->rowCount() > 0)
		{
			$data = $query->fetch(PDO::FETCH_ASSOC);
			return array(
				'Name' => $data['PlayerName'],
				'LifeSpan' => $data['LifeSpan']
				);
		}
		else
		{
			$log->addWarning("Failed to retrive getMostLife(): null rows returned.");
		}
	}

	// Rank: Deadweight
	public function getMostDeaths()
	{
		$query = $this->database->prepare("SELECT MAX(character_data.Generation) as Lifes, player_data.PlayerName as PlayerName FROM character_data LEFT JOIN player_data ON (player_data.PlayerUID = character_data.PlayerUID) WHERE character_data.Alive = 1 LIMIT 1;")
		$raw = $query->execute();
		if ($query->rowCount() > 0)
		{
			$data = $query->fetch(PDO::FETCH_ASSOC);
			return array(
				'Name' => $data['PlayerName'],
				'Lifes' => $data['Lifes']
				);
		}
		else
		{
			$log->addWarning("Failed to retrive getMostDeaths(): null rows returned.");
		}
	}

	// Rank: Olympic Stride
	public function getLongestFootDistance()
	{
		$query = $this->database->prepare("SELECT MAX(character_data.DistanceFoot) as Km, player_data.PlayerName as PlayerName FROM character_data LEFT JOIN player_data ON (player_data.PlayerUID = character_data.PlayerUID) WHERE character_data.Alive = 1 LIMIT 1;")
		$raw = $query->execute();
		if ($query->rowCount() > 0)
		{
			$data = $query->fetch(PDO::FETCH_ASSOC);
			return array(
				'Name' => $data['PlayerName'],
				'Distance' => $data['Km']
				);
		}
		else
		{
			$log->addWarning("Failed to retrive getLongestFootDistance(): null rows returned.");
		}
	}
}

?>