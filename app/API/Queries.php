<?php

namespace App\API;

use WP_REST_Request;
use WP_REST_Response;

class Queries
{
  /**
   * Returns either a specific page or the front page
   * @param string $name
   * @return array
   */
  public function get_page($name)
  {
    /**
     * Search for a post with the given name.
     */
    $args = [
      'post_type'       => 'page',
      'post_status'     => 'publish',
      'posts_per_page'  => 1,
    ];

    /**
     * Search for either the name, or the front page.
     */
    if ($name) {
      $args['name'] = $name;
    } else {
      $args['p'] = get_option('page_on_front');
    }

    $query = new \WP_Query($args);
    if ($query->have_posts()) {
      while ($query->have_posts()) {
        $query->the_post();

        $response = [
          'title'     => get_the_title(),
          'link'      => get_the_permalink(),
          'excerpt'   => get_the_excerpt(),
          'content'   => get_the_content(),
        ];
      }

      wp_reset_postdata();
    }

    return $response;
  }

  /**
   * Return the data that have a sticky value.
   * @return array
   */
  public function get_sticky_data()
  {
    /**
     * Put all results in the response array.
     */
    $response = [];

    /**
     * 
     */
    $sticky = [
      'id'        => 0,
      'title'     => 'Uitgelicht',
      'items'     => [],
      'hasMore'   => false
    ];

    /**
     * Get all fragments with the sticky meta.
     */
    $args = [
      'post_type'       => 'fragment',
      'post_status'     => 'publish',
      'posts_per_page'  => -1,
      'orderby'         => 'menu_order',
      'order'           => 'ASC',
      'meta_query'       => [
        [
          'key'       => 'fragment_sticky',
          'value'     => 1,
          'compare'   => '='
        ]
      ]
    ];

    $query = new \WP_Query($args);
    if ($query->have_posts()) {
      while ($query->have_posts()) {
        $query->the_post();

        $fragment_id = get_the_id();
        $audio_file  = get_field('fragment_audio_file');
        $still       = get_field('fragment_still');

        $title = apply_filters('the_title', get_the_title());
        $title = html_entity_decode($title);

        /**
         * Only append items that have valid audio files.
         */
        if ($audio_file) {
          $sticky['items'][] = [
            'id'         => 'sticky-' . $fragment_id,
            'title'      => $title,
            'category'   => 0,
            'thumbnail'   => [
              '@1x'         => $still['sizes']['fragment-thumbnail@1x'],
              'alt'         => $still['alt']
            ],
            'audio'      => [
              'url'         => $audio_file['url'],
              'mimeType'    => $audio_file['mime_type']
            ]
          ];
        }
      }

      wp_reset_postdata();
    }

    $response[] = $sticky;
    return $response;
  }

  /**
   * Get all data divided in categories.
   * @return array
   */
  public function get_data()
  {
    /**
     * Put all results in the response array.
     */
    $response = [];

    // Get all existing and filled terms.
    $terms = get_terms([
      'taxonomy'   => 'category',
      'hide_empty' => 'true',
      'orderby'    => 'menu_order',
      'order'      => 'ASC'
    ]);

    // If there are terms
    if (!empty($terms)) {
      foreach ($terms as $term) {
        /**
         * The current category term id.
         * @var integer
         */
        $term_id = $term->term_id;

        /**
         * The current page to get.
         */
        $page = 1;

        /**
         * Collection of data for each category.
         */
        $data = [
          'id'        => $term_id,
          'title'     => $term->name,
          'items'     => [],
          'hasMore'   => false
        ];

        /**
         * Get all fragments with the current category.
         */
        $args = [
          'post_type'       => 'fragment',
          'post_status'     => 'publish',
          'posts_per_page'  => $this->amount_of_fragments_per_category,
          'page'            => $page,
          'orderby'         => 'menu_order',
          'order'           => 'ASC',
          'category_name'   => $term->slug
        ];

        $query = new \WP_Query($args);
        if ($query->have_posts()) {
          while ($query->have_posts()) {
            $query->the_post();

            $fragment_id = get_the_id();
            $audio_file  = get_field('fragment_audio_file');
            $still       = get_field('fragment_still');

            $title = apply_filters('the_title', get_the_title());
            $title = html_entity_decode($title);

            /**
             * Only append items that have valid audio files.
             */
            if ($audio_file) {
              $data['items'][] = [
                'id'         => $fragment_id,
                'title'      => $title,
                'category'   => $term_id,
                'thumbnail'   => [
                  '@1x'         => $still['sizes']['fragment-thumbnail@1x'],
                  'alt'         => $still['alt']
                ],
                'audio'      => [
                  'url'         => $audio_file['url'],
                  'mimeType'    => $audio_file['mime_type']
                ]
              ];
            }
          }

          wp_reset_postdata();
        }

        /**
         * Let the results know that there are more posts available.
         */
        if ($query->max_num_pages > $page) {
          $data['hasMore'] = true;
        }

        $response[] = $data;
      }
    }

    return $response;
  }

  /**
   * Search through fragments and only return the results.
   * @param WP_REST_Request $request
   * @return WP_REST_Response
   */
  public function search_data($query)
  {
    /**
     * Put all results in the response array.
     */
    $response = [];

    /**
     * Create initial container.
     */
    $found = [
      'id'        => 0, // These don't belong to a category, so we'll set it to 0.
      'title'     => $query,
      'items'     => [],
      'hasMore'   => false
    ];

    /**
     * Get all fragments with the based on the query.
     */
    $args = [
      'post_type'       => 'fragment',
      'post_status'     => 'publish',
      'posts_per_page'  => -1,
      'orderby'         => 'menu_order',
      'order'           => 'ASC',
      'tag'             => $query
    ];

    $query = new \WP_Query($args);
    if ($query->have_posts()) {
      while ($query->have_posts()) {
        $query->the_post();

        $fragment_id = get_the_id();

        $audio_file  = get_field('fragment_audio_file');
        $still       = get_field('fragment_still');

        $title = apply_filters('the_title', get_the_title());
        $title = html_entity_decode($title);

        /**
         * Only append items that have valid audio files.
         */
        if ($audio_file) {
          $found['items'][] = [
            'id'         => $fragment_id,
            'title'      => $title,
            'thumbnail'   => [
              '@1x'         => $still['sizes']['fragment-thumbnail@1x'],
              'alt'         => $still['alt']
            ],
            'audio'      => [
              'url'         => $audio_file['url'],
              'mimeType'    => $audio_file['mime_type']
            ]
          ];
        }
      }

      wp_reset_postdata();
    }

    $response[] = $found;
    return $response;
  }
}
