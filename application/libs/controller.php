<?php
use Monolog\Logger;
use Monolog\ErrorHandler;
use Monolog\Handler\StreamHandler;

class Controller
{
	public $dbh;
	public $log;

	public function __construct()
	{
		$this->log = new Logger('application');
		if (USE_DEBUGGING)
			$this->log->pushHandler(new StreamHandler('logs/application.log', Logger::DEBUG));
		else
			$this->log->pushHandler(new StreamHandler('logs/application.log', Logger::ERROR));

		ErrorHandler::register($this->log);

		if (USE_DATABASE)
		{
			$this->databaseConnect();
		}
	}

	private function databaseConnect()
	{
		try
		{
			$opts = array(PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, PDO::ATTR_ERRMODE => PDO:: ERRMODE_WARNING);
			switch (DB_DRIVER)
			{
				case 'MySQL':
					$this->dbh = new PDO('mysql:host=' . DB_HOST . ';port= ' . DB_PORT . ';dbname=' . DB_NAME, DB_USER, DB_PASSW, $opts);
					break;
				case 'SQLite':
					$this->dbh = new PDO('sqlite:' . DB_PATH);
					break;
				default:
					throw new PDOException('Unsupported database driver');
			}
		}
		catch(PDOException $e)
		{
			$this->log->addError('Database Connection Error: ' . $e->getMessage(), array('driver'=>DB_DRIVER));
			exit ('<h2>Cannot establish connection to database!</h2>');
		}
	}

	/**
	 * Load and return a model
	 * @param  string $name
	 * @return object Model
	 */
	public function model($name)
	{
		require 'application/models/' . strtolower($name) . '.php';
		return new $name($this->dbh, $this->log);
	}

	/**
	 * Render a Twig View
	 * @param  String $view
	 * @param  array  $data
	 * @return null
	 */
	public function display($view, $data = array())
	{
		$twig_loader = new Twig_Loader_Filesystem('application/views/');
		$twig = new Twig_Environment($twig_loader);

		echo $twig->render($view . '.twig', $data);
	}
}
