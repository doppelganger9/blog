<script lang="ts">
  let { value, isSelected = false, onVote } = $props<{ value: string; isSelected: boolean; onVote?: (event:any) => void }>();
</script>

<button class="card" class:selected={isSelected} onclick={(e) => { console.log("card.onClick", e); onVote?.(e);}}>
	<span>{value}</span>
</button>

<style>
	.card {
		width: 80px;
		height: 120px;
		margin: 10px 10px 0 0;
		border: 2px solid #ccc;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2rem;
		font-weight: bold;
		cursor: pointer;
		transition: transform 0.2s, box-shadow 0.2s;
		background: white;
	}
	.card:hover {
		transform: translateY(-5px);
		box-shadow: 0 8px 15px rgba(0,0,0,0.1);
	}
	.card.selected {
		border-color: #007bff;
		background-color: #e6f2ff;
		transform: scale(1.05);
	}
</style>