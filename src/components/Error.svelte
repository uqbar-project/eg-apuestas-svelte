<script>
  export let message
  import { Alert } from 'sveltestrap'
</script>

<style>
  .error {
    height: 3rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }
</style>

<div class="error">
  <Alert class="error" color="danger" isOpen={message} toggle={() => (message = '')}>{message}</Alert>
</div>
