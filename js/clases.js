
class Vehiculo {
  id;
  fabricante;
  modelo;
  añoLanzamiento;
  constructor(id, fabricante, modelo, añoLanzamiento) {
    this.Id = parseInt(id);
    this.Fabricante = fabricante;
    this.Modelo = modelo;
    this.AñoLanzamiento = añoLanzamiento;
  }
  get Id() {
    return this.id;
  }
  get Fabricante() {
    return this.fabricante;
  }
  get Modelo() {
    return this.modelo;
  }
  get AñoLanzamiento() {
    return this.añoLanzamiento;
  }
  set AñoLanzamiento(value) {
    this.añoLanzamiento = parseInt(value);
  }
  set Modelo(value) {
    this.modelo = value;
  }
  set Fabricante(value) {
    this.fabricante = value;
  }
  set Id(value) {
    this.id = value;
  }

  toStringJson(conId) {
    const response = {fabricante: this.Fabricante, modelo: this.Modelo, añoLanzamiento: this.AñoLanzamiento};
    if(conId)
      response.id = this.Id;

    return JSON.stringify(response);
  }
}

class Auto extends Vehiculo {
  cantidadPuertas;
  constructor(id, fabricante, modelo, añoLanzamiento, cantidadPuertas) {
    super(id, fabricante, modelo, añoLanzamiento);
    this.CantidadPuertas = cantidadPuertas;
  }
  get CantidadPuertas() {
    return this.cantidadPuertas;
  }
  set CantidadPuertas(value) {
    this.cantidadPuertas = parseInt(value);
  }

  toStringJson(conId) {
    const jsonToString = super.toStringJson(conId);
    const response = JSON.parse(jsonToString);
    return JSON.stringify({...response, cantidadPuertas: this.CantidadPuertas});
  }
}

class Camioneta extends Vehiculo {
  transmision4x4;
  constructor(id, fabricante, modelo, añoLanzamiento, transmision4x4) {
    super(id, fabricante, modelo, añoLanzamiento);
    this.Transmision4x4 = transmision4x4;
  }
  get Transmision4x4() {
    return this.transmision4x4;
  }
  set Transmision4x4(value) {
    this.transmision4x4 = value;
  }

  toStringJson(conId) {
    const jsonToString = super.toStringJson(conId);
    const response = JSON.parse(jsonToString);
    return JSON.stringify({ ...response, transmision4x4: this.Transmision4x4 });
  }
}

/**
 * Método encargado de castear el json string al array de personas con la instancia correspondiente
 * @param {*} arrayObjetos
 * @returns
 */
const castJsonStringAInstancia = (arrayObjetos) => {
  const vehiculos = [];
  arrayObjetos.forEach(vehiculoInfo => {
    let vehiculo;
    if (vehiculoInfo?.transmision4x4 != undefined) {
      vehiculo = new Camioneta(vehiculoInfo.id, vehiculoInfo.fabricante, vehiculoInfo.modelo, vehiculoInfo.añoLanzamiento, vehiculoInfo.transmision4x4);
    } else {
      vehiculo = new Auto(vehiculoInfo.id, vehiculoInfo.fabricante, vehiculoInfo.modelo, vehiculoInfo.añoLanzamiento, vehiculoInfo.cantidadPuertas);
    }
    vehiculos.push(vehiculo);
  });
  return vehiculos;
}
let listadoVehiculos;

window.addEventListener('load', () => {
  listadoVehiculos = [];
  // Oculta el formulario
  MostrarOcultarElemento("formABM", true);
  // Se setean los eventos
  setearEventos();
  // Se parsean las instancias
  ObtenerVehiculos();
})

/**
 * Mètodo encargado de setear los eventos
 */
const setearEventos = () => {
  // Agrega los eventos a los botones
  const btnAgregar = document.getElementById("btnAgregarTabla");
  btnAgregar.addEventListener("click", () => formAgregar());

  // Agrega los eventos de ABM
  // Agrega los eventos a los botones
  const btnCancelarForm = document.getElementById("btnCancelarForm");
  btnCancelarForm.addEventListener("click", () => {
    MostrarOcultarElemento("registros", false);
    MostrarOcultarElemento("formABM", true);
  });
  const tipoVehiculo = document.getElementById("tipoVehiculo");
  tipoVehiculo.addEventListener("change", e => ocultarSegunTipo(e.target.value));

}

/**
 * Funcion encargada de crear una fila
 * @param { idColumna: "", data: } columnasData
 */
