<?php

namespace App\Gutenberg;

class Gutenberg
{
  /**
   * Text domain of the post type.
   */
  protected $text_domain = '5euros-soundboard';

  /**
   * Add after_setup_theme hook.
   */
  public function __construct()
  {
    add_action('after_setup_theme', [$this, 'add_theme_support']);
  }

  public function add_theme_support()
  {
    // Gutenberg align wide
    add_theme_support('align-wide');

    // Gutenberg custom colors
    add_theme_support('editor-color-palette', [
      [
        'name'      => __('White', $this->text_domain),
        'slug'      => 'white',
        'color'     => '#ffffff',
      ],
      [
        'name'      => __('Cod Gray', $this->text_domain),
        'slug'      => 'cod-gray',
        'color'     => '#111111',
      ],
      [
        'name'      => __('Dandelion', $this->text_domain),
        'slug'      => 'dandelion',
        'color'     => '#ffe065',
      ],
      [
        'name'      => __('Screaming Green', $this->text_domain),
        'slug'      => 'screaming-green',
        'color'     => '#65ff76',
      ],
      [
        'name'      => __('Heliothrope', $this->text_domain),
        'slug'      => 'heliothrope',
        'color'     => '#c865ff',
      ],
      [
        'name'      => __('Bittersweet', $this->text_domain),
        'slug'      => 'bittersweet',
        'color'     => '#ff6565',
      ],
      [
        'name'      => __('Aquamarine', $this->text_domain),
        'slug'      => 'aquamarine',
        'color'     => '#65f1ff',
      ],
    ]);

    /**
     * No custom gradients.
     */
    add_theme_support('disable-custom-gradients');

    /**
     * Add custom line heigt
     */
    add_theme_support('custom-line-height');

    /**
     * Support custom units.
     */
    add_theme_support(
      'custom-units',
      'rem',
      'em',
      'vw',
      'vh',
      'vmin',
      'vmax'
    );

    // Gutenberg editor styles
    add_theme_support('editor-styles');
    add_theme_support('dark-editor-style');

    // Gutenberg use default block styles
    add_theme_support('wp-block-styles');

    // Gutenberg use responsive embeds
    add_theme_support('responsive-embeds');
  }
}
