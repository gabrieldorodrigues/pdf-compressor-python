# PDF-Compressor

Um aplicativo simples de compressão de arquivos PDF utilizando Flask e Ghostscript. Este projeto permite que os usuários façam upload de um arquivo PDF e o comprima usando diferentes configurações de qualidade.

## Índice

- [Recursos](#recursos)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Uso](#uso)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Funciona](#como-funciona)

## Recursos

- Upload de arquivos PDF.
- Compressão de arquivos PDF com diferentes níveis de qualidade.
- Download do arquivo PDF comprimido.

## Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:

- **Python** (versão 3.6 ou superior)
- **Flask** (framework para aplicações web)
- **Ghostscript** (ferramenta para processamento de arquivos PDF)

### Instalação do Ghostscript

1. Baixe e instale o Ghostscript a partir do [site oficial](https://www.ghostscript.com/download/gsdnld.html).
2. Durante a instalação, anote o caminho de instalação, pois você precisará dele mais tarde.

## Instalação

1. Clone este repositório:

   ```bash
   git clone https://github.com/gabrieldorodrigues/pdf-compressor.git
   cd pdf-compressor
   ```

2. Crie um ambiente virtual (opcional, mas recomendado):

   ```bash
   python -m venv venv
   source venv/bin/activate   # No Windows use: venv\Scripts\activate
   ```

3. Instale as dependências:

   ```bash
   pip install Flask
   ```

4. Configure o caminho do Ghostscript no arquivo `app.py`:

   Localize a linha:
   ```python
   ghostscript_path = "C:\\Program Files\\gs\\gs9.xx\\bin\\gswin64c.exe"
   ```
   e atualize para o caminho onde o Ghostscript está instalado.

5. Crie as pastas para upload e compressão:

   ```bash
   mkdir uploads compressed
   ```

## Uso

1. Execute o aplicativo Flask:

   ```bash
   python app.py
   ```

2. Abra um navegador e acesse `http://127.0.0.1:5000`.

3. Utilize o formulário para fazer upload de um arquivo PDF e selecione a qualidade desejada para a compressão.

4. Após a compressão, o arquivo PDF comprimido será baixado automaticamente.

## Estrutura do Projeto

```
pdf-compressor/
│
├── app.py                   # Código do aplicativo Flask
├── uploads/                 # Diretório para arquivos PDF enviados
├── compressed/              # Diretório para arquivos PDF comprimidos
└── templates/
    └── index.html          # Modelo HTML para o formulário de upload
```

## Como Funciona

1. **Upload de Arquivo**: O usuário faz upload de um arquivo PDF através de um formulário HTML.
2. **Compressão**: O aplicativo utiliza o Ghostscript para comprimir o PDF com base na qualidade selecionada.
3. **Download**: O arquivo PDF comprimido é disponibilizado para download.

### Comando Ghostscript

O comando utilizado para compressão é semelhante a este:

```bash
gswin64c -sDEVICE=pdfwrite -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile=output.pdf input.pdf
```

- `-sDEVICE=pdfwrite`: Especifica o dispositivo de saída.
- `-dPDFSETTINGS=/screen`: Define o nível de compressão. Você pode alterar para `/screen`, `/ebook`, `/printer`, etc.
- `-sOutputFile=output.pdf`: Especifica o arquivo de saída.
- `input.pdf`: O arquivo PDF de entrada.