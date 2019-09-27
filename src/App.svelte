<script>
  import { onMount } from "svelte";
  import { Alert, Button, FormGroup, Input, Label } from "sveltestrap";

  import { Pleno, Docena, Apuesta, PLENO, DOCENA } from "./apuesta";
  export let name;

  //DODINO
  let apuesta = new Apuesta();
  let opcionesFecha = {};
  let fechaModel = {};
  let tiposApuesta = [PLENO, DOCENA];
  let errorMessage = "";

  function apostar() {
    try {
      apuesta.fecha = convertirADate(fechaModel);
      errorMessage = "";
      apuesta.apostar();
    } catch (errorValidation) {
      errorMessage = errorValidation;
    }
  }
  onMount(() => {
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    opcionesFecha = {
      dateFormat: "dd/mm/yyyy",
      disableUntil: convertirANuevoDate(ayer)
    };
    const fechaApuesta = apuesta.fecha;
    fechaModel = {
      date: convertirANuevoDate(fechaApuesta)
    };
  });

  function convertirANuevoDate(fecha) {
    return {
      year: fecha.getFullYear(),
      month: fecha.getMonth() + 1,
      day: fecha.getDate()
    };
  }

  function convertirADate(fecha) {
    if (!fecha) return null;
    return new Date(fecha.year, fecha.month - 1, fecha.day);
  }
  //DODINO

  let visible = true;

  const color = "primary";

  $: sarasa = console.log(apuesta);
</script>

<style>
  .centrado {
    text-align: center;
  }
  .gris {
    color: #9e9e9e;
    font-weight: bold;
  }
  .boton {
    margin-top: 2rem;
    padding: 1rem;
  }

  .titulo {
    margin-top: 3rem;
  }

  .apuesta-form {
    margin: 2rem;
    padding: 3rem;
    background-color: #e6eff7;
  }

  .error {
    height: 3rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }
</style>

<div>
  <div class="error">
    <div>
      <Alert
        class="error"
        color="danger"
        isOpen={errorMessage}
        toggle={() => (errorMessage = '')}>
        {errorMessage}
      </Alert>
    </div>
  </div>
  <p class="h4 text-center mb-4 titulo">Apuestas de Ruleta</p>
  <div class="card apuesta-form">
    <FormGroup>
      <h5 class="gris" for="exampleDate">Fecha</h5>
      <Input
        type="date"
        name="date"
        id="date"
        placeholder="Fecha"
        bind:value={fechaModel} />
    </FormGroup>
    <FormGroup>
      <div class="md-form">
        <h5 class="gris" for="exampleNumber">Monto</h5>
        <Input
          class="form-control"
          required="true"
          type="number"
          name="number"
          id="exampleNumber"
          bind:value={apuesta.monto} />
      </div>
    </FormGroup>
    <FormGroup>
      <h5 class="gris" for="exampleSelect">Tipo de Apuesta</h5>
      <select
        bind:value={apuesta.tipoApuesta}
        on:change={() => (apuesta.valorApostado = apuesta.tipoApuesta.valoresAApostar[0])}
        class="form-control"
        required="true"
        name="select"
        id="exampleSelect">
        {#each tiposApuesta as opcion}
          <option value={opcion}>{opcion.descripcion}</option>
        {/each}
      </select>
    </FormGroup>
    <FormGroup>
      <h5 class="gris" for="exampleSelect">Qué apostás</h5>
      <select
        bind:value={apuesta.valorApostado}
        name="select"
        class="form-control"
        required="true"
        id="exampleSelect">
        {#each apuesta.tipoApuesta.valoresAApostar as opcion}
          <option>{opcion}</option>
        {/each}
      </select>
    </FormGroup>
    <div class="centrado">
      <button
        on:click={apostar}
        {color}
        type="button"
        class="btn btn-primary boton">
        APOSTAR
      </button>
    </div>
  </div>
  {#if apuesta.resultado}
    <div class="resultado">
      <div>
        <Alert
          class="resultado"
          color={apuesta.resultado.gano() ? 'success' : 'warning'}
          isOpen={apuesta.resultado}
          toggle={() => (apuesta.resultado = null)}>
          {apuesta.resultado.valor()}
        </Alert>
      </div>
    </div>
  {/if}
</div>
