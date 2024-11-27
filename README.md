# Apuestas

[![Build](https://github.com/uqbar-project/eg-apuestas-svelte/actions/workflows/build.yml/badge.svg)](https://github.com/uqbar-project/eg-apuestas-svelte/actions/workflows/build.yml) [![codecov](https://codecov.io/gh/uqbar-project/eg-apuestas-svelte/graph/badge.svg?token=5kQDNFDROQ)](https://codecov.io/gh/uqbar-project/eg-apuestas-svelte)

![demo](./video/demo.gif)

## Binding del formulario

Cada input de la página tiene un binding con una propiedad de nuestro modelo que es la Apuesta. En el caso de la fecha, dado que el input se asocia a un string, tenemos que utilizar una propiedad que hace de intermediario, para luego adaptarla de String a Date.

