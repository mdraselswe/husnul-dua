import { PrismaClient } from '../lib/prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Sample dua for pain
  await prisma.dua.upsert({
    where: { id: 'sample-pain-dua-1' },
    update: {},
    create: {
      id: 'sample-pain-dua-1',
      titleBengali: 'মাথা ব্যথার দোয়া',
      titleEnglish: 'Dua for Headache',
      arabic: 'بِسْمِ اللَّهِ الْكَبِيرِ أَعُوذُ بِاللَّهِ الْعَظِيمِ مِنْ شَرِّ كُلِّ عَرَقٍ نَعَّارٍ وَمِنْ شَرِّ حَرِّ النَّارِ',
      transliteration: 'Bismillahil kabeer, A\'oodhu billahil \'azeem min sharri kulli \'irqin na\'aarin wa min sharri harri an-naar',
      bengali: 'আল্লাহর নামে শুরু করছি, যিনি মহান। আমি আল্লাহর কাছে আশ্রয় চাচ্ছি, যিনি মহিমান্বিত, প্রতিটি রক্তনালীর ব্যথা এবং জাহান্নামের আগুনের ক্ষতি থেকে।',
      english: 'In the name of Allah, the Great. I seek refuge in Allah, the Mighty, from the evil of every throbbing vein and from the evil of the heat of the Fire.',
      tags: 'মাথা ব্যথা, শরীর ব্যথা, যেকোন ব্যথা, ব্যথা, স্বাস্থ্য',
      category: 'স্বাস্থ্য',
      source: 'সুনান আত-তিরমিযী',
      times: 'ব্যথার সময় ৭ বার',
      benefits: 'যেকোন ধরনের ব্যথা, বিশেষ করে মাথা ব্যথা থেকে মুক্তি পাওয়ার জন্য এই দুআ পড়া হয়।',
    },
  })

  // Sample dua for protection
  await prisma.dua.upsert({
    where: { id: 'sample-protection-dua-1' },
    update: {},
    create: {
      id: 'sample-protection-dua-1',
      titleBengali: 'সকাল-সন্ধ্যার দোয়া',
      titleEnglish: 'Morning and Evening Dua',
      arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
      transliteration: 'Asbahna wa asbahal mulku lillah, walhamdulillah, la ilaha illallah wahdahu la sharika lah',
      bengali: 'আমরা সকালে জেগে উঠেছি এবং সমস্ত রাজত্ব আল্লাহর জন্য। সমস্ত প্রশংসা আল্লাহর জন্য। আল্লাহ ছাড়া কোনো উপাস্য নেই, তিনি একক, তাঁর কোনো অংশীদার নেই।',
      english: 'We have reached the morning and the dominion belongs to Allah, and all praise is due to Allah. There is no deity except Allah alone, without partner.',
      tags: 'সুরক্ষা, সকাল, সন্ধ্যা, সকালের দোয়া, সন্ধ্যার দোয়া, হিফাজত',
      category: 'সুরক্ষা',
      source: 'সহীহ মুসলিম',
      times: 'সকালে ও সন্ধ্যায়',
      benefits: 'সকাল-সন্ধ্যায় পড়লে সারা দিন ও রাতের হিফাজত হয়।',
    },
  })

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
