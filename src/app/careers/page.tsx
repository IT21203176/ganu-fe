import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCareers, Career, getCareerId } from "@/api/api";
import CareerCard from "@/components/CareerCard";

async function getCareersData(): Promise<Career[]> {
  try {
    const careers = await getCareers();
    // Filter only published careers for public view
    return careers.filter(career => career.published) || [];
  } catch (error) {
    console.error("Error fetching careers:", error);
    return [];
  }
}

export default async function CareersPage() {
  const careers = await getCareersData();

  // Filter out expired careers
  const currentCareers = careers.filter(career => {
    return new Date(career.applicationDeadline) >= new Date();
  });

  const expiredCareers = careers.filter(career => {
    return new Date(career.applicationDeadline) < new Date();
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-midnightBlue via-navyBlue to-black">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Join Our Team
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Build your career with GANU Professional Services and be part of a
            team that values excellence and innovation.
          </p>
        </div>
      </section>

      {/* Current Openings Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {currentCareers.length === 0 ? (
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
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No Current Openings
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                We do not have any open positions at the moment, but we are always looking for talented individuals. 
                Check back later for new opportunities or send us your resume for future consideration.
              </p>
              <button className="bg-desertSun hover:bg-burntOrange text-white px-6 py-3 rounded-lg transition-colors font-semibold">
                Submit Resume
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-midnightBlue mb-4">
                  Current Openings
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Explore exciting career opportunities and join our dynamic
                  team of professionals.
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  {currentCareers.length} position{currentCareers.length !== 1 ? 's' : ''} available
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {currentCareers.map((career, index) => (
                  <CareerCard
                    key={career.id || `career-${index}`}
                    career={career}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Expired Careers Section (Hidden from public) */}
      {expiredCareers.length > 0 && process.env.NODE_ENV === 'development' && (
        <section className="py-10 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-500 mb-2">
                Expired Positions (Development Only)
              </h3>
              <p className="text-gray-400 text-sm">
                These positions are no longer accepting applications
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-60">
              {expiredCareers.map((career, index) => (
                <div
                  key={`expired-${career.id || index}`}
                  className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-semibold text-gray-400">{career.title}</h4>
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                      Expired
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mb-2">
                    {career.location} • {career.type}
                  </div>
                  <div className="text-xs text-gray-400">
                    Deadline: {new Date(career.applicationDeadline).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Join Us Section */}
      <section className="py-20 bg-navyBlue">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Join GANU?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <WhyJoinItem
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              }
              title="Professional Growth"
              text="Continuous learning opportunities and career advancement paths."
              bg="bg-burntOrange"
            />
            <WhyJoinItem
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              }
              title="Great Team"
              text="Work with experienced professionals in a collaborative environment."
              bg="bg-burntOrange"
            />
            <WhyJoinItem
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              }
              title="Competitive Benefits"
              text="Attractive compensation packages and comprehensive benefits."
              bg="bg-burntOrange"
            />
          </div>
        </div>
      </section>

      {/* Application Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-midnightBlue mb-4">
              Application Process
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple and straightforward process to join our team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <ProcessStep
              number="1"
              title="Apply Online"
              description="Submit your application through our careers portal"
            />
            <ProcessStep
              number="2"
              title="Screening"
              description="Our team reviews your application and qualifications"
            />
            <ProcessStep
              number="3"
              title="Interviews"
              description="Participate in interviews with our team members"
            />
            <ProcessStep
              number="4"
              title="Offer"
              description="Receive and review your employment offer"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Reusable "Why Join Us" Item
function WhyJoinItem({
  icon,
  title,
  text,
  bg,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  bg: string;
}) {
  return (
    <div className="text-center p-6">
      <div
        className={`w-16 h-16 ${bg} rounded-full flex items-center justify-center mx-auto mb-4`}
      >
        <svg className="w-8 h-8 text-midnightBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icon}
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{text}</p>
    </div>
  );
}

// Reusable Process Step Component
function ProcessStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-desertSun rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-white font-bold text-lg">{number}</span>
      </div>
      <h3 className="text-lg font-semibold text-midnightBlue mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}