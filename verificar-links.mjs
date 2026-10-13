// Ferramenta de apoio à revisão manual (Node 18+): node verificar-links.mjs
// Para cada fonte de sites.js, confere se o link responde por HTTPS e se o
// destino final continua no domínio oficial. NÃO avalia reputação nem
// segurança do conteúdo; serve para achar links quebrados ou redirecionados.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const ctx = { window: {} };
vm.runInNewContext(readFileSync(new URL('./sites.js', import.meta.url), 'utf8'), ctx);
const sites = ctx.window.RECEITAS_DATA.sites;
let problems = 0;

for (const s of sites) {
  try {
    const res = await fetch(s.url, { redirect: 'follow', signal: AbortSignal.timeout(15000), headers: { 'user-agent': 'Mozilla/5.0 (verificador de links Alecrim)' } });
    const host = new URL(res.url).hostname;
    const okDomain = host === s.domain || host.endsWith('.' + s.domain);
    const ok = res.ok && okDomain && res.url.startsWith('https://');
    if (!ok) problems++;
    console.log(`${ok ? 'OK      ' : 'ATENÇÃO '} ${s.name}: HTTP ${res.status} -> ${res.url}${okDomain ? '' : '  (fora do domínio cadastrado!)'}`);
  } catch (e) {
    problems++;
    console.log(`FALHOU   ${s.name}: ${e.message}`);
  }
}
console.log(problems ? `\n${problems} fonte(s) precisam de atenção. Abra-as no navegador antes de decidir.` : '\nTodos os links responderam. Ainda assim, abra cada site antes de marcar como revisado.');
