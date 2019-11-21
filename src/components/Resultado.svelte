<script>
  export let resultado
  import { Alert } from 'sveltestrap'
  import Gatuli from './Gatuli.svelte'

  let hereKitty = false
  const handleMouseenter = () => (hereKitty = true)
  const handleMouseleave = () => (hereKitty = false)
</script>

<div class="resultado" on:mouseenter={handleMouseenter} on:mouseleave={handleMouseleave}>
  <Alert color={resultado.gano() ? 'success' : 'warning'} isOpen={resultado} toggle={() => (resultado = null)}>
    {resultado.valor()}
  </Alert>
  {#if resultado.gano()}
    <Gatuli {hereKitty} />
  {/if}
</div>
