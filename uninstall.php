<?php
/**
 * Uninstall procedure for CM Forge.
 *
 * Removes all plugin data when the plugin is uninstalled.
 *
 * @package CM_Forge
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

delete_option( 'cm_forge_options' );
