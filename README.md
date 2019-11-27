# Apuestas (SvelteJS)

_fork_ del ejemplo [Apuestas de una ruleta en Angular](https://github.com/uqbar-project/eg-apuestas-angular)

Realizado con [Svelte](https://svelte.dev) e implementando binding bidireccional.

![apuestas-demo](https://user-images.githubusercontent.com/26492157/69761286-afea3980-1145-11ea-8d1f-d6ee50ad0411.gif)

# Creación de la aplicación

Creamos la aplicación con [degit](https://github.com/Rich-Harris/degit) y agregamos las dependencias de [sveltestrap](https://github.com/bestguy/sveltestrap) y [svelte-calendar](https://github.com/6eDesign/svelte-calendar/blob/master/README.md) para contar con un control calendario.

```bash
npx degit sveltejs/template svelte-app
cd svelte-app
npm install --save svelte sveltestrap
npm install svelte-calendar
```

# Correr la aplicación

```bash
npm run dev
```

Ya podés navegar a [localhost:5000](http://localhost:5000) y deberías ver tu aplicación corriendo. Editá los componentes dentro de `src`, guardá y verás los cambios en el browser.


# Arquitectura general

# Vista principal

El binding es bidireccional para cargar todos los datos de una apuesta: fecha, monto, tipo de apuesta y valor apostado. Cuando el formulario tiene un error se visualiza dicho error con un cartel rojo (alert-warning), y cuando el usuario decide apostar se le informa si ganó o perdió con un cartel verde (alert-success).

## Ingreso de una fecha

Para abrir un calendario en un formulario modal, utilizamos el control Datepicker, de la siguiente manera:
```bash
    <Datepicker
          format={'#{d}/#{m}/#{Y}'}
          start={new Date()}
          on:dateSelected={event => (apuesta.fecha = event.detail.date)} />
```

Esto requiere hacer el siguiente import:

```bash
import Datepicker from 'svelte-calendar'
```

## Combos anidados

El anidamiento de combos consiste en que el valor apostado depende del tipo de apuesta: para la apuesta pleno los valores a apostar posibles son de 0 a 36 mientras que si se apuesta a docena, deberías apostar primera, segunda o tercera docena.

En nuestro modelo, la apuesta tiene un strategy TipoApuesta cuyas responsabilidades son:

- determinar los valores posibles a apostar
- validar si el tipo de apuesta es correcto

El componente principal (_App.svelte_) genera la lista de tipos de apuesta para poder llenar las opciones posibles del primer combo:
```bash
let tiposApuesta = [PLENO, DOCENA]
```

Apuesta.PLENO y Apuesta.DOCENA son dos constantes, ¿por qué hacemos esto? Porque a su vez la apuesta inicializa la referencia tipoApuesta como pleno:

```bash
export class Apuesta {
  constructor() {
    this.fecha = new Date()
    this.monto
    this.tipoApuesta = PLENO
    this.valorApostado
    this.resultado
  }
  ...
}

export const PLENO = new Pleno()
export const DOCENA = new Docena()
```

Veamos cómo se define el selector HTML en la vista:

```bash
      <FormGroup>
        <h5 for="tipoDeApuesta">Tipo de Apuesta</h5>
        <select
          bind:value={apuesta.tipoApuesta}
          class="form-control"
          required="true"
          name="select"
          id="tipoDeApuesta">
          {#each tiposApuesta as opcion}
            <option value={opcion}>{opcion.descripcion}</option>
          {/each}
        </select>
      </FormGroup>
```
Aquí vemos quie las opciones salen de la colección tiposApuesta que define el componente svelte, mientras que hay un binding bidireccional del select hacia apuesta.tipoApuesta. Entonces si la apuesta tiene un valor que no está dentro de las opciones, no será una selección válida para el combo, y no va a mostrar nada. Es decir, tanto la lista de tipos de apuesta como el valor tipoApuesta tienen que coincidir, no es válido hacer en apuesta:

```bash
    this.tipoApuesta = new Pleno()
```
Ni en el componente svelte
```bash
  let tiposApuesta = [new Pleno(), new Docena()]
```

porque eso genera nuevas copias de Pleno y Docena que son distintas a las que tendría Apuesta.

Por otra parte, los valores a apostar son numéricos, esto evita nuevas copias y por lo tanto, malos entendidos en el segundo combo. Vemos la configuración del selector en la vista:
```bash
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
```

Es interesante que las opciones salen de `apuesta.tipoApuesta.valoresAApostar`, por lo tanto, cuando modificamos la selección del tipo de apuesta en el primer combo, eso dispara una nueva lista de opciones para el segundo combo.

Un detalle adicional, se puede bindear el modelo de cada opción (bind:value) vs. el valor a mostrar (el html encerrado entre los tags option):

```bash
  {#each apuesta.tipoApuesta.valoresAApostar as opcion}
    <option>{opcion}</option>
   {/each}
``` 

# Evento apostar

## Manejo de errores

Dado que al apostar los objetos de dominio apuesta pueden tirar errores de validación:

```bash
  validarApuesta() {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    if (!this.fecha) {
      throw 'Debe ingresar una fecha de apuesta'
    }
    if (now.getTime() > this.fecha.getTime()) {
      throw 'Debe ingresar una fecha actual o posterior al día de hoy'
    }
```

lo que hace el componente svelte es interceptar los errores y guardarlos en una variable errorMessage

```bash
  function apostar() {
    try {
      errorMessage = ''
      apuesta.apostar()
      apuesta = apuesta
    } catch (validationError) {
      errorMessage = validationError
    }
  }
```

que a su vez la vista muestra llamando al componente _Error_ que se encarga de mostralo con un cartel en rojo (si la referencia tiene algún valor)

_App.svelte_
```bash
  <div class="error">
      <Error bind:message={errorMessage} />
    </div>
 ```
 
_Error.svelte_
```bash
<div class="error">
  <Alert class="error" color="danger" isOpen={message} toggle={() => (message = '')}>{message}</Alert>
</div>
```

## Resultado de la apuesta

Una vez pasadas las validaciones, se genera un objeto _Resultado_ dentro del objeto apuesta, que se visualiza en la vista. La visualización la delegamos al componente de svelte _Resultado_.

_App.svelte_
```bash
  {#if apuesta.resultado}
      <Resultado bind:resultado={apuesta.resultado} />
    {/if}
```

_Resultado.svelte_
```bash
{#if resultado}
  <div class="resultado>
    <Alert color={resultado.gano() ? 'success' : 'warning'} toggle={() => (resultado = null)}>
      <strong>{resultado.valor()}</strong>
    </Alert>
  </div>
{/if}
```

# Testing

## Testeo unitario
