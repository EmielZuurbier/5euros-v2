<!doctype html>
<html class="no-js" {!! get_language_attributes() !!}>
  @include('partials.head')
  
  <body @php body_class('app') @endphp ontouchstart="">
    @php do_action('get_header') @endphp

    <div class="shell" role="document">
      @include('partials.header')

      <main class="main-content js-main-content">
        @yield('content')

        @include('partials.effect-panel')
        @include('partials.search-panel')
      </main>

      @include('partials.footer')
    </div>

    @php do_action('get_footer') @endphp
    @php wp_footer() @endphp
  </body>
</html>
