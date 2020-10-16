<script>
  import { FormGroup } from 'sveltestrap'
  import { Apuesta, DOCENA, PLENO } from '../model/apuesta'
  import Error from './Error.svelte'
  import Resultado from './Resultado.svelte'

  let apuesta = new Apuesta()
  let tiposApuesta = [PLENO, DOCENA]
  let errorMessage = ''

  function apostar() {
    try {
      errorMessage = ''
      apuesta.apostar()
      apuesta = apuesta
    } catch (validationError) {
      errorMessage = validationError
    }
  }

  const fechaDeHoyString = () => new Date().toISOString().split('T')[0]
</script>

<style>
  .centrado {
    text-align: center;
  }
  .boton {
    margin-top: 2rem;
    font-size: 0.8rem;
    padding: 0.8rem 2rem;
  }

  .error {
    margin: 1rem 0;
  }

  .apuesta-form {
    margin: 2rem 0;
    padding: 2rem;
  }
</style>

<div class="container">
  <div>
    <div class="error">
      <Error bind:message={errorMessage} />
    </div>

    <p class="h4 text-center mb-4 titulo">Apuestas de Ruleta</p>
    <div class="card apuesta-form">
      <FormGroup>
        <h5 for="date">Fecha</h5>
        <input
          type="date"
          value={fechaDeHoyString()}
          min={fechaDeHoyString()}
          on:change={(event) => {
            apuesta.setFecha(event.target.value)
          }} />
      </FormGroup>
      <FormGroup>
        <div class="md-form">
          <h5 for="montoApuesta">Monto</h5>
          <input
            placeholder="Monto en $"
            class="form-control"
            required="true"
            type="number"
            name="number"
            id="montoApuesta"
            bind:value={apuesta.monto} />
        </div>
      </FormGroup>
      <FormGroup>
        <h5 for="tipoDeApuesta">Tipo de Apuesta</h5>
        <select
          bind:value={apuesta.tipoApuesta}
          on:blur={() => (apuesta.valorApostado = apuesta.tipoApuesta.valoresAApostar[0])}
          class="form-control"
          required="true"
          name="select"
          id="tipoDeApuesta">
          {#each tiposApuesta as opcion}
            <option value={opcion}>{opcion.descripcion}</option>
          {/each}
        </select>
      </FormGroup>
      <FormGroup>
        <h5 for="numeroApuesta">Qué apostás</h5>
        <select
          bind:value={apuesta.valorApostado}
          name="select"
          class="form-control"
          required="true"
          id="numeroApuesta">
          {#each apuesta.tipoApuesta.valoresAApostar as opcion}
            <option>{opcion}</option>
          {/each}
        </select>
      </FormGroup>
      <div class="centrado">
        <button on:click={apostar} type="button" class="btn btn-success boton">APOSTAR</button>
      </div>
    </div>
    {#if apuesta.resultado}
      <Resultado bind:resultado={apuesta.resultado} />
    {/if}
  </div>
</div>
