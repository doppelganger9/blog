<script>
import { onMount } from 'svelte';

let size = 50;
let text = 1;
let divText;
let w, h;
let adaptTextSize = () => {
  size = `${(Math.min(w,h) / text.length)}px`;
};

// Random CSS texture on each visit (replaces source.unsplash.com/featured, shut down in 2024).
const PATTERNS = [
  (a, b, c, n) => `repeating-linear-gradient(${n * 3}deg, ${a} 0 12px, ${b} 12px 24px, ${c} 24px 36px)`,
  (a, b, c, n) => `repeating-conic-gradient(from ${n}deg, ${a} 0 25%, ${b} 0 50%) 0 0 / ${24 + n % 40}px ${24 + n % 40}px, ${c}`,
  (a, b, c, n) => `radial-gradient(circle, ${a} 25%, transparent 26%) 0 0 / ${16 + n % 24}px ${16 + n % 24}px, radial-gradient(circle, ${b} 25%, transparent 26%) ${8 + n % 12}px ${8 + n % 12}px / ${16 + n % 24}px ${16 + n % 24}px, ${c}`,
  (a, b, c, n) => `repeating-radial-gradient(circle at ${n % 100}% ${(n * 7) % 100}%, ${a} 0 10px, ${b} 10px 20px, ${c} 20px 30px)`,
  (a, b, c, n) => `linear-gradient(${n}deg, ${a}, transparent 70%), repeating-linear-gradient(${n + 90}deg, ${b} 0 2px, ${c} 2px 14px)`,
];
let texture = PATTERNS[0]('hsl(280 70% 45%)', 'hsl(200 70% 45%)', 'hsl(20 70% 55%)', 45);
onMount(() => {
  const random = (max) => Math.floor(Math.random() * max);
  const hue = random(360);
  const color = (shift, light) => `hsl(${(hue + shift) % 360} ${50 + random(40)}% ${light}%)`;
  const pattern = PATTERNS[random(PATTERNS.length)];
  texture = pattern(color(0, 35 + random(20)), color(120 + random(60), 40 + random(20)), color(220 + random(60), 50 + random(20)), random(180));
});
</script>

<style>
.image-container {
  position: relative; /* Needed to position the cutout text in the middle of the image */
  height: 70vh; /* Some height */
  width: 100%;
  padding: 0;
  margin: 0;
}
.text {
  line-height: 70vh;
  font-family: sans-serif;
  background-color: white;
  color: black;
  font-weight: bold;
  margin: 0 auto; /* Center the text container */
  padding: 10px;
  width: 100%;
  height: 100%;
  text-align: center; /* Center text */
  position: absolute; /* Position text */
  top: 50%; /* Position text in the middle */
  left: 50%; /* Position text in the middle */
  transform: translate(-50%, -50%); /* Position text in the middle */
  mix-blend-mode: screen; /* This makes the cutout text possible */
}
</style>
<h1>Big Text {text}</h1>
<div class="image-container" style="background: {texture};" bind:clientWidth={w} bind:clientHeight={h}>
  <input type="text" class="text" style="font-size: {size};" on:keydown={() => adaptTextSize()} on:keyup={() => adaptTextSize()}  bind:value={text} />
</div>
