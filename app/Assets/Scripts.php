<?php

namespace App\Assets;

class Scripts
{
    /**
     * If the scripts should be placed in the wp_foot position.
     * @var boolean
     */
    private $in_footer = true;

    /**
     * Add after_setup_theme hook.
     */
    public function __construct()
    {
        add_action('after_setup_theme', [$this, 'init'], 10);
    }

    /**
     * Add filters and hooks after theme setup.
     * @link https://developer.wordpress.org/reference/hooks/after_setup_theme/
     */
    public function init()
    {
        add_filter('script_loader_tag', [$this, 'defer_scripts'], 10, 2);
        add_action('wp_head', [$this, 'javascript_active'], 1);
        add_action('wp_head', [$this, 'preload_scripts'], 1);
        add_action('wp_enqueue_scripts', [$this, 'dequeue'], 10);
        add_action('wp_enqueue_scripts', [$this, 'enqueue'], 10);
    }

    /**
     * Returns nested arrays of data that will be used when enqueueing the scripts.
     * Allows for inline scripts to be created.
     * @return array[]
     */
    public function scripts()
    {
        return [
            [
                'handle'        => 'app',
                'src'           => \App\asset_path('scripts/app.js'),
                'dependencies'  => [],
                'version'       => false,
                'inline'        => [
                    'js_key'        => 'appData',
                    'data'          => [
                        'endpoints'     => [
                            'page'          => esc_url(rest_url('5euros/v1/page')),
                            'data'          => esc_url(rest_url('5euros/v1/data')),
                            'search'        => esc_url(rest_url('5euros/v1/search')),
                        ],
                        'worker'        => \App\asset_path('scripts/worker.js'),
                        'serviceWorker' => \App\asset_path('scripts/serviceworker.js'),
                        'nonce'         => wp_create_nonce('wp_rest')
                    ],
                    'position'      => 'before'
                ],
                'preload'       => true,
                'defer'         => true
            ]
        ];
    }

    /**
     * Dequeues scripts that shouldn't be included.
     */
    public function dequeue()
    {
        $scripts = [
            'wp-embed',
            'jquery'
        ];

        foreach ($scripts as $script) {
            wp_deregister_script($script);
        }
    }

    /**
     * Enqueues scripts based on the data in the scripts array.
     * Whenever an inline key is present it will also include an inline script.
     */
    public function enqueue()
    {
        $scripts = $this->scripts();

        foreach ($scripts as $script) {
            [
                'handle'       => $handle,
                'src'          => $src,
                'dependencies' => $dependencies,
                'version'      => $version
            ] = $script;

            wp_register_script(
                $handle,
                $src,
                $dependencies,
                $version,
                $this->in_footer
            );

            if (isset($script['inline'])) {
                $inline = $script['inline'];

                [
                    'js_key'    => $js_key,
                    'data'      => $data,
                    'position'  => $position
                ] = $inline;

                $json_data = json_encode($data);

                wp_add_inline_script(
                    $handle,
                    "window.__{$js_key}__ = $json_data",
                    $position
                );
            }

            wp_enqueue_script($handle);
        }
    }

    /**
     * Outputs a script in head that removes the no-js class from the root tag to indicate that JS is active.
     * @link https://developer.wordpress.org/reference/hooks/wp_head/
     */
    public function javascript_active()
    {
        echo "<script>document.documentElement.className = document.documentElement.className.replace('no-js', '');</script>";
    }

    /**
     * Output a preload tag in the head to indicate that we need this script soon.
     * @link https://developer.wordpress.org/reference/hooks/wp_head/
     */
    public function preload_scripts()
    {
        $scripts = $this->scripts();

        if (!is_admin()) {
            foreach ($scripts as $script) {
                if (isset($script['preload']) && $script['preload'] === true) {
                    echo '<link rel="preload" href="' . $script['src'] . '" as="script">';
                }
            }
        }
    }

    /**
     * Add attributes to the script tag.
     * Can be used to add a 'async' or 'defer' attribute to a script tag.
     * @link https://developer.wordpress.org/reference/hooks/script_loader_tag/
     * @param string $tag
     * @param string $handle
     * @return string
     */
    public function defer_scripts($tag, $handle)
    {
        $handles = $this->get_handles_with('defer', true);

        if (!is_admin() && in_array($handle, $handles)) {
            return str_replace(' src', ' defer="defer" src', $tag);
        }

        return $tag;
    }

    /**
     * Returns an array of handles based on the scripts.
     * @return string[]
     */
    private function get_handles_with($property, $value)
    {
        $scripts = $this->scripts();

        $filtered_scripts = array_filter($scripts, function ($script) use ($property, $value) {
            return isset($script[$property]) && $script[$property] === $value;
        });

        return array_map(function ($script) {
            return $script['handle'];
        }, $filtered_scripts);
    }
}
