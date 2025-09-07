# PDF Compressor - Electron App

Este é um compressor de PDF moderno construído com **Electron** e **React**, eliminando a necessidade do Ghostscript e oferecendo uma interface nativa de desktop.

## ✨ Funcionalidades

- 📁 Interface nativa para seleção de arquivos
- 🗜️ Compressão de PDF usando JavaScript puro (pdf-lib)
- 🎨 Interface moderna e responsiva
- 📱 Funciona como aplicação desktop nativa
- 🚫 **Sem dependências externas** (não precisa do Ghostscript)
- 💾 Diálogo nativo para salvar arquivos

## 🚀 Tecnologias Utilizadas

- **Electron** - Framework para aplicações desktop
- **React** - Interface de usuário
- **pdf-lib** - Manipulação de PDF em JavaScript
- **CSS3** - Estilização moderna com gradientes e efeitos

## 📋 Requisitos

- Node.js 16.x ou superior
- npm ou yarn

## 🛠️ Instalação

1. Clone este repositório:

   ```bash
   git clone https://github.com/gabrieldorodrigues/pdf-compressor-python.git
   cd pdf-compressor-python
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

## 🎮 Como Usar

### Modo Desenvolvimento

```bash
npm run electron-dev
```

Este comando iniciará tanto o servidor React quanto o Electron simultaneamente.

### Modo Produção

```bash
npm run build
npm run electron
```

### Gerar Executável

```bash
npm run dist
```

Isso criará um executável na pasta `dist/` para o seu sistema operacional.

## 📚 Níveis de Compressão

- **Baixa**: Máxima compressão, menor qualidade (ideal para visualização em tela)
- **Média**: Balanceado entre tamanho e qualidade (recomendado para a maioria dos casos)
- **Alta**: Menor compressão, maior qualidade (ideal para impressão)

## 📁 Estrutura do Projeto

```
pdf-compressor-python/
├── public/
│   ├── electron.js          # Processo principal do Electron
│   ├── preload.js          # Script de preload para segurança
│   └── index.html          # Template HTML
├── src/
│   ├── components/
│   │   ├── PDFCompressor.js    # Componente principal
│   │   └── PDFCompressor.css   # Estilos do componente
│   ├── App.js              # Componente raiz
│   ├── App.css             # Estilos globais
│   ├── index.js            # Ponto de entrada React
│   └── index.css           # Estilos base
├── package.json            # Configurações do projeto
└── README.md              # Este arquivo
```

## 🔧 Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento React
- `npm run build` - Gera build de produção
- `npm run electron` - Executa o Electron
- `npm run electron-dev` - Desenvolvimento com hot reload
- `npm run dist` - Gera executável para distribuição

## 🌟 Vantagens sobre a Versão Python

1. **Sem dependências externas**: Não precisa instalar Ghostscript
2. **Interface nativa**: Diálogos de sistema para abrir/salvar arquivos
3. **Multiplataforma**: Funciona em Windows, macOS e Linux
4. **Moderna**: Interface responsiva e intuitiva
5. **Standalone**: Executável independente

## 🚨 Migração da Versão Python

A versão anterior em Python com Flask foi substituída por esta versão em Electron para:

- Eliminar a dependência do Ghostscript
- Oferecer uma experiência desktop nativa
- Simplificar a instalação e distribuição
- Modernizar a interface do usuário

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas, por favor abra uma [issue](https://github.com/gabrieldorodrigues/pdf-compressor-python/issues) no GitHub.

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
