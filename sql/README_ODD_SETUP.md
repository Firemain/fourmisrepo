# Scripts SQL pour le système ODD-Missions

Exécutez ces scripts dans l'ordre suivant sur Supabase :

## 1️⃣ Créer la table mission_odds
**Fichier :** `create_mission_odds_table.sql`

Crée la table de jonction entre missions et ODDs.

## 2️⃣ Peupler la table odds (si pas déjà fait)
**Fichier :** `populate_odds.sql`

Insère les 17 ODDs de l'ONU avec leurs catégories, couleurs et icônes.

⚠️ **Note :** Si vous avez déjà exécuté ce script, passez à l'étape 3.

## 3️⃣ Associer les missions aux ODDs
**Fichier :** `associate_missions_to_odds.sql`

Associe chaque mission à un ou plusieurs ODDs pertinents :

| Mission | ODD(s) | Catégorie |
|---------|--------|-----------|
| Formation PSC1 | ODD 3 | Santé |
| Collecte de dons | ODD 2 | Social |
| Tri des dons | ODD 2 | Social |
| Livraison à domicile | ODD 1, 2 | Social |
| Banque alimentaire | ODD 2 | Social |
| Sensibilisation gaspillage | ODD 12 | Environnement |
| Atelier Initiation Code | ODD 4 | Éducation |
| Atelier Python | ODD 4 | Éducation |
| Hackathon | ODD 9 | Social |
| Atelier Web Dev | ODD 4 | Éducation |
| Conférence IA | ODD 9 | Social |
| Soirée de Rentrée | ODD 11 | Social |

## ✅ Vérification

Après avoir exécuté les 3 scripts, vérifiez que tout fonctionne :

```sql
-- Voir toutes les missions avec leurs ODDs
SELECT 
  m.title,
  o.number,
  o.name,
  o.category,
  o.color
FROM mission_odds mo
JOIN missions m ON mo.mission_id = m.id
JOIN odds o ON mo.odd_id = o.id
ORDER BY m.title, o.number;
```

## 🎨 Résultat attendu

Les cartes de mission afficheront maintenant des badges colorés :
- 🟢 **Environnement** (vert) - ODD 6, 7, 12, 13, 14, 15
- 🔴 **Social** (rose/rouge) - ODD 1, 2, 5, 8, 9, 10, 11, 16, 17
- 🔴 **Éducation** (rouge) - ODD 4
- 🟢 **Santé** (vert santé) - ODD 3
- ⚪ **Générale** (gris) - Missions sans ODD
