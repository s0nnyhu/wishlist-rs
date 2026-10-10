-- Les profils R / S sont abandonnés : l'auteur d'une envie devient facultatif
ALTER TABLE "Wish" ALTER COLUMN "addedBy" DROP NOT NULL;
