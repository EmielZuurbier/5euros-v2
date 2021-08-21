<?php

namespace App\Rest;

use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

class FragmentRest
{
  private $sticky_transient_key = 'sticky';
  private $fragments_transient_key = 'fragments';

  protected $vendor = '5euros';
  protected $api_version = 'v1';

  /**
   * The amount of fragments every category should show.
   * @var integer
   */
  private $amount_of_fragments_per_category = -1;

  /**
   * Register the routes on the rest_api_init hook.
   */
  public function __construct()
  {
    add_action('rest_api_init', [$this, 'register_routes'], 10);
  }

  /**
   * Returns the vendor and api version combined separated by a forward slash.
   * @return string
   */
  private function namespace()
  {
    return $this->vendor . '/' . $this->api_version;
  }

  /**
   * Returns a nested array of routes.
   * @return array[]
   */
  public function routes()
  {
    return [
      [
        'route' => 'page/(?:/(?P<name>\D+))?',
        'args'  => [
          'method'              => WP_REST_Server::READABLE,
          'callback'            => [$this, 'get_page'],
          'permission_callback' => '__return_true',
          'args'                => [
            'name'                => [
              'validate_callback'   => function ($param, $request, $key) {
                return true;
              }
            ]
          ]
        ]
      ],
      [
        'route' => 'data',
        'args'  => [
          'methods'             => WP_REST_Server::READABLE,
          'callback'            => [$this, 'get_data'],
          'permission_callback' => [$this, 'verify_nonce']
        ],
      ],
      [
        'route' => 'search/(?P<query>\D+)',
        'args'  => [
          'methods'             => WP_REST_Server::READABLE,
          'args'                => [
            'query'               => [
              'required'            => true,
              'validate_callback'   => function ($param, $request, $key) {
                return true;
              }
            ]
          ],
          'callback'            => [$this, 'search_data'],
          'permission_callback' => [$this, 'verify_nonce']
        ]
      ]
    ];
  }

  /**
   * Only allow requests that come directly from the page.
   * @param WP_REST_Request $request
   * @return bool
   */
  public function verify_nonce(WP_REST_Request $request)
  {
    $nonce = $request->get_header('x-wp-nonce');
    $nonce_verification = wp_verify_nonce($nonce, 'wp_rest');

    if ($nonce_verification === 1 || $nonce_verification === 2) {
      return true;
    }

    return false;
  }

  /**
   * Loops over the routes array and registers each rout.
   */
  public function register_routes()
  {
    $namespace = $this->namespace();
    $routes = $this->routes();

    foreach ($routes as [
      'route' => $route,
      'args'  => $args
    ]) {
      register_rest_route(
        $namespace,
        $route,
        $args
      );
    }
  }

  public function get_route(WP_REST_Request $request)
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
     * Get the name that is requested
     */
    $name = $request->get_param('name');

    /**
     * Search for either the name, or the front page.
     */
    if ($name) {
      $args['name'] = $name;
    } else {
      $args['p'] = get_option('page_on_front');
    }

    $query = new WP_Query($args);
    if ($query->have_posts()) {
      while ($query->have_posts()) {
        $query->the_post();

        $response = [
          'title'     => get_the_title(),
          'link'      => get_the_permalink(),
          'excerpt'   => get_the_excerpt(),
          'content'   => get_the_content(),
        ];

        return new WP_REST_Response($response);
      }

      wp_reset_postdata();
    }
  }

  /**
   * Return the data that have a sticky value.
   * @return array
   */
  public function sticky_data()
  {
    /**
     * First check the cache.
     */
    $sticky = get_transient($this->sticky_transient_key);
    if ($sticky) {
      return $sticky;
    }

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
            'categoryId' => 0,
            'thumbnail'   => [
              '@1x'         => $still['sizes']['fragment-thumbnail@1x'],
              '@2x'         => $still['sizes']['fragment-thumbnail@2x'],
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

    set_transient($this->sticky_transient_key, $sticky);
    return $sticky;
  }

  /**
   * Get all data divided in categories.
   * @param WP_REST_Request $request
   * @return WP_REST_Response
   */
  public function get_data(WP_REST_Request $request)
  {
    /**
     * Check if there is a cache store response.
     */
    $response = get_transient($this->fragments_transient_key);
    if ($response) {
      return new WP_REST_Response($response);
    }

    /**
     * Otherwise create a new one.
     */
    $response = [];

    /** 
     * Add the sticky data first.
     */
    $response[] = $this->sticky_data();

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
         * Get the category thumbnail for each category.
         * @var array
         */
        // $category_thumbnail = get_field('category_thumbnail', $term);

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
          // 'thumbnail' => [
          //   '@1x'       => $category_thumbnail['sizes']['fragment-thumbnail@1x'],
          //   // '@2x'       => $category_thumbnail['sizes']['fragment-thumbnail@2x'],
          //   'alt'       => $category_thumbnail['alt']
          // ],
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
                'categoryId' => $term_id,
                'thumbnail'   => [
                  '@1x'         => $still['sizes']['fragment-thumbnail@1x'],
                  // '@2x'         => $still['sizes']['fragment-thumbnail@2x'],
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

    /**
     * One day expiration.
     */
    $expiration = 3600 * 24;
    set_transient($this->fragments_transient_key, $response, $expiration);
    return new WP_REST_Response($response);
  }

  /**
   * Search through fragments and only return the results.
   * @param WP_REST_Request $request
   * @return WP_REST_Response
   */
  public function search_data(WP_REST_Request $request)
  {
    $query = $request->get_param('query');
    $query = urldecode($query);

    /**
     * Check if there is a cache store response.
     */
    // $response = get_transient($query);
    // if ($response) {
    //   return new WP_REST_Response($response);
    // }

    $response = [];

    $found = [
      'id'        => 0,
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
              // '@2x'         => $still['sizes']['fragment-thumbnail@2x'],
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

    /**
     * Store the response.
     */
    // set_transient($query, $response);
    return new WP_REST_Response($response);
  }
}
