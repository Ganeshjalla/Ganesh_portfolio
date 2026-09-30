/**
 * Single source of truth for all portfolio content.
 * Everything here comes from Ganesh's resume. Edit this file to update the site.
 */

export const profile = {
  name: 'Ganesh Jalla',
  first: 'GANESH',
  last: 'JALLA',
  roleLine2: 'BACKEND & FULL-STACK DEVELOPER',
  heroCopy:
    'Building scalable backend systems, full-stack applications, and intelligent software experiences with Java, Spring Boot, React, and modern cloud technologies.',
  email: 'ganeshjalla05@gmail.com',
  phone: '+91 93465 24781',
  phoneHref: '+919346524781',
  location: 'India',
  linkedin: 'https://www.linkedin.com/in/ganesh-jalla-bbbb07330/',
  github: 'https://github.com/Ganeshjalla',
  resume: '/Ganesh_Jalla_Resume.pdf',
  metaStack: ['JAVA', 'SPRING BOOT', 'REACT', 'SQL', 'AWS'],
}

export const navItems = [
  { id: 'home', label: 'HOME' },
  { id: 'about', label: 'ABOUT' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'experience', label: 'EXPERIENCE' },
  { id: 'achievements', label: 'ACHIEVEMENTS' },
  { id: 'contact', label: 'CONTACT' },
]

export const about = {
  statement: 'I build software with an engineer\u2019s mindset.',
  body: 'Computer Science student with hands-on experience building full-stack applications using Java, Spring Boot, React.js, MySQL, PostgreSQL, and REST APIs. I design and build reliable software systems with a focus on backend architecture, APIs, databases, and scalable application workflows.',
  focus: [
    'Backend engineering',
    'API development',
    'Database systems',
    'Full-stack applications',
    'Problem solving',
    'Data structures and algorithms',
    'Cloud technologies',
  ],
  timeline: [
    { year: '2021', label: 'Intermediate', detail: '89%' },
    { year: '2023', label: 'Started B.Tech CSE', detail: 'Parul University' },
    { year: '2025', label: 'Software projects + virtual experiences', detail: 'JPMorgan, Deloitte simulations' },
    { year: '2026', label: 'Full-stack projects + advanced DSA', detail: 'SGnexasoft, ErpFlow' },
    { year: '2027', label: 'B.Tech graduation', detail: 'Expected' },
  ],
}

export const principles = [
  { n: '01', title: 'SOLVE', text: 'Break complex problems into manageable systems.' },
  { n: '02', title: 'BUILD', text: 'Turn ideas into working software.' },
  { n: '03', title: 'OPTIMIZE', text: 'Improve performance, architecture, and reliability.' },
  { n: '04', title: 'LEARN', text: 'Continuously improve through projects and problem solving.' },
]

export interface SkillNode {
  id: string
  label: string
  group: 'core' | 'backend' | 'frontend' | 'data' | 'cloud' | 'cs'
  desc: string
  related: string[]
}

export const skills: SkillNode[] = [
  { id: 'java', label: 'JAVA', group: 'backend', desc: 'Primary programming language used for backend development, DSA, and object-oriented programming.', related: ['spring', 'hibernate', 'dsa'] },
  { id: 'spring', label: 'SPRING BOOT', group: 'backend', desc: 'Used to build modular REST APIs and backend services.', related: ['java', 'rest', 'hibernate', 'mysql'] },
  { id: 'react', label: 'REACT', group: 'frontend', desc: 'Used to build responsive frontends and role-based dashboards that consume REST APIs.', related: ['rest', 'spring'] },
  { id: 'mysql', label: 'MYSQL', group: 'data', desc: 'Used for relational data storage, schema design, queries, and application persistence.', related: ['hibernate', 'postgres', 'spring'] },
  { id: 'postgres', label: 'POSTGRESQL', group: 'data', desc: 'Used for relational data storage, schema design, queries, and application persistence.', related: ['mysql', 'rest'] },
  { id: 'rest', label: 'REST API', group: 'backend', desc: 'Designed and integrated RESTful APIs between frontends and backend services, secured with JWT.', related: ['spring', 'react', 'postgres'] },
  { id: 'hibernate', label: 'HIBERNATE/JPA', group: 'backend', desc: 'ORM layer connecting Spring Boot services to MySQL for structured persistence.', related: ['java', 'spring', 'mysql'] },
  { id: 'aws', label: 'AWS', group: 'cloud', desc: 'Cloud fundamentals for deploying and hosting applications.', related: ['docker', 'azure'] },
  { id: 'azure', label: 'AZURE', group: 'cloud', desc: 'Microsoft Azure cloud fundamentals.', related: ['aws', 'docker'] },
  { id: 'python', label: 'PYTHON', group: 'cs', desc: 'Used for the Bank Fraud Detection System and for algorithmic problem solving.', related: ['dsa', 'postgres'] },
  { id: 'docker', label: 'DOCKER', group: 'cloud', desc: 'Docker and CI/CD fundamentals for containerized, repeatable deployments.', related: ['aws', 'git'] },
  { id: 'git', label: 'GIT', group: 'cloud', desc: 'Version control with Git and GitHub for every project.', related: ['docker'] },
  { id: 'dsa', label: 'DSA', group: 'cs', desc: '400+ LeetCode problems. Applied HashMaps and DFS cycle detection in the fraud detection project.', related: ['java', 'python'] },
  { id: 'system', label: 'SYSTEM DESIGN', group: 'cs', desc: 'System design fundamentals: layered architecture, API boundaries, database design, and indexing.', related: ['spring', 'rest', 'mysql'] },
]

