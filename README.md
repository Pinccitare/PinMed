# PinMed

Aplicativo offline para gerar documentos médicos: receitas simples, controle especial,
antimicrobianos, exames laboratoriais e de imagem, encaminhamentos, atestados, requisição de
hemocomponentes (FHEMERON), pacote pré-operatório, APAC e impressos institucionais
(como os da Policlínica Oswaldo Cruz / SESAU-RO).
É um aplicativo web estático centrado em um único arquivo HTML (`index.html`), que roda
diretamente no navegador, sem servidor obrigatório e sem internet.

## Recursos principais

- **Documentos e formulários completos**: receitas simples, controle especial (2 vias),
  antimicrobianos (RDC 471/2021), pedidos de exames laboratoriais, montador de **exames de imagem**
  (Raio-X, Ultrassom, Tomografia, Ressonância e Outros), encaminhamentos (incluindo ficha SESAU-RO),
  atestados, **requisição de hemocomponentes (FHEMERON, 2 páginas)**, **pacote pré-operatório
  (5 folhas)**, **APAC / Tomografia** e modelos da Policlínica Oswaldo Cruz (POC).
- **Segurança clínica e alertas**: detecção de alergias (inclusive reação cruzada por classe),
  interações medicamentosas, alertas para **Gestante** e **Lactante**, duplicidade terapêutica,
  regras regulatórias de controle especial (C1/A/B) e antimicrobianos, e conferência pré-impressão.
- **Calculadora pediátrica e protocolos**: cálculo de dose por **Peso (kg)** direto no fluxo de
  prescrição, além de protocolos `[Pediatria]` e `[Urgência / PS]` com filtros rápidos.
- **Produtividade no consultório**: aba **Texto rápido** para extrair dados de evoluções clínicas,
  fila de impressão com otimização 2 por folha A4, busca multi-termo, **Desfazer/Refazer**
  (`Ctrl+Z` / `Ctrl+Shift+Z`) e atalhos de teclado.
- **Conforto visual**: **modo escuro/claro** e modo de conforto noturno do papel na tela
  (mantendo a impressão limpa em fundo branco).
- **PWA offline-first**: instalação como aplicativo no Chrome/Edge com atalhos rápidos no ícone e
  atualização segura em segundo plano (sem interromper uma consulta em andamento).

## Como usar

1. Abra `index.html` no Chrome ou no Edge.
2. Para instalar como aplicativo (PWA, opcional), sirva esta pasta por HTTP/HTTPS, por exemplo:
   ```bash
   python -m http.server 8080
   ```
   e abra `http://localhost:8080`.

As instruções completas para o usuário final estão em `LEIA-ME.txt`.

## Uso em pen drive (opcional)

- **Modo direto (esta pasta)**: basta copiar esta pasta estática para o pen drive e abrir
  `index.html` no Chrome ou no Edge (os dados ficam salvos no navegador do computador em uso;
  use **Configurações > Backup e restauração** para levar seus modelos entre máquinas).
- **Empacotador executável (`PinMed.exe`, externo)**: existe a possibilidade de distribuir o
  PinMed embrulhado em um lançador opcional em Go (`PinMed.exe`), que serve o app localmente em
  `127.0.0.1` em modo aplicativo e armazena os dados ao lado do executável. Esse empacotador é um
  projeto/distribuição externa e **não** faz parte desta pasta web estática.

## Estrutura

| Arquivo | Função |
|---|---|
| `index.html` | O aplicativo completo (HTML, CSS e JavaScript) |
| `sw.js` | Service Worker offline-first (Stale-While-Revalidate e atualização controlada) |
| `manifest.json` | Manifesto PWA (instalação, ícones e atalhos rápidos) |
| `icon.svg` | Ícone vetorial principal |
| `icon-192.png` | Ícone PNG 192×192 |
| `icon-512.png` | Ícone PNG 512×512 |
| `icon-maskable-512.png` | Ícone PNG 512×512 full-bleed em zona segura (maskable para Android/Windows/ChromeOS) |
| `LEIA-ME.txt` | Manual completo do usuário final (médicos e prescritores) |
| `README.md` | Documentação técnica do projeto |

## Publicar uma versão nova

Sempre que atualizar o `index.html` ou algum recurso estático, aumente o número em
`CACHE = 'pinmed-vNN'` no arquivo `sw.js` (ex.: `pinmed-v24`, `pinmed-v25`).
As cópias instaladas baixam a versão nova em segundo plano e exibem o aviso de atualização sem
interromper uma consulta em andamento.

## Publicar no Git

```bash
git remote add origin <url-do-repositorio>
git branch -M main
git push -u origin main
```

## Privacidade

Todos os dados (modelos, locais, prescritor, paciente em tela e histórico) permanecem localmente no
navegador (`localStorage`). Nenhuma informação é enviada para a internet — inclusive os textos
colados na aba **Texto rápido**.
