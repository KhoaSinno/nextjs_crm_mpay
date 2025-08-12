/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `fullName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `name`,
    ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `dateOfBirth` DATE NULL,
    ADD COLUMN `fullName` VARCHAR(191) NOT NULL,
    ADD COLUMN `gender` ENUM('male', 'female', 'other') NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NULL,
    ADD COLUMN `role` ENUM('employee', 'accounting', 'hr') NOT NULL,
    ADD COLUMN `salary` DOUBLE NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    ADD COLUMN `walletAddress` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `payroll_schedules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` DOUBLE NOT NULL,
    `stablecoin_type` VARCHAR(191) NOT NULL,
    `payday` DATE NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `id_employee` INTEGER NOT NULL,
    `approved_by` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `payroll_schedules` ADD CONSTRAINT `payroll_schedules_id_employee_fkey` FOREIGN KEY (`id_employee`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payroll_schedules` ADD CONSTRAINT `payroll_schedules_approved_by_fkey` FOREIGN KEY (`approved_by`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
