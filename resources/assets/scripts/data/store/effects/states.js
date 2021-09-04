export default [
  {
    name: 'speed',
    state: {
      bypass: true,
      playbackRate: 1.0
    }
  },
  {
    name: 'overdrive',
    state: {
      bypass: true,
      preBand: 1.0,
      color: 4000,
      drive: 0.8,
      postCut: 8000
    }
  },
  {
    name: 'reverb',
    state: {
      bypass: true,
      seconds: 2,
      decay: 4,
      reverse: 0
    }
  },
  {
    name: 'bitCrusher',
    state: {
      bypass: true,
      bitDepth: 3,
      frequencyReduction: 0.1
    }
  }
]
