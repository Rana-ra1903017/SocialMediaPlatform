const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const prisma = new PrismaClient();
async function main() {
  const users = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "users.json"), "utf-8"));
  const posts = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "posts.json"), "utf-8"));
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  for (const user of users) await prisma.user.create({ data: user });
  for (const post of posts) await prisma.post.create({ data: post });
  await prisma.follow.createMany({ data:[
    { followerId:1, followingId:2 },{ followerId:1, followingId:3 },{ followerId:2, followingId:1 },{ followerId:2, followingId:4 },
    { followerId:3, followingId:1 },{ followerId:3, followingId:2 },{ followerId:3, followingId:5 },{ followerId:4, followingId:2 },
    { followerId:4, followingId:5 },{ followerId:5, followingId:1 }
  ]});
  await prisma.comment.createMany({ data:[
    { text:"Nice post", userId:2, postId:1 },{ text:"Good luck", userId:3, postId:1 },{ text:"Very useful", userId:1, postId:2 },{ text:"I agree", userId:4, postId:3 },
    { text:"Good idea", userId:5, postId:4 },{ text:"Keep going", userId:2, postId:6 },{ text:"Well done", userId:1, postId:9 },{ text:"Great feature", userId:4, postId:10 }
  ]});
  await prisma.like.createMany({ data:[
    { postId:1, userId:2 },{ postId:1, userId:3 },{ postId:2, userId:1 },{ postId:2, userId:4 },{ postId:3, userId:1 },{ postId:3, userId:2 },{ postId:4, userId:5 },
    { postId:5, userId:1 },{ postId:6, userId:2 },{ postId:6, userId:3 },{ postId:7, userId:4 },{ postId:8, userId:5 },{ postId:9, userId:1 },{ postId:10, userId:2 }
  ]});
  console.log("Database seeded successfully.");
}
main().catch((e)=>{console.error(e);process.exit(1);}).finally(async()=>{await prisma.$disconnect();});
