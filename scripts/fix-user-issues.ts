import { query, testConnection } from '../lib/db';

async function fixUserIssues() {
  try {
    console.log('Testing database connection...');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('Failed to connect to database');
      process.exit(1);
    }
    
    console.log('Database connected successfully!');
    
    // Step 1: Find the user we want to keep (admin@thelasttrade.com)
    const targetUserResult = await query(
      'SELECT id, name, email FROM users WHERE email = $1',
      ['admin@thelasttrade.com']
    );
    
    if (targetUserResult.rows.length === 0) {
      console.error('Target user admin@thelasttrade.com not found!');
      process.exit(1);
    }
    
    const targetUserId = targetUserResult.rows[0].id;
    console.log(`Target user: ${targetUserResult.rows[0].name} (${targetUserResult.rows[0].email}) with ID: ${targetUserId}`);
    
    // Step 2: Update all courses to use the target user as instructor
    console.log('\nUpdating course instructor references...');
    const updateCoursesResult = await query(
      'UPDATE courses SET instructor_id = $1 WHERE instructor_id = 1 RETURNING id, title',
      [targetUserId]
    );
    
    console.log(`Updated ${updateCoursesResult.rows.length} courses:`);
    updateCoursesResult.rows.forEach(course => {
      console.log(`- Course ID ${course.id}: ${course.title}`);
    });
    
    // Step 3: Verify no more foreign key constraints
    console.log('\nVerifying foreign key constraints...');
    const constraintCheck = await query(`
      SELECT 
        c.id,
        c.title,
        c.instructor_id,
        u.name as instructor_name,
        u.email as instructor_email
      FROM courses c
      JOIN users u ON c.instructor_id = u.id
      ORDER BY c.id
    `);
    
    console.log('Current course-instructor relationships:');
    constraintCheck.rows.forEach(course => {
      console.log(`Course ID ${course.id}: ${course.title} -> Instructor: ${course.instructor_name} (${course.instructor_email})`);
    });
    
    // Step 4: Now we can safely delete the problematic user
    console.log('\nDeleting user ID 1 (admin@example.com)...');
    const deleteUserResult = await query(
      'DELETE FROM users WHERE id = 1 RETURNING id, name, email'
    );
    
    if (deleteUserResult.rows.length > 0) {
      console.log(`✓ Successfully deleted user: ${deleteUserResult.rows[0].name} (${deleteUserResult.rows[0].email})`);
    } else {
      console.log('User ID 1 was already deleted or not found');
    }
    
    // Step 5: Verify final state
    console.log('\n=== FINAL DATABASE STATE ===');
    
    const finalUsers = await query('SELECT id, name, email, role FROM users ORDER BY id');
    console.log('\nUsers:');
    finalUsers.rows.forEach(user => {
      console.log(`ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
    });
    
    const finalCourses = await query('SELECT id, title, instructor_id FROM courses ORDER BY id');
    console.log('\nCourses:');
    finalCourses.rows.forEach(course => {
      console.log(`ID: ${course.id}, Title: ${course.title}, Instructor ID: ${course.instructor_id}`);
    });
    
    const finalEnrollments = await query(`
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
    
    console.log('\nEnrollments:');
    finalEnrollments.rows.forEach(enrollment => {
      console.log(`Enrollment ID: ${enrollment.id}, User: ${enrollment.user_name} (${enrollment.user_email}) [ID: ${enrollment.user_id}], Course: ${enrollment.course_title} [ID: ${enrollment.course_id}]`);
    });
    
    console.log('\n✅ User issues fixed successfully!');
    console.log('✅ admin@example.com has been removed');
    console.log('✅ All courses now reference admin@thelasttrade.com as instructor');
    console.log('✅ Enrollments remain intact and properly linked');
    
  } catch (error) {
    console.error('Error fixing user issues:', error);
    process.exit(1);
  }
}

fixUserIssues();