export type ProjectId = 'sgnexasoft' | 'erpflow' | 'fraud'

export interface Layer {
  name: string
  purpose: string
}

export interface Project {
  id: ProjectId
  index: string
  name: string
  year: string
  stack: string[]
  short: string
  features: string[]
  decisions: string[]
  layers: Layer[]
  /** Live URL from the resume. */
  live?: string
  /** Add a real GitHub repo URL here to show a SOURCE CODE button. Left empty on purpose. */
  source?: string
  detail: {
    challenge: string
    implementation: string
    result: string
  }
}

export const projects: Project[] = [
  {
    id: 'sgnexasoft',
    index: '01',
    name: 'SGnexasoft Freelance Platform',
    year: '2026',
    stack: ['Spring Boot', 'React.js', 'MySQL', 'JWT', 'REST APIs', 'Hibernate/JPA'],
    short:
      'A full-stack freelance platform connecting users through structured workflows, authentication, role-based access, and modular REST APIs.',
    features: [
      'Full-stack architecture',
      'Separate user and administrator dashboards',
      'JWT authentication',
      'Role-based access control',
      'RESTful API integration',
      'Hibernate/JPA persistence on MySQL',
    ],
    decisions: [
      'JWT-based authentication with role-based access control on protected workflows',
      'Modular REST APIs between the React frontend and Spring Boot backend',
      'Hibernate/JPA over MySQL for structured, persistent data',
    ],
    layers: [
      { name: 'React frontend', purpose: 'User and administrator dashboards. Sends authenticated requests.' },
      { name: 'REST API', purpose: 'Modular endpoints that separate the client from business logic.' },
      { name: 'Spring Boot', purpose: 'Services, JWT validation, and role-based access control.' },
      { name: 'Hibernate/JPA', purpose: 'Maps Java entities to relational tables.' },
      { name: 'MySQL', purpose: 'Persistent storage for users, roles, and platform data.' },
    ],
    live: 'https://sgnexasoft.vercel.app',
    detail: {
      challenge:
        'Give two different kinds of users, clients and administrators, safe access to the same platform without mixing their workflows.',
      implementation:
        'Built a Spring Boot backend that issues and validates JWTs and enforces role-based access. A React.js frontend provides separate user and administrator dashboards over modular REST APIs, with Hibernate/JPA persisting data to MySQL.',
      result:
        'A working full-stack platform, deployed and live, with authentication, role separation, and a maintainable API structure.',
    },
  },
  {
    id: 'erpflow',
    index: '02',
    name: 'ErpFlow',
    year: '2026',
    stack: ['React.js', 'Node.js', 'PostgreSQL', 'REST APIs'],
    short:
      'An ERP-style full-stack web application designed for managing business workflows, records, and role-based dashboards.',
    features: [
      'Business workflow management',
      'Role-based dashboards',
      'REST APIs',
      'React frontend',
      'PostgreSQL database',
      'Separate frontend and backend deployments',
    ],
    decisions: [
      'PostgreSQL schema designed for reliable storage, retrieval, and workflow tracking',
      'RESTful backend APIs with a responsive React frontend',
      'Separate frontend and backend environments on cloud hosting',
    ],
    layers: [
      { name: 'Frontend', purpose: 'Responsive React.js dashboards for each role.' },
      { name: 'API layer', purpose: 'RESTful Node.js endpoints for records and workflows.' },
      { name: 'Business logic', purpose: 'Workflow rules and role checks before data is written.' },
      { name: 'PostgreSQL', purpose: 'Relational store for records and workflow tracking.' },
    ],
    live: 'https://erpflow-nu.vercel.app',
    detail: {
      challenge:
        'Model business processes and records so different roles see and change only what they should, while workflows stay traceable.',
      implementation:
        'Developed RESTful backend APIs and a responsive React.js frontend, backed by PostgreSQL structures designed for retrieval and workflow tracking. Frontend and backend deploy to separate cloud environments.',
      result:
        'An ERP-style application for managing business workflows, records, and role-based dashboards, deployed and live.',
    },
  },
  {
    id: 'fraud',
    index: '03',
    name: 'Bank Fraud Detection System',
    year: '2025\u20132026',
    stack: ['Python', 'SQL', 'Data Structures', 'Real-Time Analytics'],
    short:
      'A real-time banking fraud detection system designed to identify suspicious transactions and generate transaction summaries.',
    features: [
      'HashMap-based transaction tracking',
      'DFS-based cycle detection',
      'Suspicious transaction analysis',
      'Money-laundering pattern detection',
      'SQL optimization and database indexing',
      'Diagnostic reporting',
    ],
    decisions: [
      'HashMaps for constant-time transaction tracking',
      'DFS cycle detection on the account graph to surface circular money movement',
      'Query optimization and indexing, about 35% faster lookup in project testing',
    ],
    layers: [
      { name: 'Transaction', purpose: 'Each transaction is tracked in a HashMap for fast lookup.' },
      { name: 'Pattern analysis', purpose: 'Suspicious transactions are analysed against transaction patterns.' },
      { name: 'Graph detection', purpose: 'DFS finds cycles between accounts that suggest laundering.' },
      { name: 'Risk signal', purpose: 'Flagged paths are raised as potential risk.' },
      { name: 'Report', purpose: 'Transaction summaries and diagnostic reports.' },
    ],
    live: 'https://bank-fraud-pro.vercel.app',
    detail: {
      challenge:
        'Find suspicious transaction behaviour quickly, including money moving in circles between accounts, while keeping lookups fast.',
      implementation:
        'Tracked transactions with HashMaps, modelled accounts and transfers as a graph, and used DFS-based cycle detection to spot potential money-laundering patterns. Tuned SQL queries and indexing for lookup speed.',
      result:
        'Approximately 35% faster transaction lookup in project testing. This is a personal engineering project, not a production banking deployment.',
    },
  },
]

