## Bug: Content Studio crash

`BriefsManager.tsx` reads `channel_mix` from DB where the column is `Json` (can be object/string/null). Code assumes array and calls `.map()` → crash:
`TypeError: (b.channel_mix ?? []).map is not a function`

## Fix

In `src/components/admin/content/BriefsManager.tsx`:

1. Add a tiny helper `toChannelArray(v): string[]` that returns:
   - `v` if already array of strings
   - `[v]` if string
   - `Object.values(v)` filtered to strings if object
   - `[]` otherwise
2. Use it at line 56 (`channel_mix: toChannelArray(b.channel_mix)`) and line 163 (`toChannelArray(b.channel_mix).map(...)`).
3. Same defensive coercion when seeding edit form so `form.channel_mix` is always `string[]`.

No schema/migration changes. UI-only patch.