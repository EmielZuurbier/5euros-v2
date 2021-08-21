<?php

namespace App\Media;

class ImageSizes
{
    /**
     * Set filters and actions
     */
    public function __construct()
    {
        add_filter('intermediate_image_sizes_advanced', [$this, 'remove_default_sizes'], 10, 1);
        add_action('after_setup_theme', [$this, 'add_image_sizes'], 10);
    }

    /**
     * Returns an array of default image sizes to remove.
     * @return array
     */
    public function sizes_to_remove()
    {
        return [
            'thumbnail',
            'small',
            'medium',
            'medium_large',
            'large'
        ];
    }

    /**
     * Returns a nested array with image sizes to add.
     * @return array
     */
    public function sizes_to_add()
    {
        return [
            [
                'name'   => 'fragment-thumbnail@1x',
                'width'  => 140,
                'height' => 140,
                'crop'   => true
            ],
            [
                'name'   => 'fragment-thumbnail@2x',
                'width'  => 280,
                'height' => 280,
                'crop'   => true
            ]
        ];
    }

    /**
     * Loops trough the default sizes and remove the size if it is found in the sizes array.
     * @link https://developer.wordpress.org/reference/hooks/intermediate_image_sizes_advanced/
     * @param array
     * @return array
     */
    public function remove_default_sizes($sizes)
    {
        $sizes_to_remove = $this->sizes_to_remove();

        foreach ($sizes_to_remove as $size) {
            if (($key = array_search($size, $sizes)) !== false) {
                unset($sizes[$key]);
            }
        }

        return $sizes;
    }

    /**
     * Loops through the sizes to add and adds them.
     * @link https://developer.wordpress.org/reference/hooks/after_setup_theme/
     */
    public function add_image_sizes()
    {
        $sizes_to_add = $this->sizes_to_add();

        foreach ($sizes_to_add as $size) {
            add_image_size(
                $size['name'],
                $size['width'],
                $size['height'],
                $size['crop']
            );
        }
    }
}
