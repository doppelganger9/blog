<script lang="ts">
  import Lang from "$lib/components/Lang.svelte"
  import SafetyCheckPoll from "$lib/components/SafetyCheckPoll.svelte";
  import { i18n, registerMoreLabels } from "$lib/stores/i18n";

  registerMoreLabels({
    'fr': {
      'Poll saving to AirTable with Netlify Lambda Function': 'Vote avec Lambda Function liée à AirTable',
      'see also the 2023-01-26 blog article': 'Voir aussi le billet du 2023-01-26'
    },
    'en': {
      'see also the 2023-01-26 blog article': 'See also the 2023-01-26 blog article'
    }
  });
</script>

<Lang />
<h1>{$i18n`Poll saving to AirTable with Netlify Lambda Function`}</h1>
<SafetyCheckPoll />
