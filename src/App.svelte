<script>
  import { Alert, Button, FormGroup, Input, Label } from "sveltestrap";
  export let name;

  let visible = false;
  let mensaje = "";

  let fecha;
  let monto = 0;
  const color = "primary";

  $: sarasa = console.log(fecha);

  function handleError() {
    visible = !visible;
    mensaje = "Error genérico";
  }
</script>

<style>
  .centrado {
    text-align: center;
  }
</style>

<Alert color="danger" isOpen={visible} toggle={() => (visible = false)}>
  {mensaje}
</Alert>

<h1 class="centrado">Apuesta de Ruleta</h1>

<FormGroup>
  <Label for="exampleDate">Fecha</Label>
  <Input
    type="date"
    name="date"
    id="date"
    placeholder="Fecha"
    bind:value={fecha} />
</FormGroup>
<FormGroup>
  <Label for="exampleNumber">Monto</Label>
  <Input type="number" name="number" id="exampleNumber" bind:value={monto} />
</FormGroup>
<FormGroup>
  <Label for="exampleSelect">Tipo de Apuesta</Label>
  <Input type="select" name="select" id="exampleSelect">
    <option>Pleno</option>
    <option>Docena</option>
  </Input>
</FormGroup>
<FormGroup>
  <Label for="exampleSelect">Qué apostas?</Label>
  <Input type="select" name="select" id="exampleSelect">
    <option>1</option>
    <option>2</option>
    <option>3</option>
    <option>4</option>
    <option>5</option>
  </Input>
</FormGroup>

<div class="centrado">
  <Button on:click={handleError} {color}>Apostar</Button>
</div>
