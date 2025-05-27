import { fetchDevNews } from '@/libs/api/fetchDevNews';

const DevNews = async () => {
  try {
    const articles = await fetchDevNews();

    return (
      <div className="rounded-xl h-full w-full">
        <h2>개발 관련 소식</h2>
        <div className="space-y-4 overflow-y-auto flex-1 mt-4 max-h-[330px]">
          {articles.map(({ title, description, tag_list }) => (
            <article key={title} className="border-b pb-2">
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-gray-500">{description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {tag_list.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-purple-100 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    return <p className="text-red-500">Failed to load</p>;
  }
};

export default DevNews;
