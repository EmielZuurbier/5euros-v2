<euros-reset class="banner-brand">
  <a class="brand permanent-marker" href="{{ $home_url }}">{{ $site_name }}</a>
</euros-reset>

<ul class="banner-actions">
  <li>
    <div class="needs-js">
      <euros-haptic>
        <euros-crazy-button class="button is-icon has-cod-gray-color has-screaming-green-background-color">
          <i class="fas fa-beer"></i>
          <span class="check"><i class="fas fa-check"></i></span>
        </euros-crazy-button>
      </euros-haptic>
    </div>
  </li>
  
  <li>
    <div class="needs-js">
      <euros-haptic>
        <euros-control-button class="button is-icon has-cod-gray-color has-dandelion-background-color">
          <i class="fas fa-sliders-h"></i>
          <span class="check"><i class="fas fa-times"></i></span>
        </euros-control-button>
      </euros-haptic>
    </div>
  </li>

  <li>
    <div class="needs-js">
      <euros-haptic>
        <euros-search-button class="button is-icon has-cod-gray-color has-bittersweet-background-color">
          <i class="fas fa-search"></i>
          <span class="check"><i class="fas fa-times"></i></span>
        </euros-search-button>
      </euros-haptic>
    </div>
  </li>

  <li>
    <euros-haptic>
      <a href="/support-ons/" class="button is-icon has-cod-gray-color has-heliothrope-background-color">
        {{-- <i class="fas fa-gift"></i> --}}
        <i class="fab fa-paypal"></i>
      </a>
    </euros-haptic>
  </li>
</ul>
