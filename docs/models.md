##Using Models

Loading a model from a Controller
```php
$this->model("model_name");
```

Sample Model
```php
<?php
    class model_name
    {
        private $dbh;
        private $log;
        
        public function __construct($dbh, $log)
        {
            $this->dbh = $dbh;
            $this->log = $log;
        }
        
        /**
         * Your functions go here
         */
    }
?>
```

**Remember:** the model class name should be the same as they filename (e.g model_name.php)