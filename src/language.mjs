export function preferredLanguage(search, saved) {
 const value = new URLSearchParams(search).get('lang');
 return value === 'en' || value === 'ja' ? value : saved === 'ja' ? 'ja' : 'en';
}
export function localizeSite(site, lang) { return lang === 'en' ? {...site, ...site.en} : site; }
export function localizeYear(data, lang) { return lang === 'en' ? {...data, days:data.days.map(d=>({...d,...d.en,projects:d.projects.map(p=>({...p,...p.en}))}))} : data; }
export function languageUrl(href, lang) { const url = new URL(href);url.searchParams.set('lang',lang);return url; }
