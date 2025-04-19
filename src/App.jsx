import { useEffect, useState } from 'react';

function App() {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState('general');
  const [darkMode, setDarkMode] = useState(false); // 다크모드 상태

  const fetchNews = () => {
    let url = 'https://news-app-server-cjp9.onrender.com/api/news';
    if (category) url += `?category=${category}`;

    fetch(url)
      .then(res => res.json())
      .then(data => setArticles(data.articles || []))
      .catch(err => console.error("뉴스 요청 실패:", err));
  };

  useEffect(() => {
    fetchNews();
  }, [category]);

  // 다크모드 클래스 토글
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="p-4 max-w-3xl mx-auto min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📰 US Realtime News</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-1 rounded bg-gray-800 text-white dark:bg-white dark:text-black transition"
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="mb-4 px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 dark:text-white"
      >
        <option value="general">General</option>
        <option value="business">Business</option>
        <option value="entertainment">Entertainment</option>
        <option value="health">Health</option>
        <option value="science">Science</option>
        <option value="sports">Sports</option>
        <option value="technology">Technology</option>
      </select>

      <ul className="space-y-4">
        {articles.map((article, idx) => (
          <li key={idx} className="flex gap-4 border-b border-gray-300 dark:border-gray-700 pb-4">
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt="thumbnail"
                className="w-24 h-24 object-cover rounded"
              />
            )}
            <div className="flex flex-col justify-between">
              <h2 className="text-lg font-semibold">{article.title}</h2>
              <p className="text-sm text-gray-700 dark:text-gray-300">{article.description}</p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 text-sm hover:underline mt-1"
              >
                Read More →
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;









