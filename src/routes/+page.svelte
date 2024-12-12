<script lang="ts">
	import './styles.css'

	import { Apuesta, DOCENA, PLENO } from '$lib/apuesta.svelte'
	import Validador from '$lib/Validador.svelte'
	import { formatearFecha } from '$lib/utils'
	import dayjs from 'dayjs'

	let fechaApuesta = $state(formatearFecha(null))
	let apuesta: Apuesta = new Apuesta()

	const fechaMinimaApuesta = formatearFecha(new Date())
	const tiposApuesta = [PLENO, DOCENA]
</script>

<form class="form">
	<div class="row">
		<label for="fecha" class="label">Fecha</label>
		<input
			type="date"
			onchange={() => {
			  apuesta.fecha = dayjs(fechaApuesta).toDate()
			}}
			data-testid="fechaApuesta"
			bind:value={fechaApuesta}
			name="fechaApuesta"
			placeholder="Fecha de apuesta"
			min={fechaMinimaApuesta}
		/>
		<Validador elemento={apuesta} atributo="fecha"></Validador>
	</div>
	<div class="row">
		<label for="monto">Monto</label>
		<input
			type="number"
			data-testid="monto"
			name="monto"
			class="numeric"
			bind:value={apuesta.monto}
			placeholder="Monto en $"
			required={true}
		/>
		<Validador elemento={apuesta} atributo="monto"></Validador>
	</div>
	<div class="row">
		<label for="tipoApuesta">Tipo de Apuesta</label>
		<select
			data-testid="tipoApuesta"
			name="tipoApuesta"
			class="form-control"
			bind:value={apuesta.tipoApuesta}
			required={true}
			onchange={() => {
			  apuesta.valorApostado = ''
			}}
		>
			{#each tiposApuesta as tipo}
				<option value={tipo}>{tipo.descripcion}</option>
			{/each}
		</select>
		<Validador elemento={apuesta} atributo="tipoApuesta"></Validador>
	</div>
	<div class="row">
		<label for="apuesta">Qué apostás</label>
		<select
			name="apuesta"
			data-testid="apuesta"
			class="form-control"
			bind:value={apuesta.valorApostado}
			disabled={!apuesta.tipoApuesta?.valoresAApostar}
			required={true}
		>
			{#each apuesta.tipoApuesta?.valoresAApostar ?? [] as valor}
				<option value={valor}>{valor}</option>
			{/each}
		</select>
		<Validador elemento={apuesta} atributo="valorAApostar"></Validador>
	</div>
	<div class="botonera">
		<button
			class="btn-primary"
			data-testid="btnApuesta"
			onclick={() => apuesta.apostar()}
			type="submit">Apostar</button
		>
	</div>
	<div class="row">
		{#if apuesta.resultado}
			<div class="message" data-testid="resultado">
				{apuesta.resultado.valor()}
			</div>
		{/if}
	</div>
</form>
