<script>
  export let hereKitty
</script>

<style>
  img {
    position: absolute;
    left: 0;
    bottom: -90px;
    transform: translate(-80%, 0) rotate(-30deg);
    transform-origin: 100% 100%;
    transition: transform 0.4s;
  }

  .curious {
    transform: translate(-15%, 0) rotate(0deg);
  }

  :global(body) {
    overflow: hidden;
  }
</style>

<img class:curious={hereKitty} alt="Kitten wants to know what's going on" src="images/gatuli.png" />
