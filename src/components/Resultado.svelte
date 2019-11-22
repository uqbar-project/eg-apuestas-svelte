<script>
  export let resultado
  import { Alert } from 'sveltestrap'
  import Gatuli from './Gatuli.svelte'

  let hereKitty = false
  const handleMouseenter = () => (hereKitty = true)
  const handleMouseleave = () => (hereKitty = false)
</script>

{#if resultado}
  <div class="resultado" on:mouseenter={handleMouseenter} on:mouseleave={handleMouseleave}>
    <Alert color={resultado.gano() ? 'success' : 'warning'} toggle={() => (resultado = null)}>
      {resultado.valor()}
    </Alert>
    {#if resultado.gano()}
      <Gatuli {hereKitty} />
    {/if}
  </div>
{/if}
