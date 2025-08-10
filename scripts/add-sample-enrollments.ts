import { query, testConnection } from '../lib/db';

async function addSampleEnrollments() {
  try {
    console.log('Testing database connection...');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('Failed to connect to database');
      process.exit(1);
    }
    
    console.log('Database connected successfully!');
    
    // Get existing users
    const usersResult = await query('SELECT id, name, email FROM users LIMIT 5');
    if (usersResult.rows.length === 0) {
      console.error('No users found. Please create users first.');
      process.exit(1);
    }
    
    console.log(`Found ${usersResult.rows.length} users:`, usersResult.rows.map(u => u.name));
    
    // Get existing courses
    const coursesResult = await query('SELECT id, title FROM courses LIMIT 5');
    if (coursesResult.rows.length === 0) {
      console.error('No courses found. Please create courses first.');
      process.exit(1);
    }
    
    console.log(`Found ${coursesResult.rows.length} courses:`, coursesResult.rows.map(c => c.title));
    
    // Create sample enrollments - only use users and courses that exist
    const enrollments = [];
    
    if (usersResult.rows.length > 0 && coursesResult.rows.length > 0) {
      // First user enrolls in first course
      enrollments.push({ 
        userId: usersResult.rows[0].id, 
        courseId: coursesResult.rows[0].id 
      });
      
      // First user enrolls in second course (if exists)
      if (coursesResult.rows[1]) {
        enrollments.push({ 
          userId: usersResult.rows[0].id, 
          courseId: coursesResult.rows[1].id 
        });
      }
      
      // Second user enrolls in first course (if exists)
      if (usersResult.rows[1]) {
        enrollments.push({ 
          userId: usersResult.rows[1].id, 
          courseId: coursesResult.rows[0].id 
        });
      }
      
      // Third user enrolls in second course (if exists)
      if (usersResult.rows[2] && coursesResult.rows[1]) {
        enrollments.push({ 
          userId: usersResult.rows[2].id, 
          courseId: coursesResult.rows[1].id 
        });
      }
    }
    
    console.log('Creating sample enrollments...');
    
    for (const enrollment of enrollments) {
      if (enrollment.userId && enrollment.courseId) {
        try {
          // Check if enrollment already exists
          const existingEnrollment = await query(
            'SELECT id FROM user_courses WHERE user_id = $1 AND course_id = $2',
            [enrollment.userId, enrollment.courseId]
          );
          
          if (existingEnrollment.rows.length === 0) {
            await query(
              'INSERT INTO user_courses (user_id, course_id, enrolled_at, progress_percentage) VALUES ($1, $2, CURRENT_TIMESTAMP, 0)',
              [enrollment.userId, enrollment.courseId]
            );
            console.log(`✓ Enrolled user ${enrollment.userId} in course ${enrollment.courseId}`);
          } else {
            console.log(`- Enrollment already exists for user ${enrollment.userId} in course ${enrollment.courseId}`);
          }
        } catch (error) {
          console.error(`Error creating enrollment for user ${enrollment.userId} in course ${enrollment.courseId}:`, error);
        }
      }
    }
    
    // Verify enrollments were created
    const totalEnrollments = await query('SELECT COUNT(*) as count FROM user_courses');
    console.log(`\nTotal enrollments in database: ${totalEnrollments.rows[0].count}`);
    
    // Show enrollments by user
    const userEnrollments = await query(`
      SELECT 
        u.name as user_name,
        u.email,
        COUNT(uc.course_id) as enrolled_courses
      FROM users u
      LEFT JOIN user_courses uc ON u.id = uc.user_id
      GROUP BY u.id, u.name, u.email
      ORDER BY enrolled_courses DESC
    `);
    
    console.log('\nEnrollments by user:');
    userEnrollments.rows.forEach(row => {
      console.log(`- ${row.user_name} (${row.email}): ${row.enrolled_courses} courses`);
    });
    
    console.log('\nSample enrollments added successfully!');
    
  } catch (error) {
    console.error('Error adding sample enrollments:', error);
    process.exit(1);
  }
}

addSampleEnrollments();
