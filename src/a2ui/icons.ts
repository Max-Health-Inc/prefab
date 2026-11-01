/**
 * The A2UI Basic catalog's closed `Icon.name` enum (v1.0); an unknown name fails the whole component's validation.
 * `test/a2ui-icons.test.ts` keeps this literal equal to the vendored catalog.
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

/** Lucide names whose Material counterpart is spelled differently, keyed by normalised name. */
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

/** A prefab icon name as an A2UI one, or `undefined` (callers drop the icon with a diagnostic). */
export function a2uiIconName(name: string): string | undefined {
  const key = normalise(name)
  return BY_NORMALISED.get(key) ?? ALIASES[key]
}
