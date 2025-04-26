import { useEffect, useState, useRef } from 'react';

function App() {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState('general');
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1); // 🔥 페이지 추가
  const [loading, setLoading] = useState(false); // 🔥 로딩 상태
  const loader = useRef(null); // 🔥 관찰할 div

  const fetchNews = async () => {
    setLoading(true);
    let url = `https://news-app-server-cjp9.onrender.com/api/news?category=${category}&page=${page}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (page === 1) {
        setArticles(data.articles || []);
      } else {
        setArticles(prev => [...prev, ...(data.articles || [])]);
      }
    } catch (err) {
      console.error("뉴스 요청 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [category, page]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // 무한스크롤 (IntersectionObserver)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1 }
    );
    if (loader.current) observer.observe(loader.current);

    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [loading]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1); // 카테고리 바꿀 때 1페이지로
  };

  // 🔥 검색어로 필터링
  const filteredArticles = articles.filter(article =>
    article.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <div className="flex flex-col gap-4 mb-4">
        <select
          value={category}
          onChange={handleCategoryChange}
          className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 dark:text-white text-sm"
        >
          <option value="general">General</option>
          <option value="business">Business</option>
          <option value="entertainment">Entertainment</option>
          <option value="health">Health</option>
          <option value="science">Science</option>
          <option value="sports">Sports</option>
          <option value="technology">Technology</option>
        </select>

        <input
          type="text"
          placeholder="Search news..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-2 py-1 rounded border bg-gray-50 dark:bg-gray-800 dark:text-white"
        />
      </div>

      <ul className="space-y-4">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article, idx) => (
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
          ))
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </ul>

      {/* 👇 로딩 감시용 div */}
      <div ref={loader} className="h-10"></div>

      {/* 로딩 표시 */}
      {loading && <p className="text-center my-4">Loading...</p>}
    </div>
  );
}

export default App;











