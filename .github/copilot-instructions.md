# Prefab agent instructions

Releases are cut by CI. Do not create release tags or GitHub Releases by hand, and do not run the release workflow without the user's approval.

Record every user-facing change in `CHANGELOG.md` under `## [Unreleased]`, below the anchor comment, and keep that comment. Do not add a version heading yourself. When `dev` is merged into `main`, `release.yml` (the shared `changelog-release.yml` in `max-network/.github`) stamps `[Unreleased]` as the next version, which is a patch bump over the npm release unless `package.json` already carries a higher version, then tags it and dispatches `publish.yml`. A merge with nothing under `[Unreleased]` releases nothing.

Never edit a section that has already been released. The release and the `dev` sync both refuse a change to one.
