<script>
  export let resultado;
  import { Alert } from "sveltestrap";
</script>

<style>

</style>

<div class="resultado">
  <Alert
    color={resultado.gano() ? 'success' : 'warning'}
    isOpen={resultado}
    toggle={() => (resultado = null)}>
    {resultado.valor()}
  </Alert>
</div>
