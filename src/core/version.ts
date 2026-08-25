/**
 * Single source of truth for prefab's version numbers.
 *
 * Zero imports on purpose: the lean renderer bundle (bridge, transport) can pull
 * these in without dragging the builder module graph along.
 */

/**
 * Package version of `@maxhealth.tech/prefab`. Bumped at release time by
 * `release.yml` (see `scripts/changelog-release.ts` companion step). Identifies
 * the app to an MCP Apps host (`appInfo.version`) and pins the CDN URL.
 */
export const VERSION = '0.3.11'

/**
 * Wire protocol version emitted in `$prefab.version`.
 *
 * `0.3` matches upstream PrefectHQ/prefab: the theme is folded into the `css`
 * array, `stylesheets` carries external URLs, and `mode` forces a color scheme
 * (PR #431, "Wire Transfer"). The renderer still accepts `0.2` payloads.
 *
 * NOTE: distinct from `VERSION` (the npm package version) and from the MCP Apps
 * dated protocol version (`2026-01-26`, negotiated in the bridge handshake).
 */
export const PROTOCOL_VERSION = '0.3'
