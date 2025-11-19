-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_ukmId_fkey`;

-- DropIndex
DROP INDEX `Post_authorId_fkey` ON `post`;

-- DropIndex
DROP INDEX `Post_ukmId_fkey` ON `post`;

-- AlterTable
ALTER TABLE `post` ADD COLUMN `imageUrl` VARCHAR(191) NULL,
    MODIFY `ukmId` INTEGER NULL,
    MODIFY `authorId` INTEGER NULL;

-- AlterTable
ALTER TABLE `ukm` ADD COLUMN `imageUrl` VARCHAR(191) NULL,
    ADD COLUMN `verified` BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_ukmId_fkey` FOREIGN KEY (`ukmId`) REFERENCES `UKM`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
