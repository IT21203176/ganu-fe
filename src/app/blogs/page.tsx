import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getBlogs, Blog } from "@/api/api";
import BlogCard from "@/components/BlogCard";

// Fetch Blogs
async function getBlogsData(): Promise<Blog[]> {
  try {
    const blogs = await getBlogs();
    return blogs || [];
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export default async function BlogsPage() {
  const blogs = await getBlogsData();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-midnightBlue via-navyBlue to-black">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Insights & Articles
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover expert insights, industry trends, and professional advice from our team of specialists.
          </p>
        </div>
      </section>

      {/* Blogs Grid Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {blogs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Articles Published</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We are working on new content. Check back soon for insightful articles and industry updates.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-midnightBlue mb-4">
                  Latest Articles
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Stay updated with the latest trends and insights in HR, Finance, and Corporate Governance.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog, index) => {
                  // ✅ Generate a safe unique key even if blog.id is missing
                  const uniqueKey = blog.id
                    ? `blog-${blog.id}`
                    : `blog-${index}-${blog.title?.slice(0, 20).replace(/\s+/g, "-")}`;

                  return <BlogCard key={uniqueKey} blog={blog} />;
                })}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}