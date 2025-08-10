import { query, testConnection } from '../lib/db';

async function checkDatabaseState() {
  try {
    console.log('Testing database connection...');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('Failed to connect to database');
      process.exit(1);
    }
    
    console.log('Database connected successfully!');
    
    // Check users
    console.log('\n=== USERS ===');
    const usersResult = await query('SELECT id, name, email, role FROM users ORDER BY id');
    usersResult.rows.forEach(user => {
      console.log(`ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
    });
    
    // Check courses and their instructors
    console.log('\n=== COURSES ===');
    const coursesResult = await query('SELECT id, title, instructor_id FROM courses ORDER BY id');
    coursesResult.rows.forEach(course => {
      console.log(`ID: ${course.id}, Title: ${course.title}, Instructor ID: ${course.instructor_id}`);
    });
    
    // Check enrollments
    console.log('\n=== ENROLLMENTS ===');
    const enrollmentsResult = await query(`
      SELECT 
        uc.id,
        uc.user_id,
        u.name as user_name,
        u.email as user_email,
        uc.course_id,
        c.title as course_title
      FROM user_courses uc
      JOIN users u ON uc.user_id = u.id
      JOIN courses c ON uc.course_id = c.id
      ORDER BY uc.id
    `);
    
    if (enrollmentsResult.rows.length === 0) {
      console.log('No enrollments found');
    } else {
      enrollmentsResult.rows.forEach(enrollment => {
        console.log(`Enrollment ID: ${enrollment.id}, User: ${enrollment.user_name} (${enrollment.user_email}) [ID: ${enrollment.user_id}], Course: ${enrollment.course_title} [ID: ${enrollment.course_id}]`);
      });
    }
    
    // Check for orphaned enrollments
    console.log('\n=== ORPHANED ENROLLMENTS ===');
    const orphanedResult = await query(`
      SELECT uc.id, uc.user_id, uc.course_id
      FROM user_courses uc
      LEFT JOIN users u ON uc.user_id = u.id
      WHERE u.id IS NULL
    `);
    
    if (orphanedResult.rows.length === 0) {
      console.log('No orphaned enrollments found');
    } else {
      orphanedResult.rows.forEach(orphaned => {
        console.log(`Orphaned: User ID ${orphaned.user_id} not found for enrollment ${orphaned.id}`);
      });
    }
    
    // Check localStorage vs database mismatch
    console.log('\n=== POTENTIAL ISSUES ===');
    console.log('1. User ID 1 (admin@example.com) cannot be deleted due to foreign key constraint');
    console.log('2. Need to update course instructor_id to point to admin@thelasttrade.com');
    console.log('3. Need to fix enrollment user_id references');
    
  } catch (error) {
    console.error('Error checking database state:', error);
    process.exit(1);
  }
}

checkDatabaseState();