const crearFila = (columnasData) => {
  // Se crea la nueva fila
  const fila = document.createElement("tr");
  // Agrega los campos correspondientes a cada columna
  columnasData.forEach(columnaInfo => {
    // Se crea el campo
    const elemento = document.createElement("td");
    // Se le incorpora el contendio
    elemento.appendChild(document.createTextNode(columnaInfo?.data ?? 'N/A'));
    // Se setea el atributo identificador de la columna a la que corresponde el campo
    elemento.setAttribute("columna", columnaInfo.idColumna);
    // Se le setea al campo el mismo estado de visibilidad que la columna a la que pertenece
    elemento.style.display = document.getElementById(columnaInfo.idColumna).style.display;
    // Se agrega el campo a la fila
    fila.appendChild(elemento);
  });
  // Se incorporan los botones eliminar y modificar con los eventos correspondientes
  let boton = document.createElement("input");
  boton.type = "button"
  boton.value = "Modificar";
  boton.className = "tableButton";
  boton.addEventListener("click", e => formModificar(e.target.parentNode.parentNode, "idColum"));
  let elemento = document.createElement("td");
  elemento.appendChild(boton);
  fila.appendChild(elemento);

  boton = document.createElement("input");
  boton.type = "button"
  boton.value = "Eliminar";
  boton.className = "tableButton";
  boton.addEventListener("click", e => formEliminar(e.target.parentNode.parentNode, "idColum"));
  elemento = document.createElement("td");
  elemento.appendChild(boton);
  fila.appendChild(elemento);
  // Agrega la fila al cuerpo
  document.getElementById("cuerpo").appendChild(fila);
}

/**
 * Función encargada de recargar la tabla
 * @param {*} lista
 */
const recargarTabla = (lista) => {
  let cuerpoTabla = document.getElementById('cuerpo');
  let filasTabla = cuerpoTabla.getElementsByTagName('tr');
  let rowCount = filasTabla.length;
  for (let i = 0; i < rowCount; i++) {
    cuerpoTabla.removeChild(filasTabla[rowCount - 1 - i]);
  }
  // Crea las filas correspondientes
  lista.forEach(vehiculo => {
    const columnasData = [{ idColumna: "idColum", data: vehiculo.Id },
    { idColumna: "fabricanteColumn", data: vehiculo.Fabricante },
    { idColumna: "modeloColumn", data: vehiculo.Modelo },
    { idColumna: "anoLanzamientoColum", data: vehiculo.AñoLanzamiento },
    { idColumna: "cantPuertasColumn", data: vehiculo.CantidadPuertas },
    { idColumna: "transmisionColum", data: vehiculo.Transmision4x4 }];
    crearFila(columnasData);
  });
}

// Funciones correspondientes al ABM
/**
 * Funcion encargada de mostrar u ocultar un elemento
 * @param {*} idForm
 * @param {*} ocultar
 */
const MostrarOcultarElemento = (idForm, ocultar, displayType) => {
  const formElement = document.getElementById(idForm);
  const tipoDisplay = displayType ?? "";
  formElement.style.display = ocultar ? 'none' : tipoDisplay;
}

//
// ABM
//

/**
 * Funcion encargada de mostrar y ocultar los elementos segun el tipo seleccionado
 * @param {*} tipo
 */
const ocultarSegunTipo = (tipo) => {
  switch (tipo) {
    case "Camioneta":
      document.getElementById("grupoCantidadPuertas").style.display = 'none';
      document.getElementById("grupoTransmision").style.display = '';
      document.getElementById("tipoVehiculo").value = "Camioneta";
      break;
    case "Auto":
      document.getElementById("grupoCantidadPuertas").style.display = '';
      document.getElementById("grupoTransmision").style.display = 'none';
      document.getElementById("tipoVehiculo").value = "Auto";
      break;
  }
}

/**
 * Funcion encargada de bloquear los campos del formulario
 * @param {*} bloquear
 */
const BloquarDesbloquearCamposForm = (bloquear) => {
  document.getElementById("idForm").setAttribute('disabled', '');
  if (bloquear) {
    document.getElementById("fabricanteForm").setAttribute('disabled', '');
    document.getElementById("modeloForm").setAttribute('disabled', '');
    document.getElementById("anoDeLanzamientoForm").setAttribute('disabled', '');
    document.getElementById("cantidadPuertasForm").setAttribute('disabled', '');
    document.getElementById("transmisionForm").setAttribute('disabled', '');
    document.getElementById("tipoVehiculo").setAttribute('disabled', '');
  } else {
    document.getElementById("fabricanteForm").removeAttribute('disabled');
    document.getElementById("modeloForm").removeAttribute('disabled');
    document.getElementById("anoDeLanzamientoForm").removeAttribute('disabled');
    document.getElementById("cantidadPuertasForm").removeAttribute('disabled');
    document.getElementById("transmisionForm").removeAttribute('disabled');
    document.getElementById("tipoVehiculo").removeAttribute('disabled');
  }
}

