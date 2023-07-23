/*
  Warnings:

  - A unique constraint covering the columns `[userId,postId]` on the table `user_liked` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_liked_userId_postId_key" ON "user_liked"("userId", "postId");
