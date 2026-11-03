# Roadmap

## Agora

### Objetivo 1 — Clone estático completo do sindilimpba.org.br
- **Problema:** não temos cópia própria do site; tudo depende do WordPress atual.
- **Escopo:** todas as páginas públicas em `site/`, com assets locais (CSS, JS, fontes, imagens, PDFs de `wp-content/uploads`):
  - Home; páginas institucionais (História `/histor/`, Secretarias, Plantões Jurídicos);
  - todos os posts/notícias e as listagens de categoria (Em Pauta, Institucional, Mulheres, Opinião, Parcerias, Política), com paginação;
  - menu, cabeçalho, rodapé e links internos funcionando.
- **Fora de escopo:** busca, comentários, formulários (contato/newsletter), feeds RSS, `wp-json`, área administrativa, melhorias de visual ou conteúdo.
- **Critérios de aceite (QA):**
  1. `npx --yes serve site` abre a home sem erro; visual igual ao original em desktop (1366px) e celular (375px), comparando prints lado a lado.
  2. Toda página/post/categoria listada no `sitemap` do original existe em `site/` e abre (HTTP 200).
  3. Nenhum link interno quebrado (crawler local sem 404).
  4. Com a rede desligada (ou bloqueando `sindilimpba.org.br`), nenhum recurso é carregado do domínio original; o console não mostra erros de recurso ausente.
  5. Imagens e anexos (PDFs) abrem localmente.
  6. Elementos fora de escopo não quebram a página (ficam ocultos ou inertes, sem erro de JS).
- **Bloqueio:** nenhum; espelhamento em andamento pelo tech-lead.

## Próximo

## Depois
