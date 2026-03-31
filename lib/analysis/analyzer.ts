export interface AnalysisScore {
  keywordScore: number;
  formatScore: number;
  structureScore: number;
  skillsScore: number;
  atsScore: number;
  overallScore: number;
}

export interface AnalysisDetails {
  keyword_details: {
    matched_keywords: string[];
    missing_keywords: string[];
    keyword_count: number;
    match_percentage: number;
  };
  format_details: {
    has_sections: boolean;
    formatting_score: number;
    issues: string[];
  };
  structure_details: {
    has_contact_info: boolean;
    has_summary: boolean;
    has_experience: boolean;
    has_education: boolean;
    has_skills: boolean;
    completeness_score: number;
  };
  skills_details: {
    technical_skills_found: string[];
    soft_skills_found: string[];
    skills_count: number;
    diversity_score: number;
  };
  ats_details: {
    formatting_compatible: boolean;
    uses_tables: boolean;
    uses_graphics: boolean;
    uses_special_characters: boolean;
    ats_compatibility_score: number;
    issues: string[];
  };
  suggestions: string[];
}

// Common keywords for each skill category
const TECHNICAL_KEYWORDS = [
  'javascript',
  'typescript',
  'react',
  'vue',
  'angular',
  'node.js',
  'python',
  'java',
  'c++',
  'c#',
  'go',
  'rust',
  'sql',
  'mongodb',
  'postgresql',
  'mysql',
  'docker',
  'kubernetes',
  'aws',
  'azure',
  'gcp',
  'git',
  'html',
  'css',
  'rest',
  'graphql',
  'api',
  'testing',
  'ci/cd',
  'agile',
  'scrum',
  'linux',
  'bash',
  'terraform',
  'jenkins',
];

const SOFT_KEYWORDS = [
  'communication',
  'leadership',
  'teamwork',
  'problem solving',
  'analytical',
  'critical thinking',
  'creativity',
  'attention to detail',
  'time management',
  'project management',
  'collaboration',
  'stakeholder management',
];

const COMMON_SECTIONS = [
  'professional summary',
  'objective',
  'experience',
  'work experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'languages',
  'awards',
];

