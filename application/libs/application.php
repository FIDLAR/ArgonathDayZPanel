<?php

class tbf
{
	// Controller
	private $controller = null;

	// Model
	private $action = null;

	// Request
	private $request = null; # (REST; future)

	// Parameters
	private $par1 = null;
	private $par2 = null;
	private $par3 = null;

	public function __construct()
	{
		// Load URL data into above variables
		$this->processRequest();

		if (file_exists('./application/controller/' . $this->controller . '.php'))
		{
			// Load and initialize appropriate controller
			require './application/controller/' . $this->controller . '.php';
			$this->controller = new $this->controller();

			// Attempt to calls 'action'
			if (method_exists($this->controller, $this->action))
			{
				// Pass appropriate parameters
				if (isset($this->par3)) { $this->controller->{$this->action}($this->par1, $this->par2, $this->par3); }
				else if (isset($this->par2)) { $this->controller->{$this->action}($this->par1, $this->par2); }
				else if (isset($this->par1)) { $this->controller->{$this->action}($this->par1); }
				else { $this->controller->{$this->action}(); }
			}
			else { $this->controller->index(); }
		}
		else
		{
			// Home page OR unknown x)
			require './application/controller/home.php';
			$home = new Home();
			$home->index();
		}
	}

	private function processRequest()
	{
		if (isset($_GET['url']))
		{
			// Trim, Clean, Blow it up x)
			$url = rtrim($_GET['url'], '/');
			$url = filter_var($url, FILTER_SANITIZE_URL);
			$url = explode('/', $url);

			// Process into parameters
			$this->controller = (isset($url[0]) ? $url[0]:null);
			$this->action = (isset($url[1]) ? $url[1]:null);
			$this->par1 = (isset($url[2]) ? $url[2]:null);
			$this->par2 = (isset($url[3]) ? $url[3]:null);
			$this->par3 = (isset($url[4]) ? $url[4]:null);
		}

		if (isset($_SERVER['REQUST_METHOD']))
		{
			$this->request = $_SERVER['REQUST_METHOD'];
		}
	}
}
