<script>
    let currentKeyTarget;
    let intervalID;
    let intervalInMS = 2000;
    $: success = false;
    $: error = false;
    $: allErrorKeys = [];
    $: allSuccessKeys = [];

	function handleKeydown(event) {
		let keyPressed = event.key;
        if ((keyPressed === 'Meta') || (keyPressed === 'Control') || (keyPressed === 'Shift')) {
            console.log("ignored!");
            return;
        } else {
            if (keyPressed === currentKeyTarget) {
                console.log("correct!");
                success = true;
                error = false;
            } else {
                console.log("wrong!");
                success = false;
                error = true;
            }
        }

        if (!intervalID) {
            timedTurnHandler();
        }
    }
    
    function randomLetter() {
        const keys = " 1234567890-=`~!@#$%ˆ&*()_+qwertyuiop[]\\QWERTYUIOP{}|asdfghjkl;ÁSDFGHJKL:\"zxcvbnm,./ZXCVBNM<>?";
        const randomIndex = Math.floor(Math.random() * keys.length);
        const randomKey = keys.substr(randomIndex, 1);
        return randomKey;
    }

    function timedTurnHandler() {
        checkIfKeyCorrectAndSaveResult();
        console.log("== next turn ==");
        nextTurn();
    }

    function start() {
        if (!intervalID) {
            intervalID = setInterval(timedTurnHandler, intervalInMS);
        }
    }

    function stop() {
        if (intervalID) {
            clearInterval(intervalID);
            intervalID = undefined;
        }
    }

    function nextTurn() {
        success = false;
        error = false;
        currentKeyTarget = randomLetter();
        console.log(currentKeyTarget);
    }

    function checkIfKeyCorrectAndSaveResult() {
        if (currentKeyTarget) {
            if (success) {
                allSuccessKeys = [...allSuccessKeys, currentKeyTarget]; // assignment needed here
                console.log(`it was correct`, allSuccessKeys);
            }
            if (error) {
                allErrorKeys = [...allErrorKeys, currentKeyTarget]; // assignment needed here
                console.log(`it was wrong`, allErrorKeys);
            }
            if (!error && !success) {
                allErrorKeys = [...allErrorKeys, currentKeyTarget]; // assignment needed here
                console.log(`timed out`, allErrorKeys);
            }
        } else {
            // first turn no target
        }
    }

</script>

<style>
	div.test {
		display: flex;
        height: 30vh;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
    .error {
        background-color: red;
        color: white;
    }
    .success {
        background-color: greenyellow;
    }

	kbd {
		background-color: #eee;
		border-radius: 4px;
		font-size: 6em;
		padding: 0.2em 0.5em;
		border-top: 5px solid rgba(255,255,255,0.5);
		border-left: 5px solid rgba(255,255,255,0.5);
		border-right: 5px solid rgba(0,0,0,0.2);
		border-bottom: 5px solid rgba(0,0,0,0.2);
		color: #555;
	}

    .small {
        font-size: 1em;
		padding: 0.1em 0.2em;
		border-top: 2px solid rgba(255,255,255,0.5);
		border-left: 2px solid rgba(255,255,255,0.5);
		border-right: 2px solid rgba(0,0,0,0.2);
		border-bottom: 2px solid rgba(0,0,0,0.2);
    }
</style>

<svelte:window on:keydown={handleKeydown}/>
<h1>The Typing Train 🚂</h1>
<button on:click={start} disabled={intervalID ? 'disabled': ''}>Start</button>
<button on:click={stop} disabled={!intervalID ? 'disabled': ''}>Stop</button>
<div class="test" style="text-align: center">
	{#if currentKeyTarget}
		<kbd class:success class:error>
            {currentKeyTarget === ' ' ? 'Space' : currentKeyTarget}
        </kbd>
	{:else}
		<p>Press Start button</p>
	{/if}
</div>

<div>
<h2>Correct</h2>
{#each allSuccessKeys as key}
    <kbd class="small success">{key}</kbd>
{/each}
</div>

<div>
<h2>Wrong</h2>
{#each allErrorKeys as key}
    <kbd class="small error">{key}</kbd>
{/each}
</div>
