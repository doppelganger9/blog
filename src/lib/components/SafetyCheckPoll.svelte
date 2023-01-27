<script lang="ts">
  import { onMount } from "svelte"
  import { i18n, registerMoreLabels } from "$lib/stores/i18n";

  let functionUrl = '/.netlify/functions/polls'; // 'http://localhost:9999/.netlify/functions/polls' // with netlify dev tools
  let functionDescriptionUrl = '/.netlify/functions/poll-description'; // 'http://localhost:9999/.netlify/functions/polls' // with netlify dev tools

  registerMoreLabels({
    'fr': {
      'subtitle': 'Dans quelle mesure vous sentez-vous en sécurité pour parler dans ce groupe de personne ?',
      'Loading Results...': 'Chargement en cours...',
      'Lambda Function is not responding. Try again later...': 'La Lambda Function ne réponds pas. Essayez plus tard...',
      'Results': 'Résultats',
      'No results': 'Aucun résultats',
      'Retry': 'Ré-essayer',
      'User Identifier (anonymous UUID, or anything else)': 'Identifiant utilisateur (un UUID anonyme ou ce que vous voulez)',
      'Response submitted...': 'Réponse envoyée...',
      'Your answer': 'Votre réponse',
      'Change my answer': 'Changer ma réponse',
      'Answer choice': 'Choix de réponse',
      'Submit your answer': 'Envoyer votre réponse'
    },
    'en': {
      'subtitle': 'How safe do you feel within the group?',
      '4: certains sujets tabous': '4: A few subjects to avoid',
      '3: ça dépends': '3: it depends',
      '2: silencieux': '2: silence',
      '1 : pas de vague = "oui oui"': '1 : no drama, always yes'
    }
  });

  interface Answer {
    userIdentifier: string;
    answer: string;
  }

  let uuid = crypto.randomUUID();

  // TODO plutôt que undefined ici, peut-être refactorer pour qu'on ait directement une promise ?
  let resultsFetch = undefined, resultsCache = undefined;
  let responseFetch = undefined;
  let serviceUnavailable = undefined;
  let responseFields = undefined;

  const refreshResults = () => {
    resultsFetch = new Promise((resolve, reject) => {
      fetch(functionUrl, {
        method: 'GET',
        headers: new Headers({
          'content-type': 'application/json',
          'Accept': 'application/json',
        })
      }).then(response => response.json().then(data => {
        resultsCache = data;
        resolve(data);
      }).catch(reject)).catch((err) => {
        if (err?.message == 'Failed to fetch') {
          serviceUnavailable = true;
        }
        reject(err);
      });
    });
  };

  const postAnswer = (data: Answer) => {
    const body = JSON.stringify(data);
    responseFetch = new Promise((resolve, reject) => {
      fetch(functionUrl, {
        method: 'POST',
        headers: new Headers({
          'content-type': 'application/json',
          'Accept': 'application/json',
        }),
        body
      })
      .then(response => response.json().then(data => {
        refreshResults();
        resolve(data);
      }).catch(reject))
      .catch(reject);
    });
  }

  const describeFields = () => {
    responseFields = new Promise((resolve, reject) => {
      fetch(functionDescriptionUrl, {
        method: 'GET',
        headers: new Headers({
          'Accept': 'application/json',
        })
      })
      .then(response => response.json()
        .then(data => {
          if (data) {
            const answerFieldDescription: any = Object.values(data.fields).filter((f: any) => f.name === 'answer')[0];
            const expectedAnswers = [...answerFieldDescription.options.choices.map(c => c.name)];
            return resolve(expectedAnswers);
          } else {
            return reject('empty data');
          }
        })
        .catch(reject)
      )
      .catch(reject);
    });
  }

  onMount(() => {
    // For dev env. Run function in parallel with `netlify serve:lambda`
    if (window.location.origin?.indexOf('localhost')>=0) {
      functionUrl = 'http://localhost:9999/.netlify/functions/polls' // with netlify dev tools
      functionDescriptionUrl = 'http://localhost:9999/.netlify/functions/poll-description' // with netlify dev tools
    }
    refreshResults();
    describeFields();
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { target: form } = event;
    const data = {
      userIdentifier: form.userIdentifier.value,
      answer: form.answer.value,
    } as Answer;
    postAnswer(data);
  };
</script>

{#if serviceUnavailable}
<div class="warning">{$i18n`Lambda Function is not responding. Try again later...`}</div>
{:else}

  <h2 class='question'>{$i18n`subtitle`}</h2>

  <hr/>
  <h2>{$i18n`Your answer`}</h2>
  {#if responseFetch}
    {#await responseFetch}
    <p>{$i18n`Response submitted...`}</p>
    {:then response}
    <div class="notification ok">{response.message}</div>
    <button on:click={() => responseFetch = undefined}>{$i18n`Change my answer`}</button>
    {:catch err}
    <div class="notification error">{err.message}</div>
    <button on:click={() => responseFetch = undefined}>{$i18n`Retry`}</button>
    {/await}
  {:else}
  <form on:submit={handleSubmit}>
    <label for="userIdentifier">{$i18n`User Identifier (anonymous UUID, or anything else)`}</label>
    <input id="userIdentifier" name="userIdentifier" type="text" required value="{uuid}" size="40">
    <br/>
    {#if responseFields}
      {#await responseFields}
      {$i18n`Loading possible answers`}
      {:then expectedAnswers}
        <label for="answer">{$i18n`Answer choice`}</label>
        <select id="answer" name="answer" required>
        {#each expectedAnswers as expectedAnswer}
          <option label="{$i18n`${expectedAnswer}`}" value="{expectedAnswer}"></option>
        {/each}
        </select>
      {:catch error}
      {$i18n`Error fetching possible answers`}
      {/await}
    {/if}
    <br/>
    <button type="submit" value="submit">{$i18n`Submit your answer`}</button>
  </form>
  {/if}

  <hr/>

  <h2>{$i18n`Results`}</h2>

  {#await resultsFetch}
  <p>{$i18n`Loading Results...`}</p>
  <div class="results">
    {#if resultsCache}
    <dl>
      {#if responseFields}
        {#await responseFields}
          {$i18n`Loading possible answers`}
        {:then expectedAnswers}
          {#each expectedAnswers as expectedAnswer}
            <dt>{$i18n`${expectedAnswer}`}</dt><dd>{resultsCache?.filter(x => x.answer == expectedAnswer).length}</dd>
          {/each}
        {:catch error}
          {$i18n`Error fetching possible answers`}
        {/await}
      {/if}
    </dl>
    {:else}
    {$i18n`No results`}
    {/if}
  </div>
  {:then results}
  <div class="results">
    <dl>
      {#if responseFields}
        {#await responseFields}
          {$i18n`Loading possible answers`}
        {:then expectedAnswers}
          {#each expectedAnswers as expectedAnswer}
            <dt>{$i18n`${expectedAnswer}`}</dt><dd>{results?.filter(x => x.answer == expectedAnswer).length}</dd>
          {/each}
        {:catch error}
          {$i18n`Error fetching possible answers`}
        {/await}
      {/if}
    </dl>
  </div>
  {:catch err}
  <p>{err.message}</p>
  <div class="results">
    {#if resultsCache}
    <dl>
      {#if responseFields}
        {#await responseFields}
          {$i18n`Loading possible answers`}
        {:then expectedAnswers}
          {#each expectedAnswers as expectedAnswer}
            <dt>{$i18n`${expectedAnswer}`}</dt><dd>{resultsCache?.filter(x => x.answer == expectedAnswer).length}</dd>
          {/each}
        {:catch error}
          {$i18n`Error fetching possible answers`}
        {/await}
      {/if}
    </dl>
    {:else}
    {$i18n`No results`}
    {/if}
  </div>
  <button on:click={refreshResults}>{$i18n`Retry`}</button>
  {/await}
{/if} 

<style>
  .question {
    color: darkorchid;
  }
  .notification.ok {
    color: green;
  }
  .notification.error {
    color: red;
  }
  .warning {
    border: 1px solid orange;
    color: orange;
    padding: 2em;
    margin: 2em;
  }
  button {
    padding: 1em;
    margin: 1em auto;
    color: white;
    background-color: darkorchid;
    border: 1px solid black;
    border-radius: 2px;
  }
  button:hover {
    color: darkorchid;
    background-color: rgb(227, 199, 241);
    border-color: darkorchid;
  }
  input, select {
    padding: 1em;
    margin: 1em auto;
  }
  .results {
    color: green;
  }
  dl {
    display: flex;
    flex-flow: row;
    flex-wrap: wrap;
    width: 400px;      /* set the container width*/
    overflow: visible;
  }
  dl dt {
    flex: 0 0 70%;
    text-overflow: ellipsis;
    overflow: hidden;
    padding: 0 2em;
    box-sizing: border-box;
  }
  dl dd {
    flex:0 0 30%;
    margin-left: auto;
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  dt:nth-child(1), dd:nth-child(2) {
    background-color:rgb(205, 255, 165);
  }
  dt:nth-child(3), dd:nth-child(4) {
    background-color:rgb(252, 255, 207);
  }
  dt:nth-child(5), dd:nth-child(6) {
    background-color:rgb(255, 228, 138);
  }
  dt:nth-child(7), dd:nth-child(8) {
    background-color:rgb(255, 178, 144);
  }
  dt:nth-child(9), dd:nth-child(10) {
    background-color:rgb(255, 129, 129);
  }
</style>