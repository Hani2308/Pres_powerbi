# Everything Claude Code : guide d'utilisation

Source : https://github.com/worldflowai/everything-claude-code (fork de affaan-m/everything-claude-code).
Le tout est installé **au niveau du projet**, dans `.claude/`. Ces composants s'activent dès que
Claude Code est lancé dans ce dépôt, sur cette machine cloud comme sur la tienne après `git pull`.

## Ce qui est installé

| Type | Emplacement | Contenu |
|------|-------------|---------|
| Agents (9) | `.claude/agents/` | architect, build-error-resolver, code-reviewer, doc-updater, e2e-runner, planner, refactor-cleaner, security-reviewer, tdd-guide |
| Commandes (15) | `.claude/commands/` | /plan, /tdd, /verify, /checkpoint, /code-review, /build-fix, /refactor-clean, /e2e, /eval, /learn, /orchestrate, /test-coverage, /update-codemaps, /update-docs, /setup-pm |
| Skills (11) | `.claude/skills/` | backend-patterns, clickhouse-io, coding-standards, continuous-learning, eval-harness, frontend-patterns, project-guidelines-example, security-review, strategic-compact, tdd-workflow, verification-loop |
| Règles (8) | `.claude/rules/` | agents, coding-style, git-workflow, hooks, patterns, performance, security, testing (chargées automatiquement à chaque session) |
| Hooks | `.claude/settings.json` + `.claude/scripts/hooks/` | voir plus bas |
| MCP | `.mcp.json` | memory, sequential-thinking (sans clé API). Le catalogue complet est dans `.claude/mcp-configs/mcp-servers.json` |
| Contextes | `.claude/contexts/` | dev, review, research |
| Exemples et tests | `.claude/examples/`, `.claude/tests/` | modèles de CLAUDE.md, sessions d'exemple, suite de 62 tests |

## Comment l'utiliser

### Commandes (tape-les dans Claude Code)

```
/plan Ajouter une slide sur les mesures DAX     → plan détaillé, attend ta validation avant de coder
/tdd                                            → écrit les tests d'abord, puis le code minimal
/verify                                         → build, lint, tests, sécurité, revue du diff
/code-review                                    → revue qualité et sécurité des changements non commités
/checkpoint create avant-refonte                → enregistre un point d'étape
/learn                                          → extrait les apprentissages de la session dans un skill
/orchestrate feature "Ajouter export PDF"       → enchaîne planner → tdd-guide → code-reviewer → security-reviewer
/build-fix                                      → corrige les erreurs de build une par une
/setup-pm npm                                   → fixe le gestionnaire de paquets (npm/pnpm/yarn/bun)
```

Note : `/code-review`, `/learn` et `/plan` existent aussi en version intégrée à Claude Code.
La version du projet prend le dessus quand tu tapes la commande dans ce dépôt.

### Agents (délégation)

Formule ta demande en nommant l'agent, ou laisse Claude choisir seul :

```
Utilise l'agent security-reviewer sur formation-powerbi/outils_docs/
Demande à l'agent architect comment organiser les scripts de build
```

`/agents` affiche la liste et permet de les modifier.

### Skills

Ils se chargent seuls quand le sujet correspond (sécurité, TDD, vérification…).
Tu peux aussi les demander directement : « applique le skill verification-loop ».

### Contextes

Pour changer de « mode » : `claude --append-system-prompt "$(cat .claude/contexts/review.md)"`.

## Hooks automatiques

| Événement | Effet |
|-----------|-------|
| SessionStart | signale les sessions récentes (`~/.claude/sessions/`) et le gestionnaire de paquets |
| PreToolUse Bash | **bloque** un serveur de dev lancé hors tmux ; rappels tmux et avant `git push` |
| PreToolUse Edit/Write | suggère `/compact` au bout de 50 appels, puis tous les 25 (`COMPACT_THRESHOLD` pour changer le seuil) |
| PreToolUse Write | blocage des nouveaux `.md` et `.txt` : **désactivé par défaut**, active-le avec `ECC_BLOCK_MD=1` |
| PostToolUse Edit | Prettier et `tsc` sur les fichiers JS/TS (s'ils sont installés), alerte sur les `console.log` |
| PostToolUse Bash | affiche l'URL de la PR après un `gh pr create` |
| PreCompact | consigne la compaction dans le fichier de session |
| Stop | alerte s'il reste des `console.log` dans les fichiers modifiés |
| SessionEnd | crée ou met à jour `~/.claude/sessions/AAAA-MM-JJ-session.tmp` et évalue la session pour /learn |

`/hooks` dans Claude Code liste les hooks actifs.

## Adaptations par rapport au dépôt d'origine

- `hooks/hooks.json` utilisait des matchers sous forme d'expressions (`tool == "Bash" && …`) que
  Claude Code n'accepte plus. Les conditions ont été déplacées dans `.claude/scripts/hooks/ecc-guards.js`
  et les blocages utilisent maintenant le code de sortie 2, qui bloque vraiment.
- `${CLAUDE_PLUGIN_ROOT}` a été remplacé par `$CLAUDE_PROJECT_DIR/.claude`.
- Prettier et tsc sont lancés avec `npx --no-install` : ils ne sont jamais téléchargés à ton insu.
- `evaluate-session.js` lit aussi `transcript_path` depuis l'entrée du hook (format actuel).
- Ajout du frontmatter `name`/`description` aux skills eval-harness, verification-loop et
  project-guidelines-example, sans lequel Claude Code ne les détectait pas.
- Le blocage des `.md` est désactivé par défaut parce que ce projet est surtout composé de documents.

## Vérifier l'installation soi-même

```bash
node .claude/tests/run-all.js            # 62 tests, tous doivent passer
claude -p "Liste tes agents et skills"   # doit citer planner, tdd-guide, verification-loop…
```
