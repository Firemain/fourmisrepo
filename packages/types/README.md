# @fourmis/types

Types TypeScript partagés et schémas de validation Zod pour toutes les apps Fourmis.

## Installation

Ce package est déjà installé dans le monorepo. Pour l'utiliser dans une app :

```json
{
  "dependencies": {
    "@fourmis/types": "workspace:*"
  }
}
```

## Usage

### Types TypeScript

```tsx
import type { Profile, Mission, Registration, Role, Status } from "@fourmis/types";

const profile: Profile = {
  id: "uuid",
  role: "student",
  fullName: "Jean Dupont",
  avatarUrl: "https://...",
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

### Schémas Zod (validation)

```tsx
import { MissionSchema, CreateMissionSchema } from "@fourmis/types";

// Valider des données
const result = MissionSchema.safeParse(data);
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}

// Dans une API Route Next.js
export async function POST(request: Request) {
  const body = await request.json();
  const validated = CreateMissionSchema.parse(body); // Throws si invalide
  
  // validated est typé correctement
  return Response.json({ success: true });
}
```

### Types API

```tsx
import type { ApiResponse, PaginatedResponse } from "@fourmis/types";

// Réponse d'API
const response: ApiResponse<Mission> = {
  success: true,
  data: mission,
};

// Réponse paginée
const paginated: PaginatedResponse<Mission> = {
  data: missions,
  total: 100,
  page: 1,
  pageSize: 20,
  hasMore: true,
};
```

## Exports disponibles

### Enums
- `Role` : student | association | school | admin
- `Status` : pending | approved | rejected

### Types
- `Profile`, `Mission`, `Registration`
- `CreateMission`, `CreateRegistration`
- `UpdateMission`, `UpdateProfile`
- `ApiResponse<T>`, `PaginatedResponse<T>`

### Schémas Zod
- `ProfileSchema`, `MissionSchema`, `RegistrationSchema`
- `CreateMissionSchema`, `UpdateMissionSchema`
- Tous les schémas pour validation
