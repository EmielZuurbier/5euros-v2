{{-- TODO: Restyle the effects to smaller simpler controls, something like the iOS control center. --}}
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
        <label for="control-reverb-decay">Decay</label>
        <input id="control-reverb-decay" type="range" min="0" max="20" step="2" value="2" name="reverb.decay" />
      </div>

      {{-- This one does not spark joy.
      <div class="control-input">
        <label for="control-reverb-reverse">Reverse</label>
        <input id="control-reverb-reverse" type="range" min="0" max="1" step="0.1" value="0" name="reverb.reverse" />
      </div> --}}
    </fieldset>

    <fieldset class="control-group control-group--bit-crusher">
      <legend><euros-haptic>
        <label class="control-toggle dandelion">
          Bit Crusher
          <input type="checkbox" name="bitCrusher.bypass" value="1" />
          <span class="state state--on"><i class="fas fa-check"></i></span>
          <span class="state state--off"><i class="fas fa-times"></i></span>
        </label>
      </euros-haptic></legend>
  
      <div class="control-input">
        <label for="control-bit-crusher-bit-depth">Bit Depth</label>
        <input id="control-bit-crusher-bit-depth" type="range" min="1" max="16" step="1" value="3" name="bitCrusher.bitDepth" />
      </div>
  
      <div class="control-input">
        <label for="control-bit-crusher-frequency-reduction">Frequency Reduction</label>
        <input id="control-bit-crusher-frequency-reduction" type="range" min="0" max="1" step="0.1" value="0.1" name="bitCrusher.frequencyReduction" />
      </div>
    </fieldset>
  </form>
</euros-control-panel>