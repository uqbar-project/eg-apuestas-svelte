<script lang="ts">
  import './validador.css'

  type ViewModel = {
    hasErrors: (_: string) => boolean
    errorsFrom: (_: string) => string
  }

  type ValidatorProps = {
    elemento: ViewModel
    atributo: string
  }

  let { elemento, atributo }: ValidatorProps = $props()
</script>

{#if elemento.hasErrors(atributo)}
  <div class="validation-row">
    <div data-testid={`errorMessage-${atributo}`} class="validation">
      {elemento.errorsFrom(atributo)}
    </div>
  </div>
{/if}
