<?php

class search extends Controller
{

	public function index()
	{
		$name = $_GET['input_name'];
		$search_model = $this->model("search_model");

		$results = $search_model->findPlayerName($name);

		if ($results['count'] == 0)
		{
			$this->display('search\noresults', array(
				'page' => array(
					'name'=> 'Search Results'
					),
				'find' => $name
				)
			);
		}
		else if ($results['count'] == 1)
		{
			Header("Location: " . BASE_URL . "view/uid/" . $results['name']);
		}
		else
		{
			$this->display('search\results', array(
				'page' => array(
					'name' => 'Search Results'
					),
				'results' => $results['name']
				)
			);
		}
	}

}

?>