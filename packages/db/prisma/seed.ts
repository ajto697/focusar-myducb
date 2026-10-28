import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for FocusAR...');

  // 1. Seed Badges
  const badges = [
    {
      code: 'FIRST_2_MIN',
      name: 'Khởi Đầu 2 Phút',
      description: 'Hoàn thành phiên 2 phút đầu tiên chống trì hoãn',
      icon: '⚡',
      xpReward: 50,
    },
    {
      code: 'TASK_MASTER',
      name: 'Bậc Thầy Chia Nhỏ',
      description: 'Chia nhỏ mục tiêu lớn bằng AI thành công',
      icon: '🧩',
      xpReward: 100,
    },
    {
      code: 'STREAK_7_DAYS',
      name: 'Dũng Sĩ Kiên Trì',
      description: 'Duy trì chuỗi học tập 7 ngày liên tiếp',
      icon: '🔥',
      xpReward: 300,
    },
    {
      code: 'AR_GUARDIAN_FRIEND',
      name: 'Bạn Thân AR Guardian',
      description: 'Được linh vật AR nhắc nhở và quay lại tập trung',
      icon: '🌱',
      xpReward: 150,
    },
  ];

  for (const b of badges) {
    await prisma.badge.upsert({
      where: { code: b.code },
      update: {},
      create: b,
    });
  }
  console.log('✅ Badges seeded');

  // 2. Seed Default User
  const user = await prisma.user.upsert({
    where: { email: 'demo@focusar.app' },
    update: {},
    create: {
      email: 'demo@focusar.app',
      passwordHash: 'hashed_password_demo_123',
      profile: {
        create: {
          displayName: 'Học Viên Tập Trung',
          studyGoal: 'Ôn thi đại học & Đạt IELTS 7.5',
          dailyAvailableMinutes: 120,
          procrastinationStyle: 'NOT_KNOWING_HOW',
          distractorDomains: ['facebook.com', 'tiktok.com', 'youtube.com'],
        },
      },
      procrastinationProfile: {
        create: {
          primaryStyle: 'NOT_KNOWING_HOW',
          distractors: ['Mạng xã hội', 'Thông báo điện thoại', 'Cảm giác quá sức'],
        },
      },
      settings: {
        create: {
          webcamEnabled: true,
          arOverlayEnabled: true,
          extensionEnabled: true,
        },
      },
      streaks: {
        create: {
          currentStreak: 3,
          longestStreak: 5,
        },
      },
    },
  });
  console.log('✅ Demo user seeded:', user.email);

  // 3. Seed Sample Goal & Tasks
  const goal = await prisma.goal.create({
    data: {
      userId: user.id,
      title: 'Hoàn thành Bài Luận Tiếng Anh 1000 từ',
      description: 'Chủ đề: Tác động của AI đối với giáo dục hiện đại',
      category: 'Tiếng Anh',
      targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      tasks: {
        create: [
          {
            userId: user.id,
            title: 'Mở file doc & Viết 3 câu mở bài đơn giản trong 2 phút',
            estimatedMinutes: 2,
            orderIndex: 1,
            subTasks: {
              create: [
                { title: 'Mở Google Docs và đặt tên file', estimatedMinutes: 1, orderIndex: 1 },
                { title: 'Viết câu mở đầu nói về sự bùng nổ của AI', estimatedMinutes: 1, orderIndex: 2 },
              ],
            },
          },
          {
            userId: user.id,
            title: 'Lập dàn ý 3 ý chính cho phần thân bài',
            estimatedMinutes: 15,
            orderIndex: 2,
            subTasks: {
              create: [
                { title: 'Ý 1: Cá nhân hóa học tập', estimatedMinutes: 5, orderIndex: 1 },
                { title: 'Ý 2: Tự động hóa chấm điểm', estimatedMinutes: 5, orderIndex: 2 },
                { title: 'Ý 3: Thách thức về tính trung thực', estimatedMinutes: 5, orderIndex: 3 },
              ],
            },
          },
        ],
      },
    },
  });
  console.log('✅ Sample Goal seeded:', goal.title);

  // 4. Seed Study Room
  await prisma.studyRoom.create({
    data: {
      name: 'Phòng Tập Trung Đêm Muộn 🦉',
      description: 'Cùng nhau học im lặng, không xao nhãng.',
      category: 'Đại Học',
      maxMembers: 10,
      hostId: user.id,
      isPrivate: false,
    },
  });
  console.log('✅ Sample Study Room seeded');

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
