class UI {

    async renderTable(date) {
        var dataSet = [
            {
                hora_anterior: date.anterior,
                hora_actual: date.actual,
                ajuste:date.ajuste,
                update:date.update
            }
        ];
        var datatable = $('.exceptionTable').DataTable({
            retrieve: true,
            lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
            columns: [
                { title: "Actualización", data: "update" },
                { title: "Hora anterior (hh:mm:ss)", data: "hora_anterior" },
                { title: "Ajuste (hh:mm:ss)", data: "ajuste" },
                { title: "Hora actual (hh:mm:ss)", data: "hora_actual" }
            ]
        });
        datatable.rows.add(dataSet);
        datatable.draw();
        console.log(dataSet);
    }
}
export default UI;
