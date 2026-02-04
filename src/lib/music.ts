import { Scale, Chord, Note, ChordType } from 'tonal';

// NOUVELLES CONSTANTES POUR UNE SÉLECTION PLUS FINE
export const PITCH_CLASSES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
export const ACCIDENTALS = [
    { symbol: '♭', value: 'b' }, // Bémol
    { symbol: '♮', value: '' },  // Naturel (pas d'altération)
    { symbol: '♯', value: '#' }  // Dièse
];

// Listes des gammes et accords que l'on veut proposer
export const SCALES = ['major', 'minor', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'locrian', 'major pentatonic', 'minor pentatonic', 'harmonic minor'];
export const CHORDS = ['M', 'm', '7', 'M7', 'm7', 'dim', 'aug', 'sus2', 'sus4'];

// Notations
export const NOTES_ENGLISH = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const NOTES_SOLFEGE = ['Do', 'Do#', 'Ré', 'Ré#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];

// Quelques progressions d'accords en notation degrés chiffres romain
export const PROGRESSIONS = [ 'IIm7 VMaj7 IMaj7', 'Im7 IV7 Vm7', 'I7 IV7 V7 I7', 'IMaj7 VI7 II7 V7' ];

// Fonction pour convertir la notation
export function toSolfege(note: string): string {
    const mapping = {
        'C♭': 'Do♭', 'Cb': 'Do♭', 'C': 'Do', 'C♯': 'Do♯','C#': 'Do♯',
        'D♭': 'Ré♭', 'Db': 'Ré♭', 'D': 'Ré', 'D♯': 'Ré♯','D#': 'Ré♯',
        'E♭': 'Mi♭', 'Eb': 'Mi♭', 'E': 'Mi', 'E♯': 'Mi♯','E#': 'Mi♯',
        'F♭': 'Fa♭', 'Fb': 'Fa♭', 'F': 'Fa', 'F♯': 'Fa♯','F#': 'Fa♯',
        'G♭': 'Sol♭','Gb': 'Sol♭','G': 'Sol','G♯': 'Sol♯','G#': 'Sol♯',
        'A♭': 'La♭', 'Ab': 'La♭', 'A': 'La', 'A♯': 'La♯','A#': 'La♯',
        'B♭': 'Si♭', 'Bb': 'Si♭', 'B': 'Si', 'B♯': 'Si♯','B#': 'Si♯',
    };

    // si note est un accord (ex: "Cm7"), on extrait la partie note seule
    const match = note.match(/^([A-G][b#♭♯]?)(.+?)$/);
    if (!match) return mapping[note] || note; // si pas de correspondance, on retourne tel quel
    
    const baseNote = match[1];
    const accord = match[2];
    return mapping[baseNote] + accord || note;
}

export function relativeScale(scaleName: string): string {
    // la gamme relative mineure est toujours basée sur le 6ème degré de la gamme majeure
    if (!scaleName) return '';
    if (scaleName.toLowerCase().includes('minor')) {
        const minorScale = Scale.get(scaleName);
        if (minorScale.empty) return '';
        const relativeMajor = minorScale.notes[2]; // 3ème note de la gamme mineure
        return `${relativeMajor} major`;
    } else {
        const majorScale = scaleName.includes('major') 
            ? Scale.get(scaleName) 
            : Scale.get(`${scaleName} major`)
            ;
        if (majorScale.empty) return '';
        const sixthDegree = majorScale.notes[5];
        return `${sixthDegree} minor`;
    }
}

// Map pour récupérer la description d'un accord
export const CHORD_DESCRIPTIONS: Record<string, string> = {};
ChordType.names().forEach(name => {
    const aliases = ChordType.get(name).aliases;
    if (aliases.length > 0) {
      CHORD_DESCRIPTIONS[aliases[0]] = name;
    }
});