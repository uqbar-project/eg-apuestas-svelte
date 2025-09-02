# Apuestas

[![Build](https://github.com/uqbar-project/eg-apuestas-svelte/actions/workflows/build.yml/badge.svg)](https://github.com/uqbar-project/eg-apuestas-svelte/actions/workflows/build.yml) [![codecov](https://codecov.io/gh/uqbar-project/eg-apuestas-svelte/graph/badge.svg?token=5kQDNFDROQ)](https://codecov.io/gh/uqbar-project/eg-apuestas-svelte)

![demo](./video/demo.gif)

## Binding del formulario

Cada input de la página tiene un binding con una propiedad de nuestro modelo que es la Apuesta. 

![binding](./images/Apuestas.binding.png)

Una decisión que nos obliga a tomar Svelte es que el modelo de la vista (la clase Apuesta) expone cada atributo como un $state:

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

El objeto apuesta es responsable de resolver la validación:

- la fecha debe ser la del día de hoy o posterior y no puede ser nula
- el monto debe ser positivo
- debe ingresar un tipo de apuesta
- y un valor apostado

Además, cada strategy (pleno o docena) define validaciones adicionales, como el monto mínimo que debe apostarse.

Podríamos modelar cada error como una excepción, pero eso cortaría el flujo de envío de mensajes y solo nos saltaría el primer error. En lugar de eso vamos a recolectar todos los errores en una colección de mensajes de validación:

```ts
validarApuesta() {
  this.errors.length = 0 // TODO: add a helper function
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  if (!this.fecha) {
    this.addError('fecha', 'Debe ingresar una fecha de apuesta')
  }
  if (dayjs(now).isAfter(dayjs(this.fecha))) {
    this.addError('fecha', 'Debe ingresar una fecha actual o posterior al día de hoy')
  }
  if (this.monto <= 0) {
    this.addError('monto', 'El monto a apostar debe ser positivo')
  }
  ...
}

addError(field: string, message: string) {
  this.errors.push(new ValidationMessage(field, message))
}

```

Así podemos pasar desde el componente principal la apuesta y un atributo...

```svelte
<Validador elemento={apuesta} atributo="monto"></Validador>
```

...a un componente hijo que sabe mostrar errores de validación:

```svelte
<script lang="ts">
  let { elemento, atributo } = $props()
</script>

{#if elemento.hasErrors(atributo)}
  <div class="validation-row">
    <div ... class="validation">
      {elemento.errorsFrom(atributo)}
    </div>
  </div>
{/if}
```

- el `#if` permite un renderizado condicional del div para mostrar o no un error
- `elemento` es un objeto `Apuesta` que puede mostrar todos los errores asociados a un atributo:

```ts
  errorsFrom(field: string) {
    return this.errors
      .filter((_) => _.field == field)
      .map((_) => _.message)
      .join('. ')
  }
```

## Resultado de la apuesta

En caso de ser válida la apuesta, al apostar construimos un Resultado que puede indicar si ganamos o no. El mensaje se muestra dentro de un div con un renderizado condicional, al igual que en el caso del Validador.

## Testing

Pese a no ser un objeto Typescript puro, la apuesta tiene **tests unitarios** hechos con vitest. Esto es bueno, podemos trabajar convencionalmente: inicializamos una apuesta con valores correspondientes, apostamos y sensamos las respuestas para validaciones y casos de éxito.

Para testear la página la mecánica es similar, por ejemplo para testear validaciones:

```svelte
  it('debe fallar si se ingresa un importe negativo', async () => {
    const user = userEvent.setup()
    render(ApuestaPage)
    await user.type(screen.getByTestId('monto'), '-10')
    await user.click(screen.getByTestId('btnApuesta'))
    expect(screen.getByTestId('errorMessage-monto').innerHTML).toBe('El monto a apostar debe ser positivo')
  })
```

no obstante este test tiene un alcance mayor: probamos el binding de los controles HTML con su correspondiente modelo de vista, el funcionamiento propio de la apuesta y finalmente el mensaje de error que tiene que visualizarse dentro de la página abajo del campo que ingresa el monto.

### Control sobre la apuesta exitosa

Para chequear que una apuesta fue exitosa, trabajamos con un espía (_spy_) para asegurarnos de devolver el número que nosotros decidimos apostar:

```svelte
  it('debe indicar si gana el monto para la apuesta a pleno', async () => {
    vi.spyOn(Apuesta.prototype, 'obtenerNumeroGanador').mockImplementation(() => 5)
    const user = userEvent.setup()
    render(ApuestaPage)
    await user.type(screen.getByTestId('monto'), '25')
    await user.type(screen.getByTestId('fechaApuesta'), formatearFecha(new Date()))
    await user.selectOptions(screen.getByTestId('tipoApuesta'), 'Pleno')
    await user.selectOptions(screen.getByTestId('apuesta'), '5')
    await user.click(screen.getByTestId('btnApuesta'))
    expect(screen.getByTestId('resultado').innerHTML).toBe('¡¡ Ganaste $ 875 !!')
  })
```

como detalle adicional, es una buena práctica tener un método de _tear down_ donde reseteemos los mocks para que no nos quede la implementación de resguardo que devuelve 5:

```svelte
  afterEach(() => {
    vi.resetAllMocks()
  })
```
