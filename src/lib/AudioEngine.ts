import { Chord, Note } from 'tonal';

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
	gainNode.gain.setValueAtTime(0.1, startTime);
	//gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

	oscillator.connect(gainNode);
	gainNode.connect(audioContext.destination);

	oscillator.start(startTime);
	oscillator.stop(startTime + duration);
}

// Exporte les fonctions que l'on utilisera
export const audioEngine = {
	init: initAudio,

	playNote: (note: string, duration = 1, at = audioContext?.currentTime): void => {
		initAudio();
		// Si la note n'a pas d'octave (dernier caractère n'est pas un chiffre), on ajoute "4"
		const noteWithOctave = /\d$/.test(note) ? note : `${note}4`;
		console.log('Playing note:', noteWithOctave, at);
		playNote(noteWithOctave, duration, at ?? audioContext.currentTime);
	},

	/**
	 * Joue un accord (plusieurs notes simultanées).
	 * 
	 * @param notes - Liste des notes à jouer (ex: ["C", "E", "G"])
	 * @param duration - La durée de l'accord en secondes (par défaut 1 seconde)
	 * @param at - Le moment où l'accord doit commencer (par défaut maintenant)
	 * @return Le moment où l'accord se termine
	 */
	playChord: (notes: string[], duration = 1, at = audioContext?.currentTime): number => {
		initAudio();
		let scheduledTime = at ?? audioContext.currentTime;
		console.log('Playing chord:', notes, scheduledTime);
		notes.forEach(note => playNote(`${note}4`, duration, scheduledTime));
		return scheduledTime + duration;
	},

	/**
	 * Joue un arpège (notes jouées successivement).
	 * 
	 * @param notes - Liste des notes à jouer (ex: ["C", "E", "G"])
	 * @param at - Le moment où l'arpège doit commencer (par défaut maintenant)
	 * @return Le moment où l'arpège se termine
	 */
	playArpeggio: (notes: string[], at = audioContext?.currentTime, delay: number = 0.25): number => {
		initAudio();
		let nextTime = at ?? audioContext.currentTime;

		notes.forEach(note => {
			// calcul l'octave pour que les notes de l'arpège se suivent
			nextTime += delay;
			playNote(`${note}4`, delay, nextTime);
		});
		return nextTime;
	},

	/**
	 * Joue une suite d'accords à la suite
	 * 
	 * TODO les notes sont toutes jouées sur la même octave, il faudrait adapter pour une suite logique.
	 * 
	 * @param chordProgression une suite d'accords, 
	 * 		p.ex. ["CMaj7 Em7 Am7 D7", "FMaj7 G7 CMaj7 CMaj7"] 
	 * @param at moment où commencer la progression (par défaut maintenant)
	 * @param delay délai entre chaque accord en secondes (par défaut 1 seconde)
	 * @return Le moment où la progression se termine
	 */
	playChordProgression: (chordProgression: string[], at = audioContext?.currentTime, delay: number = 1, duration: number = 1): number => {
		initAudio();
		let scheduledTime = at || audioContext.currentTime;
		console.log('Playing chord progression:', scheduledTime, chordProgression);

		chordProgression.forEach((chordNotation, i) => {
			const chordNotes: string[] = Chord.get(chordNotation).notes;
			scheduledTime = audioEngine.playChord(chordNotes, duration, scheduledTime);
			console.log('next scheduled time:', scheduledTime);
		});
		console.log('returned scheduled time:', scheduledTime);
		return scheduledTime;
	},

	/**
	 * Joue une suite d'accords en arpège à la suite.
	 * 
	 * @param chordProgression une suite d'accords, 
	 * 		p.ex. ["CMaj7 Em7 Am7 D7", "FMaj7 G7 CMaj7 CMaj7"] 
	 * @param at moment où commencer la progression (par défaut maintenant)
	 * @param delay délai entre chaque note de l'arpège en secondes (par défaut 1 seconde)
	 * @return Le moment où la progression se termine
	 */
	playArpeggiatedProgression: (chordProgression: string[], at = audioContext?.currentTime, delay: number = 1): number => {
		initAudio();
		let scheduledTime = at ?? audioContext.currentTime;
		console.log('Playing arpeggiated progression:', scheduledTime, chordProgression);

		chordProgression.forEach(chordNotation => {
			const chordNotes: string[] = Chord.get(chordNotation).notes;
			scheduledTime = audioEngine.playArpeggio(chordNotes, scheduledTime, delay);
			console.log('next scheduled time:', scheduledTime);
			scheduledTime += delay;
			console.log('next scheduled time after adding delay:', scheduledTime);
		});
		console.log('returned scheduled time:', scheduledTime + delay);
		return scheduledTime;
	},
};