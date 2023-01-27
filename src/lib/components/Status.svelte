<script>
  import { onMount } from 'svelte';
  import { status, updateStatus } from '$lib/stores/status';

  const all_status = {
    '-1': { text:'...', class:'waiting'},
    '0': { text:'paused', class:'paused'},
    '1': { text:'not checked yet', class:'not_checked_yet'},
    '2': { text:'up', class:'up'},
    '8': { text:'seems down', class:'seems_down'},
    '9': { text:'down', class:'down'},
    '404': { text:'api-404', class:'api-404'},
    '429': { text:'api-429', class:'api-429'},
    '500': { text:'api-500', class:'api-500'},
    'err': { text:'api-500', class:'api-500'},
  };

  onMount(() => {
    console.debug('onMount called');
    updateStatus();
  });
</script>

<a data-cy="status-indicator" class="status {all_status[$status].class}" href='https://stats.uptimerobot.com/ZYDp0hJL8'>
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

a.status.api-404::after {
  content:': 🕵️‍♂️'
}

a.status.api-429::after {
  content:': 🔫'
}

a.status.api-500::after {
  content:': 💥'
}

</style>
