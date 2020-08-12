<?php

if (!defined('ABSPATH')) {
    exit;
}


include "includes/body.php";


function et_add_scripts() {
    // CSS
    wp_enqueue_style('museo-moderno-font', 'https://fonts.googleapis.com/css2?family=MuseoModerno&display=swap');
    wp_enqueue_style('indie-flower-font', 'https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap');
    wp_enqueue_style('ez-tetris-style', plugins_url() . '/ez-tetris/assets/css/ez-tetris-style.css');

    // JS
    wp_enqueue_script('ez-tetris-script', plugins_url() . '/ez-tetris/assets/js/ez-tetris-main.js');
}

add_action('wp_enqueue_scripts', 'et_add_scripts');


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

add_shortcode('ez_tetris', 'cf_shortcode');

?>
