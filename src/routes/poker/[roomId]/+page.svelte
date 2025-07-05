<script lang="ts">
	import { page } from '$app/state';
	import type { PresenceChannel } from 'pusher-js';  
  import Pusher from 'pusher-js';
  import { type RoomState, type Participant, resetAllVotes, hideVotes, showVotes, setSequenceByName, PUSHER_SUBSCRIPTION_SUCCEEDED, PUSHER_MEMBER_ADDED, PUSHER_MEMBER_REMOVED, EVENT_CLIENT_VOTE, EVENT_CLIENT_SHOW_VOTES, EVENT_CLIENT_HIDE_VOTES, EVENT_CLIENT_RESET, EVENT_CLIENT_CHANGE_SEQUENCE, setParticipants, type PusherMember, addParticipant } from '$lib/types';
	import PokerBoard from '$lib/components/PokerBoard.svelte';
	import { SEQUENCES } from '$lib/planningSequences';

	let user = $state({ name: '', hasJoined: false });
	let roomState = $state<RoomState>({
		participants: [],
		votesVisible: false,
		activeSequence: SEQUENCES.fibonacci
	});

	const roomId = page.params.roomId;
	const channelName = `presence-poker-room-${roomId}`;
	let pusherChannel = $state<PresenceChannel>();

	function handleJoin(e: SubmitEvent) {
		const formData = new FormData(e.target as HTMLFormElement);
		const name = formData.get('name') as string;
		if (name.trim()) {
			user.name = name.trim();
			user.hasJoined = true;
			connectToPusher(user);
		}
	}

	function connectToPusher(user: { name: string, hasJoined: boolean }) {
    // TODO mieux gérer les erreurs de connexion !!
    console.log("connectToPusher");
		const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
			cluster: import.meta.env.VITE_PUSHER_CLUSTER,
			authEndpoint: import.meta.env.VITE_PUSHER_AUTH_ENDPOINT || '/.netlify/functions/pusher-auth',
      auth: {
				params: { user_name: user.name }
			}
		});

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

		pusherChannel.bind(EVENT_CLIENT_CHANGE_SEQUENCE, (data: { sequenceName: string }) => {
      setSequenceByName(roomState, data.sequenceName);
      // On reset aussi les votes lors du changement de séquence
      hideVotes(roomState);
      resetAllVotes(roomState);

      pusherChannel.trigger(EVENT_CLIENT_RESET, {});
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
				<h2>Rejoindre la salle de Poker Planning</h2>
				<p>Salle : <strong>{roomId}</strong></p>
				<form onsubmit={e => {e.preventDefault(); handleJoin(e);}}>
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