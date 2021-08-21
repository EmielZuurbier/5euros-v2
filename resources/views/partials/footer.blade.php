<footer class="footer">
  <div class="footer-container">
    @if (has_nav_menu('footer_navigation'))
      {!! wp_nav_menu([
        'theme_location'  => 'footer_navigation', 
        'container'       => 'nav',
        'container_class' => 'nav nav-footer',
        'menu_class'      => 'menu'
      ]) !!}
    @endif
  </div>
</footer>
