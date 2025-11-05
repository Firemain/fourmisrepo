# @fourmis/lib

Logique partagée (hooks, helpers, clients API) pour toutes les apps Fourmis.

## Installation

Ce package est déjà installé dans le monorepo. Pour l'utiliser dans une app :

```json
{
  "dependencies": {
    "@fourmis/lib": "workspace:*"
  }
}
```

## Usage

### Client Supabase

```tsx
// Dans votre app Next.js (lib/supabase.ts)
import { createSupabaseClient } from "@fourmis/lib";

export const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### Hooks React Query

```tsx
import { useMissions, useProfile } from "@fourmis/lib";
import { supabase } from "@/lib/supabase"; // Votre instance locale

export default function Dashboard() {
  const { data: profile } = useProfile(supabase);
  const { data: missions } = useMissions();

  return <div>...</div>;
}
```

### Utils

```tsx
import { formatDate, truncate, pluralize } from "@fourmis/lib";

const date = formatDate(new Date()); // "5 novembre 2025"
const text = truncate("Texte très long...", 20); // "Texte très long..."
const label = pluralize(3, "mission"); // "missions"
```

## Exports disponibles

- **createSupabaseClient** : Créer un client Supabase
- **useMissions** : Hook pour récupérer les missions
- **useProfile** : Hook pour récupérer le profil utilisateur
- **formatDate** : Formater une date en français
- **formatRelativeTime** : Date relative ("Il y a 2 jours")
- **truncate** : Tronquer un texte
- **pluralize** : Pluraliser un mot
- **capitalize** : Capitaliser un texte
