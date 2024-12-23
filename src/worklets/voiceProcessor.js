// src/worklets/audioProcessor.js
class AudioProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.bufferSize = options.processorOptions.bufferSize;
    this.numberOfChannels = options.processorOptions.numberOfChannels;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];

    // Process each channel
    for (let channel = 0; channel < this.numberOfChannels; channel++) {
      const inputChannel = input[channel];
      const outputChannel = output[channel];

      if (inputChannel && outputChannel) {
        for (let i = 0; i < inputChannel.length; i++) {
          outputChannel[i] = inputChannel[i];
        }
      }
    }

    return true;
  }
}

registerProcessor('audio-processor', AudioProcessor);
