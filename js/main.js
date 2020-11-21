//CARGANDO LA PÁGINA CON UN FADE IN
$("html").fadeIn(800);

//DEFIINICIÓN DEL MÉTODO CLASE QUE CREA OBJETO CON LA INFORMACIÓN DE CADA PAGO MENSUAL
class infoPago {
    constructor(mes, deudaInicial, interes, pagoMensual, deudaFinal) {
        this.mes = mes;
        this.deudaInicial = deudaInicial;
        this.interes = interes;
        this.pagoMensual = pagoMensual;
        this.deudaFinal = deudaFinal;
    }
}

//DEFINICIÓN DEL MÉTODO PARA FORMATEAR VALORES A PESOS CHILENOS
const formatearPeso = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: "CLP",
    minimumFractionDigits: 0
});

//DEFINICIÓN DE FUNCIÓN QUE INICIA LA SIMULACIÓN UNA VEZ ESTÁ VALIDADO EL FORMULARIO
function iniciarSimulacion(){
    generarResumen();
    generarResultados();
    generarTabla();
}

//DEFINCIÓN DE FUNCIÓN QUE A PARTIR DE LA INFORMACIÓN ALMACENADA EN SESSION STORAGE
//AÑADE LOS RESULTADOS COMO OBJETOS A UNA LISTA.
function anadirInfo() {
    var deudaInicial = parseFloat($("#deudaTotalFacturada")[0].value);
    var tasaMensual = parseFloat($("#tasaMensual")[0].value);
    var pagoMinimo = parseFloat($("#pagoMinimo")[0].value);
    var pagoAdicional = parseFloat($("#pagoAdicional")[0].value);
    var deudaFinal = 0;
    var interes = 0;
    var pago = 0;
    var mes = 1
    
    var listaPagos = [];

    //CICLO DONDE SE CREAN OBJETOS CON LA INFORMACIÓN DE LOS PAGOS MENSUALES
    //Y QUE TERMINA CUANDO YA NO HAY MAS DEUDA POR PAGAR
    while (deudaInicial != 0) {
        interes = Math.round(calcularInteres(deudaInicial, tasaMensual));
        pago = pagoMensual(pagoMinimo, pagoAdicional, deudaInicial, tasaMensual);
        deudaFinal = calcularDeudaFinal(deudaInicial, interes, pago);
        listaPagos.push(new infoPago(mes, deudaInicial, interes, pago, deudaFinal));
        deudaInicial = deudaFinal;
        mes = mes + 1;
    }
    return listaPagos;
}

//DEFINICIÓN DE FUNCIÓN QUE CALCULA EL INTERÉS A PAGAR MES A MES
function calcularInteres(deudaInicial, tasaMensual) {
    let interes = (tasaMensual/100) * deudaInicial;
    return interes
}

//DEFINICIÓN DE FUNCIÓN QUE CALCULA EL MONTO A AMORTIZAR MES A MES
function pagoMensual(pagoMinimo, pagoAdicional, deudaInicial, tasaMensual) {
    let pagoMensual = pagoMinimo + pagoAdicional;
    if (deudaInicial < pagoMensual) {
        return deudaInicial + Math.round(calcularInteres(deudaInicial, tasaMensual));
    }
    else {
        return pagoMensual;
    }
}

//DEFINICIÓN DE FUNCIÓN QUE CALCULA EL MONTO ACTUALIZADO DE LA DEUDA LUEGO DE UN PAGO
function calcularDeudaFinal(deudaInicial, interes, pagoMensual){
    let deudaFinal = deudaInicial + interes - pagoMensual;
    return deudaFinal;
}

