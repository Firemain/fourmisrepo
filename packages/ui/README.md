# @fourmis/ui

Design system partagé pour toutes les apps Fourmis.

## Installation

Ce package est déjà installé dans le monorepo. Pour l'utiliser dans une app :

```json
{
  "dependencies": {
    "@fourmis/ui": "workspace:*"
  }
}
```

## Usage

### Importer les composants

```tsx
import { Button, Card, Container } from "@fourmis/ui";

export default function Page() {
  return (
    <Container>
      <Card>
        <h1>Titre</h1>
        <Button variant="primary">Cliquer</Button>
      </Card>
    </Container>
  );
}
```

### Importer les styles globaux

Dans votre `app/layout.tsx` ou `_app.tsx` :

```tsx
import "@fourmis/ui/globals.css";
```

### Utiliser le thème Tailwind

Dans votre `tailwind.config.ts` :

```ts
import baseConfig from "@fourmis/ui/tailwind.config";

export default {
  ...baseConfig,
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx}",
  ],
};
```

## Composants disponibles

- **Button** : Boutons avec variantes (primary, secondary, outline, ghost)
- **Card** : Cartes pour afficher du contenu
- **Container** : Container responsive avec max-width

## Palette de couleurs

- `primary`: #18534F
- `secondary`: #226D68
- `background`: #ECF8F6
- `accent`: #FEEAA1
- `highlight`: #D6955B
