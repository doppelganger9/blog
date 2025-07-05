<script lang="ts">
	import type { RoomState } from '$lib/types';
	import {setMyVote, resetMyVote, showVotes, hideVotes, resetAllVotes, setSequenceByName, EVENT_CLIENT_CHANGE_SEQUENCE, EVENT_CLIENT_RESET, EVENT_CLIENT_VOTE, EVENT_CLIENT_HIDE_VOTES, EVENT_CLIENT_SHOW_VOTES} from '$lib/types';
	import Card from './Card.svelte';
	import { SEQUENCES } from '$lib/planningSequences';
	import type { PresenceChannel } from 'pusher-js';  

	let { roomState = $bindable(), pusherChannel, meId } = $props<{
		roomState: RoomState;
		pusherChannel: PresenceChannel;
		meId: string;
	}>();

	function handleVote(vote: string) {
		setMyVote(roomState, meId, vote);
		// pour que ça fonctionne, il faut avoir activé les client events
		// voir https://dashboard.pusher.com/apps/2015156/settings

		// propagate vote action to others users' UI/State.
		pusherChannel.trigger(EVENT_CLIENT_VOTE, { userId: meId, vote });
	}

	function toggleReveal() {
		if (roomState.votesVisible) {
			hideVotes(roomState);
			// propagate reveal action to others users' UI/State.
			pusherChannel.trigger(EVENT_CLIENT_HIDE_VOTES, {});
		} else {
			showVotes(roomState);
			// propagate reveal action to others users' UI/State.
			pusherChannel.trigger(EVENT_CLIENT_SHOW_VOTES, {});
		}
	}

	/**
	 * Handle reset by the current user, not by others.
	 */
	function handleReset() {
		resetMyVote(roomState, meId);
		resetAllVotes(roomState);
		hideVotes(roomState);
		// propagate reset action to others users' UI/State.
		pusherChannel.trigger(EVENT_CLIENT_RESET, {});
	}
	
	function handleSequenceChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		setSequenceByName(roomState, target.value);
		resetMyVote(roomState, meId);
		resetAllVotes(roomState);
		// propagate sequence change to others users' UI/State.
		pusherChannel.trigger(EVENT_CLIENT_CHANGE_SEQUENCE, { sequenceName: target.value });
	}

	let selectedVote = $state(roomState.participants.find(p => p.id === meId)?.vote || null);
	$effect(() => {
		selectedVote = roomState.participants.find(p => p.id === meId)?.vote;
	});

	//// Un état dérivé (computed) pour savoir si tout le monde a voté
	//const allHaveVoted = $derived(roomState.participants.every(p => p.hasVoted));
	const myName = $derived(roomState.participants.filter(p => p.id === meId).map(p => p.name));
</script>

<main>
	<header>
		<h1>Planning Poker</h1>
		<h2>{roomState.name}</h2>
		<p>{roomState.description}</p>
		<div class="controls">
			<select onchange={handleSequenceChange}>
				{#each Object.keys(SEQUENCES) as seqName}
					<option value={seqName}>{seqName.charAt(0).toUpperCase() + seqName.slice(1)}</option>
				{/each}
			</select>
			<button onclick={toggleReveal}>{roomState.votesVisible ? 'Masquer' : 'Révéler'}</button>
			<button onclick={handleReset}>Réinitialiser</button>
		</div>
	</header>

	<section class="voting-area">
		<h2>Cher {myName}, ton vote :</h2>
		<div class="card-deck">
			{#each roomState.activeSequence as value}
				<Card {value} isSelected={selectedVote === value} onVote={(e) => {console.log("pokerboard-card-handler", e, value); handleVote(value);}} />
			{/each}
		</div>
	</section>

	{#if roomState.participants.length>1}
	<section class="participants">
		<h2>Les participants ({roomState.participants.length})</h2>
		<ul class="participant-list">
			{#each roomState.participants as p}
				<li class="participant-card">
					<div class="vote-display">
						{#if roomState.votesVisible}
							<span class="vote">{p.vote ?? '-'}</span>
						{:else if p.hasVoted}
							<span class="voted-icon">✓</span>
						{/if}
					</div>
					<span class="name">{p.name} {p.id === meId ? '(Vous)' : ''}</span>
				</li>
			{/each}
		</ul>
	</section>
	{:else}
	<section class="participants">
		<h2>Pas d'autres participants pour le moment...</h2>
	</section>
	{/if}
</main>

<style>
	.voted-icon {
		display: inline;
	}
	.vote-display {
		display: inline;
	}
	.card-deck {
    display: flex;
		align-items: center;
		justify-content: center;
  }
	.participant-list li {
		margin: 0;
	}
</style>