<?php

    /*
    Plugin Name: EZ-Tetris
    Plugin URI: https://thewongalaxy.com
    Description: Game of tetris that can be embedded with shortcode.
    Version: 1.0
    Author: Won Rhim
    Author URI: https://thewongalaxy.com
    */

    function generate_html() {
        echo '<p>';
        echo 'Hello World!<br />';
        echo '</p>';
    }

    function cf_shortcode() {
        ob_start();
        generate_html();

        /* ob_get_clean() is equivalent to calling bot ob_get_contents() and ob_end_clean() */
        return ob_get_clean();
    }

    add_shortcode('ez-tetris', 'cf_shortcode');

?>