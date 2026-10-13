# Alecrim — receitas com carinho

Biblioteca pessoal de sites de receitas selecionados, feita como presente. Reúne fontes conhecidas por categoria, permite favoritar, anotar e montar uma lista de receitas para testar, e tem um espaço especial com carta e surpresa.

O nome vem do alecrim, a erva. Pode ser trocado em `config.js`.

## O que existe no projeto

- Página inicial com saudação, pesquisa, atalhos de categoria, fontes em destaque, resumo dos favoritos e acesso ao espaço especial.
- Catálogo de fontes com cartões: nome, descrição, idioma, tipo de conteúdo, categorias, domínio oficial cadastrado, situação da revisão e botão para visitar.
- Pesquisa e filtros (texto, categoria, idioma, só favoritos) com estado vazio e botão de limpar.
- Favoritos, anotações por fonte, marcação "já experimentei" e lista "Receitas para testar" (nome, link opcional, observação, marcar como feita, remover, pesquisar).
- Espaço romântico: envelope que abre uma carta e uma surpresa. Todo o texto fica em `config.js`.
- PWA: pode ser instalada no celular ou computador quando hospedada em HTTPS.
- Sem login, sem rastreamento, sem bibliotecas externas, sem fontes ou imagens de terceiros.

Tecnologias: HTML5, CSS3 e JavaScript puro. Nada para instalar.

## Estrutura dos arquivos

| Arquivo | Para que serve |
|---|---|
| `index.html` | Estrutura da página (todas as telas) |
| `style.css` | Visual; cores e fontes nas variáveis do início do arquivo |
| `script.js` | Lógica: pesquisa, filtros, favoritos, lista, carta, PWA |
| `sites.js` | **Cadastro dos sites e das categorias** (único lugar com links) |
| `config.js` | **Nome dela, textos, carta e surpresa** |
| `manifest.json` | Dados de instalação do aplicativo |
| `service-worker.js` | Cache dos arquivos do próprio projeto |
| `icon.svg`, `icon-192.png`, `icon-512.png` | Ícones |
| `verificar-links.mjs` | Apoio para revisar links (precisa de Node 18+) |
| `README.md` | Este guia |

Observação: os dados dos sites ficam em `sites.js` (e não em `sites.json`) para que o projeto funcione também ao abrir o `index.html` com duplo clique. O navegador bloqueia a leitura de arquivos `.json` nesse modo. O conteúdo é JSON comum atribuído a uma variável.

## Como executar

1. Extraia o ZIP em uma pasta.
2. **Opção simples:** dê duplo clique em `index.html`. Tudo funciona, exceto o recurso de instalação como aplicativo.
3. **Opção com servidor local** (recomendada para testar o PWA). Na pasta do projeto, com Python instalado: `python3 -m http.server 8080` e acesse `http://localhost:8080`.
4. **Publicar:** envie todos os arquivos para uma hospedagem estática com HTTPS (GitHub Pages, Netlify, Cloudflare Pages etc.). Não há etapa de compilação.

Service Worker e instalação do aplicativo só funcionam em HTTPS ou em `localhost`. Fora disso o site funciona normalmente, sem esses recursos.

## Como adicionar um site de receitas

Edite `sites.js`, dentro da lista `"sites"`. Copie um bloco existente, cole ao final (lembrando da vírgula entre blocos) e altere:

```js
{
  "id": "exemplo-receitas",
  "name": "Exemplo Receitas",
  "url": "https://www.exemplo-receitas.com.br/",
  "domain": "exemplo-receitas.com.br",
  "language": "Português (BR)",
  "type": "Blog de receitas caseiras",
  "description": "Uma frase ou duas, escritas por você, sobre o que o site tem de bom.",
  "categories": ["bolos", "doces"],
  "keywords": ["bolo de pote", "festa"],
  "featured": false,
  "status": "pending",
  "lastReview": null,
  "note": "Opcional: um aviso útil, como 'tem muitos anúncios'."
}
```

