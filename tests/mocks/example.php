<?php
/**
 * Sample PHP file for CodeMirror Forge preview
 * 
 * @package CM_Forge
 */

namespace CM_Forge;

class Example_Class {
    
    private $property = 'value';
    protected $array = [1, 2, 3];
    public static $static_prop = 'static';
    
    /**
     * Constructor
     */
    public function __construct() {
        $this->init();
    }
    
    /**
     * Initialize the class
     */
    private function init() {
        if (isset($_GET['action'])) {
            $action = sanitize_text_field($_GET['action']);
            $this->handle_action($action);
        }
    }
    
    /**
     * Handle action
     * 
     * @param string $action Action to handle
     * @return bool
     */
    private function handle_action($action) {
        switch ($action) {
            case 'save':
                return $this->save_data();
            case 'delete':
                return $this->delete_data();
            default:
                return false;
        }
    }
    
    /**
     * Save data
     */
    private function save_data() {
        $data = [
            'name' => 'CodeMirror Forge',
            'version' => '1.0.0',
            'active' => true
        ];
        
        return update_option('cm_forge_data', $data);
    }
    
    /**
     * Delete data
     */
    private function delete_data() {
        return delete_option('cm_forge_data');
    }
}

