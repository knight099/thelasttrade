import { query, testConnection } from '../lib/db';

async function addSampleCourses() {
  try {
    console.log('Testing database connection...');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('Failed to connect to database');
      process.exit(1);
    }
    
    console.log('Database connected successfully!');
    
    // First, ensure we have categories
    const categories = [
      { name: 'Stock Trading Basics', description: 'Learn the fundamentals of stock trading', icon: '📈' },
      { name: 'Technical Analysis', description: 'Master chart patterns and indicators', icon: '📊' },
      { name: 'Risk Management', description: 'Protect your capital with proper risk management', icon: '🛡️' },
      { name: 'Advanced Strategies', description: 'Advanced trading techniques and strategies', icon: '🚀' }
    ];
    
    for (const category of categories) {
      await query(
        'INSERT INTO categories (name, description, icon) VALUES ($1, $2, $3) ON CONFLICT (name) DO NOTHING',
        [category.name, category.description, category.icon]
      );
    }
    
    console.log('Categories created/verified');
    
    // Get the first user as instructor (assuming it's the admin user)
    const instructorResult = await query('SELECT id FROM users LIMIT 1');
    const instructorId = instructorResult.rows[0]?.id || 1;
    
    // Get category IDs
    const stockBasicsCat = await query('SELECT id FROM categories WHERE name = $1', ['Stock Trading Basics']);
    const technicalCat = await query('SELECT id FROM categories WHERE name = $1', ['Technical Analysis']);
    const riskCat = await query('SELECT id FROM categories WHERE name = $1', ['Risk Management']);
    const advancedCat = await query('SELECT id FROM categories WHERE name = $1', ['Advanced Strategies']);
    
    // Sample courses
    const courses = [
      {
        title: 'Stock Trading Fundamentals',
        description: 'Master the basics of stock trading, from understanding market mechanics to placing your first trade. Perfect for beginners who want to start their trading journey.',
        price: 999,
        categoryId: stockBasicsCat.rows[0]?.id || 1,
        difficulty: 'beginner',
        duration: 120, // 2 hours in minutes
        features: [
          'Understanding stock markets',
          'Basic trading terminology',
          'How to read stock charts',
          'Risk management basics'
        ]
      },
      {
        title: 'Technical Analysis Mastery',
        description: 'Learn to read charts like a pro. Master candlestick patterns, indicators, and trend analysis to make informed trading decisions.',
        price: 1499,
        categoryId: technicalCat.rows[0]?.id || 2,
        difficulty: 'intermediate',
        duration: 180, // 3 hours in minutes
        features: [
          'Candlestick patterns',
          'Technical indicators',
          'Trend analysis',
          'Support and resistance'
        ]
      },
      {
        title: 'Risk Management Strategies',
        description: 'Protect your capital with proven risk management techniques. Learn position sizing, stop losses, and portfolio management.',
        price: 1299,
        categoryId: riskCat.rows[0]?.id || 3,
        difficulty: 'intermediate',
        duration: 150, // 2.5 hours in minutes
        features: [
          'Position sizing',
          'Stop loss strategies',
          'Portfolio management',
          'Risk-reward ratios'
        ]
      },
      {
        title: 'Advanced Trading Strategies',
        description: 'Take your trading to the next level with advanced strategies including options trading, swing trading, and algorithmic approaches.',
        price: 1999,
        categoryId: advancedCat.rows[0]?.id || 4,
        difficulty: 'advanced',
        duration: 240, // 4 hours in minutes
        features: [
          'Options trading basics',
          'Swing trading strategies',
          'Algorithmic trading',
          'Market psychology'
        ]
      }
    ];
    
    for (const course of courses) {
      const result = await query(
        `INSERT INTO courses (title, description, price, category_id, instructor_id, duration_minutes, difficulty_level, is_published) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         ON CONFLICT (title) DO NOTHING 
         RETURNING id`,
        [course.title, course.description, course.price, course.categoryId, instructorId, course.duration, course.difficulty, true]
      );
      
      if (result.rows.length > 0) {
        const courseId = result.rows[0].id;
        console.log(`Created course: ${course.title} (ID: ${courseId})`);
        
        // Add sample videos for each course
        for (let i = 0; i < 3; i++) {
          await query(
            `INSERT INTO videos (course_id, title, description, video_url, order_index, duration_seconds, is_free) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              courseId,
              `Lesson ${i + 1}: ${course.features[i] || 'Introduction'}`,
              `Learn about ${course.features[i] || 'course fundamentals'}`,
              `https://example.com/video-${courseId}-${i + 1}.mp4`,
              i + 1,
              (course.duration / 3) * 60, // Divide course duration by 3 for each video
              i === 0 // First video is free
            ]
          );
        }
      }
    }
    
    console.log('Sample courses created successfully!');
    console.log('You can now test the enrollment functionality.');
    
  } catch (error) {
    console.error('Error adding sample courses:', error);
    process.exit(1);
  }
}

// Run the script if this file is executed directly
if (require.main === module) {
  addSampleCourses();
}

export default addSampleCourses;
