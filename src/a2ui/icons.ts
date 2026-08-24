/**
 * prefab icon name → A2UI Basic catalog icon.
 *
 * The one place where the two catalogs disagree on *values* rather than on
 * component shape. prefab's `Icon(name)` takes any string, because its renderer
 * resolves Lucide names at runtime and new icons cost nothing. A2UI's
 * `Icon.name` is a closed enum of 59 names, so an unrecognised value does not
 * render as a fallback glyph — it makes the whole component fail validation.
 *
 * Passing the name through unchecked therefore emits an invalid surface for
 * every icon outside those 59, which is most of them. Instead the name is
 * normalised, matched against the enum, and dropped with a diagnostic when
 * nothing fits, so an unmappable icon costs a glyph rather than the payload.
 */

/**
 * The A2UI Basic catalog's `Icon.name` enum, v1.0.
 *
 * Duplicated as a literal because prefab ships zero runtime dependencies and
 * cannot read the catalog JSON at emit time. `test/a2ui-icons.test.ts` asserts
 * this matches the vendored catalog exactly, so it cannot drift silently.
 */
export const A2UI_ICONS: readonly string[] = [
  'accountCircle', 'add', 'arrowBack', 'arrowForward', 'attachFile', 'calendarToday',
  'call', 'camera', 'check', 'close', 'delete', 'download', 'edit', 'event', 'error',
  'fastForward', 'favorite', 'favoriteOff', 'folder', 'help', 'home', 'info',
  'locationOn', 'lock', 'lockOpen', 'mail', 'menu', 'moreVert', 'moreHoriz',
  'notificationsOff', 'notifications', 'pause', 'payment', 'person', 'phone', 'photo',
  'play', 'print', 'refresh', 'rewind', 'search', 'send', 'settings', 'share',
  'shoppingCart', 'skipNext', 'skipPrevious', 'star', 'starHalf', 'starOff', 'stop',
  'upload', 'visibility', 'visibilityOff', 'volumeDown', 'volumeMute', 'volumeOff',
  'volumeUp', 'warning',
]

/** Lookup by normalised form, so `Arrow-Back`, `arrow_back` and `ArrowBack` all hit. */
const BY_NORMALISED = new Map(A2UI_ICONS.map(name => [normalise(name), name]))

/**
 * Names that differ between the two vocabularies rather than merely in case.
 *
 * prefab follows Lucide, A2UI follows Material. Where the concept exists in both
 * under different words, the alias keeps the icon; where it does not, the entry
 * is absent and the icon is dropped rather than mapped to something that means
 * something else. Keys are normalised, so one entry covers every spelling.
 */
const ALIASES: Record<string, string> = {
  // Status and feedback
  alertcircle: 'error', alerttriangle: 'warning', alertoctagon: 'error',
  xcircle: 'error', circlex: 'error', circlealert: 'error',
  checkcircle: 'check', circlecheck: 'check', checkcircle2: 'check',
  infocircle: 'info', circleinfo: 'info', helpcircle: 'help', circlehelp: 'help',
  bell: 'notifications', belloff: 'notificationsOff',
  // Navigation
  arrowleft: 'arrowBack', arrowright: 'arrowForward',
  chevronleft: 'arrowBack', chevronright: 'arrowForward',
  x: 'close', plus: 'add', trash: 'delete', trash2: 'delete',
  ellipsisvertical: 'moreVert', ellipsis: 'moreHoriz', morehorizontal: 'moreHoriz',
  morevertical: 'moreVert',
  // Objects and actions
  pencil: 'edit', pen: 'edit', squarepen: 'edit',
  user: 'person', usercircle: 'accountCircle', circleuser: 'accountCircle',
  eye: 'visibility', eyeoff: 'visibilityOff',
  mappin: 'locationOn', map: 'locationOn',
  image: 'photo', images: 'photo', file: 'folder', files: 'folder',
  calendar: 'calendarToday', calendardays: 'calendarToday', clock: 'event',
  creditcard: 'payment', cart: 'shoppingCart', shoppingbag: 'shoppingCart',
  phonecall: 'call', mailopen: 'mail', inbox: 'mail',
  cog: 'settings', gear: 'settings', sliders: 'settings',
  rotatecw: 'refresh', rotateccw: 'refresh', refreshcw: 'refresh',
  heart: 'favorite', heartoff: 'favoriteOff',
  volume: 'volumeUp', volume1: 'volumeDown', volume2: 'volumeUp', volumex: 'volumeOff',
  skipforward: 'skipNext', skipback: 'skipPrevious',
  paperclip: 'attachFile', link: 'share', share2: 'share',
  magnifyingglass: 'search', searchicon: 'search',
}

/** Case-insensitive, separator-insensitive key for matching either vocabulary. */
function normalise(name: string): string {
  return name.replace(/[\s._-]/g, '').toLowerCase()
}

/**
 * Resolve a prefab icon name to an A2UI one.
 *
 * @returns the catalog name, or `undefined` when nothing in the enum means the
 *   same thing. Callers drop the icon and record a diagnostic.
 */
export function a2uiIconName(name: string): string | undefined {
  const key = normalise(name)
  return BY_NORMALISED.get(key) ?? ALIASES[key]
}
