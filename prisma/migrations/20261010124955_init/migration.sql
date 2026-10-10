-- CreateEnum
CREATE TYPE "Person" AS ENUM ('ME', 'PARTNER');

-- CreateTable
CREATE TABLE "Wish" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" TEXT,
    "comment" TEXT,
    "photoUrl" TEXT,
    "links" TEXT[],
    "addedBy" "Person" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wish_pkey" PRIMARY KEY ("id")
);
