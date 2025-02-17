-- AlterTable
ALTER TABLE "CarView" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "password" TEXT;

UPDATE "User" SET "password" = '$argon2id$v=19$m=65536,t=3,p=4$WbFdife0HEJ+zcygKz+11Q$fdqsjnOv5Tighfc1JjGBWycQ9mzFArwwctYjMDvgqSE' WHERE "id" = 1;
UPDATE "User" SET "password" = '$argon2id$v=19$m=65536,t=3,p=4$ixRKNVPS8B75LrSenIseHQ$UnW2b8ykY5tbKk5Jygd+fjVgyJFAROFFNJ6fDSUw/lo' WHERE "id" = 2;
UPDATE "User" SET "password" = '$argon2id$v=19$m=65536,t=3,p=4$+UtWnNwNSTuVLnP4obrsvg$JkeaRou5HLiVbqnlRCwBNrhjRCmWRsHuwu6jMEV8pz8' WHERE "id" = 3;
UPDATE "User" SET "password" = '$argon2id$v=19$m=65536,t=3,p=4$rPrWMINZ2QpqRMrJvfNgbg$gK6Mjd1dz6/kMwxcVzuil/+CJsV8fQjrZC2369L1GAs' WHERE "id" = 4;
UPDATE "User" SET "password" = '$argon2id$v=19$m=65536,t=3,p=4$DPDCnVbkLrip+9qDzUlqdw$DXnk+k7JarbxCYQFP3d/tMJji4IiQJJhYzMy8dYgf30' WHERE "id" = 5;
UPDATE "User" SET "password" = '$argon2id$v=19$m=65536,t=3,p=4$hXLNgMOTb3oc1Gq/HwxGaw$3wTVnvHcp+T25jj77+BAmeeyNQbJWgqwKKSNcuHtdYw' WHERE "id" = 6;
UPDATE "User" SET "password" = '$argon2id$v=19$m=65536,t=3,p=4$bgYCNZu98Y2ZTEecrtxKtA$681tO5tj28TdbOggTVgFRPkf8vbBor0z9KbXrquret0' WHERE "id" = 7;
UPDATE "User" SET "password" = '$argon2id$v=19$m=65536,t=3,p=4$HU+UHxmlRua7zkb9RtMADw$1q1s15ZrPGijAqEMlaL85hdPOywjg7sSlOt17PyQLVI' WHERE "id" = 8;
UPDATE "User" SET "password" = '$argon2id$v=19$m=65536,t=3,p=4$NamhOvzu5SO8zdNH+fFNAA$iobYzKqJMSMWd8//ceHk1pkDE/a3j7hcI51ObimMTfo' WHERE "id" = 9;
UPDATE "User" SET "password" = '$argon2id$v=19$m=65536,t=3,p=4$ttxAAeQQVQMQfJ/+MzGvsQ$pnLt5qlEP+9lnz9KrWpaLaLnx6gZGSVoIH+K2pLlLRE' WHERE "id" = 10;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" SET NOT NULL, ALTER COLUMN "name" DROP NOT NULL;
