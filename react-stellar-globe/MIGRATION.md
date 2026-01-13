# Migration Guide: Symbol Naming Changes

## Overview

This release removes the `$` suffix from all exported component names in `@stellar-globe/react-stellar-globe`. The old names are deprecated and will be removed in a future major version.

## Quick Migration

Replace all `$` suffix symbols with their new names:

```diff
- import { Globe$, PanLayer$, ZoomLayer$ } from '@stellar-globe/react-stellar-globe';
+ import { Globe, PanLayer, ZoomLayer } from '@stellar-globe/react-stellar-globe';

function App() {
  return (
-   <Globe$>
-     <PanLayer$ />
-     <ZoomLayer$ />
-   </Globe$>
+   <Globe>
+     <PanLayer />
+     <ZoomLayer />
+   </Globe>
  );
}
```

## Complete Symbol Mapping

| Old Name (deprecated) | New Name |
|----------------------|----------|
| `Globe$` | `Globe` |
| `PanLayer$` | `PanLayer` |
| `ZoomLayer$` | `ZoomLayer` |
| `RollLayer$` | `RollLayer` |
| `TouchLayer$` | `TouchLayer` |
| `ConstellationLayer$` | `ConstellationLayer` |
| `EsoMilkyWayLayer$` | `EsoMilkyWayLayer` |
| `GridLayer$` | `GridLayer` |
| `HipparcosCatalogLayer$` | `HipparcosCatalogLayer` |
| `TextLayer$` | `TextLayer` |
| `TractTileLayer$` | `TractTileLayer` |
| `MarkerLayer$` | `MarkerLayer` |
| `ClickableMarkerLayer$` | `ClickableMarkerLayer` |
| `PathLayer$` | `PathLayer` |
| `BeautifulObjectLayer$` | `BeautifulObjectLayer` |
| `GlobeEventLayer$` | `GlobeEventLayer` |
| `HipsSimpleLayer$` | `HipsSimpleLayer` |
| `DomLayer$` | `DomLayer` |

## Automated Migration

You can use a find-and-replace tool to migrate your codebase. The following regex patterns can help:

### VSCode Find and Replace

1. Open Find and Replace (Cmd/Ctrl + H)
2. Enable regex mode
3. Find: `(\w+)\$`
4. Replace: `$1`
5. Limit scope to files importing from `@stellar-globe/react-stellar-globe`

### Sed Command

```bash
# Dry run (preview changes)
sed -n 's/\([A-Z][a-zA-Z]*\)\$/\1/gp' your-file.tsx

# Apply changes
sed -i '' 's/\([A-Z][a-zA-Z]*\)\$/\1/g' your-file.tsx
```

## Handling Name Collisions

If you use both `stellar-globe` (core library) and `react-stellar-globe` in the same file, you may encounter name collisions. Use import aliases to resolve this:

```typescript
// Core library class
import { Globe as CoreGlobe, TractTileLayer } from 'stellar-globe';

// React component
import { Globe, TractTileLayer as ReactTractTileLayer } from '@stellar-globe/react-stellar-globe';

// Now you can use both
const globe = new CoreGlobe(container);

function App() {
  return (
    <Globe>
      <ReactTractTileLayer baseUrl="..." />
    </Globe>
  );
}
```

## Deprecation Timeline

- **Current Version**: Old names (`$` suffix) are deprecated but still functional
- **Next Major Version**: Old names will be removed

We recommend migrating to the new names as soon as possible to ensure smooth future upgrades.

## TypeScript Support

If you're using TypeScript, deprecated symbols will show strikethrough styling in your IDE, making it easy to identify code that needs updating.

## Questions?

If you encounter any issues during migration, please open an issue on our GitHub repository.
