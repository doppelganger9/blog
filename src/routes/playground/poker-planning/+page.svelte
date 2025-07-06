<script lang="ts">
	import type { PresenceChannel } from 'pusher-js';  
  import Pusher from 'pusher-js';
  import { type RoomState, type Participant, resetAllVotes, hideVotes, showVotes, setSequenceByName, PUSHER_SUBSCRIPTION_SUCCEEDED, PUSHER_MEMBER_ADDED, PUSHER_MEMBER_REMOVED, EVENT_CLIENT_VOTE, EVENT_CLIENT_SHOW_VOTES, EVENT_CLIENT_HIDE_VOTES, EVENT_CLIENT_RESET, EVENT_CLIENT_CHANGED_SEQUENCE, setParticipants, type PusherMember, addParticipant, EVENT_CLIENT_CHANGED_ROOM_NAME, EVENT_CLIENT_CHANGED_ROOM_DESCRIPTION } from '$lib/types';
	import PokerBoard from '$lib/components/PokerBoard.svelte';
	import { SEQUENCES } from '$lib/planningSequences';

	let user = $state({ name: '', hasJoined: false });
	let roomState = $state<RoomState>({
		name: 'Salle de Poker Planning',
		description: 'Une salle de Poker Planning pour estimer des tâches',
		participants: [],
		votesVisible: false,
		activeSequence: SEQUENCES.fibonacci
	});

	// générer un UUID pour l'identifiant de la salle
	function generateUUID() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}
	let roomId = '';
	if (typeof window !== 'undefined') {
		const roomIdFromLocationHash = window.location.hash.replace(/^#/, '');
		if (roomIdFromLocationHash) {
			roomId = roomIdFromLocationHash;
		} else {
			// Si pas de hash, on essaie de lire l'ID de la salle
			const params = new URLSearchParams(window.location.search);
			roomId = params.get('roomId') || generateUUID(); // Si pas de paramètre, on garde l'ID de la salle actuel
			window.location.hash = roomId; // Mettre à jour le hash de l'URL pour que les autres utilisateurs puissent rejoindre la même salle
		}
	} else {
			roomId = generateUUID();
	}
	
	let pusherChannel = $state<PresenceChannel>();

	function handleJoin(e: SubmitEvent) {
		const formData = new FormData(e.target as HTMLFormElement);
		const name = formData.get('name') as string;
		const room = formData.get('room') as string;
		roomId = room.trim() || roomId; // Si le champ est vide, on garde l'ID de la salle actuel
		window.location.hash = roomId; // Mettre à jour le hash de l'URL pour que les autres utilisateurs puissent rejoindre la même salle
		if (name.trim()) {
			user.name = name.trim();
			user.hasJoined = true;
			connectToPusher(user, roomId);
		}
	}

	function connectToPusher(user: { name: string, hasJoined: boolean }, roomId: string) {
    // TODO mieux gérer les erreurs de connexion !!
    console.log("connectToPusher");
		const pusher = new Pusher(import.meta.env.VITE_PUSHER_PUBLIC_KEY, {
			cluster: import.meta.env.VITE_PUSHER_CLUSTER,
			authEndpoint: import.meta.env.VITE_PUSHER_AUTH_ENDPOINT || '/.netlify/functions/pusher-auth',
      auth: {
				params: { user_name: user.name }
			}
		});

		const channelName = `presence-poker-room-${roomId}`;
		pusherChannel = pusher.subscribe(channelName) as PresenceChannel;

		// S'abonner aux événements
		pusherChannel.bind(PUSHER_SUBSCRIPTION_SUCCEEDED, () => {
			const newParticipants: Participant[] = [];
			pusherChannel.members.each((member: PusherMember) => {
				newParticipants.push({
					id: member.id,
					name: member.info?.name || `User-${member.id.substring(0,4)}`,
					vote: null,
					hasVoted: false
				});
			});
      setParticipants(roomState, newParticipants);
		});

		pusherChannel.bind(PUSHER_MEMBER_ADDED, (member: PusherMember) => {
      addParticipant(roomState, member)
      // si possible, envoyer le vote actuel à ce nouvel utilisateur vu qu'aucun état n'est stocké ?
      const myId = pusherChannel?.members.me.id;
      const myVote = roomState.participants.find(p => p.id === myId).vote;
      if (myVote !== null && myVote !== undefined) {
        pusherChannel.trigger(EVENT_CLIENT_VOTE, {userId: myId, vote: myVote, targetUserId: member.id});
      }
		});

		pusherChannel.bind(PUSHER_MEMBER_REMOVED, (member: any) => {
			roomState.participants = roomState.participants.filter(p => p.id !== member.id);
		});
		
		// Événements custom de notre application
		pusherChannel.bind(EVENT_CLIENT_VOTE, (data: { userId: string, vote: string, targetUserId: string }) => {
      const myId = pusherChannel?.members.me.id;
      // si pas de targetUserId, c'est pour tout le monde, on traite,
      // si targetUserId = moi, on traite aussi
      // sinon on ignore
      if (!data.targetUserId || data.targetUserId === myId) {
        // if (data.userId === myId) {
        //   // NOTE: on ne passe jamais là...
        //   console.log("je reçois aussi mon vote");
        // }
        const participant = roomState.participants.find(p => p.id === data.userId);
        if (participant) {
          console.log("updating participant vote in roomState", data.vote);
          participant.vote = data.vote;
          participant.hasVoted = true;
        }
      } else {
        // ignorer
        console.log("ignored", data.targetUserId, myId);
      }
		});

		pusherChannel.bind(EVENT_CLIENT_SHOW_VOTES, () => {
      showVotes(roomState);
		});

    pusherChannel.bind(EVENT_CLIENT_HIDE_VOTES, () => {
      hideVotes(roomState);
    });

		pusherChannel.bind(EVENT_CLIENT_RESET, () => {
      resetAllVotes(roomState);
      hideVotes(roomState);
		});

		pusherChannel.bind(EVENT_CLIENT_CHANGED_SEQUENCE, (data: { sequenceName: string }) => {
      setSequenceByName(roomState, data.sequenceName);
      // On reset aussi les votes lors du changement de séquence
      hideVotes(roomState);
      resetAllVotes(roomState);

      pusherChannel.trigger(EVENT_CLIENT_RESET, {});
		});

		pusherChannel.bind(EVENT_CLIENT_CHANGED_ROOM_NAME, (data: { name: string }) => {
			roomState.name = data.name;
		});
		
		pusherChannel.bind(EVENT_CLIENT_CHANGED_ROOM_DESCRIPTION, (data: { description: string }) => {
			roomState.description = data.description;
		});
	}

	$effect(() => {
		// Cleanup quand le composant est détruit
		return () => {
			pusherChannel?.unsubscribe();
		};
	});

</script>

<div class="page-container">
	{#if !user.hasJoined}
		<div class="modal-overlay">
			<div class="modal-content">
				<form onsubmit={e => {e.preventDefault(); handleJoin(e);}}>
					<h2>Rejoindre la salle de Poker Planning</h2>
					<p>Salle : <input type="text" name="room" placeholder="Votre salle" required bind:value={roomId}/></p>
					<input type="text" name="name" placeholder="Votre pseudo" required />
					<button type="submit">Rejoindre</button>
				</form>
			</div>
		</div>
	{:else}
		<PokerBoard bind:roomState={roomState} {pusherChannel} meId={pusherChannel?.members.me.id} />
	{/if}
</div>

<style>
	/* Styles pour le modal de pseudo */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.modal-content {
		background: white;
		padding: 2rem 3rem;
		border-radius: 8px;
		text-align: center;
	}
    /* ... autres styles ... */
</style>