export const achievements = {
  leetcode: {
    value: 400,
    suffix: '+',
    label: 'LEETCODE PROBLEMS SOLVED',
    text: '400+ problems covering Data Structures, Algorithms, and problem-solving patterns.',
  },
  hackerrank: {
    value: '5\u2605',
    label: 'HACKERRANK',
    text: '5-Star rating in Java and Problem Solving.',
  },
}

export const certifications = [
  { org: 'Oracle', title: 'Oracle Analytics Cloud' },
  { org: 'NPTEL', title: 'IIT Kharagpur \u2014 Computer Networks' },
  { org: 'Microsoft & LinkedIn Learning', title: 'Generative AI' },
]

export const virtualExperiences = [
  {
    org: 'JPMorgan Chase & Co.',
    title: 'Software Engineering Virtual Experience',
    text: 'Enterprise development workflows, software lifecycle practices, and practical engineering tasks.',
  },
  {
    org: 'Deloitte',
    title: 'Cybersecurity Job Simulation',
    text: 'Threat detection, security controls, risk analysis, and client-oriented security communication.',
  },
  {
    org: 'Deloitte',
    title: 'Data Analytics Job Simulation',
    text: 'Data analysis, dashboard interpretation, and generation of business insights.',
  },
]

export const education = [
  {
    school: 'PARUL UNIVERSITY',
    program: 'B.Tech \u2014 Computer Science & Engineering',
    years: '2023 \u2014 2027',
    metricLabel: 'CGPA',
    metric: '7.52 / 10',
    place: 'Vadodara, Gujarat',
  },
  {
    school: 'SRI VISWA JUNIOR COLLEGE',
    program: 'Intermediate \u2014 MPC',
    years: '2021 \u2014 2023',
    metricLabel: 'SCORE',
    metric: '89%',
    place: 'Visakhapatnam',
  },
]
