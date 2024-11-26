<script lang='ts'>
  import './styles.css'
	import { Apuesta, DOCENA, PLENO } from '$lib/apuesta'
	import dayjs from 'dayjs'
	import type { Resultado } from '$lib/resultado'
	import Validador from '$lib/Validador.svelte'

  const formatearFecha = (fecha: Date) => dayjs(fecha).format('YYYY-MM-DD')
  
  let fechaApuesta = $state(formatearFecha(new Date()))
  let monto = $state(0)
  let tipoApuesta = $state(PLENO)
  let valorApostado: any = $state(undefined)
  let apuesta: Apuesta = $state(new Apuesta())

  const updateApuesta = () => {
    apuesta = new Apuesta()
    apuesta.fecha = dayjs(fechaApuesta).toDate()
    apuesta.monto = monto
    apuesta.tipoApuesta = tipoApuesta
    apuesta.valorApostado = valorApostado
  }

  let resultado: Resultado | null = $state(null)
  let valoresAApostar = $derived(tipoApuesta?.valoresAApostar ?? [])

  const fechaMinimaApuesta = formatearFecha(new Date())
  const tiposApuesta = [PLENO, DOCENA]
  const apostar = () => {
    updateApuesta()
    apuesta.apostar()
    resultado = apuesta.resultado
  }
</script>

<form class="form">
  <div class="row">
    <label for="fecha" class="label">Fecha</label>
    <input type="date" data-testid="fechaApuesta" bind:value={fechaApuesta} name="fechaApuesta" placeholder="Fecha de apuesta" min={fechaMinimaApuesta}>
    <Validador elemento={apuesta} atributo='fecha'></Validador>
  </div>
  <div class="row">
    <label for="monto">Monto</label>
    <input type="number" data-testid="monto" name="monto" class="numeric" bind:value={monto}
      placeholder="Monto en $" required={true}>
    <Validador elemento={apuesta} atributo='monto'></Validador>
  </div>
  <div class="row">
    <label for="tipoApuesta">Tipo de Apuesta</label>
    <select data-testid="tipoApuesta" name="tipoApuesta" class="form-control" bind:value={tipoApuesta}
      required={true} onchange={() => { valorApostado = undefined}}>
      {#each tiposApuesta as tipo}
        <option value={tipo}>{tipo.descripcion}</option>
      {/each}
    </select>
    <Validador elemento={apuesta} atributo="'tipoApuesta'"></Validador>
  </div>
  <div class="row">
    <label for="apuesta">Qué apostás</label>
    <select name="apuesta" data-testid="apuesta" class="form-control" bind:value={valorApostado}
      disabled={!tipoApuesta?.valoresAApostar} required={true}>
      {#each valoresAApostar as valor}
          <option value={valor}>{valor}</option>
      {/each}
    </select>
    <Validador elemento={apuesta} atributo="'valorAApostar'"></Validador>
  </div>
  <div class="botonera">
    <button class="btn-primary" data-testid="btnApuesta" onclick={apostar} type="submit">Apostar</button>
  </div>
  <div class="row">
      {#if (resultado)}
        <div class="message" data-testid="resultado">
          {resultado.valor()}
        </div>
      {/if}
  </div>
</form>