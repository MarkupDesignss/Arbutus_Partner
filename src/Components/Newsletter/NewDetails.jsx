import React from 'react';
import { useParams, Link,   } from 'react-router-dom';
import { useGetBlogQuery } from '../../Redux/api/publicApiSlice';
import NewsHero from './NewsHero'; 
import AltFundSection from '../AltDatabase/AltFundSection';
import NewDetailsSkeleton from '../../Skeleton/Blogs/NewDetailsSkeleton';

export default function NewDetails() {
  const { slug } = useParams();
  const { data, error, isLoading } = useGetBlogQuery();
  const newsList = data?.data?.news ?? [];
  const educationList = data?.data?.education ?? [];

  const matched =
    newsList.find((i) => i.slug === slug) ||
    educationList.find((i) => i.slug === slug) ||
    newsList[0] || 
    null;

  const renderLongDescription = (long_description) => {
    if (!long_description) return null;
    return long_description
      .split(/\r?\n\r?\n/)
      .map((p, idx) => <p key={idx} className="mb-4">{p}</p>);
  };

  if (isLoading) {
    return (
      <>
        <NewsHero />
        <NewDetailsSkeleton/>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NewsHero />
        <NewDetailsSkeleton/>
      </>
    );
  }

  return (
    <>
      <NewsHero />
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <h1 className="text-2xl text-slate-900 tracking-tight roboto-bold">
                  {matched?.title ?? 'Article'}
                </h1>
                <p className="text-slate-600 text-xs">
                  {matched?.post_date ? `${matched.post_date} |` : ''}
                  {matched?.author_name ? ` by ${matched.author_name}` : ''}
                </p>
                <p className=" text-lg leading-relaxed roboto-regular">
                  {matched?.short_description ?? ''}
                </p>
              </div>

              {/* Hero Image */}
              {matched?.image && (
                <div className="rounded-2xl overflow-hidden ">
                  <img
                    src={matched.image}
                    alt={matched.title}
                    className="w-full h-[350px] object-cover"
                  />
                </div>
              )}

              {/* Table of Contents */}
              <div className="bg-white p-4">
                <h2 className="text-2xl roboto-bold mb-4">
                  What to expect in this article
                </h2>
                <ul className="space-y-2 roboto-regular">
                  <li className="flex items-center transition-colors cursor-pointer border-b border-slate-200 pb-2">
                    <span className="text-blue-500 mr-3 text-lg">▸</span>
                    The Problem With Cash
                  </li>
                  <li className="flex items-center transition-colors cursor-pointer border-b border-slate-200 pb-2">
                    <span className="text-blue-500 mr-3 text-lg">▸</span>
                    Mind The Gap
                  </li>
                  <li className="flex items-center transition-colors cursor-pointer border-b border-slate-200 pb-2">
                    <span className="text-blue-500 mr-3 text-lg">▸</span>
                    The Safety Myth
                  </li>
                  <li className="flex items-center transition-colors cursor-pointer border-b border-slate-200 pb-2">
                    <span className="text-blue-500 mr-3 text-lg">▸</span>
                    Risk-Reward
                  </li>
                </ul>
              </div>

              {/* Article Sections (using long_description) */}
              <div className="space-y-8">
                <section className="bg-white p-4">
                  <h2 className="text-2xl mb-6 roboto-bold">
                    {matched?.title ?? 'Article'}
                  </h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    {renderLongDescription(matched?.long_description)}
                  </div>
                </section>

                {/* Example second section: you can expand or map sections */}
                <section className="bg-white p-4">
                  <h2 className="text-2xl mb-6 roboto-bold">
                    Additional context
                  </h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      {matched?.short_description ?? 'No short description available.'}
                    </p>
                  </div>
                </section>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Latest articles (news) */}
              <div className="bg-white p-6">
                <h3 className="text-xl mb-4 relative pb-2 roboto-bold">
                  Latest News
                  <span className="absolute left-0 bottom-0 h-1 w-12 bg-blue-500 rounded"></span>
                  <span className="absolute left-0 bottom-0 h-0.5 w-full bg-gray-200"></span>
                </h3>

                <div className="space-y-4">
                  {newsList.map((item) => (
                    <Link
                      to={`/NewDetails/${item.slug}`}
                      key={item.id}
                      className="flex items-center gap-4 group cursor-pointer"
                    >
                      <div className="w-25 h-25 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                        <img
                          src={item.image || `https://picsum.photos/seed/${item.id}/200/200`}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <p className="text-lg roboto-regular text-slate-900">
                          {item.title}
                        </p>
                      
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Popular News (education) */}
              <div className="bg-white p-6">
                <h3 className="text-xl mb-4 relative pb-2 roboto-bold">
                  Education 
                  <span className="absolute left-0 bottom-0 h-1 w-12 bg-blue-500 rounded"></span>
                  <span className="absolute left-0 bottom-0 h-0.5 w-full bg-gray-200"></span>
                </h3>

                <div className="space-y-4">
                  {educationList.map((item) => (
                    <Link
                      to={`/NewDetails/${item.slug}`}
                      key={item.id}
                      className="flex items-center gap-4 group cursor-pointer"
                    >
                      <div className="w-25 h-25 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                        <img
                          src={item.image || `https://picsum.photos/seed/edu-${item.id}/200/200`}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <p className="text-lg roboto-regular text-slate-900">
                          {item.title}
                        </p>
                       
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AltFundSection />
    </>
  );
}
