---
description: Describe when these instructions should be loaded by the agent based on task context
---

<!-- Tip: Use /create-instructions in chat to generate content with agent assistance -->

DO NOT create a release tag on github ! THE CI HANDLES THAT
DO NOT RUN THE RELEASE CI WITHOUT APPROVAL FROM THE USER

ALWAYS update and maintain the CHANGELOG.md file! Never tag with [Unreleased] because the CI will release the coming version with that tag and it will  look bad in the changelog. Always update the changelog with the new version and then tag with that version.