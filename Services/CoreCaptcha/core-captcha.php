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

add_action('wpcf7_init', 'custom_add_form_tag_captcha');
 
function custom_add_form_tag_captcha() {
  wpcf7_add_form_tag('core_captcha', 'core_captcha_form_tag_handler');
}

function core_captcha_form_tag_handler($tag) {
  $validation_error = wpcf7_get_validation_error( $tag->name );

	$class = wpcf7_form_controls_class( $tag->type );

	if ( $validation_error ) {
		$class .= ' wpcf7-not-valid';
	}

  $atts = array();

	$atts['size'] = $tag->get_size_option( '40' );
	$atts['maxlength'] = $tag->get_maxlength_option();
	$atts['minlength'] = $tag->get_minlength_option();

	if ( $atts['maxlength'] and $atts['minlength']
	and $atts['maxlength'] < $atts['minlength'] ) {
		unset( $atts['maxlength'], $atts['minlength'] );
	}

	$atts['class'] = $tag->get_class_option( $class );
	$atts['id'] = $tag->get_id_option();
	$atts['tabindex'] = $tag->get_option( 'tabindex', 'signed_int', true );
	$atts['autocomplete'] = 'off';

	if ( $validation_error ) {
		$atts['aria-invalid'] = 'true';
		$atts['aria-describedby'] = wpcf7_get_validation_error_reference(
			$tag->name
		);
	} else {
		$atts['aria-invalid'] = 'false';
	}

  $arrContextOptions = array(
    'ssl' => array(
      'verify_peer' => false,
      'verify_peer_name' => false,
    )
  ); 

  $data = file_get_contents('https://localhost:44301/api/CaptchaCreate', false, stream_context_create($arrContextOptions));
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
  <input id="captchaHash" type="text" name="captcha-hash" style="display: none;" value='. $captcha_data['hash'] .' />';

  // Script
  $res .=
  '<script type="text/javascript">
    let sound = "' . $captcha_data['sound'] . '";

    document.head.insertAdjacentHTML("beforeend", `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">`);

    document.getElementById("captchaAudio").addEventListener("click", () => {
      var e=this;setTimeout(function(){e.disabled=true;},0);

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

  return sprintf($res, sanitize_html_class( $tag->name ), $atts, $validation_error);
}

add_filter( 'wpcf7_messages', 'wpcf7_core_captcha_messages', 10, 1 );

function wpcf7_core_captcha_messages( $messages ) {
	$messages = array_merge( $messages, array(
		'captcha_not_match' => array(
			'description' =>
				__( "The code that sender entered does not match the CAPTCHA", 'contact-form-7' ),
			'default' =>
				__( 'Your entered code is incorrect.', 'contact-form-7' ),
		),
	) );

	return $messages;
}

// add_filter('wpcf7_core_captcha_validation', 'wpcf7_core_captcha_validation', 10, 3);
add_filter('wpcf7_special_mail_tags', 'wpcf7_core_captcha_validation', 10, 3);

function wpcf7_core_captcha_validation($result, $tag) {
  $captchaValue = isset( $_POST['captcha-input'] ) ? trim( $_POST['captcha-input'] ) : '';
  $hashValue = isset( $_POST['captcha-hash'] ) ? trim( $_POST['captcha-hash'] ) : '';

  $getData = http_build_query(
    array(
      'captcha' => $captchaValue,
      'hash' => $hashValue,
      'clientId' => '12345'
    )
  );
  $opts = array(
    'ssl' => array(
      'verify_peer' => false,
      'verify_peer_name' => false
    )
  ); 

  $data = file_get_contents('https://localhost:44301/api/CaptchaValidate?'.$getData, false, stream_context_create($opts));

  // if (!$captchaValue || !$hashValue || strpos($http_response_header[0], '400') !== false) {
    $result->invalidate( $tag, "Are you sure this is the correct address?" );
  // }
  
  return $result;
}
