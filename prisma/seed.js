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
    { followerId:1, followingId:2 },{ followerId:1, followingId:3 },{ followerId:1, followingId:6 },{ followerId:1, followingId:10 },
    { followerId:2, followingId:1 },{ followerId:2, followingId:4 },{ followerId:2, followingId:7 },{ followerId:2, followingId:11 },
    { followerId:3, followingId:1 },{ followerId:3, followingId:2 },{ followerId:3, followingId:5 },{ followerId:3, followingId:8 },
    { followerId:4, followingId:2 },{ followerId:4, followingId:5 },{ followerId:4, followingId:9 },
    { followerId:5, followingId:2 },{ followerId:5, followingId:3 },{ followerId:5, followingId:12 },
    { followerId:6, followingId:2 },{ followerId:6, followingId:7 },{ followerId:6, followingId:13 },
    { followerId:7, followingId:1 },{ followerId:7, followingId:2 },{ followerId:7, followingId:8 },
    { followerId:8, followingId:2 },{ followerId:8, followingId:3 },{ followerId:8, followingId:14 },
    { followerId:9, followingId:2 },{ followerId:9, followingId:6 },{ followerId:9, followingId:15 },
    { followerId:10, followingId:2 },{ followerId:10, followingId:1 },
    { followerId:11, followingId:2 },{ followerId:11, followingId:6 },
    { followerId:12, followingId:2 },{ followerId:12, followingId:3 },{ followerId:12, followingId:7 },
    { followerId:13, followingId:2 },{ followerId:13, followingId:8 },
    { followerId:14, followingId:2 },{ followerId:14, followingId:5 },
    { followerId:15, followingId:1 },{ followerId:15, followingId:2 },{ followerId:15, followingId:9 }
  ]});
  await prisma.comment.createMany({ data:[
    { text:"Nice post!", userId:2, postId:1 },{ text:"Good luck with it", userId:3, postId:1 },{ text:"Very useful info", userId:1, postId:2 },
    { text:"I agree with you", userId:4, postId:3 },{ text:"Good idea!", userId:5, postId:4 },{ text:"Keep going!", userId:2, postId:6 },
    { text:"Well done", userId:1, postId:9 },{ text:"Great feature", userId:4, postId:10 },{ text:"Welcome to the platform!", userId:7, postId:11 },
    { text:"React is amazing", userId:7, postId:12 },{ text:"Totally agree", userId:6, postId:13 },{ text:"Congrats!", userId:10, postId:14 },
    { text:"So true!", userId:7, postId:16 },{ text:"I feel the same", userId:9, postId:16 },{ text:"Very important skill", userId:11, postId:17 },
    { text:"SQLite is great for learning", userId:12, postId:18 },{ text:"I love debugging too", userId:13, postId:19 },{ text:"We are almost done!", userId:14, postId:20 },
    { text:"Same here!", userId:6, postId:21 },{ text:"That happens a lot", userId:3, postId:22 },{ text:"Tailwind is the best", userId:15, postId:23 },
    { text:"Backend is fun", userId:5, postId:24 },{ text:"Git is essential", userId:7, postId:25 },{ text:"Prisma is my favorite", userId:7, postId:26 },
    { text:"Well done!", userId:8, postId:27 },{ text:"TypeScript is worth learning", userId:2, postId:28 },{ text:"Looks great!", userId:11, postId:29 },
    { text:"Keep it up!", userId:13, postId:30 },{ text:"Same experience here", userId:14, postId:31 },{ text:"Postman is very handy", userId:15, postId:32 },
    { text:"Absolutely right", userId:9, postId:33 },{ text:"Planning is key", userId:10, postId:34 },{ text:"Relations can be tricky", userId:6, postId:35 },
    { text:"Next.js is powerful", userId:4, postId:36 },{ text:"That is so kind!", userId:12, postId:37 },{ text:"Dark mode forever!", userId:7, postId:38 },
    { text:"Indexes help a lot", userId:3, postId:39 },{ text:"Haha true!", userId:5, postId:40 },{ text:"Good luck with the presentation", userId:2, postId:46 },
    { text:"You can do it!", userId:8, postId:48 }
  ]});
  await prisma.like.createMany({ data:[
    { postId:1, userId:2 },{ postId:1, userId:3 },{ postId:1, userId:6 },{ postId:2, userId:1 },{ postId:2, userId:4 },{ postId:2, userId:8 },
    { postId:3, userId:1 },{ postId:3, userId:2 },{ postId:3, userId:7 },{ postId:4, userId:5 },{ postId:4, userId:9 },{ postId:5, userId:1 },
    { postId:6, userId:2 },{ postId:6, userId:3 },{ postId:7, userId:4 },{ postId:7, userId:10 },{ postId:8, userId:5 },{ postId:8, userId:11 },
    { postId:9, userId:1 },{ postId:9, userId:12 },{ postId:10, userId:2 },{ postId:10, userId:13 },{ postId:11, userId:1 },{ postId:11, userId:7 },
    { postId:12, userId:8 },{ postId:12, userId:14 },{ postId:13, userId:6 },{ postId:13, userId:15 },{ postId:14, userId:10 },{ postId:14, userId:3 },
    { postId:15, userId:7 },{ postId:15, userId:9 },{ postId:16, userId:1 },{ postId:16, userId:11 },{ postId:17, userId:12 },{ postId:18, userId:13 },
    { postId:19, userId:14 },{ postId:20, userId:15 },{ postId:21, userId:6 },{ postId:21, userId:2 },{ postId:22, userId:3 },{ postId:23, userId:15 },
    { postId:24, userId:5 },{ postId:25, userId:7 },{ postId:26, userId:1 },{ postId:27, userId:8 },{ postId:28, userId:2 },{ postId:29, userId:11 },
    { postId:30, userId:13 },{ postId:31, userId:14 },{ postId:32, userId:15 },{ postId:33, userId:9 },{ postId:34, userId:10 },{ postId:35, userId:6 },
    { postId:36, userId:4 },{ postId:37, userId:12 },{ postId:38, userId:1 },{ postId:39, userId:3 },{ postId:40, userId:5 },{ postId:46, userId:2 },
  ]});
  console.log("Database seeded successfully.");
}
main().catch((e)=>{console.error(e);process.exit(1);}).finally(async()=>{await prisma.$disconnect();});
