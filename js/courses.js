// Import course content
// Note: Make sure to include course-content.js before this file in your HTML

const breakupRecoveryCourse = {
  id: 'breakup-recovery',
  title: 'THE BREAKUP RESET',
  subtitle: 'Your healing journey starts here.',
  description: 'A 22-day journey to heal your heart and reclaim your power.',
  price: 33,
  image: 'images/Breakup Recovery Course.jpg',
  purchaseUrl: '/product/breakup-course.html',
  
  // Use content from course-content.js
  introduction: courseContent.introduction,
  weeks: courseContent.weeks,
  days: [
    // Add Day 0 as the first day for progress tracking
    {
      day: 0,
      title: courseContent.introduction.day0.title,
      reading: courseContent.introduction.day0.reading,
      task: courseContent.introduction.day0.task,
      ritualMorning: courseContent.introduction.day0.ritualMorning,
      ritualEvening: courseContent.introduction.day0.ritualEvening,
      prompt: courseContent.introduction.day0.prompt,
      audio: courseContent.introduction.day0.audio
    },
    ...courseContent.days
  ]
}; 
window.breakupRecoveryCourse = breakupRecoveryCourse;
window.COURSES = window.COURSES || {};
window.COURSES.breakup = breakupRecoveryCourse; 