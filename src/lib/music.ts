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
export const NOTES_SCIENTIFIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const NOTES_SOLFEGE = ['Do', 'Do#', 'Ré', 'Ré#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];

// Fonction pour convertir la notation
export function toSolfege(note: string): string {
    const pc = Note.pitchClass(note); // 'C#', 'D' etc.
    const index = NOTES_SCIENTIFIC.indexOf(pc);
    return index !== -1 ? NOTES_SOLFEGE[index] : note;
}

// Map pour récupérer la description d'un accord
export const CHORD_DESCRIPTIONS: Record<string, string> = {};
ChordType.names().forEach(name => {
    const aliases = ChordType.get(name).aliases;
    if (aliases.length > 0) {
      CHORD_DESCRIPTIONS[aliases[0]] = name;
    }
});