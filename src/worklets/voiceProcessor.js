class VoiceProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'pitch', defaultValue: 0, minValue: -12, maxValue: 12 },
      { name: 'reverb', defaultValue: 0, minValue: 0, maxValue: 1 },
      { name: 'tremolo', defaultValue: 0, minValue: 0, maxValue: 1 },
    ];
  }

  constructor() {
    super();
    this.phase = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    const pitch = parameters.pitch[0];
    const reverb = parameters.reverb[0];
    const tremolo = parameters.tremolo[0];

    if (!input || !output) return true;

    for (let channel = 0; channel < input.length; channel++) {
      const inputChannel = input[channel];
      const outputChannel = output[channel];

      for (let i = 0; i < inputChannel.length; i++) {
        // Apply pitch shift
        const pitchShift = Math.pow(2, pitch / 12);
        const index = Math.floor(i * pitchShift) % inputChannel.length;
        let sample = inputChannel[index];

        // Apply tremolo
        if (tremolo > 0) {
          this.phase += 0.1;
          const tremoloEffect = 1 - tremolo * (0.5 + 0.5 * Math.sin(this.phase));
          sample *= tremoloEffect;
        }

        // Apply reverb (simple implementation)
        if (reverb > 0 && i > 0) {
          sample = sample * (1 - reverb) + inputChannel[Math.max(0, i - 1000)] * reverb;
        }

        outputChannel[i] = sample;
      }
    }

    return true;
  }
}

registerProcessor('voice-processor', VoiceProcessor);