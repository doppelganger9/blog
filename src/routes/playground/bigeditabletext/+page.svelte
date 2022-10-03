<script>
let size = 50;
let text = 1;
let divText;
let w, h;
let adaptTextSize = () => {
  size = `${(Math.min(w,h) / text.length)}px`;
};
</script>

<style>
.image-container {
  background-image: url("https://source.unsplash.com/featured/?textures-patterns"); /* The image used - important! */
  background-size: cover;
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
<div class="image-container" bind:clientWidth={w} bind:clientHeight={h}>
  <input type="text" class="text" style="font-size: {size};" on:keydown={() => adaptTextSize()} on:keyup={() => adaptTextSize()}  bind:value={text} />
</div>
