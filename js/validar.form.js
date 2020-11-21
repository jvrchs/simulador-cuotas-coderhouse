//FUNCIÓN QUE RETORNA "" SI EL VALOR ES NEGATIVO O NEUTRO Y EL VALOR MISMO CUANDO ES POSTIVO
function validarPositivo(valor){
    if(valor <= 0){
        return "";
    }
    else{
        return valor;
    }
}

//FUNCIÓN QUE RETORNA "" SI EL VALOR ES NEGATIVO Y EL VALOR MISMO CUANDO ES POSTIVO O NEUTRO
function validarNeutroPositivo(valor){
    if(valor < 0){
        return "";
    }
    else{
        return valor;
    }
}

//FUNCIÓN QUE MUESTRA ALERTAS INSTANTÁNEAS DENTRO DEL MISMO FORMULARIO AL INGRESAR VALORES INVÁLIDOS.
function alertaValidarNumero(id){
    if (id == 'pagoAdicional' || id == 'tasaMensual'){
        let valor = $("#"+id)[0].value;
        let numeroValidado = validarNeutroPositivo(valor);

        if (numeroValidado == ""){
            $("#alert"+id).slideDown(400);
            $("#"+id)[0].focus();
        }
        else{
            $("#alert"+id).slideUp(400);
        }
    }
    else{
        let valor = $("#"+id)[0].value;
        let numeroValidado = validarPositivo(valor);
        
        if (numeroValidado == ""){
            $("#alert"+id).slideDown(400);
            $("#"+id)[0].focus();
        }
        else{
            $("#alert"+id).slideUp(400);
        }
    }
}

//FUNCIÓN QUE VALIDA QUE LOS VALORES SEAN POSITIVOS EN EL INPUT LUEGO DE QUE YA SE DIÓ CLICK AL BOTÓN SIMULAR
function validarValoresInputPositivos(){
    let listaBool = [];
    for(let i = 0; i < 2; i++){
       let valor = $("input")[i].value;
       let numeroValidado = validarPositivo(valor);
        
       if (numeroValidado == ""){
        listaBool.push(false);
       }
       else{
        listaBool.push(true);
       }
    }

    if(listaBool.includes(false)){
        return false;
    }
    else{
        return true;
    }
}

//FUNCIÓN QUE VALIDA QUE LOS VALORES SEAN POSITIVOS O NEUTROS EN EL INPUT LUEGO DE QUE YA SE DIÓ CLICK AL BOTÓN SIMULAR
function validarValoresInputPositvoNeutro(){
    let listaBool = [];
    for(let i = 2; i < 4; i++){
        let valor = $("input")[i].value;
        let numeroValidado = validarNeutroPositivo(valor);
         
        if (numeroValidado == ""){
         listaBool.push(false);
        }
        else{
         listaBool.push(true);
        }
    }
    if(listaBool.includes(false)){
        return false;
    }
    else{
        return true;
    }
}

//FUNCIÓN QUE VALIDA QUE LA SUMA DEL PAGO MÍNIMO Y EL PAGO ADICIONAL NO SUPEREN AL MONTO TOTAL
//LUEGO DE QUE YA SE DIO CLICK AL BOTÓN SIMULAR
function validarSumaMinimoAdicional(){
    let facturado = parseFloat($("#deudaTotalFacturada")[0].value);
    let minimo = parseFloat($("#pagoMinimo")[0].value);
    let adicional = parseFloat($("#pagoAdicional")[0].value);
    if (minimo + adicional > facturado){
        return false;
    }
    else{
        return true;
    }
}

//FUNCIÓN QUE VALIDA QUE EL EL INTERÉS MENSUAL A PAGAR NO SUPERE AL MONTO DEL PAGO MENSUAL
//LUEGO DE QUE YA SE DIO CLICK AL BOTÓN SIMULAR
function validarPagoMensualIntereses(){
    let facturado = parseFloat($("#deudaTotalFacturada")[0].value);
    let minimo = parseFloat($("#pagoMinimo")[0].value);
    let adicional = parseFloat($("#pagoAdicional")[0].value);
    let tasaInteres = parseFloat($("#tasaMensual")[0].value);
    let sumaMinAd = minimo + adicional;

    if( sumaMinAd <= (facturado * tasaInteres)/100){
        return false;
    }
    else{
        return true;
    }
}

