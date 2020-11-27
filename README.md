# Apuestas (SvelteJS)

_fork_ del ejemplo [Apuestas de una ruleta en Angular](https://github.com/uqbar-project/eg-apuestas-angular)

Realizado con [Svelte](https://svelte.dev) e implementando binding bidireccional.

![apuestas-demo](https://user-images.githubusercontent.com/26492157/69761286-afea3980-1145-11ea-8d1f-d6ee50ad0411.gif)

# Creación de la aplicación

Creamos la aplicación con [degit](https://github.com/Rich-Harris/degit) y agregamos la dependencia de [sveltestrap](https://github.com/bestguy/sveltestrap).

```bash
npx degit sveltejs/template svelte-app
cd svelte-app
npm install --save svelte sveltestrap
```

# Correr la aplicación

```bash
npm run dev
```

Ya podés navegar a [localhost:5000](http://localhost:5000) y deberías ver tu aplicación corriendo. Editá los componentes dentro de `src`, guardá y verás los cambios en el browser.

# Introducción a Svelte

## Componentes

En Svelte, una aplicación está compuesta por uno o más componentes. Un componente es un bloque de código reusable que encapsula HTML, CSS Y JavaScript que conviven juntos en un archivo .svelte.

### Ejemplo

```svelte
<script>
  let name = 'world';
</script>

<h1>Hello {name}!</h1>
```

Entre llaves podemos poner el código JavaScript que querramos.

## Atributos dinámicos

```svelte
<script>
  let src = 'imagen.jpg';
</script>

<img src={src} alt="Imagen de ejemplo.">
```

como el nombre y el valor del atributo son lo mismo, se puede escribir así:

```svelte
<img {src} alt="Imagen de ejemplo.">
```

## Estilos

Al igual que en HTML, podemos agregar el tag `<style>` a nuestro componente y ahí poner el css que deseemos. Los estilos se van a aplicar solo a ese componente.

```svelte
<style>
  p {
    color: purple;
    font-family: 'Comic Sans MS', cursive;
    font-size: 2em;
  }
</style>

<p>This is a paragraph.</p>
```

## Componentes anidados

Podemos importar componentes de otros archivos e incluirlos como muestra este ejemplo:

```svelte
<script>
  import Nested from './Nested.svelte';
</script>

<p>This is a paragraph.</p>
<Nested/>
```

# Reactividad

## Asignaciones

El DOM se mantiene sincronizado con el estado de nuestra aplicación - por ejemplo, en respuesta a un evento.

```svelte
<script>
  let count = 0;
</script>

<button on:click={()=> count += 1}>
  Clicked {count} {count === 1 ? 'time' : 'times'}
</button>
```

## Declaraciones reactivas

Svelte automáticamente actualiza el DOM cuando el estado de tu componente cambia. A menudo, algunas partes del estado de un componente necesitan ser calculadas de a partir de otros valores y si estas cambian, volver a calcularlas (el ejemplo de las fórmulas del excel).

Para eso tenemos las declaraciones reactivas:

```svelte
<script>
  let count = 0;
  
  function handleClick() {
    count += 1;
  }
  $: doubled = count * 2;
</script>

<button on:click= {handleClick}>
  Clicked {count} {count === 1 ? 'time' : 'times'}
</button>

<p>{count} doubled is {doubled}</p>

```

la línea `$: doubled = count * 2;` en Svelte quiere decir "corré este código cada vez que alguno de los valores referenciados cambie"

## Actualizando arrays y objetos

Como la reactividad se dispara por asignaciones, usar métodos de arrays como push y splice no generan actualizaciones automáticas.

Una forma de solucionar esto es agregar una asignación que parece redundante:

```js
function addNumber() {
  numbers.push(numbers.length + 1);
  numbers = numbers;
}
```

Una solución más idiomática:

```js
function addNumber() {
  numbers = [...numbers, numbers.length + 1];
}
```

Estos conceptos y otros más como props, lógica (parecido a los *ngIf, *ngFor, etc. de Angular), eventos, bindings, ciclos de vida, stores, transiciones, etc., se pueden encontar en el [tutorial](https://svelte.dev/tutorial) y también en la parte de [ejemplos](https://svelte.dev/examples).

# Aplicación

## Vista principal

El binding es bidireccional para cargar todos los datos de una apuesta: fecha, monto, tipo de apuesta y valor apostado. Cuando el formulario tiene un error se visualiza dicho error con un cartel rojo (alert-warning), y cuando el usuario decide apostar se le informa si ganó o perdió con un cartel verde (alert-success).

### Combos anidados

El anidamiento de combos consiste en que el valor apostado depende del tipo de apuesta: para la apuesta pleno los valores a apostar posibles son de 0 a 36 mientras que si se apuesta a docena, deberías apostar primera, segunda o tercera docena.

En nuestro modelo, la apuesta tiene un strategy TipoApuesta cuyas responsabilidades son:

- determinar los valores posibles a apostar
- validar si el tipo de apuesta es correcto

El componente principal (_App.svelte_) genera la lista de tipos de apuesta para poder llenar las opciones posibles del primer combo:
```js
  let tiposApuesta = [PLENO, DOCENA]
```

Apuesta.PLENO y Apuesta.DOCENA son dos constantes, ¿por qué hacemos esto? Porque a su vez la apuesta inicializa la referencia tipoApuesta como pleno:

```js
export class Apuesta {
  constructor() {
    this.fecha = new Date()
    this.monto
    this.tipoApuesta = PLENO
    this.valorApostado
  }
  ...
}

export const PLENO = new Pleno()
export const DOCENA = new Docena()
```

Veamos cómo se define el selector HTML en la vista:

```svelte
      <FormGroup>
        <h5 for="tipoDeApuesta">Tipo de Apuesta</h5>
        <select
          bind:value={apuesta.tipoApuesta}
          on:change={() => (apuesta.valorApostado = apuesta.tipoApuesta.valoresAApostar[0])}
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

```js
  this.tipoApuesta = new Pleno()
```
Ni en el componente svelte
```js
  let tiposApuesta = [new Pleno(), new Docena()]
```

porque eso genera nuevas copias de Pleno y Docena que son distintas a las que tendría Apuesta.

Por otra parte, los valores a apostar son numéricos, esto evita nuevas copias y por lo tanto, malos entendidos en el segundo combo. Vemos la configuración del selector en la vista:
```svelte
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

```svelte
  {#each apuesta.tipoApuesta.valoresAApostar as opcion}
    <option>{opcion}</option>
  {/each}
``` 

## Evento apostar

### Manejo de errores

Dado que al apostar los objetos de dominio apuesta pueden tirar errores de validación:

```js
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

```js
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
```svelte
    <div class="error">
      <Error bind:message={errorMessage} />
    </div>
 ```
 
_Error.svelte_
```svelte
    <div class="error">
      <Alert class="error" color="danger" isOpen={message} toggle={() => (message = '')}>{message}</Alert>
    </div>
```

### Resultado de la apuesta

Una vez pasadas las validaciones, se genera un objeto _Resultado_ dentro del objeto apuesta, que se visualiza en la vista. La visualización la delegamos al componente de svelte _Resultado_.

_App.svelte_
```svelte
  {#if apuesta.resultado}
    <Resultado bind:resultado={apuesta.resultado} />
  {/if}
```

_Resultado.svelte_
```svelte
<div class="resultado" on:mouseenter={handleMouseenter} on:mouseleave={handleMouseleave}>
  <Alert color={resultado.gano() ? 'success' : 'warning'} isOpen={resultado} toggle={() => (resultado = null)}>
    {resultado.valor()}
  </Alert>
  {#if resultado.gano()}
    <Gatuli {hereKitty} />
  {/if}
</div>
```
