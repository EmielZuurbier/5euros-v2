<?php

namespace App\Controllers;

use Sober\Controller\Controller;

class FrontPage extends Controller
{
  public function data()
  {
    $categories = [];

    // Get all existing and filled terms.
    $terms = get_terms([
      'taxonomy'   => 'category',
      'hide_empty' => 'true'
    ]);

    // If there are terms
    if (!empty($terms)) {
      foreach ($terms as $term) {
        $fragments = [];

        $args = [
          'post_type'       => 'fragment',
          'post_status'     => 'publish',
          'posts_per_page'  => 8,
          'orderby'         => 'menu_order',
          'order'           => 'ASC',
          'category_name'   => $term->slug
        ];

        $query = new \WP_Query($args);
        if ($query->have_posts()) {
          while ($query->have_posts()) {
            $query->the_post();

            $fragments[] = [
              'title' => get_the_title()
            ];
          }
          wp_reset_postdata();
        }

        $categories[$term->name] = $fragments;
      }
    }

    return $categories;
  }
}