//
// Funciones correspondientes a cada boton del ABM
//

/**
 * Funcion encargada de obtner la informacion a modificar,
 * validarla y en caso de ser correcta realizar la modificacion.
 * Caso contrario mostrar mensaje de alerta
 */
const modificarItem = async () => {
  try {
    const dataForm = obtenerDataABM();
    await ModificarVehiculo(dataForm);
  } catch (e) {
    swal("Error", e.message, "error");
  }
}

/**
 * Funcion encargada de obtner la informacion a agregar,
 * validarla y en caso de ser correcta agregar al listado.
 * Caso contrario mostrar mensaje de alerta
 */
const agregarItem = () => {
  try {
    // Valida que el id no exista
    const dataForm = obtenerDataABM();
    InsertarVehiculo(dataForm);
  } catch (e) {
    swal("Error", e.message, "error");
  }
}

/**
 * Funcion encargada de obtner la informacion a eliminar,
 * validarla y en caso de ser correcta eliminar del listado.
 * Caso contrario mostrar mensaje de alerta
 */
const eliminarItem = async () => {
  try {
    const dataForm = obtenerDataABM();
    await EliminarVehiculo(dataForm);
  } catch (e) {
    swal("Error", e.message, "error");
  }
}

/**
 * Funcion encargada de buscar por id una unstancia en la lista y retornarla
 * @param {*} id
 * @returns
 */
const buscarPorId = (id) => {
  return listadoVehiculos.find(vehiculo => vehiculo.id == id);
}

/**
 * Funcion encargada de volver al listado
 */
const volver = () => {
  MostrarOcultarElemento("registros", false);
  MostrarOcultarElemento("formABM", true);
  recargarTabla(listadoVehiculos);
}

/**
 * Funcion encargada de limpiar el listado de campos pasados por parametro
 * @param {*} camposId
 */
const formABMLimpiarCampos = (camposId) => {
  camposId.forEach(idCampo => {
    document.getElementById(idCampo).value = "";
  });
}

/**
 * Funcion encargada de obtener la infromacion ingresada en el ABM
 * @returns
 */
const obtenerDataABM = () => {
  const data = {
    id: parseInt((document.getElementById("idForm").value)) || null,
    fabricante: document.getElementById("fabricanteForm").value,
    modelo: document.getElementById("modeloForm").value,
    añoLanzamiento: parseInt(document.getElementById("anoDeLanzamientoForm").value),
    cantidadPuertas: parseInt(document.getElementById("cantidadPuertasForm").value),
    transmision4x4: document.getElementById("transmisionForm").value
  };
  const tipo = document.getElementById("tipoVehiculo").value;
  validarData(data, tipo);
  let retorno = null;
  switch (tipo) {
    case 'Auto':
      retorno = new Auto(data.id, data.fabricante, data.modelo, data.añoLanzamiento, data.cantidadPuertas);
      break;
    case 'Camioneta':
      retorno = new Camioneta(data.id, data.fabricante, data.modelo, data.añoLanzamiento, data.transmision4x4);
      break;
  }
  return retorno;
}

function validarData(data, tipoInstancia) {
  if(!data.fabricante || data.fabricante.length == 0)
    throw new Error("El fabricante no puede ser vacio");
  if(!data.modelo || data.modelo.length === 0)
    throw new Error("El modelo no puede ser vacio");
  if(parseInt(data.añoLanzamiento) <= 1920)
    throw new Error("El año de lanzamiento debe ser mayor a 1920");
  switch (tipoInstancia) {
    case 'Auto':
      if(parseInt(data?.cantidadPuertas) < 2)
        throw new Error("La cantidad de puertas debe ser mayor o igual a 2");
      break;
    case 'Camioneta':
      if(!data?.transmision4x4 || !["SI", "NO"].includes(data.transmision4x4))
        throw new Error("Transmision 4x4 debe ser SI o NO");
      break;
  }
}

/**
 * Funcion encargada de inciializar el formulario del ABM al agregar
 */
