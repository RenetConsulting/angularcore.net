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
	wp_register_style( 'core-captcha', plugins_url( 'CoreCaptcha/style.css' ) );
	wp_enqueue_style( 'core-captcha' );
}

$captcha_create_url = get_option('cf7sr_captcha_create_url');
$captcha_validate_url = get_option( 'cf7sr_captcha_validate_url' );


if (!empty($captcha_create_url) && !empty($captcha_validate_url) && !is_admin()) {
  function cf7sr_wpcf7_form_elements($form) {
    $form = do_shortcode($form);
    return $form;
  }
  add_filter('wpcf7_form_elements', 'cf7sr_wpcf7_form_elements');

  function cf7sr_shortcode($atts) {
    $arrContextOptions = array(
      'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => false,
      )
    ); 
  
    $captcha_response = file_get_contents(get_option('cf7sr_captcha_create_url'), false, stream_context_create($arrContextOptions));
    $captcha_data = json_decode($captcha_response, true);
    
    include('index.html');
    // Script
    $script .=
    '<script type="text/javascript">
      let sound = "' . $captcha_data['sound'] . '";

      document.head.insertAdjacentHTML("beforeend", `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">`);

      document.getElementById("captchaAudio").addEventListener("click", () => {
        const audio = new Audio(sound);
        audio.play();
      }, false);
      document.getElementById("captchaRefresh").addEventListener("click", async () => {
        window.setTimeout("this.disabled=true",0);

        const response = await fetch("' . get_option("cf7sr_captcha_create_url") . '");
        const data = await response.json();

        document.getElementById("captchaImage").src = data.image;
        document.getElementById("captchaInput").value = "";
        document.getElementById("captchaHash").value = data.hash;
        sound = data.sound;
      }, false);
    </script>';

    return $script;
  }
  add_shortcode('core-captcha', 'cf7sr_shortcode');

  function cf7sr_verify_recaptcha($result) {
    $captchaValue = isset( $_POST['captcha-input'] ) ? trim( $_POST['captcha-input'] ) : '';
    $hashValue = isset( $_POST['captcha-hash'] ) ? trim( $_POST['captcha-hash'] ) : '';
  
    $getData = http_build_query(
      array(
        'captcha' => $captchaValue,
        'hash' => $hashValue,
        'clientId' => get_option( 'cf7sr_client_id' )
      )
    );
    $opts = array(
      'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => false
      ),
      'http' => array('ignore_errors' => true)
    );
    
    try {
      $data = file_get_contents(get_option( 'cf7sr_captcha_validate_url' ) . '?' . $getData, false, stream_context_create($opts));
    } catch (RequestException $e) { }

    if (!$captchaValue || !$hashValue || strpos($http_response_header[0], '400') !== false) {
      ?>
      <script type="text/javascript">
        const tag = document.createElement('p');
        const text = document.createTextNode('Validation captcha error');

        tag.appendChild(text);

        setTimeout(() => {
          const element = document.getElementById('captchaErrorWrap');
          element.appendChild(tag);
        }, 1000);
      </script>
      <?php
      $result->invalidate(array('type' => 'captcha', 'name' => 'captcha-input'), 'Invalid captcha');
    }

    return $result;
  }
  add_filter('wpcf7_validate', 'cf7sr_verify_recaptcha', 20, 2);
}


//add captcha settings in admin panel
if (is_admin()) {
  function cf7sr_adminhtml() {
    if (!current_user_can('manage_options')) {
      wp_die(__('You do not have sufficient permissions to access this page.'));
    }
    if (! class_exists('WPCF7_Submission')) {
      echo '<p>To use <strong>Contact Form 7 Captcha</strong> please update <strong>Contact Form 7</strong> plugin as current version is not supported.</p>';
      return;
    }
    if (
      ! empty ($_POST['update'])
      && ! empty($_POST['cf7sr_nonce'])
      && wp_verify_nonce($_POST['cf7sr_nonce'],'cf7sr_update_settings' )
    ) {
      $cf7sr_captcha_create_url = ! empty ($_POST['cf7sr_captcha_create_url']) ? sanitize_text_field($_POST['cf7sr_captcha_create_url']) : '';
      update_option('cf7sr_captcha_create_url', $cf7sr_captcha_create_url);

      $cf7sr_captcha_validate_url = ! empty ($_POST['cf7sr_captcha_validate_url']) ? sanitize_text_field($_POST['cf7sr_captcha_validate_url']) : '';
      update_option('cf7sr_captcha_validate_url', $cf7sr_captcha_validate_url);

      $cf7sr_client_id = ! empty ($_POST['cf7sr_client_id']) ? sanitize_text_field($_POST['cf7sr_client_id']) : '';
      update_option('cf7sr_client_id', $cf7sr_client_id);

      $updated = 1;
    } else {
      $cf7sr_captcha_create_url = get_option('cf7sr_captcha_create_url');
      $cf7sr_captcha_validate_url = get_option('cf7sr_captcha_validate_url');
      $cf7sr_client_id = get_option('cf7sr_client_id');
    }

    include('settings.html');
  }

  function cf7sr_addmenu() {
    add_submenu_page (
      'options-general.php',
      'Core captcha',
      'Core captcha',
      'manage_options',
      'cf7sr_edit',
      'cf7sr_adminhtml'
    );
  }
  add_action('admin_menu', 'cf7sr_addmenu');
}
