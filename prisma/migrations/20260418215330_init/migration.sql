-- CreateTable
CREATE TABLE "SyncToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SyncToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckIn" (
    "id" TEXT NOT NULL,
    "emotion" TEXT NOT NULL,
    "intensity" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "tokenId" TEXT NOT NULL,

    CONSTRAINT "CheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SyncToken_token_key" ON "SyncToken"("token");

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "SyncToken"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
