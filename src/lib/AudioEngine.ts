import { Note } from 'tonal';

let audioContext: AudioContext;

// Crée le contexte audio (doit être appelé suite à une action de l'utilisateur)
function initAudio() {
	if (!audioContext || audioContext.state === 'closed') {
		audioContext = new AudioContext();
	}
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

/**
 * Joue une seule note
 * @param note - La note à jouer (ex: "C4")
 * @param duration - La durée en secondes
 * @param startTime - Le moment où la note doit commencer
 */
function playNote(note: string, duration: number, startTime: number) {
	if (!audioContext) return;

	const freq = Note.freq(note);
	if (!freq) return;

	const oscillator = audioContext.createOscillator();
	oscillator.type = 'sine'; // onde simple et pure
	oscillator.frequency.setValueAtTime(freq, startTime);

	const gainNode = audioContext.createGain();
	gainNode.gain.setValueAtTime(0.3, startTime);
	gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

	oscillator.connect(gainNode);
	gainNode.connect(audioContext.destination);

	oscillator.start(startTime);
	oscillator.stop(startTime + duration);
}

// Exporte les fonctions que l'on utilisera
export const audioEngine = {
	init: initAudio,
	playChord: (notes: string[]) => {
		initAudio();
		const now = audioContext.currentTime;
		notes.forEach(note => playNote(`${note}4`, 1, now));
	},
	playArpeggio: (notes: string[]) => {
		initAudio();
		const now = audioContext.currentTime;
		notes.forEach((note, i) => {
			playNote(`${note}4`, 0.25, now + i * 0.25);
		});
	}
};