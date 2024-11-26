<script lang='ts'>
  import './styles.css'

  import { Apuesta, DOCENA, PLENO } from '$lib/apuesta'
  import Validador from '$lib/Validador.svelte'
  import dayjs from 'dayjs'

  const formatearFecha = (fecha: Date) => dayjs(fecha).format('YYYY-MM-DD')
  
  let fechaApuesta = $state(formatearFecha(new Date()))
  let apuestaPojo: any = $state({
    monto: 0,
    fecha: new Date(),
    tipoApuesta: PLENO,
    valorApostado: 1,
  })
  // https://github.com/sveltejs/svelte/issues/10560
  let apuestaModel: Apuesta = $state(new Apuesta())

  const fechaMinimaApuesta = formatearFecha(new Date())
  const tiposApuesta = [PLENO, DOCENA]
  const apostar = () => {
    apuestaModel = Object.assign(new Apuesta(), apuestaPojo)
    apuestaModel.apostar()
  }
</script>

<form class="form">
  <div class="row">
    <label for="fecha" class="label">Fecha</label>
    <input type="date" onchange={() => { apuestaPojo.fecha = dayjs(fechaApuesta).toDate() }} data-testid="fechaApuesta" bind:value={fechaApuesta} name="fechaApuesta" placeholder="Fecha de apuesta" min={fechaMinimaApuesta}>
    <Validador elemento={apuestaModel} atributo='fecha'></Validador>
  </div>
  <div class="row">
    <label for="monto">Monto</label>
    <input type="number" data-testid="monto" name="monto" class="numeric" bind:value={apuestaPojo.monto}
      placeholder="Monto en $" required={true}>
    <Validador elemento={apuestaModel} atributo='monto'></Validador>
  </div>
  <div class="row">
    <label for="tipoApuesta">Tipo de Apuesta</label>
    <select data-testid="tipoApuesta" name="tipoApuesta" class="form-control" bind:value={apuestaPojo.tipoApuesta}
      required={true} onchange={() => { apuestaPojo.valorApostado = ''}}>
      {#each tiposApuesta as tipo}
        <option value={tipo}>{tipo.descripcion}</option>
      {/each}
    </select>
    <Validador elemento={apuestaModel} atributo="'tipoApuesta'"></Validador>
  </div>
  <div class="row">
    <label for="apuesta">Qué apostás</label>
    <select name="apuesta" data-testid="apuesta" class="form-control" bind:value={apuestaPojo.valorApostado}
      disabled={!apuestaPojo.tipoApuesta?.valoresAApostar} required={true}>
      {#each apuestaPojo.tipoApuesta?.valoresAApostar ?? [] as valor}
          <option value={valor}>{valor}</option>
      {/each}
    </select>
    <Validador elemento={apuestaModel} atributo="'valorAApostar'"></Validador>
  </div>
  <div class="botonera">
    <button class="btn-primary" data-testid="btnApuesta" onclick={apostar} type="submit">Apostar</button>
  </div>
  <div class="row">
      {#if (apuestaModel.resultado)}
        <div class="message" data-testid="resultado">
          {apuestaModel.resultado.valor()}
        </div>
      {/if}
  </div>
</form>