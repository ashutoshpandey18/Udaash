/**
 * Prisma Seed Script
 * Day 15 - UDAASH Production Database
 *
 * IMPORTANT: This is SAMPLE DATA for development only.
 * All jobs, companies, and details are fictional and for testing purposes.
 */

import { PrismaClient, Market, ApplicationStatus } from '@prisma/client';

const prisma = new PrismaClient();

const SAMPLE_JOBS = [
  // INDIA MARKET
  {
    title: 'Senior Full-Stack Developer',
    company: 'TechVista Solutions',
    location: 'Bangalore, India',
    market: Market.INDIA,
    salaryMin: 2000000,
    salaryMax: 3500000,
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
    description: 'Sample job listing for development. Join our team building scalable SaaS platforms.',
  },
  {
    title: 'Frontend Engineer',
    company: 'CloudNine Technologies',
    location: 'Hyderabad, India',
    market: Market.INDIA,
    salaryMin: 1500000,
    salaryMax: 2500000,
    skills: ['React', 'Next.js', 'Tailwind CSS', 'JavaScript'],
    description: 'Sample job listing. Build modern web applications with cutting-edge frameworks.',
  },
  {
    title: 'Backend Developer',
    company: 'DataFlow Systems',
    location: 'Pune, India',
    market: Market.INDIA,
    salaryMin: 1800000,
    salaryMax: 2800000,
    skills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Docker'],
    description: 'Sample position. Design and implement robust API services.',
  },
  {
    title: 'DevOps Engineer',
    company: 'InfraCore Labs',
    location: 'Mumbai, India',
    market: Market.INDIA,
    salaryMin: 2200000,
    salaryMax: 3200000,
    skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'CI/CD'],
    description: 'Sample role. Automate infrastructure and deployment pipelines.',
  },
  {
    title: 'Machine Learning Engineer',
    company: 'AI Innovations',
    location: 'Bangalore, India',
    market: Market.INDIA,
    salaryMin: 2500000,
    salaryMax: 4000000,
    skills: ['Python', 'TensorFlow', 'PyTorch', 'ML Ops', 'AWS'],
    description: 'Sample listing. Build production ML systems at scale.',
  },

  // US MARKET
  {
    title: 'Senior Software Engineer',
    company: 'Silicon Valley Startup',
    location: 'San Francisco, CA',
    market: Market.US,
    salaryMin: 150000,
    salaryMax: 220000,
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS'],
    description: 'Sample job. Shape the future of enterprise SaaS.',
  },
  {
    title: 'Staff Engineer',
    company: 'TechGiant Corp',
    location: 'Seattle, WA',
    market: Market.US,
    salaryMin: 200000,
    salaryMax: 300000,
    skills: ['Distributed Systems', 'Go', 'Kubernetes', 'Microservices'],
    description: 'Sample position. Lead technical initiatives across teams.',
  },
  {
    title: 'Frontend Architect',
    company: 'DesignFirst Studio',
    location: 'Austin, TX',
    market: Market.US,
    salaryMin: 140000,
    salaryMax: 190000,
    skills: ['React', 'Vue.js', 'CSS Architecture', 'Performance'],
    description: 'Sample role. Define frontend standards and best practices.',
  },
  {
    title: 'Data Engineer',
    company: 'Analytics Pro',
    location: 'New York, NY',
    market: Market.US,
    salaryMin: 160000,
    salaryMax: 210000,
    skills: ['Python', 'Spark', 'Airflow', 'Snowflake', 'dbt'],
    description: 'Sample listing. Build data pipelines for analytics.',
  },
  {
    title: 'Security Engineer',
    company: 'SecureCloud Inc',
    location: 'Remote, US',
    market: Market.US,
    salaryMin: 170000,
    salaryMax: 240000,
    skills: ['Security', 'Penetration Testing', 'AWS Security', 'Python'],
    description: 'Sample job. Protect cloud infrastructure and applications.',
  },

  // GERMANY MARKET
  {
    title: 'Senior Backend Developer',
    company: 'Berlin Tech Hub',
    location: 'Berlin, Germany',
    market: Market.DE,
    salaryMin: 70000,
    salaryMax: 95000,
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Kafka', 'Docker'],
    description: 'Sample position. Entwickeln Sie skalierbare Backend-Systeme.',
  },
  {
    title: 'Full-Stack Engineer',
    company: 'Munich Innovations',
    location: 'Munich, Germany',
    market: Market.DE,
    salaryMin: 65000,
    salaryMax: 85000,
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
    description: 'Sample role. Build web applications for European market.',
  },
  {
    title: 'Cloud Architect',
    company: 'Frankfurt Systems',
    location: 'Frankfurt, Germany',
    market: Market.DE,
    salaryMin: 80000,
    salaryMax: 110000,
    skills: ['AWS', 'Azure', 'Kubernetes', 'Terraform', 'Microservices'],
    description: 'Sample listing. Design cloud-native architectures.',
  },
  {
    title: 'Mobile Developer',
    company: 'Hamburg Apps',
    location: 'Hamburg, Germany',
    market: Market.DE,
    salaryMin: 60000,
    salaryMax: 80000,
    skills: ['React Native', 'iOS', 'Android', 'TypeScript'],
    description: 'Sample job. Create mobile experiences for millions.',
  },
  {
    title: 'Platform Engineer',
    company: 'Stuttgart Tech',
    location: 'Stuttgart, Germany',
    market: Market.DE,
    salaryMin: 75000,
    salaryMax: 100000,
    skills: ['Kubernetes', 'Go', 'Platform Engineering', 'GitOps'],
    description: 'Sample position. Build internal developer platforms.',
  },
];

