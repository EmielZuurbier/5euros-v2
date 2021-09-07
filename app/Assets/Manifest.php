<?php

namespace App\Assets;

/**
 * Adds an App Manifest to the head tag.
 */
class Manifest
{
  public function __construct()
  {
    add_action('wp_head', [$this, 'init'], 10);
  }

  public function init()
  {
    $manifest_path = \App\resources_assets_path('manifest.json');
    echo '<link rel="manifest" href="' . $manifest_path . '">';
  }
}
