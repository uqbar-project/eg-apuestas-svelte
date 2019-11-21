<script>
  export let resultado
  import { Alert } from 'sveltestrap'
  import Gatuli from './Gatuli.svelte'

  let hereKitty = false

  const handleMouseenter = () => (hereKitty = true)
  const handleMouseleave = () => (hereKitty = false)
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

<div class="resultado" on:mouseenter={handleMouseenter} on:mouseleave={handleMouseleave}>
  <Alert color={resultado.gano() ? 'success' : 'warning'} isOpen={resultado} toggle={() => (resultado = null)}>
    {resultado.valor()}
  </Alert>
  <!-- {#if hereKitty && resultado.gano()} -->
  <!-- <Gatuli hereKitty=hereKitty/> -->
  <img
    class:curious={hereKitty && resultado.gano()}
    alt="Kitten wants to know what's going on"
    src="images/gatuli.png" />

  <!-- {/if} -->
</div>
