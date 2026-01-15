# Migration Guide: Git Clone → npm

If you previously used IPA template via git clone, follow these steps to migrate.

## Step 1: Install CLI

```bash
npm install -g ipa-ck
```

## Step 2: Backup Existing Files (Optional)

```bash
# In your project
cp -r .claude .claude.backup
cp CLAUDE.md CLAUDE.md.backup
```

## Step 3: Initialize with npm

```bash
ipa-ck init --force
```

This will:
- Copy latest template files
- Create `.ipa-ck.json` config

## Step 4: Verify

Check that your customizations are preserved or restore from backup.

## Step 5: Remove Git Clone Artifacts

If you had the template as a git submodule or cloned repo:

```bash
# Remove submodule (if applicable)
git submodule deinit .claude-template
git rm .claude-template

# Clean up .git/config
```

## Future Updates

Use `ipa-ck update-template` instead of `git pull`.

## Comparison

| Task | Old (git clone) | New (npm) |
|------|-----------------|-----------|
| Install | `git clone ...` | `npm install -g ipa-ck` |
| Init | `cp -r template/.claude .` | `ipa-ck init` |
| Update | `cd template && git pull && cp ...` | `ipa-ck update-template` |
| Version | Check git commits | `ipa-ck config --get template-version` |
