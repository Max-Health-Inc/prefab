const modules = new Map<string, Promise<unknown>>()

/** Import an ES module from a CDN once per page; a failed load is forgotten so a later render can retry. */
export function importFromCdn(url: string): Promise<unknown> {
  const cached = modules.get(url)
  if (cached) return cached
  const loading: Promise<unknown> = import(/* webpackIgnore: true */ url)
  modules.set(url, loading)
  loading.catch(() => { modules.delete(url) })
  return loading
}

/** Whether `el` currently renders in a dark scheme, by the nearest theme marker or the OS preference. */
export function prefersDark(el: Element): boolean {
  const marked = el.closest('[data-theme], .dark, .light')
  if (marked) return marked.getAttribute('data-theme') === 'dark' || marked.classList.contains('dark')
  return typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches
}
