<?php

class view extends Controller
{

	public $groups = array(
		'TheMob' => array(
			'name' => 'TheMob',
			'url' => 'http://service.mrteddy.pw/dayz/mob/squad.xml'
			)
		);

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
	public function user($name)
	{
		$this->player($name);
	}

	public function group($name)
	{
		$url = $this->groups[$name]['url'];
		if (!is_null($url))
		{
			$group_model = $this->model("group_model");
			$group_model->loadSquad($url);

			$group_kills = $group_model->getSquadKills();
			$group_members = $group_model->getMembers();

			$this->display('view/group',
				array(
					'page' => array(
						'name' => 'Faction: ' . ucfirst($name)
						),
					'zStat' => $group_kills,
					'zMember' => $group_members
					)
				);
		}
	}

	public function groups()
	{
		$this->display('view/groups',
			array(
				'page'=>array(
					'name' => 'Factions'
					),
				'groups'=>$this->groups
				)
			);
	}

}

?>