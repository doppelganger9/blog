import type Pusher from "pusher-js";
import { SEQUENCES } from "./planningSequences";

// modèle représentant un participant.
export interface Participant {
  id: string;
  name: string;
  vote: string | null;
  hasVoted: boolean;
}

// modèle représentant un participant.
export interface PusherMember {
  id: string;
  info?: {
    name: string;
  };
}

// état de la salle de poker planning
export interface RoomState {
  participants: Participant[];
  votesVisible: boolean;
  activeSequence: string[];
}

// ACTIONS

// Server events
export const PUSHER_SUBSCRIPTION_SUCCEEDED = 'pusher:subscription_succeeded';
export const PUSHER_MEMBER_ADDED = 'pusher:member_added';
export const PUSHER_MEMBER_REMOVED = 'pusher:member_removed';
// Client events
export const EVENT_CLIENT_VOTE = 'client-vote';
export const EVENT_CLIENT_CHANGE_SEQUENCE = 'client-change-sequence';
export const EVENT_CLIENT_RESET = 'client-reset';
export const EVENT_CLIENT_HIDE_VOTES = 'client-hide-votes';
export const EVENT_CLIENT_SHOW_VOTES = 'client-show-votes';

export function setParticipants(roomState: RoomState, participants: Participant[]) {
  roomState.participants = participants;
}

export function addParticipant(roomState: RoomState, member: PusherMember) {
  console.log("addParticipant", member);
  roomState.participants.push({
    id: member.id,
    name: member.info?.name || `User-${member.id.substring(0, 4)}`,
    vote: null,
    hasVoted: false
  });
}

/** met à jour l'état RoomState pour cet utilisateur */
export function resetMyVote(roomState: RoomState, meId: string) {
  console.log("resetMyVote");
  for (const p of roomState.participants) {
    if (p.id === meId) {
      p.vote = null;
      p.hasVoted = false;
    }
  }
  // selectedVote sera mis à jour par le $derived ci-dessus
}

/** met à jour l'état RoomState pour cet utilisateur */
export function setMyVote(roomState:RoomState, meId: string, vote: string) {
  console.log("setMyVote", vote);
  for (const p of roomState.participants) {
    if (p.id === meId) {
      p.vote = vote;
      p.hasVoted = true;
    }
  }
  // selectedVote sera mis à jour par le $derived ci-dessus
}

export function resetAllVotes(roomState: RoomState) {
  console.log("resetAllVotes");
  for (const p of roomState.participants) {
    p.vote = null;
    p.hasVoted = false;
  }
}

export function hideVotes(roomState: RoomState) {
  roomState.votesVisible = false;
}

export function showVotes(roomState: RoomState) {
  roomState.votesVisible = true;
}

export function setSequenceByName(roomState: RoomState, sequenceName: string) {
  if (SEQUENCES[sequenceName]) {
    roomState.activeSequence = SEQUENCES[sequenceName];
  }
}

// TODO pouvoir mettre n'importe quelle séquence pas que celles prévues dans SEQUENCES
// export function setSequence(roomState: RoomState, sequence: string[]) {
//   roomState.activeSequence = sequence;
// }
