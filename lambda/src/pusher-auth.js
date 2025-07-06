//@ts-check

// netlify/functions/pusher-auth.ts
import Pusher from 'pusher';

// Initialisez Pusher avec les clés secrètes depuis les variables d'environnement
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.VITE_PUSHER_PUBLIC_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.VITE_PUSHER_CLUSTER,
  useTLS: true,
});
console.log(pusher);

export const handler = async (event) => {
  console.log("handle event", event);

  // Les données sont envoyées en x-www-form-urlencoded par le client Pusher
  const params = new URLSearchParams(event.body || '');
  const socketId = params.get('socket_id');
  const channel = params.get('channel_name');
  const userName = params.get('user_name');
  console.log(socketId, channel);

  // L'objet `userData` sera disponible pour les autres membres du canal
  const presenceData = {
    user_id: `user-${Date.now()}-${Math.floor(Math.random() * 10000)}`, // ID utilisateur unique
    user_info: {
        // Le pseudo sera ajouté côté client avant l'authentification
        name: userName
    },
  };
  console.log(presenceData);

  if (!socketId || !channel) {
    console.log("ni sockerId ni channel : 400 !");
    return { 
      statusCode: 400,
      headers: {
        "access-control-allow-method": "POST,GET",
        "access-control-allow-headers": "content-type",
        ...(event.headers.origin && {"Access-Control-Allow-Origin": event.headers.origin}),
      },
      body: 'Bad Request'
    };
  }

  try {
    const auth = pusher.authorizeChannel(socketId, channel, presenceData);
    console.log("Auth OK : 200 !");
    return {
      statusCode: 200,
      headers: {
        "access-control-allow-method": "POST,GET",
        "access-control-allow-headers": "content-type",
        ...(event.headers.origin && {"Access-Control-Allow-Origin": event.headers.origin}),
      },
      body: JSON.stringify(auth),
    };
  } catch (error) {
    console.error(error);
    console.log("Auth KO : 500 !");
    return { 
      statusCode: 500,
            headers: {
        "access-control-allow-method": "POST,GET",
        "access-control-allow-headers": "content-type",
        ...(event.headers.origin && {"Access-Control-Allow-Origin": event.headers.origin}),
      },
      body: 'Internal Server Error'
    };
  }
};