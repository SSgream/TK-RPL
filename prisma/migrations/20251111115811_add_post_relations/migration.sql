/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `ukm` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `ukm` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `user` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `post` DROP COLUMN `imageUrl`,
    ADD COLUMN `authorId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `ukm` DROP COLUMN `imageUrl`,
    DROP COLUMN `verified`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `createdAt`,
    MODIFY `role` VARCHAR(191) NOT NULL DEFAULT 'pengurus';

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
