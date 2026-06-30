const routes = [
  'http://localhost:5173/',
  'http://localhost:5173/login',
  'http://localhost:5173/register',
  'http://localhost:5173/courses',
  'http://localhost:5173/courses/some-test-id',
];

for (const url of routes) {
  try {
    const res = await fetch(url);
    const text = await res.text();
    const hasRoot = text.includes('id="root"');
    console.log(`${url} -> ${res.status} | HTML has root: ${hasRoot} | Size: ${text.length}`);
  } catch (e) {
    console.log(`${url} -> ERROR: ${e.message}`);
  }
}