// More sample jobs to reach ~100 total
const generateMoreJobs = (): typeof SAMPLE_JOBS => {
  const titles = [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full-Stack Developer',
    'DevOps Engineer',
    'Data Scientist',
    'QA Engineer',
    'Product Manager',
    'Technical Lead',
    'System Architect',
  ];

  const companies = [
    'Innovate Labs',
    'Digital Dynamics',
    'Code Crafters',
    'Tech Horizon',
    'Data Masters',
    'Cloud Pioneers',
    'Agile Solutions',
    'Smart Systems',
    'Future Tech',
    'Enterprise Pro',
  ];

  const indianCities = ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai'];
  const usCities = ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Boston, MA'];
  const germanCities = ['Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Cologne'];

  const skillSets = [
    ['React', 'JavaScript', 'CSS', 'HTML'],
    ['Python', 'Django', 'PostgreSQL', 'Redis'],
    ['Java', 'Spring Boot', 'MySQL', 'Kafka'],
    ['Node.js', 'Express', 'MongoDB', 'GraphQL'],
    ['TypeScript', 'Next.js', 'Tailwind CSS', 'Prisma'],
    ['Go', 'Kubernetes', 'Docker', 'gRPC'],
    ['AWS', 'Terraform', 'CI/CD', 'Linux'],
    ['React Native', 'iOS', 'Android', 'Firebase'],
  ];

  const markets = [
    { market: Market.INDIA, cities: indianCities, salaryRange: [1200000, 3500000] },
    { market: Market.US, cities: usCities, salaryRange: [120000, 280000] },
    { market: Market.DE, cities: germanCities, salaryRange: [55000, 110000] },
  ];

  const moreJobs: typeof SAMPLE_JOBS = [];

  for (let i = 0; i < 85; i++) {
    const title = titles[i % titles.length];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const marketData = markets[i % markets.length];
    const city = marketData.cities[Math.floor(Math.random() * marketData.cities.length)];
    const skills = skillSets[Math.floor(Math.random() * skillSets.length)];
    const salaryMin = marketData.salaryRange[0] + Math.floor(Math.random() * 100000);
    const salaryMax = salaryMin + 200000 + Math.floor(Math.random() * 500000);

    moreJobs.push({
      title,
      company,
      location: marketData.market === Market.DE ? `${city}, Germany` : marketData.market === Market.US ? city : `${city}, India`,
      market: marketData.market,
      salaryMin,
      salaryMax,
      skills,
      description: `Sample job listing ${i + 1} for development and testing purposes.`,
    });
  }

  return moreJobs;
};

async function main() {
  console.log('🌱 Starting database seed...');
  console.log('⚠️  IMPORTANT: This is SAMPLE DATA for development only.\n');

  // Clean existing data
  console.log('Cleaning existing data...');
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.user.deleteMany();

  // Create sample user
  console.log('Creating sample user...');
  const user = await prisma.user.create({
    data: {
      email: 'dev@udaash.local',
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      location: 'Bangalore, India',
    },
  });

  // Create jobs
  console.log('Creating sample jobs...');
  const allJobs = [...SAMPLE_JOBS, ...generateMoreJobs()];

  for (const jobData of allJobs) {
    await prisma.job.create({
      data: jobData,
    });
  }

  // Create sample applications
  console.log('Creating sample applications...');
  const jobs = await prisma.job.findMany({ take: 5 });

  for (const job of jobs) {
    await prisma.application.create({
      data: {
        userId: user.id,
        jobId: job.id,
        status: [ApplicationStatus.PENDING, ApplicationStatus.APPLIED, ApplicationStatus.REPLIED][
          Math.floor(Math.random() * 3)
        ],
        notes: 'Sample application for testing',
      },
    });
  }

  const jobCount = await prisma.job.count();
  const applicationCount = await prisma.application.count();

  console.log('\n✅ Seed completed successfully!');
  console.log(`   Created ${jobCount} sample jobs`);
  console.log(`   Created ${applicationCount} sample applications`);
  console.log(`   Created 1 sample user\n`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