//DEFINICIÓN DE FUNCIÓN QUE HACE UN RESUMEN CON LOS DATOS QUE FUERON INGRESADOS PARA SIMULAR
function generarResumen(){
    let deuda = $("#deudaTotal")[0];
    let pagoMin = $("#pagoMin")[0];
    let pagoAd = $("#pagoAd")[0];
    let iMensual = $("#iMensual")[0];
    let iAnual = $("#iAnual")[0];

    deuda.innerHTML = "Deuda total facturada: " + formatearPeso.format(parseFloat($("#deudaTotalFacturada")[0].value));
    pagoMin.innerHTML = "Pago mínimo: " + formatearPeso.format(parseFloat($("#pagoMinimo")[0].value));
    pagoAd.innerHTML = "Pago adicional: " + formatearPeso.format(parseFloat($("#pagoAdicional")[0].value));
    iMensual.innerHTML = "Tasa de interés mensual: " + parseFloat($("#tasaMensual")[0].value) + "%";
    iAnual.innerHTML = "Tasa de interés anual: " + (parseFloat($("#tasaMensual")[0].value) * 12) + "%";
}

//DEFINICIÓN DE FUNCIÓN QUE MUESTRA EL RESULTADO DEL MONTO TOTAL A PAGAR CONSIDERANDO LOS INTERESES.
function generarResultados(){
    let numeroMeses = $("#nMeses")[0];
    let interesTotal = $("#intereses")[0];
    let capital = $("#capital")[0];
    let total = $("#total")[0];

    let listaPagos = anadirInfo();
    let nMeses = listaPagos.length;

    let sumaIntereses = 0;
    for(i = 0; i < listaPagos.length; i++){
        let interes = Object.values(listaPagos[i])[2];
        sumaIntereses += interes;
    }

    let montoTotal = parseFloat($("#deudaTotalFacturada")[0].value) + sumaIntereses;

    numeroMeses.innerHTML = "Número de meses: " + nMeses;
    interesTotal.innerHTML = "Intereses Pagados: " + formatearPeso.format(sumaIntereses);
    capital.innerHTML = "Capital pagado: " + formatearPeso.format(parseFloat($("#deudaTotalFacturada")[0].value));
    total.innerHTML = "Monto total a pagar: " + formatearPeso.format(montoTotal);
}

//DEFINICIÓN DE FUNCIÓN QUE CREA LA TABLA CON LA INFORMACIÓN DE PAGO CORRESPONDIENTE A CADA MES
function generarTabla(){
    let tabla = $("#tablaResultado")[0];
    let tblBody = document.createElement("tbody");
    let listaPagos = anadirInfo();

    for (let i = 0; i < listaPagos.length; i++) {
        let fila = document.createElement("tr");
        let listaObjeto = Object.values(listaPagos[i]);
        let tamanoObjeto = listaObjeto.length;
        for (let j = 0; j < tamanoObjeto; j++) {
            let columna = document.createElement("td");
            if (j == 0){
                let contenido = document.createTextNode(listaObjeto[j]);
                columna.appendChild(contenido);
                fila.appendChild(columna);
            }
            else{
                let contenido = document.createTextNode(formatearPeso.format(listaObjeto[j]));
                columna.appendChild(contenido);
                fila.appendChild(columna);
            }
        }
        tblBody.appendChild(fila);
    }
    tabla.appendChild(tblBody); 
    tblBody.setAttribute("id", "cuerpoResultados");

    abrirResultados();
}

//DEFINICIÓN DE FUNCIÓN QUE HACE ANIMACIÓN AL APARECER LOS RESULTADOS
function abrirResultados(){
    let modal = $(".modal-resultados")[0];
    let modalC = $(".modal-container")[0];

    modalC.style.opacity = "1";
    modalC.style.visibility= "visible";
    modal.classList.toggle("modal-close");
}

//DEFINICIÓN DE FUNCIÓN QUE HACE ANIMACIÓN AL CERRAR LOS RESULTADOS
function cerrarResultados(){
    let modal = $(".modal-resultados")[0];
    let modalC = $(".modal-container")[0];

    modal.classList.toggle("modal-close");

    setTimeout(function(){
        modalC.style.opacity = "0";
        modalC.style.visibility= "hidden";
    },450);

    borrarResultados();
}

//DEFINICIÓN DE FUNCIÓN QUE BORRA LO ESCRITO EN EL DOM AL HACER CLICK SOBRE "VOLVER A SIMULAR"
function borrarResultados(){
    let tabla = $("#tablaResultado")[0];
    let resultados = $("#cuerpoResultados")[0];

    tabla.removeChild(resultados);
}