export function analyzeResume(
  resumeText: string,
  selectedRole: string,
  roleKeywords: string[]
): { scores: AnalysisScore; details: AnalysisDetails } {
  const normalizedText = resumeText.toLowerCase();
  const words = normalizedText.split(/\s+/);

  // 1. KEYWORD MATCHING ANALYSIS (25%)
  const matchedKeywords = roleKeywords.filter(keyword =>
    normalizedText.includes(keyword.toLowerCase())
  );
  const missingKeywords = roleKeywords.filter(
    keyword => !normalizedText.includes(keyword.toLowerCase())
  );
  const keywordMatchPercentage = (matchedKeywords.length / roleKeywords.length) * 100;
  const keywordScore = Math.min(100, keywordMatchPercentage);

  // 2. FORMAT ANALYSIS (15%)
  let formatScore = 50; // Base score
  const hasMultipleSections = COMMON_SECTIONS.filter(section =>
    normalizedText.includes(section)
  ).length;
  formatScore += (hasMultipleSections / COMMON_SECTIONS.length) * 40;
  formatScore = Math.min(100, formatScore);

  const formatIssues: string[] = [];
  if (hasMultipleSections < 3) {
    formatIssues.push('Consider adding more standard resume sections');
  }

  // 3. STRUCTURE ANALYSIS (20%)
  const hasContactInfo =
    /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/.test(resumeText) ||
    /\d{3}[-.]?\d{3}[-.]?\d{4}/.test(resumeText);
  const hasSummary =
    normalizedText.includes('summary') ||
    normalizedText.includes('objective') ||
    normalizedText.includes('professional');
  const hasExperience =
    normalizedText.includes('experience') ||
    normalizedText.includes('work history') ||
    normalizedText.includes('employment');
  const hasEducation = normalizedText.includes('education') || normalizedText.includes('degree');
  const hasSkills = normalizedText.includes('skills') || normalizedText.includes('technical');

  const structureScore =
    (hasContactInfo ? 20 : 0) +
    (hasSummary ? 20 : 0) +
    (hasExperience ? 20 : 0) +
    (hasEducation ? 20 : 0) +
    (hasSkills ? 20 : 0);

  // 4. SKILLS ANALYSIS (20%)
  const technicalSkillsFound = TECHNICAL_KEYWORDS.filter(skill =>
    normalizedText.includes(skill.toLowerCase())
  );
  const softSkillsFound = SOFT_KEYWORDS.filter(skill =>
    normalizedText.includes(skill.toLowerCase())
  );
  const totalSkillsFound = technicalSkillsFound.length + softSkillsFound.length;
  const skillsScore = Math.min(100, (totalSkillsFound / 15) * 100);
  const skillsDiversityScore = Math.min(
    100,
    ((technicalSkillsFound.length + softSkillsFound.length * 1.5) / 25) * 100
  );

  // 5. ATS COMPATIBILITY ANALYSIS (20%)
  const usesSpecialCharacters = /[^a-zA-Z0-9\s\n\r\-.,()&@#:]/.test(resumeText);
  const usesGraphics = false; // We can't detect graphics from text
  let atsScore = 100;
  const atsIssues: string[] = [];

  if (usesSpecialCharacters) {
    atsScore -= 10;
    atsIssues.push('Contains special characters that may not be ATS-friendly');
  }

  if (normalizedText.includes('table') || normalizedText.includes('column')) {
    atsScore -= 10;
    atsIssues.push('May contain tables which some ATS systems struggle with');
  }

  if (words.length > 1000) {
    atsScore = Math.max(50, atsScore - 5);
  }

  // OVERALL SCORE
  const overallScore = Math.round(
    keywordScore * 0.25 +
      formatScore * 0.15 +
      structureScore * 0.2 +
      skillsScore * 0.2 +
      atsScore * 0.2
  );

  // GENERATE SUGGESTIONS
  const suggestions: string[] = [];

  if (keywordScore < 50) {
    suggestions.push(
      `Add more ${selectedRole}-specific keywords. Missing: ${missingKeywords.slice(0, 5).join(', ')}`
    );
  }

  if (!hasSummary) {
    suggestions.push(
      'Add a professional summary at the top to highlight key qualifications'
    );
  }

  if (technicalSkillsFound.length < 5) {
    suggestions.push('Expand your technical skills section with more relevant technologies');
  }

  if (softSkillsFound.length < 3) {
    suggestions.push('Include soft skills like leadership, communication, and teamwork');
  }

  if (atsScore < 80) {
    suggestions.push(
      'Simplify formatting to improve ATS compatibility (avoid special characters and tables)'
    );
  }

  if (overallScore < 70) {
    suggestions.push('Consider restructuring your resume to better match job requirements');
  }

  if (suggestions.length === 0) {
    suggestions.push('Your resume looks strong! Consider adding more specific achievements.');
  }

  return {
    scores: {
      keywordScore: Math.round(keywordScore),
      formatScore: Math.round(formatScore),
      structureScore,
      skillsScore: Math.round(skillsScore),
      atsScore,
      overallScore,
    },
    details: {
      keyword_details: {
        matched_keywords: matchedKeywords,
        missing_keywords: missingKeywords,
        keyword_count: matchedKeywords.length,
        match_percentage: Math.round(keywordMatchPercentage),
      },
      format_details: {
        has_sections: hasMultipleSections > 0,
        formatting_score: Math.round(formatScore),
        issues: formatIssues,
      },
      structure_details: {
        has_contact_info: hasContactInfo,
        has_summary: hasSummary,
        has_experience: hasExperience,
        has_education: hasEducation,
        has_skills: hasSkills,
        completeness_score: structureScore,
      },
      skills_details: {
        technical_skills_found: technicalSkillsFound,
        soft_skills_found: softSkillsFound,
        skills_count: totalSkillsFound,
        diversity_score: Math.round(skillsDiversityScore),
      },
      ats_details: {
        formatting_compatible: atsScore >= 80,
        uses_tables: false,
        uses_graphics: usesGraphics,
        uses_special_characters: usesSpecialCharacters,
        ats_compatibility_score: atsScore,
        issues: atsIssues,
      },
      suggestions,
    },
  };
}
