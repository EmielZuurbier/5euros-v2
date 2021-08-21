@extends('layouts.app')

@section('content')
  <article class="page-content">
    @while(have_posts()) @php the_post() @endphp
      @include('partials.page-header')
      @include('partials.content-page')
    @endwhile
  </article>
@endsection
