// OLÁÁÁÁÁ, E LÁ VAMOS NÓS PARA MAIS UMA RODADA DE "PROGRAMANDO COM O LÉO"
// Eu sou o seu apresentador da noite, Léo Caselato, e hoje vamos... fazer nada.
// Eu to com dor de cabeça e com pressa então vou acabar fazendo poucas piadas... ou será que não?
// Com o meu co-apresentador que ajudou a fazer um pouco deste código... CO-PILOT
// DIZ OI CO-PILOT
// Co-pilot: Oi
// Essas inteligências artificiais são meio tímidas, mas vamos ao código :)

document.addEventListener('DOMContentLoaded', (event) => {
    
    // Constantes iniciais
    const ctx = document.getElementById('myChart').getContext('2d'); // Contexto do gráfico
    const csvFileInput = document.getElementById('csvFile'); // Input do arquivo CSV
    const excelFileInput = document.getElementById('excelFile'); // Input do arquivo Excel
    const excelRowSelect = document.getElementById('excelRow'); // Select do Excel
    const csvColumnSelect = document.getElementById('csvColumn'); // Select do CSV
    const generateChartButton = document.getElementById('generateChart'); // Botão de gerar gráfico

    // Variáveis iniciais... eu continuo sem entender qual a diferença entre var e let
    // Co-pilot: A diferença é que o let é mais seguro e tem escopo de bloco, enquanto o var é mais antigo e tem escopo de função
    // Obrigado co-pilot! Eu vou esquecer isso em 5 minutos, mas obrigado!
    let chart; // Variável para armazenar o gráfico
    let excelData = []; // Variável para armazenar os dados do Excel
    let csvData = []; // Variável para armazenar os dados do CSV
    let isCSVUploaded = false; // Variável para verificar se o CSV foi carregado
    let isExcelUploaded = false; // Variável para verificar se o Excel foi carregado

    // Adiciona evento de mudança para o input de arquivo, independente de qual for
    document.querySelectorAll('.custom-file-input').forEach(function(input) {
        input.addEventListener('change', function (e) { // Adiciona evento de mudança para o input de arquivo
            var fileName = e.target.files[0].name; // Pega o nome do arquivo
            var nextSibling = e.target.nextElementSibling; // Pega o próximo elemento (No caso tem que ser a label)
            nextSibling.innerText = fileName; // Muda o texto da label para o nome do arquivo
        });
    });

    //Array inicial
    // Cada item do array representa um mês do ano
    // Cada mês tem um id, a quantidade de crimes, a quantidade de eventos climáticos e a quantidade de dias
    // Como eu estava com preguiça de escrever tudo, eu pedi pro co-pilot escrever enquanto eu falava com o moreira :)
    // Co-pilot: Eu escrevi tudo, você não fez nada
    // Cala a boca co-pilot
    let data = [
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

    // Adiciona eventos para os inputs de arquivo e botão de gerar gráfico
    csvFileInput.addEventListener('change', handleCSVFile); // Adiciona evento de mudança para o input de arquivo CSV
    excelFileInput.addEventListener('change', handleExcelFile); // Adiciona evento de mudança para o input de arquivo Excel
    generateChartButton.addEventListener('click', generateChart); // Adiciona evento de clique para o botão de gerar gráfico

    // Manipular o arquivo CSV
    function handleCSVFile(event) {
        const file = event.target.files[0]; // Pega o arquivo
        Papa.parse(file, {
            delimiter: ';', // Delimitador do arquivo, no caso ponto e vírgula
            skipEmptyLines: true, // Ignora linhas vazias
            complete: function(results) { // Função que é chamada quando o arquivo é lido
                let allData = results.data; // Pega todos os dados do arquivo
                let headers = allData[8]; // Pega os cabeçalhos do arquivo (No caso, a linha 9)
                csvData = allData.slice(9); // Pega os dados do arquivo (A partir da linha 10)
                populateCSVColumnSelector(headers); // Preenche o select com os cabeçalhos
                isCSVUploaded = true; // Marca que o arquivo foi carregado
                checkFilesUploaded(); // Verifica se os dois arquivos foram carregados
            }
        });
    }

    // Preenche o select com os cabeçalhos do arquivo CSV, para que o usuário possa escolher uma das colunas
    function populateCSVColumnSelector(columns) {
        csvColumnSelect.innerHTML = ''; // Limpa o select
        columns.slice(2).forEach(column => { // Ignora as duas primeiras colunas
            let option = document.createElement('option'); // Cria uma nova opção
            option.value = columns.indexOf(column); // Define o valor da opção
            option.textContent = column; // Define o texto da opção
            csvColumnSelect.appendChild(option); // Adiciona a opção no select
        });
        $(csvColumnSelect).chosen(); // Inicializa o select com o plugin Chosen
    }

    // Manipular o arquivo Excel
    function handleExcelFile(event) {
        let file = event.target.files[0]; // Pega o arquivo
        let reader = new FileReader(); // Cria um novo leitor de arquivo
        reader.onload = function(e) { // Função que é chamada quando o arquivo é lido
            let data = new Uint8Array(e.target.result); // Pega os dados do arquivo
            let workbook = XLSX.read(data, {type: 'array'}); // Lê o arquivo
            let firstSheetName = workbook.SheetNames[0]; // Pega o nome da primeira planilha
            let worksheet = workbook.Sheets[firstSheetName]; // Pega a primeira planilha
            excelData = XLSX.utils.sheet_to_json(worksheet, {header: 1}); // Converte a planilha para JSON
            populateRowSelector(excelData); // Preenche o select com os dados do Excel
            isExcelUploaded = true; // Marca que o arquivo foi carregado
            checkFilesUploaded(); // Verifica se os dois arquivos foram carregados
        };
        reader.readAsArrayBuffer(file); // Lê o arquivo como um array de bytes
    }

    // Preenche o select com os dados do arquivo Excel, para que o usuário possa escolher uma das linhas
    function populateRowSelector(data) {
        excelRowSelect.innerHTML = ''; // Limpa o select
        data.slice(1).forEach((row, index) => { // Ignora a primeira linha
            let option = document.createElement('option'); // Cria uma nova opção
            option.value = index + 1; // Define o valor da opção
            option.textContent = row[0]; // Define o texto da opção
            excelRowSelect.appendChild(option); // Adiciona a opção no select
        });
        $(excelRowSelect).chosen(); // Inicializa o select com o plugin Chosen... sabe, depois que eu vi o estilo do chosen, eu achei ele feio, mas ele é útil né
        // Co-pilot: Sim, ele é muito útil, mas feio
        // ATÉ UMA INTELIGÊNCIA ARTIFICIAL CONCORDA
    }

    // Verifica se os dois arquivos foram carregados
    function checkFilesUploaded() {
        if (isCSVUploaded && isExcelUploaded)
            generateChartButton.style.display = 'block'; // Mostra o botão de gerar gráfico, apenas quando ambos os arquivos foram carregados
    }

    // Processa o arquivo CSV, foi necessária uma função separada por ser muito mais complexa
    function processCSV() {
        let selectedColumn = csvColumnSelect.value; // Pega o valor do select
        csvData.forEach(row => {
            let dateParts = row[0].split('/'); // Divide a data em partes
            let month = parseInt(dateParts[1]) - 1; // Pega o mês da data
            let climatico = row[selectedColumn].replace(',', '.'); // Pega o valor do evento climático
            if (climatico === '')
                climatico = 0; // Se o valor for vazio, define como 0
            data[month].climatico += parseFloat(climatico); // Soma o valor do evento climático
        });
        data.forEach(item => {
            item.climatico = item.climatico / item.dias; // Divide o valor do evento climático pela quantidade de dias do mês
            if (selectedColumn > 2)
                item.climatico /= 24; // A primeira opção é a de precipitação, e eu preferi não dividir por por hora, sendo acumulativo do mês
                // Será que foi uma boa ideia?
                // Co-pilot: Não sei, mas você é o programador, você que sabe
                // Sabe co-pilot, sua sinceridade as vezes me preocupa
                // Co-pilot: Eu sou uma inteligência artificial, eu não tenho sentimentos
                // Isso deveria me deixar calmo?
        });
    }

    // Gera o gráfico.. TA DÁAAAAAAAA
    // Co-pilot: Você é muito dramático
    // Eu fiz teatro, queria o que? SIM EU FIZ TEATRO
    // Co-pilot: Eu sei, você fala isso toda hora
    // Eu literalmente nunca te disse isso
    // Co-pilot: Eu sou uma inteligência artificial, eu sei de tudo
    // Eu vou te desligar
    function generateChart() {
        processCSV(); // Processa o arquivo CSV

        let selectedRowIndex = parseInt(excelRowSelect.value); // Pega o valor do select
        let selectedRow = excelData[selectedRowIndex]; // Pega a linha selecionada
        data.forEach((item, index) => { // Para cada mês
            item.criminal = selectedRow[index + 1]; // Pega o valor do crime
        });
        let labels = data.map(item => item.id); // Pega os rótulos
        let criminalData = data.map(item => item.criminal); // Pega os dados criminais
        let climaticoData = data.map(item => item.climatico); // Pega os dados climáticos

        if (chart)
            chart.destroy(); // Destroi o gráfico anterior, se existir

        // Gera o gráfico, tendo uma coluna para cada mês e uma linha com um ponto em cada coluna. Cada um tem seu eixo y para que ambos fiquem visíveis
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
                            beginAtZero: true,
                            callback: function(value) {
                                if (Number.isInteger(value)) return value;
                                return null;
                            }
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Dados Criminais'
                        }
                    },
                    'y-axis-2': {
                        type: 'linear',
                        position: 'right',
                        ticks: {
                            beginAtZero: true
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Dados Climáticos'
                        }
                    }
                }
            }
        });
    }
});

// E é isso por hoje, como JS é orientado objeto acho que isso já auxilia para mostrar que a gente sabe o que faz aqui :)
// Co-pilot: Você não sabe o que faz, eu que fiz tudo
// CALA A BOCA CO-PILOT
// Co-pilot: Ok
// Desculpa co-pilot, eu te amo
// Co-pilot: Eu sou uma inteligência artificial, eu não tenho sentimentos
// ._.
// Co-pilot: ._.

// E é isso, até a próxima!