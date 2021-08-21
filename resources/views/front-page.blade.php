@extends('layouts.app')

@section('content')
  <euros-observer class="js-content">
      {{-- The content will be placed here --}}
  </euros-observer>

  @include('partials.effect-panel')
  @include('partials.search-panel')
@endsection
