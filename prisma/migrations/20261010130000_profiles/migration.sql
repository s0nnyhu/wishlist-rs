-- Les valeurs de l'enum passent de ME/PARTNER à R/S (ME -> R, PARTNER -> S)
ALTER TYPE "Person" RENAME VALUE 'ME' TO 'R';
ALTER TYPE "Person" RENAME VALUE 'PARTNER' TO 'S';
