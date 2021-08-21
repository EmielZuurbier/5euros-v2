<?php

namespace App\Plugins;

class ACF
{
  public function __construct()
  {
    add_action('acf/init', [$this, 'init']);
  }

  public function init()
  {
    if (function_exists('acf_add_options_page')) {
      $this->add_options_page();
    }

    if (function_exists('acf_add_local_field_group')) {
      // $this->add_local_field_group();
    }
  }

  public function add_options_page()
  {
    acf_add_options_page([
      'page_title'  => 'Theme settings',
      'menu_title'  => 'Theme Settings',
      'menu_slug'   => 'theme-settings',
      'capability'  => 'edit_posts',
      'redirect'    => false
    ]);
  }

  public function add_local_field_group()
  {
    acf_add_local_field_group(array(
      'key' => 'group_5cd6f6a72bb6b',
      'title' => 'Bestanden',
      'fields' => array(
        array(
          'key' => 'field_5cd6f6b140b23',
          'label' => 'Upload audio bestand',
          'name' => 'fragment_audio_file',
          'type' => 'file',
          'instructions' => 'Upload hier een bestand.',
          'required' => 0,
          'conditional_logic' => 0,
          'wrapper' => array(
            'width' => '100',
            'class' => '',
            'id' => '',
          ),
          'return_format' => 'array',
          'library' => 'all',
          'min_size' => '',
          'max_size' => '',
          'mime_types' => '',
        ),
      ),
      'location' => array(
        array(
          array(
            'param' => 'post_type',
            'operator' => '==',
            'value' => 'fragment',
          ),
        ),
      ),
      'menu_order' => 15,
      'position' => 'acf_after_title',
      'style' => 'default',
      'label_placement' => 'top',
      'instruction_placement' => 'label',
      'hide_on_screen' => '',
      'active' => true,
      'description' => '',
    ));

    acf_add_local_field_group(array(
      'key' => 'group_5cd6f75b8d816',
      'title' => 'Beschrijving',
      'fields' => array(
        array(
          'key' => 'field_5cd6f7b7e6c82',
          'label' => 'Titel',
          'name' => 'fragment_title',
          'type' => 'text',
          'instructions' => 'Vul hier een titel in die aan de voorkant wordt vertoond.',
          'required' => 0,
          'conditional_logic' => 0,
          'wrapper' => array(
            'width' => '100',
            'class' => '',
            'id' => '',
          ),
          'default_value' => '',
          'placeholder' => '',
          'prepend' => '',
          'append' => '',
          'maxlength' => '',
        ),
        array(
          'key' => 'field_5cd6f7655be51',
          'label' => 'Vul hier een beschrijving in.',
          'name' => 'fragment_description',
          'type' => 'textarea',
          'instructions' => '',
          'required' => 0,
          'conditional_logic' => 0,
          'wrapper' => array(
            'width' => '100',
            'class' => '',
            'id' => '',
          ),
          'default_value' => '',
          'placeholder' => '',
          'maxlength' => '',
          'rows' => 4,
          'new_lines' => '',
        ),
      ),
      'location' => array(
        array(
          array(
            'param' => 'post_type',
            'operator' => '==',
            'value' => 'fragment',
          ),
        ),
      ),
      'menu_order' => 25,
      'position' => 'acf_after_title',
      'style' => 'default',
      'label_placement' => 'top',
      'instruction_placement' => 'label',
      'hide_on_screen' => '',
      'active' => false,
      'description' => '',
    ));
  }
}
