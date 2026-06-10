-- =============================================================
-- Sécurisation de la table suggestions (corrige la RLS ouverte)
-- =============================================================
-- Problème actuel : les policies donnent SELECT/UPDATE/DELETE au rôle
-- anon → n'importe qui possédant la clé publique du site peut lire les
-- emails/téléphones des contributeurs, approuver, modifier ou supprimer
-- des suggestions.
--
-- Modèle cible : le public (anon) peut uniquement SOUMETTRE une
-- suggestion. La lecture et la modération passent par un utilisateur
-- Supabase Auth (rôle authenticated).
--
-- ÉTAPES (dashboard Supabase, projet titsvceqvnazykguwmwp) :
--   1. Authentication → Users → Add user : créer l'utilisateur admin
--      (ex. admin@genevahelp.ch + mot de passe fort), email confirmé.
--   2. Authentication → Providers → Email : désactiver les signups
--      publics ("Allow new users to sign up" = OFF).
--   3. SQL Editor : exécuter ce script.
--   4. Adapter le frontend (src/lib/auth.ts : signInWithPassword au lieu
--      du mot de passe codé en dur) puis redéployer — me redemander,
--      le refactor est prêt à être fait une fois les étapes 1-3 validées.
-- =============================================================

-- Supprimer les policies permissives existantes
DROP POLICY IF EXISTS "Anyone can submit suggestions" ON suggestions;
DROP POLICY IF EXISTS "Anyone can read suggestions" ON suggestions;
DROP POLICY IF EXISTS "Anyone can update suggestions" ON suggestions;
DROP POLICY IF EXISTS "Anyone can delete suggestions" ON suggestions;

ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

-- Le public peut soumettre une suggestion (formulaire du site),
-- mais uniquement avec le statut pending et sans champs de modération.
CREATE POLICY "Public can submit pending suggestions"
  ON suggestions FOR INSERT
  TO anon
  WITH CHECK (
    status = 'pending'
    AND reviewed_at IS NULL
    AND admin_notes IS NULL
  );

-- Seul un utilisateur authentifié (admin) peut lire les suggestions
-- (elles contiennent des données personnelles des contributeurs).
CREATE POLICY "Authenticated admin can read suggestions"
  ON suggestions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated admin can update suggestions"
  ON suggestions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated admin can delete suggestions"
  ON suggestions FOR DELETE
  TO authenticated
  USING (true);
