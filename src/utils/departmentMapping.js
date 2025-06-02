// Map categories to their respective departments
export const CATEGORY_DEPARTMENT_MAP = {
  'Infrastructure': 'Public Works',
  'Roads': 'Public Works',
  'Noise': 'Environment',
  'Utilities': 'Public Works',
  'Environment': 'Environment',
  'Water Supply': 'Water Supply',
  'Electricity': 'Electricity',
  'Sanitation': 'Public Works',
  'Other': 'Public Works'
};

/**
 * Determines the appropriate department based on the grievance category
 * @param {string} category - The grievance category
 * @returns {string} The assigned department
 */
export const getDepartmentForCategory = (category) => {
  // Get the mapped department or default to Public Works
  return CATEGORY_DEPARTMENT_MAP[category] || 'Public Works';
};

/**
 * Determines the priority level based on the grievance category and description
 * @param {string} category - The grievance category
 * @param {string} description - The grievance description
 * @returns {string} The assigned priority level
 */
export const getPriorityLevel = (category, description) => {
  // Convert to lowercase for case-insensitive matching
  const lowerDescription = description.toLowerCase();
  
  // Keywords that indicate high priority
  const urgentKeywords = ['urgent', 'emergency', 'immediate', 'danger', 'hazard', 'unsafe'];
  const highPriorityCategories = ['Water Supply', 'Electricity', 'Sanitation'];
  
  // Check for urgent keywords in description
  if (urgentKeywords.some(keyword => lowerDescription.includes(keyword))) {
    return 'urgent';
  }
  
  // Check category priority
  if (highPriorityCategories.includes(category)) {
    return 'high';
  }
  
  // Default priority
  return 'medium';
}; 