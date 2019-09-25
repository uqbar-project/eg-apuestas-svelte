<script>
  import { onMount } from "svelte";
  import { Alert, Button, FormGroup, Input, Label } from "sveltestrap";

  import { Pleno, Docena, Apuesta, PLENO, DOCENA } from "./apuesta";
  import Resultado from "./resultado";
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
</style>

<Alert color="danger" isOpen={visible} toggle={() => (visible = false)}>
  {errorMessage}
</Alert>

<h1 class="centrado">Apuesta de Ruleta</h1>

<FormGroup>
  <Label for="exampleDate">Fecha</Label>
  <Input
    type="date"
    name="date"
    id="date"
    placeholder="Fecha"
    bind:value={fechaModel} />
</FormGroup>
<FormGroup>
  <Label for="exampleNumber">Monto</Label>
  <Input
    type="number"
    name="number"
    id="exampleNumber"
    bind:value={apuesta.monto} />
</FormGroup>
<FormGroup>
  <Label for="exampleSelect">Tipo de Apuesta</Label>
  <select bind:value={apuesta.tipoApuesta} name="select" id="exampleSelect">
    {#each tiposApuesta as opcion}
      <option value={opcion}>{opcion.descripcion}</option>
    {/each}
  </select>
</FormGroup>
<FormGroup>
  <Label for="exampleSelect">Qué apostas?</Label>
  <select bind:value={apuesta.valorApostado} name="select" id="exampleSelect">
    {#each apuesta.tipoApuesta.valoresAApostar as opcion}
      <option>{opcion}</option>
    {/each}
  </select>
</FormGroup>

<div class="centrado">
  <Button on:click={apostar} {color}>Apostar</Button>
</div>
