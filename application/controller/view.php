<?php

class view extends Controller
{

	public function index()
	{
		Header("Location: " . BASE_URL);
	}

	public function player($name)
	{
		$player_model = $this->model("player_model");

		$playerUID = $player_model->getPID(trim($name));

		if ($playerUID == 0)
		{
			// 404
		}
		else
		{
			$zombie_stats = $player_model->getZombieStats($playerUID);
			$humanity = $player_model->getHumanity($playerUID);
			$life_stats = $player_model->getLifeStats($playerUID);
			$kill_stats = $player_model->getPlayerKillStatus($playerUID);

			$this->display('view/player',
				array(
					'zStat' => $zombie_stats,
					'hStat' => $humanity,
					'lStat' => $life_stats,
					'kStat' => $kill_stats
					)
				);

		}
	}

}

?>