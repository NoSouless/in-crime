document.addEventListener('DOMContentLoaded', (event) => {
    const ctx = document.getElementById('myChart').getContext('2d');
    const csvFileInput = document.getElementById('csvFile');
    const excelFileInput = document.getElementById('excelFile');
    const excelRowSelect = document.getElementById('excelRow');
    const csvColumnSelect = document.getElementById('csvColumn');
    const generateChartButton = document.getElementById('generateChart');
    let chart;
    let excelData;
    let csvData = [];
    let isCSVUploaded = false;
    let isExcelUploaded = false;

    $('.chosen').chosen();

    document.querySelectorAll('.custom-file-input').forEach(function(input) {
        input.addEventListener('change', function (e) {
            var fileName = e.target.files[0].name;
            var nextSibling = e.target.nextElementSibling;
            nextSibling.innerText = fileName;
        });
    });

    // Exemplo de dados
    const data = [
        { id: 'Janeiro', criminal: 0, climatico: 0, dias: 31 },
        { id: 'Fevereiro', criminal: 0, climatico: 0, dias: 28 },
        { id: 'Março', criminal: 0, climatico: 0, dias: 31 },
        { id: 'Abril', criminal: 0, climatico: 0, dias: 30 },
        { id: 'Maio', criminal: 0, climatico: 0, dias: 31 },
        { id: 'Junho', criminal: 0, climatico: 0, dias: 30 },
        { id: 'Julho', criminal: 0, climatico: 0, dias: 31 },
        { id: 'Agosto', criminal: 0, climatico: 0, dias: 31 },
        { id: 'Setembro', criminal: 0, climatico: 0, dias: 30 },
        { id: 'Outubro', criminal: 0, climatico: 0, dias: 31 },
        { id: 'Novembro', criminal: 0, climatico: 0, dias: 30 },
        { id: 'Dezembro', criminal: 0, climatico: 0, dias: 31 }
    ];

    csvFileInput.addEventListener('change', handleCSVFile);
    excelFileInput.addEventListener('change', handleExcelFile);
    generateChartButton.addEventListener('click', generateChart);

    function handleCSVFile(event) {
        const file = event.target.files[0];
        Papa.parse(file, {
            delimiter: ';',
            skipEmptyLines: true,
            complete: function(results) {
                const allData = results.data;
                const headers = allData[8]; // Pega a nona linha como cabeçalho
                csvData = allData.slice(9); // Pula as 8 primeiras linhas
                populateCSVColumnSelector(headers);
                isCSVUploaded = true;
                checkFilesUploaded();
            }
        });
    }

    function populateCSVColumnSelector(columns) {
        csvColumnSelect.innerHTML = '';
        columns.slice(2).forEach(column => { // Ignora as duas primeiras colunas
            const option = document.createElement('option');
            option.value = columns.indexOf(column);
            option.textContent = column;
            csvColumnSelect.appendChild(option);
        });
        csvColumnSelect.style.display = 'block';
        $(csvColumnSelect).chosen();
    }

    function handleExcelFile(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            excelData = XLSX.utils.sheet_to_json(worksheet, {header: 1});
            populateRowSelector(excelData);
            isExcelUploaded = true;
            checkFilesUploaded();
        };
        reader.readAsArrayBuffer(file);
    }

    function populateRowSelector(data) {
        excelRowSelect.innerHTML = '';
        data.slice(1).forEach((row, index) => {
            const option = document.createElement('option');
            option.value = index + 1;
            option.textContent = row[0]; // Supondo que a primeira coluna é a categoria
            excelRowSelect.appendChild(option);
        });
        excelRowSelect.style.display = 'block';
        $(excelRowSelect).chosen();
    }

    function checkFilesUploaded() {
        if (isCSVUploaded && isExcelUploaded) {
            generateChartButton.style.display = 'block';
        }
    }

    function processCSV() {
        const selectedColumn = csvColumnSelect.value;
        csvData.forEach(row => {
            let dateParts = row[0].split('/');
            let month = parseInt(dateParts[1]) - 1;
            let climatico = row[selectedColumn].replace(',', '.');
            if (climatico === '') {
                climatico = 0;
            }
            data[month].climatico += parseFloat(climatico);
        });
        data.forEach(item => {
            item.climatico = item.climatico / item.dias;
            if (selectedColumn > 2) {
                item.climatico /= 24;
            }
        });
    }

    function generateChart() {
        processCSV();

        const selectedRowIndex = parseInt(excelRowSelect.value);
        const selectedRow = excelData[selectedRowIndex];

        data.forEach((item, index) => {
            item.criminal = selectedRow[index + 1]; // Ignora a primeira coluna
        });

        const labels = data.map(item => item.id);
        const criminalData = data.map(item => item.criminal);
        const climaticoData = data.map(item => item.climatico);

        if (chart) {
            chart.destroy();
        }

        console.log(data);

        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Criminal',
                        data: criminalData,
                        type: 'line',
                        backgroundColor: 'rgba(192, 75, 75, 1)',
                        borderColor: 'rgba(192, 75, 75, 1)',
                        borderWidth: 1,
                        yAxisID: 'y-axis-1'
                    },
                    {
                        label: 'Climático',
                        data: climaticoData,
                        backgroundColor: 'rgba(75, 192, 192, 1)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        yAxisID: 'y-axis-2'
                    }
                ]
            },
            options: {
                scales: {
                    'y-axis-1': {
                        type: 'linear',
                        position: 'left',
                        ticks: {
                            beginAtZero: true
                        }
                    },
                    'y-axis-2': {
                        type: 'linear',
                        position: 'right',
                        ticks: {
                            beginAtZero: true
                        }
                    }
                }
            }
        });
    }
});