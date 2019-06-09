<script>
  import { writable } from 'svelte/store';

  let computerCost = writable(3000);
  let timeWaiting = writable(10);
  let annualSalary = writable(63000);
  let nbDaysWorkAYear = writable(210);
  let nbHoursADay = writable(7);
  $: costPerDay = $annualSalary*3/$nbDaysWorkAYear;
  $: costPerMinuteOfTimeWaiting = (costPerDay/8)/60;
  $: costPerTimeWaiting = costPerMinuteOfTimeWaiting *$timeWaiting;
  $: moneyWastedWaitingPerYear = costPerTimeWaiting * $nbDaysWorkAYear;
</script>

<style>
  input[type=number] {
    padding: 0;
    margin: 0;
  }
  input[type=number].w-l {
    width: 4em;
  }
  input[type=number].w-m {
    width: 3.5em;
  }
  input[type=number].w-sm {
    width: 2.5em;
  }
  input[type=number].w-xs {
    width: 1.5em;
  }
</style>

<h1>The total cost of ownership of a developer's computer</h1>
<h2>
  showing 💰 figures to explain why we want better laptops, not fricking VDIs.
</h2>

<p>  Over one year, on a VDI, you will spend <input class="w-sm" type="number" bind:value={$timeWaiting}/> minutes waiting. Because some days it won't work, you'll have to call someone to fix your session. Other times, it hangs. And every days, it is slow. What else? Even being an engineer, you are not trusted, so you will loose time asking administrator rights. You're on an old version of Windows without the Linux subsystem (or you would not have admin rights so why even ask for it), you cannot install Docker, Kubernetes. You have to ask for another VM on Azure that cost also 200€/month just to patch your 💩 VDI. I won't even take this cost into account later, maybe I should. So {$timeWaiting} is a good overall estimation.</p>
<p>  Your annual salary is <input class="w-l" type="number" bind:value={$annualSalary}/>€.</p>
<p>  You work <input class="w-m" type="number" bind:value={$nbDaysWorkAYear}/> days each Year.</p>
<p>  So you cost <b>{''+(costPerDay/3).toFixed(2)}</b>€/day. Wait, you really cost your employer 3 times that, <b>{''+(costPerDay).toFixed(2)}</b>€/day.</p>
<p>  A day is <input class="w-xs" type="number" bind:value={$nbHoursADay}/>hours.</p>
<p>  So {$timeWaiting} minutes a day represents {''+(costPerTimeWaiting).toFixed(2)}€/day.</p>
<p>  This is {costPerTimeWaiting * $nbDaysWorkAYear} for a year.</p>
<p>  So how {moneyWastedWaitingPerYear} (money lost while waiting) compares to {$computerCost} (money that could be invested in a decent laptop)? </p>
<p>  Let's say a good developer laptop costs the company <input class="w-m" type="number" bind:value={$computerCost}/>€. This cost should be 'amorti' on 3 years, so really, expect a new computer every 3 years ({($computerCost / 3).toFixed(2)}€/year)</p>
<p>
   What does this amount represents in terms of time wasted? <br/>
  {(($computerCost / 3)/costPerMinuteOfTimeWaiting).toFixed(2)} minutes per year, <br/>
  or {((($computerCost / 3)/costPerMinuteOfTimeWaiting)/60).toFixed(2)} hours per year, <br/>
  or {(((($computerCost / 3)/costPerMinuteOfTimeWaiting)/60)/8).toFixed(2)} days of work per year.
</p>
<h3>
  Leave the VDI, and every 3 years, buy me a {$computerCost}€ laptop with admin rights and Linux/MacOS, and I will save you the price of the VDI+{(moneyWastedWaitingPerYear-($computerCost/3)).toFixed(2)}€ per year, which is to say at least {((moneyWastedWaitingPerYear-($computerCost/3))/costPerDay).toFixed(2)} DAYS OF WORK. Features. Quality. Think about that. <br/>I'm a living proof of this dream since 2017, AND I WILL NEVER GO BACK TO DOING MY JOB ON A VDI.
</h3>
<p>
  Moreover, I feel like the company care for me instead of impairing my ability to work. I can quickly install tools on my own, no need for tech support for MacOS (well known). (I called internal tech support once in 10 years since I'm on MacOS.)
</p>
<p>
  I can bring the laptop to meetings, conferences, home to fuel my passion for my job. I can really do flex-office without thinking about where I need to sit to be compfortable (dual screen, etc.). I can even use other spaces that are not equiped with VDIs. I can do meetings using the laptop to project slides and work.
</p>
<p>
  Ok, we don't yet have Office 365 so I can't do Outlook, Word, Excel. I still need a VDI sometimes for this BECAUSE WE DON'T HAVE REMOTE OFFICE ACCESS.
</p>
<p>
  Ok, there are security implications &amp; responsabilities to carry a laptop. But other companies are doing it. And usually the security flaws are bigger than just an engineer loosing its laptop.
</p>
