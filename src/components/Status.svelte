<script>
  import { fetch } from 'cross-fetch';
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';

  const all_status = {
    '-1': { text:'...', class:'waiting'},
    '0': { text:'paused', class:'paused'},
    '1': { text:'not checked yet', class:'not_checked_yet'},
    '2': { text:'up', class:'up'},
    '8': { text:'seems down', class:'seems_down'},
    '9': { text:'down', class:'down'},
  };

  const API_KEY = 'm782954097-5449c0939742ace6ade5d999';
  let status = writable('-1');

  onMount(() => {
    console.debug('onMount called');

    fetch('https://api.uptimerobot.com/v2/getMonitors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: `{"api_key":"${API_KEY}","monitors":["782954097"],"format":"json"}`,
    }).then((response) => {
      console.debug(response);
      response.json().then(json => {
        console.debug(json);
        $status = ''+json.monitors[0].status;
      });
    }).catch(console.error);
  });
</script>

<a data-cy="status-indicator" class="status {all_status[$status].class}" href='https://status.lacourt.dev'>
  Status: {all_status[$status].text}
</a>

<style>
a.status.waiting::after {
  content:': ⏳'
}
a.status.paused::after {
  content:': ⏸'
}
a.status.not_checked_yet::after {
  content:': 🌫'
}
a.status.up::after {
  content:': ✅'
}
a.status.seems_down::after {
  content:': ⚠️'
}
a.status.down::after {
  content:': 🆘'
}
</style>
