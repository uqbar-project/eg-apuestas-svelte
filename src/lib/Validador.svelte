<script lang="ts">
	import './validador.css'

	let { elemento, atributo } = $props()
</script>

{#if elemento.hasErrors(atributo)}
	<div class="validation-row">
		<div data-testid={`errorMessage-${atributo}`} class="validation">
			{elemento.errorsFrom(atributo)}
		</div>
	</div>
{/if}
