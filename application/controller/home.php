<?php

class Home extends Controller
{
	public function index()
	{
		$stats_model = $this->model("stats_model");

		$slayer = $stats_model->getMostZombieKills();
		$headhunter = $stats_model->getMostHeadshots();
		$skills = $stats_model->getMostSurvivorKills();
		$bKills = $stats_model->getMostBanditKills();
		$lLife = $stats_model->getMostLife();
		$mDeath = $stats_model->getMostDeaths();
		$dist = $stats_model->getLongestFootDistance();

		$this->display('home\index',
			array(
				'page' => array(
					'name' => 'Argonath DayZ'
				),
				'ranks' => array(
					'slayer' => $slayer,
					'headHunter' => $headhunter,
					'serialKiller' => $skills,
					'banditHunter' => $bKills,
					'longestLife' => $lLife,
					'deadweight' => $mDeath,
					'olympic' => $dist
					)
			)
		);
	}
}
