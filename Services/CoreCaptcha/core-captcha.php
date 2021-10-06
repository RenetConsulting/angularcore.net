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
	wp_register_style( 'core-captcha', plugins_url( 'core-captcha/style.css' ) );
	wp_enqueue_style( 'core-captcha' );
}

$cf7sr_captcha_create_url = get_option('cf7sr_captcha_create_url');
$cf7sr_captcha_validate_url = get_option( 'cf7sr_captcha_validate_url' );
if (!empty($cf7sr_captcha_create_url) && !empty($cf7sr_captcha_validate_url) && !is_admin()) {
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
  
    $data = file_get_contents(get_option('cf7sr_captcha_create_url'), false, stream_context_create($arrContextOptions));
    $captcha_data = json_decode($data, true);
    

    // Structure
    $res =
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

    <input id="captchaInput" type="text" name="captcha-input" style="margin-bottom: 1rem;" />
    <input id="captchaHash" type="text" name="captcha-hash" style="display: none;" value='. $captcha_data['hash'] .' />

    <div id="captchaErrorWrap"></div>';

    // Script
    $res .=
    '<script type="text/javascript">
      let sound = "' . $captcha_data['sound'] . '";

      document.head.insertAdjacentHTML("beforeend", `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">`);

      document.getElementById("captchaAudio").addEventListener("click", () => {
        const audio = new Audio(sound);
        audio.play();
      }, false);
      document.getElementById("captchaRefresh").addEventListener("click", async () => {
        window.setTimeout("this.disabled=true",0);

        const response = await fetch("https://localhost:44301/api/CaptchaCreate");
        const data = await response.json();

        document.getElementById("captchaImage").src = data.image;
        document.getElementById("captchaInput").value = "";
        document.getElementById("captchaHash").value = data.hash;
        sound = data.sound;
      }, false);
    </script>';

    return $res;
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
    
    $data = file_get_contents(get_option( 'cf7sr_captcha_validate_url' ) . '?' . $getData, false, stream_context_create($opts));

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
    ?>
    <div class="cf7sr-wrap" style="font-size: 15px; background: #fff; border: 1px solid #e5e5e5; margin-top: 20px; padding: 20px; margin-right: 20px;">
      <h2>
        Captcha Settings
      </h2>
      This plugin implements anti spam captcha.<br><br>
      To add Core Captcha to CF7 form, add <strong>[core-captcha]</strong> in your form ( preferable above submit button )<br>
      <form action="<?php echo $_SERVER['REQUEST_URI']; ?>" method="POST">
        <input type="hidden" value="1" name="update">
        <?php wp_nonce_field( 'cf7sr_update_settings', 'cf7sr_nonce' ); ?>
        <ul>
          <li><input type="text" style="width: 370px;" value="<?php echo esc_attr($cf7sr_captcha_create_url); ?>" name="cf7sr_captcha_create_url"> Captcha create url</li>
          <li><input type="text" style="width: 370px;" value="<?php echo esc_attr($cf7sr_captcha_validate_url); ?>" name="cf7sr_captcha_validate_url"> Captcha validate url</li>
          <li><input type="text" style="width: 370px;" value="<?php echo esc_attr($cf7sr_client_id); ?>" name="cf7sr_client_id"> Client id</li>
        </ul>
        <input type="submit" class="button-primary" value="Save Settings">
      </form><br>
      <?php if (!empty($updated)): ?>
        <p>Settings were updated successfully!</p>
      <?php endif; ?>
    </div>
    <?php
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
