import { prisma } from "./prisma";

// ========== User ==========

export async function findUserByCredentials(email, password) {
  return await prisma.user.findFirst({
    where: { email: email.toLowerCase(), password },
    select: { id: true, username: true, email: true, bio: true, avatar: true },
  });
}

export async function findUserByEmail(email) {
  return await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
}

export async function createUser(username, email, password) {
  return await prisma.user.create({
    data: { username, email: email.toLowerCase(), password },
  });
}

export async function getUserProfile(userId) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: { select: { posts: true, followers: true, following: true } },
    },
  });
}

export async function updateUserProfile(userId, { username, email, bio, avatar }) {
  return await prisma.user.update({
    where: { id: userId },
    data: { username, email: email.toLowerCase(), bio, avatar },
    select: { id: true, username: true, email: true, bio: true, avatar: true },
  });
}

// ========== Post ==========

const postInclude = {
  user: { select: { id: true, username: true, email: true } },
  comments: {
    include: { user: { select: { id: true, username: true } } },
    orderBy: { createdAt: "desc" },
  },
  likes: { select: { userId: true } },
};

export async function getPostById(postId) {
  return await prisma.post.findUnique({
    where: { id: postId },
    include: postInclude,
  });
}

export async function getUserPosts(userId) {
  return await prisma.post.findMany({
    where: { userId },
    include: postInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function getFeedPosts(userId) {
  const follows = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  const followingIds = follows.map((x) => x.followingId);
  return await prisma.post.findMany({
    where: {
      OR: [
        { userId },
        { userId: { in: followingIds.length ? followingIds : [-1] } },
      ],
    },
    include: postInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function createPost(content, userId) {
  return await prisma.post.create({
    data: { content, userId },
  });
}

export async function deletePost(postId) {
  return await prisma.post.delete({ where: { id: postId } });
}

export async function likePost(postId, userId) {
  const existing = await prisma.like.findFirst({
    where: { postId, userId },
  });
  if (!existing) {
    await prisma.like.create({ data: { postId, userId } });
  }
}

// ========== Comment ==========

export async function createComment(text, postId, userId) {
  return await prisma.comment.create({
    data: { text, postId, userId },
  });
}

// ========== Follow ==========

export async function getFollowData(userId) {
  const users = await prisma.user.findMany({
    where: { id: { not: userId } },
    select: { id: true, username: true, email: true },
    orderBy: { username: "asc" },
  });
  const follows = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  return { users, followingIds: follows.map((x) => x.followingId) };
}

export async function followUser(followerId, followingId) {
  const existing = await prisma.follow.findFirst({
    where: { followerId, followingId },
  });
  if (!existing) {
    await prisma.follow.create({ data: { followerId, followingId } });
  }
}

export async function unfollowUser(followerId, followingId) {
  return await prisma.follow.deleteMany({
    where: { followerId, followingId },
  });
}

// ========== Stats ==========

export async function getStats() {
  const totalUsers = await prisma.user.count();
  const totalPosts = await prisma.post.count();
  const totalComments = await prisma.comment.count();
  const totalLikes = await prisma.like.count();

  const followersGroups = await prisma.follow.groupBy({
    by: ["followingId"],
    _count: { followingId: true },
  });
  const averageFollowersPerUser =
    totalUsers === 0
      ? 0
      : followersGroups.reduce((s, i) => s + i._count.followingId, 0) /
        totalUsers;
  const averagePostsPerUser = totalUsers === 0 ? 0 : totalPosts / totalUsers;

  const mostActiveGroup = await prisma.post.groupBy({
    by: ["userId"],
    _count: { userId: true },
    orderBy: { _count: { userId: "desc" } },
    take: 1,
  });
  let mostActiveUser = "No data";
  if (mostActiveGroup.length) {
    const u = await prisma.user.findUnique({
      where: { id: mostActiveGroup[0].userId },
      select: { username: true },
    });
    mostActiveUser = u?.username || "No data";
  }

  const mostFollowedGroup = await prisma.follow.groupBy({
    by: ["followingId"],
    _count: { followingId: true },
    orderBy: { _count: { followingId: "desc" } },
    take: 1,
  });
  let mostFollowedUser = "No data";
  if (mostFollowedGroup.length) {
    const u = await prisma.user.findUnique({
      where: { id: mostFollowedGroup[0].followingId },
      select: { username: true },
    });
    mostFollowedUser = u?.username || "No data";
  }

  const topCommenterGroup = await prisma.comment.groupBy({
    by: ["userId"],
    _count: { userId: true },
    orderBy: { _count: { userId: "desc" } },
    take: 1,
  });
  let topCommenter = "No data";
  if (topCommenterGroup.length) {
    const u = await prisma.user.findUnique({
      where: { id: topCommenterGroup[0].userId },
      select: { username: true },
    });
    topCommenter = u?.username || "No data";
  }

  return {
    totalUsers,
    totalPosts,
    totalComments,
    totalLikes,
    averageFollowersPerUser: Number(averageFollowersPerUser.toFixed(2)),
    averagePostsPerUser: Number(averagePostsPerUser.toFixed(2)),
    mostActiveUser,
    mostFollowedUser,
    topCommenter,
  };
}
