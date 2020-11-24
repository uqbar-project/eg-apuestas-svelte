<script>
  import { Alert } from 'sveltestrap'
  import Gatuli from './Gatuli.svelte'
  import { resultado } from '../stores/resultadoStore'

  let hereKitty = false
  const handleMouseenter = () => (hereKitty = true)
  const handleMouseleave = () => (hereKitty = false)
</script>

<style>
  .resultado {
    text-align: center;
  }
</style>

{#if $resultado}
  <div data-testid="resultado"  class="resultado" on:mouseenter={handleMouseenter} on:mouseleave={handleMouseleave}>
    <Alert color={$resultado.gano() ? 'success' : 'warning'} toggle={() => (resultado.actualizar(null))}>
      <strong>{$resultado.valor()}</strong>
    </Alert>
    {#if $resultado.gano()}
      <Gatuli {hereKitty} />
    {/if}
  </div>
{/if}
