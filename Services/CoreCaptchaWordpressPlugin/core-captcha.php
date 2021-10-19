<?php
/**
 * Plugin Name:       Core captcha
 * Plugin URI:        https://github.com/RenetConsulting/angularcore.net
 * Description:       Add a simple text captcha to contact form 7
 * Version:           1.0
 * Author:            Renet Consulting, Inc.
 * Author URI:        https://www.renetusa.com
 * License:           GNU General Public License v2
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       core-captcha
*/

//register styles
add_action( 'wp_enqueue_scripts', 'register_plugin_styles' );
//register the stylesheet and add it to the queue
function register_plugin_styles() {
	wp_register_style( 'core-captcha', plugins_url( 'CoreCaptchaWordpressPlugin/style.css' ) );
	wp_enqueue_style( 'core-captcha' );
}

$captcha_create_url = get_option('core_captcha_create_url');
$captcha_validate_url = get_option( 'core_captcha_validate_url' );


if (!empty($captcha_create_url) && !empty($captcha_validate_url) && !is_admin()) {
  function core_captcha_wpcf7_form_elements($form) {
    $form = do_shortcode($form);
    return $form;
  }
  add_filter('wpcf7_form_elements', 'core_captcha_wpcf7_form_elements');

  function core_captcha_shortcode($atts) {
    $requestOptions = stream_context_create(array(
      'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => false
      )
    ));
  
    $captcha_response = file_get_contents(get_option('core_captcha_create_url'), false, $requestOptions);
    $captcha_data = json_decode($captcha_response, true);
    
    $content =
    '<div class="captcha-container">
      <img id="captchaImage" class="captcha-image" src='. $captcha_data['image'] .'>
      <div class="captcha-button-container">
        <button id="captchaRefresh" class="captcha-button" type="button">
          <svg width="20px" height="20px" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M256.455 8c66.269.119 126.437 26.233 170.859 68.685l35.715-35.715C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.75c-30.864-28.899-70.801-44.907-113.23-45.273-92.398-.798-170.283 73.977-169.484 169.442C88.764 348.009 162.184 424 256 424c41.127 0 79.997-14.678 110.629-41.556 4.743-4.161 11.906-3.908 16.368.553l39.662 39.662c4.872 4.872 4.631 12.815-.482 17.433C378.202 479.813 319.926 504 256 504 119.034 504 8.001 392.967 8 256.002 7.999 119.193 119.646 7.755 256.455 8z" class=""></path></svg>
        </button>
        <button id="captchaAudio" class="captcha-button" type="button">
          <svg width="20px" height="20px" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M256 32C114.52 32 0 146.496 0 288v48a32 32 0 0 0 17.689 28.622l14.383 7.191C34.083 431.903 83.421 480 144 480h24c13.255 0 24-10.745 24-24V280c0-13.255-10.745-24-24-24h-24c-31.342 0-59.671 12.879-80 33.627V288c0-105.869 86.131-192 192-192s192 86.131 192 192v1.627C427.671 268.879 399.342 256 368 256h-24c-13.255 0-24 10.745-24 24v176c0 13.255 10.745 24 24 24h24c60.579 0 109.917-48.098 111.928-108.187l14.382-7.191A32 32 0 0 0 512 336v-48c0-141.479-114.496-256-256-256z" class=""></path></svg>
        </button>
      </div>
    </div>

    <span class="wpcf7-form-control-wrap captcha-input">
      <input id="captchaInput" class="wpcf7-form-control" type="text" name="captcha-input" style="margin-bottom: 1rem;" />
    </span>

    <input id="captchaHash" type="text" name="captcha-hash" style="display: none;" value='. $captcha_data['hash'] .' />';

    // Script
    $content .=
    '<script type="text/javascript">
      let sound = "' . $captcha_data['sound'] . '";

      document.head.insertAdjacentHTML("beforeend", `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">`);

      document.getElementById("captchaAudio").addEventListener("click", () => {
        const audio = new Audio(sound);
        audio.play();
      }, false);
      document.getElementById("captchaRefresh").addEventListener("click", async () => {
        window.setTimeout("this.disabled=true",0);

        const response = await fetch("' . get_option("core_captcha_create_url") . '");
        const data = await response.json();

        document.getElementById("captchaImage").src = data.image;
        document.getElementById("captchaInput").value = "";
        document.getElementById("captchaHash").value = data.hash;
        sound = data.sound;
      }, false);
    </script>';

    return $content;
  }
  add_shortcode('core-captcha', 'core_captcha_shortcode');

  function core_captcha_verify($result) {
    $captchaValue = isset( $_POST['captcha-input'] ) ? trim( $_POST['captcha-input'] ) : '';
    $hashValue = isset( $_POST['captcha-hash'] ) ? trim( $_POST['captcha-hash'] ) : '';
  
    $params = http_build_query(
      array(
        'captcha' => $captchaValue,
        'hash' => $hashValue,
        'clientId' => get_option( 'core_captcha_client_id' )
      )
    );
    $requestOptions = stream_context_create(array(
      'http' => array('ignore_errors' => true),
      'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => false
      )
    ));

    file_get_contents(get_option( 'core_captcha_validate_url' ) . '?' . $params, false, $requestOptions);

    if (!$captchaValue || !$hashValue || strpos($http_response_header[0], '400') !== false) {
      $result -> invalidate(array('type' => 'captcha', 'name' => 'captcha-input'), 'Invalid captcha');
    }

    return $result;
  }
  add_filter('wpcf7_validate', 'core_captcha_verify', 20, 2);
}


//add captcha settings in admin panel
if (is_admin()) {
  function core_captcha_adminhtml() {
    if (!current_user_can('manage_options')) {
      wp_die(__('You do not have sufficient permissions to access this page.'));
    }
    if (! class_exists('WPCF7_Submission')) {
      echo '<p>To use <strong>Contact Form 7 Captcha</strong> please update <strong>Contact Form 7</strong> plugin as current version is not supported.</p>';
      return;
    }
    if (
      ! empty ($_POST['update'])
      && ! empty($_POST['core_captcha_nonce'])
      && wp_verify_nonce($_POST['core_captcha_nonce'],'core_captcha_update_settings' )
    ) {
      $core_captcha_create_url = ! empty ($_POST['core_captcha_create_url']) ? sanitize_text_field($_POST['core_captcha_create_url']) : '';
      update_option('core_captcha_create_url', $core_captcha_create_url);

      $core_captcha_validate_url = ! empty ($_POST['core_captcha_validate_url']) ? sanitize_text_field($_POST['core_captcha_validate_url']) : '';
      update_option('core_captcha_validate_url', $core_captcha_validate_url);

      $core_captcha_client_id = ! empty ($_POST['core_captcha_client_id']) ? sanitize_text_field($_POST['core_captcha_client_id']) : '';
      update_option('core_captcha_client_id', $core_captcha_client_id);

      $updated = 1;
    } else {
      $core_captcha_create_url = get_option('core_captcha_create_url');
      $core_captcha_validate_url = get_option('core_captcha_validate_url');
      $core_captcha_client_id = get_option('core_captcha_client_id');
    }

    include('settings.html');
  }

  function core_captcha_addmenu() {
    add_submenu_page (
      'options-general.php',
      'Core captcha',
      'Core captcha',
      'manage_options',
      'core_captcha_edit',
      'core_captcha_adminhtml'
    );
  }
  add_action('admin_menu', 'core_captcha_addmenu');
}
