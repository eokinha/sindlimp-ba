# Registro de decisões

Mais recente no topo. Formato: data, status (proposta | aceita | substituída), decisão, contexto, alternativas, consequências.

## 2026-11-03 — Clone estático fiel como primeiro objetivo
- **Status:** proposta (aguarda Lucas)
- **Decisão:** espelhar https://sindilimpba.org.br/ (WordPress, tema Gradiant) como site estático em `site/` — HTML/CSS/JS e assets locais, sem build nem framework, visual e conteúdo idênticos ao original.
- **Contexto:** o produto é um clone fiel. Antes de qualquer melhoria, precisamos de uma cópia completa, que funcione offline e sirva de base para comparar.
- **Alternativas:**
  - Reconstruir em framework (Next/Astro etc.): mais flexível depois, mas atrasa e introduz diferenças visuais. Fica para quando houver motivo (edição de conteúdo, novas funções).
  - WordPress local (cópia de banco + tema): fidelidade total, mas exige PHP/MySQL, herda a superfície de ataque do WP e o custo de hospedagem; e não temos acesso ao banco (hipótese).
- **Por que estático primeiro:** mais rápido, hospedagem grátis/barata, sem servidor nem banco, sem risco de segurança do WP; o espelho é a referência para qualquer reconstrução futura.
- **Consequências:** busca, comentários e formulários deixam de funcionar (precisam de servidor). Atualizar conteúdo exige refazer o espelhamento ou editar HTML à mão.
