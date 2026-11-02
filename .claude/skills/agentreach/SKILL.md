---
name: agentreach
description: Travailler sur une machine distante (serveur SSH, VM, conteneur Docker/Podman) avec AgentReach (`reach`), sans installer d'agent ni copier de clé API sur la cible. À utiliser quand l'utilisateur veut exécuter des commandes, lire ou modifier des fichiers sur une autre machine, lancer Claude Code « sur » un serveur, ou mentionne `reach`, AgentReach, une cible `host:path`, `ssh://`, `docker://` ou `podman://`.
---

# AgentReach (`reach`)

Source : https://github.com/bojieli/agentreach (Go, licence MIT, aucune dépendance).

L'agent reste sur la machine locale ; `reach` intercepte ses commandes shell
(et, en mode `mirror`, ses lectures/écritures de fichiers) et les exécute sur la
cible via **une seule connexion SSH multiplexée**. Rien n'est installé sur la
cible par défaut ; seul le binaire `ssh` local est requis.

## 1. Vérifier / installer

```bash
command -v reach || go install github.com/bojieli/agentreach/cmd/reach@latest
```

Sans Go : binaires sur https://github.com/bojieli/agentreach/releases, ou image
`ghcr.io/bojieli/agentreach` (monter `~/.ssh` en lecture seule).
Ne jamais inventer d'identifiants : `reach` réutilise la config `ssh` existante
(`~/.ssh/config`, `ProxyJump`, clés, 2FA).

## 2. Désigner une cible

```
build-box                      alias ssh_config ou nom de /etc/hosts
[user@]host:path               comme scp (chemin relatif au home sauf « / »)
ssh://[user@]host[:port]/path  ~/path ; « //path » = chemin absolu
docker://conteneur/path        relatif à la racine du conteneur
podman://conteneur/path
local:///abs/path              cette machine (tests)
```

## 3. Usages depuis cette session (Claude déjà lancé)

Pour agir sur une cible sans relancer Claude, passer par `reach <cible> exec` :

```bash
reach build-box doctor                       # ce que la cible supporte, niveau choisi
reach build-box exec -- df -h /              # commande ponctuelle sur la cible
reach build-box:/srv/app exec -- go test ./...
reach fs read /etc/nginx/nginx.conf          # lire un fichier distant (session active)
reach status                                 # sessions ouvertes
reach log                                    # journal de ce qui a été exécuté / modifié
reach down <session>                         # fermer la session, ne rien laisser
```

Règles :
- Toujours `reach <cible> doctor` avant un premier travail sur une cible inconnue.
- Les commandes modifiant la cible (écriture de fichiers, `systemctl`, `rm`, etc.)
  sont des actions sur une machine réelle : confirmer avec l'utilisateur d'abord.
- Après le travail, montrer `reach log` et proposer `reach down`.

## 4. Lancer un agent « sur » la cible (à proposer à l'utilisateur)

Ces commandes démarrent un nouvel agent interactif ; c'est l'utilisateur qui les
lance dans son terminal :

```bash
reach build-box claude                       # Claude Code, bash exécuté sur build-box
reach build-box:src/app claude               # dans un répertoire précis
reach build-box --mode mirror claude         # Read/Write/Edit redirigés aussi
reach build-box claude --resume              # flags inconnus transmis à l'agent
reach client-box:/srv/app codex              # aussi : goose, opencode, gemini, kimi, crush, grok
```

Modes :
- `exec` (défaut) : les outils Read/Write/Edit de Claude sont désactivés, il
  travaille via le shell (déjà distant).
- `mirror` : `reach` sert Read/Write/Edit en tirant/poussant les fichiers via SSH.

Session longue et nommée :

```bash
reach up build-box:/srv/app --name build
reach claude --session build
reach down build
```

## 5. Dépannage

- `reach doctor` explique le niveau retenu (`pipe`, `posix`, helper) et ce qui
  est éventuellement présent sur la cible.
- `reach helper uninstall` retire tout ce que `reach` a pu déposer sur la cible.
- Docs détaillées : `docs/HOW-IT-WORKS.md`, `docs/harnesses/claude-code.md`,
  `docs/SECURITY.md` dans le dépôt.
