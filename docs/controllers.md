##Controllers

Sample Controller

```php
<?php
    class my_controller extends Controller
    {
        /** 
         * This is essentially:
         * http://www.example.com/my_controller/index 
         * However;
         * http://www.example.com/my_controller/ 
         * will also load the index()
         */
        public function index()
        {
            $this->display('my_controller\index');
        }
        
        /**
         * If you want:
         * http://www.example.com/my_controller/pages
         * You would simply make it a function as follows
         */
        public function pages()
        {
            $page_model = $this->model('model_page');
            $pages = $page_model->getPages();
            $this->display('my_controller\page', array('pages'=>$pages));
        }
    }
?>
```