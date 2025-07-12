// src/lib/wavEncoder.ts

/**
 * Encode un AudioBuffer en un Blob de fichier WAV.
 * @param buffer L'AudioBuffer à encoder.
 * @returns Un Blob contenant les données du fichier WAV.
 */
export function bufferToWav(buffer: AudioBuffer): Blob {
	const numOfChan = buffer.numberOfChannels;
	const length = buffer.length * numOfChan * 2 + 44; // 2 bytes par sample (16-bit)
	const arrayBuffer = new ArrayBuffer(length);
	const view = new DataView(arrayBuffer);

	let offset = 0;

	// Helper pour écrire des chaînes de caractères dans la vue
	function writeString(str: string) {
		for (let i = 0; i < str.length; i++) {
			view.setUint8(offset + i, str.charCodeAt(i));
		}
	}

	// --- En-tête RIFF ---
	writeString('RIFF');
	offset += 4;
	view.setUint32(offset, length - 8, true); // Taille du fichier - 8
	offset += 4;
	writeString('WAVE');
	offset += 4;

	// --- Sous-bloc "fmt " ---
	writeString('fmt ');
	offset += 4;
	view.setUint32(offset, 16, true); // Taille du sous-bloc (16 pour PCM)
	offset += 4;
	view.setUint16(offset, 1, true); // Format audio (1 pour PCM)
	offset += 2;
	view.setUint16(offset, numOfChan, true); // Nombre de canaux
	offset += 2;
	view.setUint32(offset, buffer.sampleRate, true); // Taux d'échantillonnage
	offset += 4;
	view.setUint32(offset, buffer.sampleRate * 2 * numOfChan, true); // ByteRate
	offset += 4;
	view.setUint16(offset, numOfChan * 2, true); // BlockAlign
	offset += 2;
	view.setUint16(offset, 16, true); // Bits par sample
	offset += 2;

	// --- Sous-bloc "data" ---
	writeString('data');
	offset += 4;
	view.setUint32(offset, length - offset - 4, true); // Taille des données
	offset += 4;

	// --- Écriture des données audio ---
	// On fusionne les canaux et on convertit de Float32 à PCM 16-bit
	for (let i = 0; i < buffer.length; i++) {
		for (let chan = 0; chan < numOfChan; chan++) {
			const sample = buffer.getChannelData(chan)[i];
			// On limite la valeur entre -1 et 1 avant de la convertir
			const s = Math.max(-1, Math.min(1, sample));
			// Conversion en entier 16-bit
			const intSample = s < 0 ? s * 0x8000 : s * 0x7FFF;
			view.setInt16(offset, intSample, true);
			offset += 2;
		}
	}

	return new Blob([view], { type: 'audio/wav' });
}