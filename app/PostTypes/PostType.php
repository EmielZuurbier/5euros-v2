<?php

namespace App\PostTypes;

abstract class PostType
{
  /**
   * Name of the post type.
   */
  protected $post_type;

  /**
   * Text domain of the post type.
   */
  protected $text_domain = '5euros-soundboard';

  /**
   * Returns an array of strings that represent taxonomies the post type should use.
   * @return string[]
   */
  protected function taxonomies()
  {
    return [];
  }

  /**
   * Returns an array of functionalities the post type should support.
   * Available functionalities are: 
   * title, editor, thumbnail, comments, revisions, trackbacks, 
   * author, excerpt, page-attributes, custom-fields, post-formats
   * @return string[]
   */
  protected function supports()
  {
    return [
      'title',
      'editor',
      'thumbnail',
      'comments',
      'revisions',
      'trackbacks',
      'author',
      'excerpt',
      'page-attributes',
      'custom-fields',
      'post-formats'
    ];
  }

  /**
   * Returns an array of translatable strings
   * @return string[]
   */
  abstract protected function labels();

  /**
   * Returns an array of arguments for the register_post_type function.
   * @param string[] $labels An array of translatable strings
   * @param string[] $supports An array of string of supported functionalities
   * @param string[] $taxonomies An array of taxonomy strings
   * @return mixed[]
   */
  abstract protected function args($labels, $supports, $taxonomies);

  /**
   * Register post type on the init hook.
   * @link https://developer.wordpress.org/reference/hooks/init/
   */
  public function __construct()
  {
    add_action('init', [$this, 'register'], 0);
  }

  /**
   * Register the post type.
   * @return void
   */
  public function register()
  {
    $post_type = $this->post_type;

    if (!isset($post_type) || $post_type === '') {
      return new WP_Error('invalid_post_type_name', __('The given post_type name is not valid', $this->text_domain));
    }

    $labels = $this->labels();
    $supports = $this->supports();
    $taxonomies = $this->taxonomies();

    $args = $this->args(
      $labels,
      $supports,
      $taxonomies
    );

    register_post_type($post_type, $args);
  }
}
