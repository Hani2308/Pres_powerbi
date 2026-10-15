#!/usr/bin/env node
/**
 * ECC guards - port of the inline hooks from everything-claude-code hooks/hooks.json
 *
 * The upstream hooks.json uses expression matchers (tool == "Bash" && ...) that
 * current Claude Code does not support: matchers are tool-name regexes. The
 * settings.json matchers select the tool, and this script applies the original
 * conditions on the hook input read from stdin.
 *
 * Usage: node ecc-guards.js <pre-bash|pre-write|post-bash|post-edit|stop>
 * Exit 2 blocks the tool call (PreToolUse) and sends stderr to Claude.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const mode = process.argv[2];

function readInput() {
  try {
    const raw = fs.readFileSync(0, 'utf8');
    return raw.trim() ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const input = readInput();
const toolInput = input.tool_input || {};
const err = msg => console.error(msg);

function preBash() {
  const cmd = toolInput.command || '';

  if (/(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)/.test(cmd) && !process.env.TMUX) {
    err('[Hook] BLOCKED: Dev server must run in tmux for log access');
    err('[Hook] Use: tmux new-session -d -s dev "npm run dev"');
    err('[Hook] Then: tmux attach -t dev');
    process.exit(2);
  }

  if (/(npm (install|test)|pnpm (install|test)|yarn (install|test)?|bun (install|test)|cargo build|make|docker|pytest|vitest|playwright)/.test(cmd) && !process.env.TMUX) {
    err('[Hook] Consider running in tmux for session persistence');
    err('[Hook] tmux new -s dev  |  tmux attach -t dev');
  }

  if (/git push/.test(cmd)) {
    err('[Hook] Review changes before push...');
    err('[Hook] Continuing with push (remove this hook to add interactive review)');
  }
}

function preWrite() {
  // Opt-in: this project is documentation-heavy (formation-powerbi/*.md),
  // so blocking new .md files is only enabled with ECC_BLOCK_MD=1.
  if (process.env.ECC_BLOCK_MD !== '1') return;
  const p = toolInput.file_path || '';
  if (/\.(md|txt)$/.test(p) && !/(README|CLAUDE|AGENTS|CONTRIBUTING)\.md$/.test(p)) {
    err('[Hook] BLOCKED: Unnecessary documentation file creation');
    err('[Hook] File: ' + p);
    err('[Hook] Use README.md for documentation instead');
    process.exit(2);
  }
}

function postBash() {
  const cmd = toolInput.command || '';
  if (!/gh pr create/.test(cmd)) return;
  const res = input.tool_response || input.tool_output || {};
  const out = typeof res === 'string' ? res : (res.stdout || res.output || '');
  const m = out.match(/https:\/\/github.com\/[^/]+\/[^/]+\/pull\/\d+/);
  if (m) {
    const repo = m[0].replace(/https:\/\/github.com\/([^/]+\/[^/]+)\/pull\/\d+/, '$1');
    const pr = m[0].replace(/.*\/pull\/(\d+)/, '$1');
    err('[Hook] PR created: ' + m[0]);
    err('[Hook] To review: gh pr review ' + pr + ' --repo ' + repo);
  }
}

function postEdit() {
  const p = toolInput.file_path;
  if (!p || !fs.existsSync(p)) return;

  if (/\.(ts|tsx|js|jsx)$/.test(p)) {
    // --no-install: format only when prettier is available, never download it
    try {
      execSync('npx --no-install prettier --write "' + p + '"', { stdio: 'pipe' });
    } catch {}
  }

  if (/\.(ts|tsx)$/.test(p)) {
    let dir = path.dirname(p);
    while (dir !== path.dirname(dir) && !fs.existsSync(path.join(dir, 'tsconfig.json'))) {
      dir = path.dirname(dir);
    }
    if (fs.existsSync(path.join(dir, 'tsconfig.json'))) {
      let out = '';
      try {
        out = execSync('npx --no-install tsc --noEmit --pretty false 2>&1', { cwd: dir, encoding: 'utf8', stdio: 'pipe' });
      } catch (e) {
        out = e.stdout || '';
      }
      const lines = out.split('\n').filter(l => l.includes(p)).slice(0, 10);
      if (lines.length) err(lines.join('\n'));
    }
  }

  if (/\.(ts|tsx|js|jsx)$/.test(p)) {
    const matches = [];
    fs.readFileSync(p, 'utf8').split('\n').forEach((l, idx) => {
      if (/console\.log/.test(l)) matches.push(idx + 1 + ': ' + l.trim());
    });
    if (matches.length) {
      err('[Hook] WARNING: console.log found in ' + p);
      matches.slice(0, 5).forEach(m => err(m));
      err('[Hook] Remove console.log before committing');
    }
  }
}

function stop() {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'pipe' });
    const files = execSync('git diff --name-only HEAD', { encoding: 'utf8', stdio: 'pipe' })
      .split('\n')
      .filter(f => /\.(ts|tsx|js|jsx)$/.test(f) && fs.existsSync(f));
    let hasConsole = false;
    for (const f of files) {
      if (fs.readFileSync(f, 'utf8').includes('console.log')) {
        err('[Hook] WARNING: console.log found in ' + f);
        hasConsole = true;
      }
    }
    if (hasConsole) err('[Hook] Remove console.log statements before committing');
  } catch {}
}

const handlers = { 'pre-bash': preBash, 'pre-write': preWrite, 'post-bash': postBash, 'post-edit': postEdit, stop };
if (handlers[mode]) handlers[mode]();
process.exit(0);
