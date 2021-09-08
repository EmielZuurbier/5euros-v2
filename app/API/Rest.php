<?php

namespace App\API;

use App\API\Queries;

use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

class Rest
{
  /**
   * The vendor for the Rest API.
   */
  protected $vendor = '5euros';

  /**
   * Current version of Rest API.
   */
  protected $api_version = 'v1';

  /**
   * The keys of the transients.
   */
  protected static $transient_data_key = 'data';

  /**
   * The duration a transient should be stored.
   */
  protected static $transient_expiration_date = 3600 * 24;

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
   * Returns the page data of a specific page, or the front page.
   * @param WP_REST_Request $request
   * @return WP_REST_Response
   */
  public function get_page(WP_REST_Request $request)
  {
    /**
     * Get the name that is requested
     */
    $name = $request->get_param('name');

    /**
     * Create new queries instance.
     */
    $queries = new Queries();

    /**
     * Get a response based on the name.
     */
    $response = $queries->get_page($name);

    /**
     * Return the response.
     */
    return new WP_REST_Response($response);
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
    $response = get_transient(self::$transient_data_key);
    if ($response) {
      return new WP_REST_Response($response);
    }

    /**
     * Create new queries instance.
     */
    $queries = new Queries();

    /**
     * First get the sticky data.
     */
    $sticky_data = $queries->get_sticky_data();

    /**
     * Then get the rest of the data.
     */
    $data = $queries->get_data();

    /**
     * Combine the two arrays.
     */
    $response = array_merge($sticky_data, $data);

    /**
     * Save the response.
     */
    set_transient(self::$transient_data_key, $response, self::$transient_expiration_date);

    /**
     * Return the response.
     */
    return new WP_REST_Response($response);
  }

  /**
   * Search through fragments and only return the results.
   * @param WP_REST_Request $request
   * @return WP_REST_Response
   */
  public function search_data(WP_REST_Request $request)
  {
    /**
     * Get the query value.
     */
    $query = urldecode($request->get_param('query'));

    /**
     * Create new queries instance.
     */
    $queries = new Queries();

    /**
     * Get a response based on the query.
     */
    $response = $queries->search_data($query);

    /**
     * Return the response.
     */
    return new WP_REST_Response($response);
  }
}
