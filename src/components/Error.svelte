<script>
  export let message
  import { Alert } from 'sveltestrap'
</script>

<style>
</style>

<Alert data-testid="error" color="danger" isOpen={message} toggle={() => (message = '')}>{message}</Alert>