- **Nome:** campo `name`.
- **URL oficial:** campo `url`, obrigatoriamente `https://`. Abra o site no navegador e copie o endereço, sem encurtadores.
- **Domínio:** campo `domain`, só o domínio principal, sem `https://` e sem `www`. O botão só aparece se a URL pertencer a esse domínio.
- **Descrição:** texto próprio, curto e honesto. Não copie a descrição do site nem invente avaliações.
- **Categorias:** use os `id` da lista `"categories"` (por exemplo `bolos`, `massas`, `a-dois`). Para criar uma categoria nova, acrescente `{ "id": "...", "name": "...", "hint": "..." }` à lista de categorias.
- **Palavras-chave:** termos que ela poderia digitar na pesquisa.
- **Imagem:** os cartões usam a inicial do site como marca, para não depender de imagens de terceiros. Se quiser logotipo ou foto, coloque o arquivo na pasta do projeto e ajuste `buildCard` em `script.js`; não use imagens hospedadas em outros sites, pois a política de segurança do `index.html` as bloqueia.
- **Data de revisão:** deixe `"status": "pending"` e `"lastReview": null` até conferir o site. Depois de abrir o link e verificar, troque para `"status": "reviewed"` e `"lastReview": "AAAA-MM-DD"` (a data real).
- **Validar o endereço:** abra o `index.html`. Se o link for inválido (não HTTPS ou fora do domínio), a fonte é ocultada e um aviso aparece em "Fontes". Opcionalmente rode `node verificar-links.mjs` para ver se os links respondem e se redirecionam para outro domínio.
- **Testar:** procure o site pelo nome na página "Fontes", confira o cartão e clique em "Visitar site" (abre em nova aba).

Para o site aparecer na página inicial, use `"featured": true` (recomendado no máximo 4 ou 5).

## Como remover ou atualizar um site

No mesmo `sites.js`: para atualizar, altere os campos do bloco (link, descrição, categorias) e, se mexeu no link, volte `status` para `"pending"` até revisar de novo. Para remover uma fonte que deixou de ser confiável, apague o bloco inteiro (cuidando das vírgulas). Favoritos que apontavam para uma fonte removida deixam de aparecer, sem causar erro.

## Como personalizar

- **Nome do sistema, tagline, nome dela, carta e surpresa:** `config.js`.
- **Cores:** variáveis no início de `style.css` (`--sage`, `--rose`, `--cream`...).
- **Tipografia:** `--font-body` e `--font-title` em `style.css`. Foram usadas fontes que já vêm no aparelho; para usar uma fonte própria, coloque o arquivo na pasta e declare com `@font-face`.
- **Logotipo e ícone:** troque `icon.svg`, `icon-192.png`, `icon-512.png` mantendo os nomes (ou ajuste `manifest.json`).
- **Categorias:** lista `"categories"` em `sites.js`.
- **Fotografias:** o projeto não inclui fotos. A página inicial usa uma ilustração em SVG dentro do `index.html`. Para usar fotos, coloque-as na pasta e referencie-as; elas precisam ser locais (a política de segurança bloqueia imagens externas).
- **Textos fixos** (títulos das seções, avisos): `index.html`.

Os textos de `config.js` entregues são genéricos de propósito, sem memórias do casal. Troque por algo seu antes de entregar.

## Favoritos e armazenamento

Favoritos, anotações, "já experimentei" e a lista de receitas ficam no `localStorage` do navegador, com a chave `alecrim.v1`. Isso significa:

- Os dados permanecem ao fechar e reabrir o navegador.
- **Não acompanham** a pessoa em outro navegador ou aparelho. Celular e computador terão listas separadas.
- Se ela limpar os dados do site ou do navegador, ou usar navegação privada, os dados somem.
- Não há sincronização entre aparelhos nem cópia de segurança. Nada é enviado a servidor algum.

## Segurança e limitações

O que está implementado de fato:

- Links vivem só em `sites.js`; o código não tem endereços escritos.
- Só são aceitos links `https://` cujo domínio pertença ao domínio oficial cadastrado, sem usuário e senha. Fontes que não cumprem isso são ocultadas e avisadas.
- Links externos abrem em nova aba com `rel="noopener noreferrer"`.
- O conteúdo da tela é montado com `textContent`, sem `innerHTML`; o que ela digita nas anotações e na lista não é interpretado como HTML. Links digitados na lista "Receitas para testar" só são aceitos se forem HTTPS.
- Política de segurança de conteúdo (CSP) no `index.html`: só scripts, estilos e imagens do próprio projeto; nenhuma conexão a servidores externos.
- Sem scripts, fontes, imagens ou analytics de terceiros. Não pede senhas, dados bancários nem dados pessoais.
- O service worker guarda em cache apenas os arquivos deste projeto e ignora qualquer endereço de outro site.

