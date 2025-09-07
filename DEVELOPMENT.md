# Guia de Desenvolvimento

## 🔄 Como Testar a Aplicação

### 1. Modo Desenvolvimento

```bash
npm run electron-dev
```

- Inicia React + Electron simultaneamente
- Hot reload ativado
- DevTools abertas automaticamente

### 2. Modo Produção Local

```bash
npm run build
npm run electron
```

### 3. Gerar Executável

```bash
npm run dist
```

Gera executáveis para distribuição na pasta `dist/`

## 🧪 Testando a Compressão

1. **Selecionar arquivo**: Clique na área de upload
2. **Escolher nível**: Baixa/Média/Alta compressão
3. **Comprimir**: Aguarde o processo
4. **Visualizar resultados**: Estatísticas de compressão
5. **Salvar**: Diálogo nativo do sistema

## 🛠️ Melhorias Implementadas

### Sobre a Versão Anterior (Python)

- ❌ Dependia do Ghostscript (instalação externa)
- ❌ Interface web básica
- ❌ Processamento server-side

### Nova Versão (Electron)

- ✅ Sem dependências externas
- ✅ Interface desktop nativa
- ✅ Processamento client-side
- ✅ Multiplataforma
- ✅ Estatísticas de compressão
- ✅ Executável standalone

## 🚀 Próximos Passos

### Funcionalidades Adicionais

1. **Compressão em lote**: Múltiplos arquivos
2. **Preview**: Visualização antes/depois
3. **Configurações avançadas**: DPI, qualidade de imagem
4. **Histórico**: Arquivos processados recentemente
5. **Drag & Drop**: Arrastar arquivos para a interface

### Melhorias Técnicas

1. **Worker threads**: Para arquivos grandes
2. **Compressão avançada**: Bibliotecas especializadas
3. **Validação**: Verificar integridade do PDF
4. **Logging**: Sistema de logs detalhado
5. **Auto-update**: Atualizações automáticas

## 📊 Limitações Atuais

### pdf-lib vs Ghostscript

- **pdf-lib**: Compressão básica, sem otimização de imagens
- **Ghostscript**: Compressão avançada, otimização de imagens

### Para Compressão Mais Avançada

Considere adicionar:

- `pdf2pic` + `sharp` para processamento de imagens
- `pdfparse` para análise detalhada
- `canvas` para renderização customizada

## 🔧 Configuração do Build

### Windows (NSIS)

```json
"win": {
  "target": "nsis",
  "icon": "public/icon.ico"
}
```

### macOS

```json
"mac": {
  "target": "dmg",
  "icon": "public/icon.icns"
}
```

### Linux

```json
"linux": {
  "target": "AppImage",
  "icon": "public/icon.png"
}
```
