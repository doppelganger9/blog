//@ts-check

// netlify/functions/pusher-auth.ts
import { randomUUID } from 'crypto';
import Pusher from 'pusher';
import { corsHeaders, isAllowedOrigin, json } from './utils/http';

// Initialisez Pusher avec les clés secrètes depuis les variables d'environnement
// NOTE: ne jamais logger cet objet, il contient le secret.
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.VITE_PUSHER_PUBLIC_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.VITE_PUSHER_CLUSTER,
  useTLS: true,
});

const ALLOWED_METHODS = 'POST';

// Seuls les canaux de présence du poker planning peuvent être autorisés.
// Caractères permis par Pusher dans un nom de canal : A-Z a-z 0-9 _ - = @ , . ;
const ALLOWED_CHANNEL_PATTERN = /^presence-poker-room-[A-Za-z0-9_\-=@,.;]{1,128}$/;
const SOCKET_ID_PATTERN = /^\d+\.\d+$/;
const MAX_USER_NAME_LENGTH = 50;

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders(event, ALLOWED_METHODS),
      body: ''
    };
  }

  // Le client Pusher appelle cet endpoint en POST depuis le navigateur, qui envoie toujours l'en-tête Origin.
  if (!isAllowedOrigin(event.headers?.origin || event.headers?.Origin)) {
    return json(event, ALLOWED_METHODS, 403, { message: 'Forbidden' });
  }
  if (event.httpMethod !== 'POST') {
    return json(event, ALLOWED_METHODS, 405, { message: 'Method not allowed' });
  }

  // Les données sont envoyées en x-www-form-urlencoded par le client Pusher
  const params = new URLSearchParams(event.body || '');
  const socketId = params.get('socket_id');
  const channel = params.get('channel_name');
  const userName = (params.get('user_name') || '').trim().substring(0, MAX_USER_NAME_LENGTH);

  if (!socketId || !SOCKET_ID_PATTERN.test(socketId) || !channel || !ALLOWED_CHANNEL_PATTERN.test(channel) || !userName) {
    return json(event, ALLOWED_METHODS, 400, { message: 'Bad Request' });
  }

  // L'objet `userData` sera disponible pour les autres membres du canal
  const presenceData = {
    user_id: `user-${randomUUID()}`, // ID utilisateur unique
    user_info: {
        // Le pseudo sera ajouté côté client avant l'authentification
        name: userName
    },
  };

  try {
    const auth = pusher.authorizeChannel(socketId, channel, presenceData);
    return json(event, ALLOWED_METHODS, 200, auth);
  } catch (error) {
    console.error('pusher-auth: authorizeChannel failed', error?.message);
    return json(event, ALLOWED_METHODS, 500, { message: 'Internal Server Error' });
  }
};
