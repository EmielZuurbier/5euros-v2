<euros-control-panel>
  <form class="control-layout">
    <fieldset class="control-group control-group--speed">
      <legend>
        <euros-haptic>
          <span class="control-toggle dandelion">
            Snelheid
          </span>
        </euros-haptic>
      </legend>
  
      <div class="control-input">
        <label for="control-speed-playback-speed">Playback speed</label>
        <input id="control-speed-playback-speed" type="range" min="0.5" max="1.5" step="0.01" value="1" name="speed.playbackRate" />
      </div>
    </fieldset>

    <fieldset class="control-group control-group--overdrive">
      <legend>
        <euros-haptic>
          <label class="control-toggle dandelion">
            Overdrive
            <input type="checkbox" name="overdrive.bypass" value="1" />
            <span class="state state--on"><i class="fas fa-check"></i></span>
            <span class="state state--off"><i class="fas fa-times"></i></span>
          </label>
        </euros-haptic>
      </legend>
  
      <div class="control-input">
        <label for="control-overdrive-preband">Pre-band</label>
        <input id="control-overdrive-preband" type="range" min="0" max="1" step="0.1" value="1" name="overdrive.preBand" />
      </div>
  
      <div class="control-input">
        <label for="control-overdrive-color">Color</label>
        <input id="control-overdrive-color" type="range" min="0" max="22050" step="50" value="4000" name="overdrive.color" />
      </div>
  
      <div class="control-input">
        <label for="control-overdrive-drive">Drive</label>
        <input id="control-overdrive-drive" type="range" min="0" max="1" step="0.1" value="0.8" name="overdrive.drive" />
      </div>
  
      <div class="control-input">
        <label for="control-overdrive-post-cut">Post-cut</label>
        <input id="control-overdrive-post-cut" type="range" min="0" max="22050" step="50" value="8000" name="overdrive.postCut" />
      </div>
    </fieldset>
  
    <fieldset class="control-group control-group--reverb">
      <legend><euros-haptic>
        <label class="control-toggle dandelion">
          Reverb
          <input type="checkbox" name="reverb.bypass" value="1" />
          <span class="state state--on"><i class="fas fa-check"></i></span>
          <span class="state state--off"><i class="fas fa-times"></i></span>
        </label>
      </euros-haptic></legend>
  
      <div class="control-input">
        <label for="control-reverb-seconds">Seconds</label>
        <input id="control-reverb-seconds" type="range" min="1" max="10" step="1" value="3" name="reverb.seconds" />
      </div>
  
      <div class="control-input">
        <label for="control-reberb-decay">Decay</label>
        <input id="control-reberb-decay" type="range" min="0" max="20" step="2" value="2" name="reverb.decay" />
      </div>

      {{-- This one does not spark joy.
      <div class="control-input">
        <label for="control-reberb-reverse">Reverse</label>
        <input id="control-reberb-reverse" type="range" min="0" max="1" step="0.1" value="0" name="reverb.reverse" />
      </div> --}}
    </fieldset>
  </form>
</euros-control-panel>