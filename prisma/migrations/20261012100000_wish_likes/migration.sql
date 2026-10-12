-- CreateTable
CREATE TABLE "WishLike" (
    "wishId" TEXT NOT NULL,
    "voterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WishLike_pkey" PRIMARY KEY ("wishId","voterId")
);

-- AddForeignKey
ALTER TABLE "WishLike" ADD CONSTRAINT "WishLike_wishId_fkey" FOREIGN KEY ("wishId") REFERENCES "Wish"("id") ON DELETE CASCADE ON UPDATE CASCADE;
