<header class="banner">
  <div class="banner-container">
    @if ($is_front_page) 
      @include('partials.header-front-page')
    @else
      @include('partials.header-default')
    @endif
  </div>
</header>
