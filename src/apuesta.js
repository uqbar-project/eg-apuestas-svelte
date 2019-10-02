import Resultado from "./resultado";

const PRIMERA = {
  toString: () => "Primera",
  min: 1,
  max: 12
};
const SEGUNDA = {
  toString: () => "Segunda",
  min: 13,
  max: 24
};
const TERCERA = {
  toString: () => "Tercera",
  min: 25,
  max: 36
};

export class Pleno {
  constructor() {
    this.ganancia = 35;
    this.descripcion = "Pleno";
    this.valoresAApostar = [...Array(37).keys()];
  }

  validar(apuesta) {
    if (apuesta.monto < 10) {
      throw "Debe apostar más de $10";
    }
  }

  esGanador(numeroGanador, valorApostado) {
    return numeroGanador === valorApostado;
  }
}

export class Docena {
  constructor() {
    this.ganancia = 11;
    this.descripcion = "Docena";
    this.valoresAApostar = [PRIMERA, SEGUNDA, TERCERA];
  }

  validar(apuesta) {
    if (apuesta.monto < 50) {
      throw "Debe apostar más de $50";
    }
  }

  esGanador(numeroGanador, valorApostado) {
    return numeroGanador >= valorApostado.min && numeroGanador <= valorApostado.max
  }
}

export class Apuesta {
  constructor() {
    this.fecha = new Date();
    this.monto = 0;
    this.tipoApuesta = PLENO;
    this.valorApostado;
    this.resultado;
  }

  validarApuesta() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (!this.fecha) {
      throw "Debe ingresar una fecha de apuesta";
    }
    if (now.getTime() > this.fecha.getTime()) {
      throw "Debe ingresar una fecha actual o posterior al día de hoy";
    }
    if (!this.monto) {
      throw "Debe ingresar un monto para apostar";
    }
    if (this.monto <= 0) {
      throw "El monto a apostar debe ser positivo";
    }
    if (!this.tipoApuesta) {
      throw "Debe ingresar tipo de apuesta";
    }
    if (!this.valorApostado) {
      throw "Debe ingresar valor a apostar";
    }
    this.tipoApuesta.validar(this);
  }

  apostar() {
    this.validarApuesta();
    const numeroGanador = Math.floor(Math.random() * 37);
    let ganancia = 0;
    if (this.tipoApuesta.esGanador(numeroGanador, this.valorApostado)) {
      ganancia = this.monto * this.tipoApuesta.ganancia;
    }
    this.resultado = new Resultado(numeroGanador, ganancia);
  }
}

export const PLENO = new Pleno();
export const DOCENA = new Docena();

