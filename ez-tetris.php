<?php

    /*
    Plugin Name: EZ-Tetris
    Plugin URI: https://thewongalaxy.com
    Description: Game of tetris that can be embedded with shortcode.
    Version: 1.0
    Author: Won Rhim
    Author URI: https://thewongalaxy.com
    */

    include "includes/header.php";
    include "includes/body.php";
    include "includes/footer.php";


    function generate_html() {
        
        global $header;
        global $body;
        global $footer;

        echo $header;
        echo $body;
        echo $footer;

    }


    function cf_shortcode() {
        
        /* Turn on output buffering which we do via echo in generate_html() */
        ob_start();
        generate_html();

        /* ob_get_clean() is equivalent to calling bot ob_get_contents() and ob_end_clean() */
        return ob_get_clean();

    }


    add_shortcode('ez-tetris', 'cf_shortcode');

?>