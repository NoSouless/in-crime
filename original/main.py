import pandas as pd  #biblioteca utilizada para extração do conteúdo do XLSX
import warnings  #apenas para não exibir os warnings
import csv  #biblioteca utilizada para a extração do conteúdo do CSV
import matplotlib.pyplot as plt  #biblioteca utilizada para a criação do gráfico
import numpy as np  #biblioteca utilizada para cálculo de arranjo do gráfico
from matplotlib.ticker import MaxNLocator  #importação da função para definir as labels dos eixos y para inteiros

#Relação entre Índices Pluviométricos e Criminalidade na Capital de São Paulo

#UM DESENVOLVIMENTO DE:

#FELIPE DE LIMA MONTEIRO (3695696)
#GUSTAVO DA SILVA SILVESTRE (7354473)
#LÉO CASELATO VILARONGA (8964753)
#PABLO DA SILVA MINHÃO (3537908)

warnings.simplefilter("ignore")  #esconder os warnings

#array principal, nele terá todo o conteúdo do gráfico, por mês
meses = [
    {
        'id': 'Janeiro',
        'dias': 31,
        'climatico': 0.00,
        'criminal': 0
    },
    {
        'id': 'Fevereiro',
        'dias': 28,
        'climatico': 0.00,
        'criminal': 0
    },
    {
        'id': 'Março',
        'dias': 31,
        'climatico': 0.00,
        'criminal': 0
    },
    {
        'id': 'Abril',
        'dias': 30,
        'climatico': 0.00,
        'criminal': 0
    },
    {
        'id': 'Maio',
        'dias': 31,
        'climatico': 0.00,
        'criminal': 0
    },
    {
        'id': 'Junho',
        'dias': 30,
        'climatico': 0.00,
        'criminal': 0
    },
    {
        'id': 'Julho',
        'dias': 31,
        'climatico': 0.00,
        'criminal': 0
    },
    {
        'id': 'Agosto',
        'dias': 31,
        'climatico': 0.00,
        'criminal': 0
    },
    {
        'id': 'Setembro',
        'dias': 30,
        'climatico': 0.00,
        'criminal': 0
    },
    {
        'id': 'Outubro',
        'dias': 31,
        'climatico': 0.00,
        'criminal': 0
    },
    {
        'id': 'Novembro',
        'dias': 30,
        'climatico': 0.00,
        'criminal': 0
    },
    {
        'id': 'Dezembro',
        'dias': 31,
        'climatico': 0.00,
        'criminal': 0
    },
]

#labels que serão mostradas no eixo y
labels = {
    'climatico': '',
    'criminal': '',
}

#abrindo o xlsx
xl_file = pd.ExcelFile(
    "OcorrenciaMensal(Criminal)-101 DP - Jardim das Imbuias_20240522_191258.xlsx",
    engine="openpyxl")

#extração do conteúdo do xlsx para ser inserido no array principal
#como um xlsx pode ter várias planilhas, fazemos um for para varrer-las
#neste caso o arquivo possui apenas uma planilha
for sheet_name in xl_file.sheet_names:
    df = xl_file.parse(sheet_name)  #conteúdo da planilha selecionada
    for i in range(
            0, 23):  #percorrer cada coluna para selecionar uma categoria de dado criminal
        print(format(i + 1) + ' - ' + df.iloc[i, 0])
    escolha = int(input("\nEscolha um dado criminal: ")) - 1
    labels['criminal'] = df.iloc[escolha, 0]  #seleciona a categoria e defina a label
    for i in range(1, 13):
        meses[i - 1]['criminal'] = int(df.iloc[escolha, i])#dados de cada coluna (mês) da categoria

print("\n\n")
#abrir o arquivo csv
with open(
        "INMET_SE_SP_A771_SAO PAULO - INTERLAGOS_01-01-2023_A_31-12-2023.CSV",
        newline='') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=';', quotechar='|')
    for _ in range(8): #pular as 8 primeiras linhas (são inúteis)
        next(spamreader)

    primeiraLinha = 1 #definir qua a próxima linha é a primeira linha, contendo as colunas que devem ser demonstradas ao usuário

    for row in spamreader:
        if (primeiraLinha == 1):
            for i in range(2, 19): #imprimir cada uma das categorias de dados climáticos
                print(format(i - 1) + ' - ' + row[i])

            escolha = int(input("\nEscolha um dado climatico: "))
            divisaoClimatica = 1 if escolha == 1 else 24 #precipitação é o único dado que não deve ser dividido por hora
            labels['climatico'] = row[escolha + 1] #inserir a label da categoria selecionada
            primeiraLinha = 0
        else:
            exploded_col = row[0].split('/') #o dado é recebido por dia, mas precisamos apenas do mês
            middle_value = exploded_col[1]
            if (row[escolha + 1] != ''): #algumas colunas estão simplesmente vazias
                float_value = row[escolha + 1].replace(',', '.') #convertendo para uma notação de float legível
                meses[(int(middle_value) -
                       1)]['climatico'] += float(float_value)

mes_names = [mes['id'] for mes in meses] #definir os dados das labels do eixo x
dadosClimaticos = [((mes['climatico']/mes['dias'])/(divisaoClimatica)) for mes in meses] #definir as labels do eixo Y da esquerda
dadosCriminais = [mes['criminal'] for mes in meses] #definir os dados das labels do eixo Y da direita

bar_width = 0.35 #o tamanho da coluna
fig, ax = plt.subplots(figsize=(12, 8)) #tamanho do gráfico

x = np.arange(len(mes_names)) #calculo do arranjo das colunas do gráfico

barra = ax.bar(x, dadosClimaticos, bar_width) #definindo a barra de dados climáticos
ax.set_ylabel(labels['climatico']+'/dia', color='tab:blue',
              fontsize=12) #definindo a label do eixo de dados climáticos
ax.tick_params(axis='y', labelcolor='tab:blue') #definindo a cor dos ticks do eixo de dados climáticos

ax1 = ax.twinx() #copia o ax

linha = ax1.plot(x, dadosCriminais, bar_width, color='orange') #adiciona a linha de dados criminais
ax1.set_ylabel(labels['criminal'], color='tab:orange',
               fontsize=12) #definindo a label de dados criminais no eixo Y
ax1.tick_params(axis='y', labelcolor='tab:orange') #definindo a cor dos dados criminais

for X, mes in zip(x, meses): #colocando os números reais, não aproximados
    climaTotal = ((mes['climatico']/mes['dias'])/(divisaoClimatica)) #cálculo dos dados climáticos, com base na escolha do usuário
    ax.annotate('{:.2f}'.format(climaTotal),
                xy=(X, climaTotal),
                xytext=(-5, 5),
                ha='right',
                textcoords='offset points') #colocando os números nos pontos dos dados climáticos
    ax1.annotate('{}'.format(mes['criminal']),
                 xy=(X, mes['criminal']),
                 xytext=(-5, 5),
                 ha='right',
                 textcoords='offset points') #colocando os números nos pontos dos dados criminais

ax.set_title('2023') #define o título do gráfico
ax.set_xticks(x) #define a quantidade de colunas que o gráfico terá
ax.set_xticklabels(mes_names) #define os nomes das colunas

ax.yaxis.grid(True) #coloca as linhas referentes aos dados climáticos

#limita os ticks para números inteiros em ambos os casos
ax.yaxis.set_major_locator(MaxNLocator(integer=True)) 
ax1.yaxis.set_major_locator(MaxNLocator(integer=True))


plt.xticks(rotation=45) #define a rotação dos ticks (neste caso os meses) para 45º para que caibam (caso precise)
plt.show() #mostra o gráfico
