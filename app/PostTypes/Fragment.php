<?php

namespace App\PostTypes;

use App\PostTypes\PostType;

class Fragment extends PostType
{
  /**
   * The name of the post type.
   * @var string
   */
  protected $post_type = 'fragment';

  public function __construct()
  {
    parent::__construct();

    add_filter("manage_{$this->post_type}_posts_columns", [$this, 'fragment_posts_columns'], 10,);
    add_filter("manage_edit-{$this->post_type}_sortable_columns", [$this, 'fragment_sortable_columns'], 10, 1);
    add_action("manage_{$this->post_type}_posts_custom_column", [$this, 'fragment_sticky_column'], 10, 2);
  }

  /**
   * Show the column with sticky in it.
   * @param array $columns
   * @return array
   */
  public function fragment_posts_columns($columns)
  {
    unset($columns['tags']);
    $columns['sticky'] = __('Sticky', $this->text_domain);
    return $columns;
  }

  /**
   * Make the sticky column sortable
   * @param array $columns
   * @return array
   */
  public function fragment_sortable_columns($columns)
  {
    $columns['sticky'] = __('Sticky', $this->text_domain);
    return $columns;
  }

  /**
   * Get the sticky field from ACF and show Yes or No in the column.
   * @param mixed $column
   * @param int $post_id
   */
  public function fragment_sticky_column($column, $post_id)
  {
    switch ($column) {
      case 'sticky':
        if (function_exists('get_field')) {
          $sticky = get_field('fragment_sticky', $post_id);
          if ($sticky) {
            echo __('Yes', $this->text_domain);
          } else {
            echo __('No', $this->text_domain);
          }
        }
        break;
    }
  }

  /**
   * Returns an array of strings that represent taxonomies the post type should use.
   * @return string[]
   */
  public function taxonomies()
  {
    return [
      'category',
      'post_tag'
    ];
  }

  /**
   * Returns an array of functionalities the post type should support.
   * Available functionalities are: 
   * title, editor, thumbnail, comments, revisions, trackbacks, 
   * author, excerpt, page-attributes, custom-fields, post-formats
   * @return string[]
   */
  public function supports()
  {
    return [
      'title',
      'revision'
    ];
  }

  /**
   * Returns an array of translatable strings
   * @return string[]
   */
  public function labels()
  {
    return [
      'name'                  => _x('Fragments', 'Post Type General Name', $this->text_domain),
      'singular_name'         => _x('Fragment', 'Post Type Singular Name', $this->text_domain),
      'menu_name'             => __('Fragments', $this->text_domain),
      'name_admin_bar'        => __('Fragment', $this->text_domain),
      'archives'              => __('Fragment Archives', $this->text_domain),
      'attributes'            => __('Fragment Attributes', $this->text_domain),
      'parent_item_colon'     => __('Parent Fragment:', $this->text_domain),
      'all_items'             => __('All Fragments', $this->text_domain),
      'add_new_item'          => __('Add New Fragment', $this->text_domain),
      'add_new'               => __('Add New', $this->text_domain),
      'new_item'              => __('New Fragment', $this->text_domain),
      'edit_item'             => __('Edit Fragment', $this->text_domain),
      'update_item'           => __('Update Fragment', $this->text_domain),
      'view_item'             => __('View Fragment', $this->text_domain),
      'view_items'            => __('View Fragments', $this->text_domain),
      'search_items'          => __('Search Fragment', $this->text_domain),
      'not_found'             => __('Not found', $this->text_domain),
      'not_found_in_trash'    => __('Not found in Trash', $this->text_domain),
      'featured_image'        => __('Fragment Image', $this->text_domain),
      'set_featured_image'    => __('Set fragment image', $this->text_domain),
      'remove_featured_image' => __('Remove fragment image', $this->text_domain),
      'use_featured_image'    => __('Use as fragment image', $this->text_domain),
      'insert_into_item'      => __('Insert into fragment', $this->text_domain),
      'uploaded_to_this_item' => __('Uploaded to this fragment', $this->text_domain),
      'items_list'            => __('Fragments list', $this->text_domain),
      'items_list_navigation' => __('Fragments list navigation', $this->text_domain),
      'filter_items_list'     => __('Filter fragments list', $this->text_domain),
    ];
  }

  /**
   * Returns an array of arguments for the register_post_type function.
   * @param string[] $labels An array of translatable strings
   * @param string[] $supports An array of string of supported functionalities
   * @param string[] $taxonomies An array of taxonomy strings
   * @return mixed[]
   */
  public function args($labels, $supports, $taxonomies)
  {
    return [
      'label'                 => __('Fragments', $this->text_domain),
      'description'           => __('Small sound snippets', $this->text_domain),
      'labels'                => $labels,
      'supports'              => $supports,
      'taxonomies'            => $taxonomies,
      'hierarchical'          => false,
      'public'                => true,
      'show_ui'               => true,
      'show_in_menu'          => true,
      'menu_position'         => 5,
      'menu_icon'             => 'dashicons-megaphone',
      'show_in_admin_bar'     => true,
      'show_in_nav_menus'     => true,
      'show_in_rest'          => true,
      'can_export'            => true,
      'has_archive'           => false,
      'exclude_from_search'   => false,
      'publicly_queryable'    => true,
      'capability_type'       => 'page',
    ];
  }
}
