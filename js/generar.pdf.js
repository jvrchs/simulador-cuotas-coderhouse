//FUNCIÓN QUE GENERA EL PDF CON LOS RESULTADOS OBTENIDOS. UTILIZA LA LIBRERÍA jsPDF 
//Y EL PLUGIN AUTOTABLE.
function generarPDF(){
    //CREANDO EL DOCUMENTO
    var doc = new jspdf.jsPDF();
    //ESCRIBIENDO TÍTULO, SUBTÍTULOS Y TABLAS
    doc.setFontSize(20);
    doc.text('Resultados simulación', 14, 20);

    doc.setFontSize(10);
    doc.text('La operación fue simulada utilizando los siguientes datos:', 14, 30);
    doc.autoTable({startY: 35, html: '#tablaResumen'});

    doc.setFontSize(10);
    doc.text('Los resultados de su cálculo son los siguientes:', 14, 80);
    doc.autoTable({startY: 85, html: '#tablaCalculo'});
    doc.autoTable({html: '#tablaResultado'});

    //GUARDANDO EL PDF
    doc.save("Simulación TC.pdf");
}