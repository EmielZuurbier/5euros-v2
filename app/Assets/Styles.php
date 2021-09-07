<?php

namespace App\Assets;

class Styles
{
  /**
   * Add after_setup_theme hook.
   */
  public function __construct()
  {
    add_action('after_setup_theme', [$this, 'init'], 10);
  }

  /**
   * Add filters and actions.
   * @link https://developer.wordpress.org/reference/hooks/after_setup_theme/
   */
  public function init()
  {
    add_filter('style_loader_tag', [$this, 'lazy_styles'], 10, 4);
    add_action('wp_head', [$this, 'preload_styles'], 1);
    add_action('wp_enqueue_scripts', [$this, 'dequeue'], 10);
    add_action('wp_enqueue_scripts', [$this, 'enqueue'], 10);
  }

  /**
   * Returns nested arrays of data that will be used when enqueueing the styles.
   * @return array[]
   */
  public function styles()
  {
    return [
      [
        'handle'        => 'app',
        'src'           => \App\asset_path('styles/app.css'),
        'dependencies'  => [],
        'version'       => false,
        'media'         => 'all',
        'preload'       => true,
        'lazy'          => false
      ]
    ];
  }

  /**
   * Dequeues styles that shouldn't be included.
   */
  public function dequeue()
  {
    $styles = [
      'wp-block-library'
    ];

    foreach ($styles as $style) {
      wp_deregister_style($style);
    }
  }

  /**
   * Enqueues styles based on the data in the styles array.
   */
  public function enqueue()
  {
    $styles = $this->styles();

    foreach ($styles as $style) {
      [
        'handle'       => $handle,
        'src'          => $src,
        'dependencies' => $dependencies,
        'version'      => $version,
        'media'        => $media
      ] = $style;

      wp_register_style(
        $handle,
        $src,
        $dependencies,
        $version,
        $media
      );

      wp_enqueue_style($handle);
    }
  }

  /**
   * Adds a preload tag before the stylesheet tag.
   * @return string
   */
  public function preload_styles()
  {
    $styles = $this->styles();

    if (!is_admin()) {
      foreach ($styles as $style) {
        if (isset($style['preload']) && $style['preload'] === true) {
          echo '<link rel="preload" href="' . $style['src'] . '" as="style">';
        }
      }
    }
  }

  /**
   * Modifies the link html to incorporate a lazy-loading tactic.
   * @param string $html
   * @param string $handle
   * @param string $href
   * @param string $media
   * @return string
   */
  public function lazy_styles($html, $handle, $href, $media)
  {
    $handles = $this->get_handles_with('lazy', true);

    if (!is_admin() && in_array($handle, $handles)) {
      return "<link id='$handle-css' href='$href' rel='stylesheet' media='print' onload='this.media=\"$media\"'>";
    }

    return $html;
  }

  /**
   * Returns an array of handles based on the styles.
   * @param string $property
   * @param string $value
   * @return string[]
   */
  private function get_handles_with($property, $value)
  {
    $styles = $this->styles();

    $filtered_styles = array_filter($styles, function ($style) use ($property, $value) {
      return isset($style[$property]) && $style[$property] === $value;
    });

    return array_map(function ($style) {
      return $style['handle'];
    }, $filtered_styles);
  }
}