//FUNCIÓN QUE VALIDA EL FORM LLAMANDO A LAS FUNCIONES ANTERIORES. SI TODOS LOS VALORES SON VÁLIDOS
//SE INICIA LA SIMULACIÓN, EN EL CASO CONTRARIO SE LLAMA A UNA FUNCIÓN QUE GENERA UN ALERT.
function validarForm(){
    let listaBool = [];
    let positivos = validarValoresInputPositivos();
    let positivoNeutro = validarValoresInputPositvoNeutro();
    let sumaMinAd = validarSumaMinimoAdicional();
    let pagoInteres = validarPagoMensualIntereses();
    
    listaBool.push(positivos, positivoNeutro, sumaMinAd, pagoInteres);
    
    if(!listaBool.includes(false)){
      iniciarSimulacion();
    }
    else{
        generarAlert(positivos, positivoNeutro, sumaMinAd, pagoInteres);
    }
}

//FUNCIÓN QUE GENERA UN ALERT CUANDO ALGUNO DE LOS VALORES SON INVÁLIDOS O CUANDO NO SE 
//CUMPLE LA CONDICIÓN DE LA SUMA DEL PAGO MÍNIMO CON EL ADICIONAL Y LA DEL INTERÉS MENOR AL
//PAGO MENSUAL
function generarAlert(positivos, positivoNeutro, sumaMinAd, pagoInteres){
   let errores = $("#listaErrores")[0];

    if(positivos == false || positivoNeutro == false){
        let nInvalido = document.createElement("li");
        nInvalido.innerHTML = "Ingrese valores válidos";
        errores.appendChild(nInvalido);
           //AL HABER UN VALOR INVÁLIDO SOLO SE MUESTRA ESTE MENSAJE
    }
    else{
        //SI LOS VALORES SON VÁLIDOS PERO NO SE CUMPLE LAS CONDICIONES SE MUESTRA UNO O AMBOS DE
        //LOS SIGUIENTES ALERT
        if(sumaMinAd == false){
            let sumaMinAdInvalida = document.createElement("li");
            sumaMinAdInvalida.innerHTML = "La suma del pago mínimo y pago adicional no deben superar al monto de la deuda total facturada";
            errores.appendChild(sumaMinAdInvalida);
        }
        if(pagoInteres == false){
            let interesInvalido = document.createElement("li");
            interesInvalido.innerHTML = "El monto de interés mensual no debe superar al pago mensual";
            errores.appendChild(interesInvalido);
        }
    }
    abrirAlert();
}

//FUNCIÓN QUE MANEJA ANIMACIÓN AL EJECUTARSE UN ALERT
function abrirAlert(){
    let alert = $(".alerta")[0];
    let alertContainer = $(".alert-container")[0];

    alertContainer.style.opacity = "1";
    alertContainer.style.visibility = "visible";
    alert.classList.toggle("alert-close");
}

//FUNCIÓN QUE MANEJA ANIMACIÓN AL CERRAR UN ALERT
function cerrarAlert(){
    let alert = $(".alerta")[0];
    let alertContainer = $(".alert-container")[0];

    alert.classList.toggle("alert-close");

    setTimeout(function(){
        alertContainer.style.opacity = "0";
        alertContainer.style.visibility = "hidden";
        borrarAlert();
    }, 450);  
}

//FUNCIÓN QUE BORRA LO ESCRITO EN EL DOM UNA VEZ CERRADO EL ALERT
function borrarAlert(){
    let lista = $("#listaErrores")[0];
    if(lista.hasChildNodes()){
        while(lista.childNodes.length >= 1){
            lista.removeChild(lista.firstChild);
        }
    }
}

