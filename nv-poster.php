<?php
/**
 * NuVous Poster
 *
 * @wordpress-plugin
 * Plugin Name:       NV Poster
 * Plugin URI:        https://github.com/davidfuzju/nv-poster
 * Description:       Get product information and generate a poster, allowing users to save the image.
 * Version:           1.0.0
 * Author:            David FU <david.fu.zju@gmail.com>
 * Author URI:        https://github.com/davidfuzju
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       nv-poster
 */

// Load necessary scripts after all plugins are loaded
add_action('plugins_loaded', 'product_poster_initialize');

function product_poster_initialize() {
    if (function_exists('nv_get_referral_url')) {
        add_action('woocommerce_before_single_product', 'product_poster_enqueue_scripts');
    } else {
        error_log('nv_get_referral_url function not found.');
    }
}

// Enqueue necessary scripts and styles
function product_poster_enqueue_scripts() {
    global $product;
    $referral_url = nv_get_referral_url();
    wp_enqueue_script('html2canvas', 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', array('jquery'), null, true);
    wp_enqueue_script('qrcode', 'https://cdnjs.cloudflare.com/ajax/libs/jquery.qrcode/1.0/jquery.qrcode.min.js', array('jquery'), null, true);
    wp_enqueue_script('poster-generator', plugin_dir_url(__FILE__) . 'js/poster-generator.js', array('jquery', 'html2canvas', 'qrcode'), '1.0', true);
    wp_enqueue_style('poster-generator-style', plugin_dir_url(__FILE__) . 'css/style.css');
        
    // get current user
    $current_user = wp_get_current_user();

    // Pass product data and referral URL to JavaScript
    wp_localize_script('poster-generator', 'productData', array(
        'name' => $product->get_name(),
        'image' => wp_get_attachment_image_src($product->get_image_id(), 'full')[0],
        'referral_url' => $referral_url,
        'user_name' => $current_user->user_login
    ));
}
?>