const formAgregar = () => {
  MostrarOcultarElemento("registros", true);
  MostrarOcultarElemento("formABM", false, "flex");
  // Modifica el titulo del formulario
  ModificarTituloFormABM("Formulario Alta");
  // Oculta los campos segun el tipo de instancia selecionada
  ocultarSegunTipo(document.getElementById("tipoVehiculo").value);
  // Limpia los campos
  formABMLimpiarCampos(["fabricanteForm", "modeloForm", "anoDeLanzamientoForm", "cantidadPuertasForm",
    "transmisionForm"]);
  // Desbloquea los campos
  BloquarDesbloquearCamposForm(false);
  // Setea el evento del boton aceptar correspondiente a agregar
  let btnAceptar = document.getElementById("btnAceptarForm");
  if(btnAceptar)
    btnAceptar.remove();
  btnAceptar = document.createElement("input");
  btnAceptar.type = "button"
  btnAceptar.value = "Aceptar";
  btnAceptar.id = "btnAceptarForm";
  btnAceptar.addEventListener("click", () => agregarItem("registros"));
  document.getElementById("botoneraFormABM").appendChild(btnAceptar);
}

/**
 * Funcion encargada de abrir el formulario de modificacion y eliminacion
 * ocultando y mostrando los elementos correspondientes
 * @param {*} fila
 * @param {*} idColumna
 */
const formModificar = (fila, idColumna) => {
  const id = parseInt(fila.querySelectorAll("[columna=" + idColumna + "]")[0].innerText);
  const elementoAModificar = buscarPorId(id);
  if (!elementoAModificar) throw new Error('No se encontro el id a modificar');

  // Esconde los campos segun la instancia
  if (elementoAModificar instanceof Auto) {
    ocultarSegunTipo("Auto");
  } else {
    ocultarSegunTipo("Camioneta");
  }
  // Carga los datos al formulario
  formCargarCamposABM(elementoAModificar);
  MostrarOcultarElemento("registros", true);
  MostrarOcultarElemento("formABM", false, "flex");
  // Modifica el titulo del formulario
  ModificarTituloFormABM("Formulario Modificación");

  // Bloquea los campos que no se pueden modificar
  BloquarDesbloquearCamposForm(false);
  let btnAceptar = document.getElementById("btnAceptarForm");
  if(btnAceptar)
    btnAceptar.remove();
  btnAceptar = document.createElement("input");
  btnAceptar.type = "button"
  btnAceptar.value = "Aceptar";
  btnAceptar.id = "btnAceptarForm";
  btnAceptar.addEventListener("click", modificarItem);
  document.getElementById("botoneraFormABM").appendChild(btnAceptar);

}

/**
 * Funcion encargada de abrir el formulario de modificacion y eliminacion
 * ocultando y mostrando los elementos correspondientes
 * @param {*} fila
 * @param {*} idColumna
 */
const formEliminar = (fila, idColumna) => {
  const id = parseInt(fila.querySelectorAll("[columna=" + idColumna + "]")[0].innerText);
  const elementoAEliminar = buscarPorId(id);
  if (!elementoAEliminar) throw new Error('No se encontro el id a modificar');

  // Esconde los campos segun la instancia
  if (elementoAEliminar instanceof Auto) {
    ocultarSegunTipo("Auto");
  } else {
    ocultarSegunTipo("Camioneta");
  }
  // Carga los datos al formulario
  formCargarCamposABM(elementoAEliminar);
  MostrarOcultarElemento("registros", true);
  MostrarOcultarElemento("formABM", false, "flex");
  // Modifica el titulo del formulario
  ModificarTituloFormABM("Formulario Baja");
  // Bloquea los campos que no se pueden modificar
  BloquarDesbloquearCamposForm(true);
  let btnAceptar = document.getElementById("btnAceptarForm");
  if(btnAceptar)
    btnAceptar.remove();
  btnAceptar = document.createElement("input");
  btnAceptar.type = "button"
  btnAceptar.value = "Aceptar";
  btnAceptar.id = "btnAceptarForm";
  btnAceptar.addEventListener("click", eliminarItem);
  document.getElementById("botoneraFormABM").appendChild(btnAceptar);
}

/**
 * Método encargado de cargar los campos del formulario ABM
 * @param {*} dataCampos
 */
const formCargarCamposABM = (dataCampos) => {
  document.getElementById("idForm").value = dataCampos.Id;
  document.getElementById("fabricanteForm").value = dataCampos.Fabricante;
  document.getElementById("modeloForm").value = dataCampos.Modelo;
  document.getElementById("anoDeLanzamientoForm").value = dataCampos.AñoLanzamiento;
  document.getElementById("cantidadPuertasForm").value = dataCampos.CantidadPuertas ?? "";
  document.getElementById("transmisionForm").value = dataCampos.Transmision4x4 ?? "";
}

