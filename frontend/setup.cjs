const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const dirs = [
  'assets',
  'components/common',
  'components/layout',
  'components/ui',
  'layouts',
  'pages',
  'routes',
  'services',
  'hooks',
  'context',
  'utils',
  'constants',
  'styles'
];

dirs.forEach(d => {
  const dirPath = path.join(srcDir, d);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Pages
const pages = [
  { name: 'CoursesPage.jsx', content: `const CoursesPage = () => {\n  return (\n    <div>\n      <h1>Courses</h1>\n    </div>\n  );\n};\n\nexport default CoursesPage;\n` },
  { name: 'CourseDetailPage.jsx', content: `const CourseDetailPage = () => {\n  return (\n    <div>\n      <h1>Course Detail</h1>\n    </div>\n  );\n};\n\nexport default CourseDetailPage;\n` },
  { name: 'LoginPage.jsx', content: `const LoginPage = () => {\n  return (\n    <div>\n      <h1>Login</h1>\n    </div>\n  );\n};\n\nexport default LoginPage;\n` },
  { name: 'RegisterPage.jsx', content: `const RegisterPage = () => {\n  return (\n    <div>\n      <h1>Register</h1>\n    </div>\n  );\n};\n\nexport default RegisterPage;\n` },
  { name: 'DashboardPage.jsx', content: `const DashboardPage = () => {\n  return (\n    <div>\n      <h1>Dashboard</h1>\n    </div>\n  );\n};\n\nexport default DashboardPage;\n` },
  { name: 'ProfilePage.jsx', content: `const ProfilePage = () => {\n  return (\n    <div>\n      <h1>Profile</h1>\n    </div>\n  );\n};\n\nexport default ProfilePage;\n` },
  { name: 'MyLearningPage.jsx', content: `const MyLearningPage = () => {\n  return (\n    <div>\n      <h1>My Learning</h1>\n    </div>\n  );\n};\n\nexport default MyLearningPage;\n` },
  { name: 'AboutPage.jsx', content: `const AboutPage = () => {\n  return (\n    <div>\n      <h1>About</h1>\n    </div>\n  );\n};\n\nexport default AboutPage;\n` }
];

pages.forEach(p => {
  const filePath = path.join(srcDir, 'pages', p.name);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, p.content);
  }
});

// Layouts
const layouts = [
  { name: 'AuthLayout.jsx', content: `import { Outlet } from 'react-router-dom';\n\nconst AuthLayout = () => {\n  return (\n    <div>\n      <Outlet />\n    </div>\n  );\n};\n\nexport default AuthLayout;\n` },
  { name: 'DashboardLayout.jsx', content: `import { Outlet } from 'react-router-dom';\n\nconst DashboardLayout = () => {\n  return (\n    <div>\n      <Outlet />\n    </div>\n  );\n};\n\nexport default DashboardLayout;\n` }
];

layouts.forEach(l => {
  const filePath = path.join(srcDir, 'layouts', l.name);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, l.content);
  }
});

// Shared components (just empty files with basic scaffold)
const commonComponents = [
  'Button.jsx', 'Input.jsx', 'Card.jsx', 'Loader.jsx', 'EmptyState.jsx', 'ErrorState.jsx', 'PageHeader.jsx'
];

commonComponents.forEach(c => {
  const name = c.replace('.jsx', '');
  const content = `const ${name} = () => {\n  return (\n    <div>${name}</div>\n  );\n};\n\nexport default ${name};\n`;
  const filePath = path.join(srcDir, 'components', 'common', c);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
  }
});

// Services
const services = [
  { name: 'api.js', content: `import axios from 'axios';\n\nconst api = axios.create({\n  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',\n  headers: {\n    'Content-Type': 'application/json'\n  }\n});\n\nexport default api;\n` },
  { name: 'courseService.js', content: `import api from './api';\n\nexport const courseService = {\n  // methods here\n};\n` },
  { name: 'authService.js', content: `import api from './api';\n\nexport const authService = {\n  // methods here\n};\n` },
  { name: 'userService.js', content: `import api from './api';\n\nexport const userService = {\n  // methods here\n};\n` }
];

services.forEach(s => {
  const filePath = path.join(srcDir, 'services', s.name);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, s.content);
  }
});

// Constants
const constants = [
  { name: 'routes.js', content: `export const ROUTES = {\n  HOME: '/',\n  COURSES: '/courses',\n  COURSE_DETAIL: '/courses/:id',\n  LOGIN: '/login',\n  REGISTER: '/register',\n  DASHBOARD: '/dashboard',\n  PROFILE: '/profile',\n  MY_LEARNING: '/my-learning',\n  ABOUT: '/about'\n};\n` },
  { name: 'apiEndpoints.js', content: `export const API_ENDPOINTS = {\n  LOGIN: '/auth/login',\n  REGISTER: '/auth/register',\n  // add more as needed\n};\n` }
];

constants.forEach(c => {
  const filePath = path.join(srcDir, 'constants', c.name);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, c.content);
  }
});

// .env
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, `VITE_API_BASE_URL=http://localhost:5000/api\n`);
}

console.log('Setup complete');
