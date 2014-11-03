<?php

session_start();

// Composer Engine
require 'vendor/autoload.php';

// Application Configuration
require 'application/config/config.php';

// Application Bootstraper
require 'application/libs/application.php';
require 'application/libs/controller.php';

// Start Application
$tbf = new tbf();

// Exit Application
exit();
?>