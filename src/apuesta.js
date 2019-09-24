export class Pleno {
  ganancia = 35;
  descripcion = "Pleno";
  valoresAApostar = Array.from(new Array(36), (value, index) => index + 1);

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
  ganancia = 11;
  descripcion = "Docena";
  valoresAApostar = ["Primera", "Segunda", "Tercera"];

  validar(apuesta) {
    if (apuesta.monto < 50) {
      throw "Debe apostar más de 50 $";
    }
  }

  esGanador(numeroGanador, valorApostado) {
    const docena = this.valoresAApostar.indexOf(valorApostado);
    const min = docena * 12 + 1;
    const max = (docena + 1) * 12;
    return numeroGanador >= min && numeroGanador <= max;
  }
}

export class Apuesta {
    static PLENO = new Pleno()
    static DOCENA = new Docena()

    fecha = new Date()
    monto = 0
    tipoApuesta = Apuesta.PLENO
    valorApostado
    resultado

	validarApuesta() {
        const now = new Date()
        now.setHours(0, 0, 0, 0)
        if (!this.fecha) {
            throw "Debe ingresar una fecha de apuesta"
        }
        if (now.getTime() > this.fecha.getTime()) {
            throw "Debe ingresar una fecha actual o posterior al día de hoy"
        }
        if (this.monto <= 0) {
            throw "El monto a apostar debe ser positivo"
        }
        if (!this.tipoApuesta) {
            throw "Debe ingresar tipo de apuesta"
		}
		if (!this.valorApostado) {
            throw "Debe ingresar valor a apostar"
        }
        this.tipoApuesta.validar(this)
    }

    apostar() {
		this.resultado = null
        this.validarApuesta()
		const numeroGanador = Math.floor(Math.random() * 37)
		let ganancia = 0
		if (this.tipoApuesta.esGanador(numeroGanador, this.valorApostado)) {
			ganancia = this.monto * this.tipoApuesta.ganancia
		}
		this.resultado = new Resultado(numeroGanador, ganancia)
	}
}