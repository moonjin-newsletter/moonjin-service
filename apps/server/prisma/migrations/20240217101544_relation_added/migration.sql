-- CreateIndex
CREATE INDEX "Follow_writerId_idx" ON "Follow"("writerId");

-- CreateIndex
CREATE INDEX "Follow_followerId_idx" ON "Follow"("followerId");

-- CreateIndex
CREATE INDEX "Newsletter_postId_idx" ON "Newsletter"("postId");

-- CreateIndex
CREATE INDEX "Newsletter_receiverId_idx" ON "Newsletter"("receiverId");

-- CreateIndex
CREATE INDEX "Post_writerId_idx" ON "Post"("writerId");

-- CreateIndex
CREATE INDEX "Post_seriesId_idx" ON "Post"("seriesId");

-- CreateIndex
CREATE INDEX "Series_writerId_idx" ON "Series"("writerId");

-- CreateIndex
CREATE INDEX "Stamp_userId_idx" ON "Stamp"("userId");

-- CreateIndex
CREATE INDEX "Stamp_postId_idx" ON "Stamp"("postId");
