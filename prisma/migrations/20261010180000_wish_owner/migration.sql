-- Chaque wish appartient à Rojo ou à Sonny (onglets de la page d'accueil)
CREATE TYPE "Owner" AS ENUM ('ROJO', 'SONNY');

ALTER TABLE "Wish" ADD COLUMN "owner" "Owner" NOT NULL DEFAULT 'ROJO';

-- Reprise des anciens profils : R = Rojo, S = Sonny
UPDATE "Wish" SET "owner" = 'SONNY' WHERE "addedBy" = 'S';
