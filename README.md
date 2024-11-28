# Apuestas

[![Build](https://github.com/uqbar-project/eg-apuestas-svelte/actions/workflows/build.yml/badge.svg)](https://github.com/uqbar-project/eg-apuestas-svelte/actions/workflows/build.yml) [![codecov](https://codecov.io/gh/uqbar-project/eg-apuestas-svelte/graph/badge.svg?token=5kQDNFDROQ)](https://codecov.io/gh/uqbar-project/eg-apuestas-svelte)

![demo](./video/demo.gif)

## Binding del formulario

Cada input de la página tiene un binding con una propiedad de nuestro modelo que es la Apuesta. 

![binding](./images/Apuestas.binding.png)

Una decisión que nos obliga a tomar Svelte es que el objeto de dominio Apuesta expone cada atributo como un $state:

```svelte
export class Apuesta {
  fecha: Date = $state(new Date())
  monto = $state(0)
  tipoApuesta: TipoApuesta = $state(PLENO)
  valorApostado: string | number = $state(1)
  resultado: Resultado | null = $state(null)
  errors: ValidationMessage[] = $state([])

  ...
```

Esto implica que **no podemos migrar directamente** este ejemplo a otras tecnologías como Angular o Vue sin hacer cambios. A favor ganamos que nuestro formulario puede utilizar el binding de los inputs sobre cada propiedad de Apuesta. Esto incluye **el binding anidado de tipo de apuesta y valor apostado, que están sincronizados**:

```svelte
  <div class="row">
    <label for="tipoApuesta">Tipo de Apuesta</label>
    <select ...  name="tipoApuesta" bind:value={apuesta.tipoApuesta}>
      {#each tiposApuesta as tipo}
        <option value={tipo}>{tipo.descripcion}</option>
      {/each}
    </select>
    <...>
  </div>
  <div class="row">
    <label for="apuesta">Qué apostás</label>
    <select ... name="apuesta" bind:value={apuesta.valorApostado}>
      {#each apuesta.tipoApuesta?.valoresAApostar ?? [] as valor}
        <option value={valor}>{valor}</option>
      {/each}
    </select>
    <...>
  </div>
```

En el caso de la fecha, dado que el input se asocia a un string, tenemos que utilizar una propiedad `fechaApuesta` que hace de intermediario, para luego adaptarla de String a Date.

```svelte
  <input type="date" data-testid="fechaApuesta" bind:value={fechaApuesta}
    onchange={() => {
      apuesta.fecha = dayjs(fechaApuesta).toDate()
    }}
```

## Tener un objeto Apuesta como $state de la página

Podríamos haber intentado tener un objeto Apuesta **puro de Typescript** (que no tenga las runas `$state`), como $state de nuestra página, algo como

```svelte
	let apuesta: Apuesta = $state(new Apuesta())
```

Lamentablemente eso no permite que sea reactivo el binding de los inputs, aun cuando los definamos como `bind:value={apuesta.monto}`. Esto es un cambio de comportamiento de la versión 4 a la 5 de Svelte donde solo soporta objetos planos, sin métodos, como está documentado [en este issue](https://github.com/sveltejs/svelte/issues/10560). Esto significa que esta variante sí funciona:

```svelte
let apuesta: Apuesta = $state({
  fecha: new Date(),
  monto: 0,
  tipoApuesta: PLENO,
  valorApostado: 1,
})
```

pero **no tenemos los métodos que validan la apuesta ni el que apuesta**. Con lo cual esta muy discutible decisión de diseño de quienes implementan Svelte nos forzaría a pasar el comportamiento del modelo de la vista a la página, o a un objeto o lista de funciones externa. Por eso es importante conocer los frameworks en profundidad para entender las limitaciones que nos pueden imponer a la hora de modelar una solución.

## Tipos de apuesta

Un detalle interesante de la implementación de los tipos de apuesta es que

- definimos un Tipo de Apuesta como interfaz
- pero no la exportamos, solo la utilizamos dentro de Apuesta
- por otra parte sí exportamos PLENO y DOCENA que son objetos que implementan dicha interfaz (strategies stateless)
- pero en la definición **no necesitamos decir que implementan Tipo de Apuesta**. Por el mecanismo de **duck typing** es posible asignar tanto PLENO como DOCENA al tipo de apuesta
- el tipo de apuesta define la lista de valores que el usuario puede apostar

```ts
class Pleno {...}

class Docena {...}

export type TipoApuesta = {
	esGanador(numeroGanador: number, valorApostado: number | string): boolean
	validar(apuesta: Apuesta): void
	get ganancia(): number
	get valoresAApostar(): (number | string)[]
}

export const PLENO = new Pleno()
export const DOCENA = new Docena()
```

## Validación de la apuesta

TODO

## Resultado de la apuesta

TODO

## Testing

TODO