O que **não** existe:

- Nenhuma verificação automática de reputação ou de malware (como Google Safe Browsing). Isso exigiria uma chave de API que não pode ficar exposta no navegador e, portanto, um servidor próprio; não foi implementado.
- Nenhum monitoramento contínuo. A revisão é manual: o `verificar-links.mjs` é uma ajuda para achar links quebrados ou redirecionados, não um certificado.
- HTTPS não prova que um site é confiável, e nenhuma fonte aqui é apresentada como "100% segura". O selo mostrado é "Revisado em [data]" (só aparece se você mesmo registrar a revisão) ou "Revisão pendente".
- O projeto não controla o que os sites listados exibem (anúncios, pop-ups, mudanças de dono ou de conteúdo).

Situação do catálogo na entrega: as dez fontes estão como **revisão pendente**. Os endereços foram cadastrados a partir dos domínios conhecidos de cada site, mas os links não foram abertos e conferidos individualmente quando o projeto foi montado. Faça a revisão (abrir cada link, conferir que o endereço e o site estão corretos) e registre a data.

## PWA e publicação

- Para atualizar arquivos depois de publicar, altere `CACHE_VERSION` em `service-worker.js` (por exemplo para `alecrim-v2`) para que os aparelhos baixem a versão nova. O service worker busca primeiro na rede e usa o cache só como reserva.
- Se criar arquivos novos que o aplicativo precise, inclua-os na lista `ASSETS` do `service-worker.js`.
- Sem internet, o próprio Alecrim abre (cartões, favoritos, carta), mas os sites de receitas não: eles dependem de conexão e não são guardados.
- No iPhone, a instalação é por Safari > Compartilhar > Adicionar à Tela de Início.

## Testes realizados

Executados em ambiente automatizado (Node + jsdom), com 34 verificações aprovadas: abertura da página, 12 categorias, links HTTPS com `noopener noreferrer`, pesquisa (inclusive sem acento), filtros de categoria, idioma e favoritos, estado vazio, favoritar e persistência no `localStorage` (inclusive após recarregar), anotações, lista para testar (rejeita `http://` e `javascript:`), texto digitado sem virar HTML, envelope e surpresa, menu móvel, rotas por `#`, ocultação de fonte com link inválido ou domínio falso, arquivos referenciados existentes e ausência de `style=` inline (compatível com a CSP). O jsdom emitiu avisos de `scrollTo`/`scrollIntoView` não implementados, que são limitações do simulador e não afetam navegadores reais.

**Não foi testado:** a aparência em navegadores e aparelhos reais (Chrome, Safari, Firefox, Edge, Android, iPhone, tablets), o contraste medido por ferramenta, leitores de tela, a instalação do PWA, o service worker em execução e o carregamento dos sites externos. O layout foi escrito mobile-first com Grid e Flexbox, mas confira em seus aparelhos antes de entregar.

## Solução de problemas

- **Página sem fontes ou em branco:** confira se `sites.js` e `config.js` estão na mesma pasta do `index.html` e se não ficou vírgula faltando ou sobrando ao editar (abra o console do navegador, F12, para ver o erro).
- **Uma fonte sumiu:** o link não é HTTPS ou não pertence ao `domain` cadastrado; veja o aviso em "Fontes".
- **Favoritos sumiram:** dados do navegador foram limpos, ou está em outra aba privada, navegador ou aparelho.
- **Botão "Instalar" não aparece:** exige HTTPS (ou `localhost`) e um navegador compatível; o iPhone usa "Adicionar à Tela de Início".
- **Alterei arquivos e nada mudou no aplicativo instalado:** aumente `CACHE_VERSION` no `service-worker.js` e recarregue.
- **Imagem local não aparece:** confira o caminho e o nome do arquivo (maiúsculas contam).
