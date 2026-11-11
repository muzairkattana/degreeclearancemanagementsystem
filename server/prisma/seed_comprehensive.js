import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connectWithRetry(retries = 6) {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully.');
  } catch (error) {
    console.log(`⚠️ Database connection attempt failed. Retries left: ${retries}`);
    if (retries <= 0) throw error;
    console.log('⏳ Waiting 4 seconds before retry...');
    await sleep(4000);
    return connectWithRetry(retries - 1);
  }
}

async function main() {
  await connectWithRetry();
  console.log('🌱 Starting rich comprehensive database seeding...');

  // 1. Seed 8 Clearance Departments
  const departmentsData = [
    { name: 'Admission Office', code: 'ADM' },
    { name: 'Accounts Office', code: 'ACC' },
    { name: 'University Library', code: 'LIB' },
    { name: 'Hostel Office', code: 'HST' },
    { name: 'Central Store', code: 'STR' },
    { name: 'Transport Section', code: 'TRN' },
    { name: 'FYP Coordinator', code: 'FYP' },
    { name: 'Career Liaison Office', code: 'CLO' },
  ];

  const createdDepartments = {};
  for (const dept of departmentsData) {
    const savedDept = await prisma.department.upsert({
      where: { code: dept.code },
      update: {},
      create: dept,
    });
    createdDepartments[dept.code] = savedDept.department_id;
  }
  console.log('✅ 8 Departments verified & seeded.');

  // 2. Seed Academic Programs
  const programsData = [
    { name: 'BSc Computer Software Engineering', code: 'BSC-SE', level: 'Undergraduate' },
    { name: 'BSc Electrical Engineering', code: 'BSC-EE', level: 'Undergraduate' },
    { name: 'BSc Civil Engineering', code: 'BSC-CE', level: 'Undergraduate' },
    { name: 'BSc Mechanical Engineering', code: 'BSC-ME', level: 'Undergraduate' },
    { name: 'BSc Telecommunication Engineering', code: 'BSC-TE', level: 'Undergraduate' },
    { name: 'BS Computer Science', code: 'BS-CS', level: 'Undergraduate' },
    { name: 'BS Artificial Intelligence', code: 'BS-AI', level: 'Undergraduate' },
    { name: 'MSc Computer Software Engineering', code: 'MSC-SE', level: 'Postgraduate' },
  ];

  const createdPrograms = {};
  for (const prog of programsData) {
    const savedProg = await prisma.academicProgram.upsert({
      where: { code: prog.code },
      update: {},
      create: prog,
    });
    createdPrograms[prog.code] = savedProg.program_id;
  }
  console.log('✅ Academic Programs verified.');

  // Hashes
  const adminPass = await bcrypt.hash('admin123', 10);
  const controllerPass = await bcrypt.hash('controller123', 10);
  const officerPass = await bcrypt.hash('officer123', 10);
  const studentPass = await bcrypt.hash('student123', 10);

  // 3. System Admin & Controller
  await prisma.user.upsert({
    where: { email: 'admin@university.edu.pk' },
    update: {},
    create: {
      full_name: 'Engr. Tariq Khan (Admin)',
      email: 'admin@university.edu.pk',
      password_hash: adminPass,
      role: 'admin',
    },
  });

  await prisma.user.upsert({
    where: { email: 'controller@university.edu.pk' },
    update: {},
    create: {
      full_name: 'Prof. Dr. Farooq Ahmad (Controller)',
      email: 'controller@university.edu.pk',
      password_hash: controllerPass,
      role: 'controller',
    },
  });

  // 4. Seed Department Officers
  for (const dept of departmentsData) {
    const email = `officer.${dept.code.toLowerCase()}@university.edu.pk`;
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        full_name: `${dept.name} Officer`,
        email,
        password_hash: officerPass,
        role: 'officer',
        department_id: createdDepartments[dept.code],
      },
    });
  }
  console.log('✅ Officers active.');

  // 5. Seed Real-world Batch of Students across Programs
  // Note: 2021-SE-102 was already linked to student2@uetmardan.edu.pk in previous DB runs
  const studentsDataset = [
    {
      name: 'Muhammad Awais',
      reg: '2021-SE-101',
      email: 'awais@student.uetmardan.edu.pk',
      progCode: 'BSC-SE',
      cnic: '15603-1234567-1',
      phone: '0300-1122334',
    },
    {
      name: 'Muhammad Ali',
      reg: '2021-SE-102',
      email: 'student2@uetmardan.edu.pk',
      progCode: 'BSC-SE',
      cnic: '15603-1234567-2',
      phone: '0312-9988771',
    },
    {
      name: 'Fatima Zahra',
      reg: '2021-SE-103',
      email: 'fatima.zahra@student.uetmardan.edu.pk',
      progCode: 'BSC-SE',
      cnic: '15603-1234567-3',
      phone: '0312-5544332',
    },
    {
      name: 'Hamza Khan',
      reg: '2021-CS-205',
      email: 'hamza.khan@student.uetmardan.edu.pk',
      progCode: 'BS-CS',
      cnic: '15603-1234567-4',
      phone: '0333-5566778',
    },
    {
      name: 'Ayesha Noor',
      reg: '2021-EE-310',
      email: 'ayesha.noor@student.uetmardan.edu.pk',
      progCode: 'BSC-EE',
      cnic: '15603-1234567-5',
      phone: '0345-4433221',
    },
    {
      name: 'Bilal Afridi',
      reg: '2021-AI-404',
      email: 'bilal.afridi@student.uetmardan.edu.pk',
      progCode: 'BS-AI',
      cnic: '15603-1234567-6',
      phone: '0301-7788990',
    },
  ];

  const studentUsers = [];

  for (const s of studentsDataset) {
    // 5a. Ensure EligibleStudent record
    await prisma.eligibleStudent.upsert({
      where: { registration_no: s.reg },
      update: { is_registered: true },
      create: {
        registration_no: s.reg,
        email: s.email,
        full_name: s.name,
        program_id: createdPrograms[s.progCode],
        batch_year: 2021,
        is_registered: true,
      },
    });

    // 5b. Upsert User safely using registration_no as primary discriminator if found
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ email: s.email }, { registration_no: s.reg }],
      },
    });

    if (user) {
      user = await prisma.user.update({
        where: { user_id: user.user_id },
        data: {
          full_name: s.name,
          email: s.email,
          registration_no: s.reg,
          program_id: createdPrograms[s.progCode],
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          full_name: s.name,
          email: s.email,
          password_hash: studentPass,
          role: 'student',
          program_id: createdPrograms[s.progCode],
          registration_no: s.reg,
          cnic: s.cnic,
          phone: s.phone,
        },
      });
    }

    studentUsers.push(user);
  }
  console.log(`✅ ${studentUsers.length} Students registered & verified.`);

  // 6. Realistic Clearance Requests with Varied Real-time Statuses
  // Student: Fatima Zahra (2021-SE-103) -> In Progress with Mixed Reviews
  const fatima = studentUsers.find((u) => u.email === 'fatima.zahra@student.uetmardan.edu.pk');
  if (fatima) {
    let reqFatima = await prisma.clearanceRequest.findFirst({
      where: { student_id: fatima.user_id },
    });

    if (!reqFatima) {
      reqFatima = await prisma.clearanceRequest.create({
        data: {
          student_id: fatima.user_id,
          status: 'in_progress',
          submitted_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
      });

      const deptList = Object.values(createdDepartments);
      const statuses = ['approved', 'approved', 'approved', 'approved', 'rejected', 'pending', 'pending', 'pending'];
      const remarksList = [
        'Admission documents verified.',
        'Semester tuition fees verified.',
        'Library books returned.',
        'Hostel room handed over.',
        'Lab equipment outstanding.',
        null,
        null,
        null,
      ];

      for (let i = 0; i < deptList.length; i++) {
        await prisma.departmentReview.upsert({
          where: {
            clearance_id_department_id: {
              clearance_id: reqFatima.clearance_id,
              department_id: deptList[i],
            },
          },
          update: {},
          create: {
            clearance_id: reqFatima.clearance_id,
            department_id: deptList[i],
            status: statuses[i],
            remarks: remarksList[i],
            reviewed_at: statuses[i] !== 'pending' ? new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) : null,
          },
        });
      }
    }
  }

  // Student: Hamza Khan (2021-CS-205) -> Fully Completed Clearance with Certificate
  const hamza = studentUsers.find((u) => u.email === 'hamza.khan@student.uetmardan.edu.pk');
  if (hamza) {
    let reqHamza = await prisma.clearanceRequest.findFirst({
      where: { student_id: hamza.user_id },
    });

    if (!reqHamza) {
      reqHamza = await prisma.clearanceRequest.create({
        data: {
          student_id: hamza.user_id,
          status: 'completed',
          submitted_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          completed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          certificate_uri: `/certificates/clearance_${hamza.user_id}.pdf`,
          certificate_generated_at: new Date(),
        },
      });

      const deptList = Object.values(createdDepartments);
      for (const deptId of deptList) {
        await prisma.departmentReview.upsert({
          where: {
            clearance_id_department_id: {
              clearance_id: reqHamza.clearance_id,
              department_id: deptId,
            },
          },
          update: {},
          create: {
            clearance_id: reqHamza.clearance_id,
            department_id: deptId,
            status: 'approved',
            remarks: 'All clearance criteria verified and approved.',
            reviewed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
        });
      }
    }
  }

  // Student: Bilal Afridi (2021-AI-404) -> Fresh submission
  const bilal = studentUsers.find((u) => u.email === 'bilal.afridi@student.uetmardan.edu.pk');
  if (bilal) {
    let reqBilal = await prisma.clearanceRequest.findFirst({
      where: { student_id: bilal.user_id },
    });

    if (!reqBilal) {
      reqBilal = await prisma.clearanceRequest.create({
        data: {
          student_id: bilal.user_id,
          status: 'in_progress',
          submitted_at: new Date(),
        },
      });

      const deptList = Object.values(createdDepartments);
      for (const deptId of deptList) {
        await prisma.departmentReview.upsert({
          where: {
            clearance_id_department_id: {
              clearance_id: reqBilal.clearance_id,
              department_id: deptId,
            },
          },
          update: {},
          create: {
            clearance_id: reqBilal.clearance_id,
            department_id: deptId,
            status: 'pending',
          },
        });
      }
    }
  }

  // 7. Seed Notifications
  const adminUser = await prisma.user.findFirst({ where: { role: 'admin' } });
  const accOfficer = await prisma.user.findFirst({ where: { email: 'officer.acc@university.edu.pk' } });

  if (adminUser) {
    await prisma.notification.create({
      data: {
        user_id: adminUser.user_id,
        title: 'Institutional Clearance Status Report',
        message: 'Multiple student clearances are currently active in the pipeline for evaluation.',
      },
    });
  }

  if (accOfficer) {
    await prisma.notification.create({
      data: {
        user_id: accOfficer.user_id,
        title: 'Pending Accounts Clearance',
        message: 'New clearance submissions pending accounts clearance review.',
      },
    });
  }

  console.log('✅ Realistic clearances, departmental reviews & notifications populated!');
  console.log('🎉 Comprehensive dataset seeding complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