const ModificarTituloFormABM = (contenidoTitulo) => {
  const titulo = document.getElementById("tituloABM");
  if (titulo.childNodes.length > 0)
    titulo.removeChild(titulo.childNodes[0]);
  titulo.appendChild(document.createTextNode(contenidoTitulo));
}

//
//
//  Funciones correspondientes las peticiones al servidor
//
//
const host = "localhost";
const port = "5001";
const url = `https://${host}:${port}`;


/**
 * Método encargado de realizar la petición para obtener el listado de Vehiculos
 */
 const ObtenerVehiculos = () => {
  let requestUrl = `${url}/Vehiculos/Vehiculos`;
  const constRequestDetail = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };
  document.getElementById("spinnerBack").style.display = "flex";
  fetch(requestUrl, constRequestDetail)
    .then(res => {
      if (res.status == 200) {
        res.json().then(jsonResponse => {
          listadoVehiculos = castJsonStringAInstancia(jsonResponse);
          // Se carga la informacion en la tabla
          document.getElementById("spinnerBack").style.display = "none";
          // Se carga la informacion en la tabla
          recargarTabla(listadoVehiculos);
        }).catch(() => {throw new Error()} );
      } else {
        throw new Error();
      }
    })
    .catch(() => {
      document.getElementById("spinnerBack").style.display = "none";
      volver();
      swal("Error", "No se pudo obtener el listado", "error");
    });
}


/**
 * Método encargdo de insertar una vehiculo y setear el Id correspondiente
 * @param {Vehiculo} data
 */
 const InsertarVehiculo = (data) => {
  let requestUrl = `${url}/Vehiculos/`;
  if (data instanceof Auto)
    requestUrl += "InsertarAuto";
  else
    requestUrl += "InsertarCamioneta";
  const xhttp = new XMLHttpRequest();
  document.getElementById("spinnerBack").style.display = "flex";
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const jsonResponse = JSON.parse(xhttp.responseText);
      data.Id = jsonResponse.id;
      listadoVehiculos.push(data);
      volver();
      document.getElementById("spinnerBack").style.display = "none";
    } else if (this.readyState == 4 && this.status != 200) {
      document.getElementById("spinnerBack").style.display = "none";
      swal("Error", "No se pudo obtener el listado", "error");
    }
  };
  console.log(requestUrl);
  xhttp.open("PUT", requestUrl, true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(data.toStringJson());
}

/**
 * Metodo encargado de realizar la peticion para modificar un vehiculo
 * y modifcarlo en la lista en caso de que este de 200
 * @param {Vehiculo} data
 */
 const ModificarVehiculo = async (data) => {
  let requestUrl = `${url}/Vehiculos/`;
  if (data instanceof Auto)
    requestUrl += "ModificarAuto";
  else
    requestUrl += "ModificarCamioneta";

  const constRequestDetail = {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: data.toStringJson(true)
  };
  document.getElementById("spinnerBack").style.display = "flex";
  const res = await fetch(requestUrl, constRequestDetail);
  if (res.status == 200) {
    listadoVehiculos = listadoVehiculos.map(vehiculo => {
      if (vehiculo.id === data.id)
        return data;
      return vehiculo;
    });
    volver();
    document.getElementById("spinnerBack").style.display = "none";
  } else {
    document.getElementById("spinnerBack").style.display = "none";
    volver();
    throw new Error(`Ocurrio un error al modificar el vehiculo - ID: ${data.Id}`)
  }
}

/**
 * Metodo encargado de realizar la peticion para eliminar un vehiculo por id
 * y eliminarlo del listado en caso de que la misma de resultado 200
 * @param {Vehiculo} data
 */
 const EliminarVehiculo = async (data) => {
  let requestUrl = `${url}/Vehiculos/EliminarVehiculo`;
  const constRequestDetail = {
    method: 'DELETE',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify({ id: data.id })
  };
  document.getElementById("spinnerBack").style.display = "flex";
  try {
    const res = await fetch(requestUrl, constRequestDetail);
    if (res.status == 200) {
      listadoVehiculos = listadoVehiculos.filter(vehiculo => vehiculo.id != data.id);
      volver();
      document.getElementById("spinnerBack").style.display = "none";
    } else {
      throw new Error();
    }
  } catch {
    document.getElementById("spinnerBack").style.display = "none";
    volver();
    swal("Error", `Ocurrio un error al eliminar el vehiculo - ID: ${data.id}`, "error");
  }
}
