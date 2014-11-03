<?php

// You'll want to turn debugging off when on production
define('USE_DEBUGGING', true);

define ('BASE_URL', 'http://localhost/dayz'); // production note: rename to BASE_URL

define ('USE_DATABASE', true);
define ('DB_DRIVER', 'MySQL'); // Options: MySQL, SQlite, PgSQL

/* MySQL Database Details */
if (DB_DRIVER == "MySQL")
{
	define ('DB_HOST', '127.0.0.1');
	define ('DB_PORT', 3306);
	define ('DB_NAME', '');
	define ('DB_USER', '');
	define ('DB_PASSW', '');
}

/* SQLite Database Details */
else if (DB_DRIVER == "SQLite")
{
	define ('DB_PATH', 'database/db.sdb'); // Do not include "sqlite:"
}

/* PostgreSQL Database Details */
else if (DB_DRIVER == "PgSQL")
{
	define ('DB_HOST', '127.0.0.1');
	define ('DB_NAME', 'db');
	define ('DB_USER', 'root');
	define ('DB_PASSW', '');
}

/* Site Details */
define ('SITE_NAME', 'Argonath DayZ Panel');
define ('SITE_COPYRIGHT', '&copy; Copyright 2014 ArgonathRPG. Some rights reserved. Open Source on <a href="https://github.com/derekmartinez18/ArgonathDayZPanel">GitHub</a>.');

/* 

	Do not edit bellow this line
	Unless you are a monkey
	cause monkeys are smart

	 */

if (USE_DEBUGGING) 
{
	error_reporting (E_ALL);
	ini_set ("display_errors", 1);
}