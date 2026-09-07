// Cyberpunk Game Audio Engine using Web Audio API
// Created to run natively without external assets for maximum reliability.

class CyberAudioEngine {
    constructor() {
        this.ctx = null;
        this.ambientOsc = null;
        this.ambientGain = null;
        this.isMuted = false;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playClick() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.1);
    }

    playSuccess() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        
        // Ascending chime arpeggio
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4, E4, G4, C5, E5
        notes.forEach((freq, idx) => {
            const time = now + idx * 0.08;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, time);
            
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.15, time + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(time);
            osc.stop(time + 0.3);
        });
    }

    playError() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(130, now); // Low C3
        osc.frequency.linearRampToValueAtTime(80, now + 0.25);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        // Simple lowpass filter to make it warmer/buzzier
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, now);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.3);
    }

    playLevelUp() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        
        // Exciting retro double-tone
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'square';
        osc1.frequency.setValueAtTime(587.33, now); // D5
        osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(293.66, now); // D4
        osc2.frequency.exponentialRampToValueAtTime(440, now + 0.2);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc1.stop(now + 0.4);
        osc2.start(now);
        osc2.stop(now + 0.4);
    }

    playFireworkBurst() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        
        // 1. Deep Bass Boom
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(10, now + 0.4);
        
        oscGain.gain.setValueAtTime(0.4, now);
        oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        
        // 2. High Sparkle Crackle (Noise)
        const bufferSize = this.ctx.sampleRate * 0.2; // 0.2 seconds
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noiseNode = this.ctx.createBufferSource();
        noiseNode.buffer = buffer;
        
        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(1200, now);
        noiseFilter.Q.setValueAtTime(3, now);
        
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.08, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        
        // Connect everything
        osc.connect(oscGain);
        oscGain.connect(this.ctx.destination);
        
        noiseNode.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        
        // Start
        osc.start(now);
        osc.stop(now + 0.4);
        noiseNode.start(now);
        noiseNode.stop(now + 0.2);
    }

    playWaka() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(250, now);
        osc.frequency.exponentialRampToValueAtTime(500, now + 0.06);
        osc.frequency.exponentialRampToValueAtTime(250, now + 0.12);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
    }

    playPacmanDeath() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        const notes = [600, 500, 400, 300, 200, 100];
        notes.forEach((freq, idx) => {
            const time = now + idx * 0.08;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, time);
            gain.gain.setValueAtTime(0.12, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.07);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(time);
            osc.stop(time + 0.08);
        });
    }

    playSadBuzzer() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(120, now);
        osc1.frequency.linearRampToValueAtTime(80, now + 0.55);
        
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(123, now); // Detuned for chorus buzz!
        osc2.frequency.linearRampToValueAtTime(83, now + 0.55);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, now);
        
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
        
        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc1.start(now);
        osc1.stop(now + 0.6);
        osc2.start(now);
        osc2.stop(now + 0.6);
    }


    startAmbient() {
        if (this.isMuted) return;
        try {
            this.init();
            if (this.ambientOsc) return; // Already running

            const now = this.ctx.currentTime;
            this.ambientOsc = this.ctx.createOscillator();
            const mod = this.ctx.createOscillator();
            const modGain = this.ctx.createGain();
            this.ambientGain = this.ctx.createGain();

            // Cyberpunk pulsating background pad
            this.ambientOsc.type = 'sine';
            this.ambientOsc.frequency.setValueAtTime(75, now); // Very low rumble

            // LFO frequency modulation for pulse effect
            mod.type = 'sine';
            mod.frequency.setValueAtTime(0.2, now); // 0.2Hz (5s cycle)
            modGain.gain.setValueAtTime(8, now); // +/- 8Hz sweep

            this.ambientGain.gain.setValueAtTime(0, now);
            this.ambientGain.gain.linearRampToValueAtTime(0.06, now + 2); // Slow fade-in

            mod.connect(modGain);
            modGain.connect(this.ambientOsc.frequency);
            this.ambientOsc.connect(this.ambientGain);
            this.ambientGain.connect(this.ctx.destination);

            mod.start(now);
            this.ambientOsc.start(now);
        } catch (e) {
            console.error("Failed to start ambient audio context:", e);
        }
    }

    stopAmbient() {
        if (this.ambientOsc) {
            try {
                const now = this.ctx.currentTime;
                this.ambientGain.gain.cancelScheduledValues(now);
                this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
                this.ambientGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
                
                const osc = this.ambientOsc;
                this.ambientOsc = null;
                setTimeout(() => {
                    try {
                        osc.stop();
                    } catch (e) {}
                }, 600);
            } catch (e) {
                this.ambientOsc = null;
            }
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopAmbient();
        } else {
            this.startAmbient();
        }
        return this.isMuted;
    }
}

const AudioEngine = new CyberAudioEngine();
window.AudioEngine = AudioEngine; // Make it global
