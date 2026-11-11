// Nasarawa State University, Keffi: faculties and departments offered at sign-up.
//
// Confirm with Academic Affairs before launch:
// - Senate (25 May 2026) split Natural & Applied Sciences into Computing, Life
//   Sciences and Physical Sciences, with Statistics & Data Analytics in Computing.
//   Governing Council approval was pending. The split of the other old science
//   departments between Life and Physical Sciences below is by subject.
// - Mass Communication was upgraded to a faculty (its name is assumed here).
// - The official name of the health faculty is assumed.
// Edit this list and run `npm run db:seed` again; it only adds what is missing.

export const FACULTIES: { name: string; campus?: string; departments: string[] }[] = [
  {
    name: 'Administration',
    departments: [
      'Accounting', 'Banking and Finance', 'Business Administration', 'Public Administration',
      'Taxation', 'Entrepreneurial Studies', 'Security and Investment Management',
    ],
  },
  {
    name: 'Agriculture',
    campus: 'Lafia',
    departments: [
      'Agronomy', 'Agricultural Economics and Extension', 'Animal Science',
      'Home Science and Management', 'Forestry and Wildlife', 'Fisheries',
    ],
  },
  {
    name: 'Arts',
    departments: [
      'English Language', 'History', 'Linguistics', 'Religious Studies', 'French', 'Arabic',
      'Theatre and Cultural Studies',
    ],
  },
  { name: 'Communication and Media Studies', departments: ['Mass Communication'] },
  { name: 'Computing', departments: ['Computer Science', 'Statistics and Data Analytics'] },
  {
    name: 'Education',
    departments: [
      'Arts and Social Science Education', 'Educational Foundations',
      'Science, Technology and Mathematics Education', 'Special Education',
    ],
  },
  { name: 'Engineering', departments: ['Civil Engineering', 'Chemical Engineering', 'Electrical and Electronics Engineering'] },
  { name: 'Environmental Sciences', departments: ['Geography', 'Urban and Regional Planning', 'Architecture', 'Building Technology'] },
  {
    name: 'Health Sciences',
    departments: ['Community Health', 'Health Information Management', 'Environmental Health', 'Nutrition and Dietetics'],
  },
  { name: 'Law', departments: ['Private and Business Law', 'Public and International Law', 'Islamic Law and Jurisprudence'] },
  { name: 'Life Sciences', departments: ['Biochemistry and Molecular Biology', 'Microbiology', 'Zoology', 'Plant Science'] },
  {
    name: 'Physical Sciences',
    departments: ['Physics', 'Chemistry', 'Mathematics', 'Geology and Mining', 'Science Laboratory Technology'],
  },
  { name: 'Social Sciences', departments: ['Economics', 'Political Science', 'Psychology', 'Sociology'] },
];
