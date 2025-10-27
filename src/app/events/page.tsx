import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CORSTest from "@/components/CORSTest";
import { getEvents, Event, debugEvents } from "@/api/api";

async function getEventsData(): Promise<Event[]> {
  try {
    console.log('🔄 Fetching events data...');
    
    const events = await getEvents();
    console.log(`✅ Successfully fetched ${events.length} events`);
    return events || [];
  } catch (error) {
    console.error('❌ Error fetching events:', error);
    return [];
  }
}

export default async function EventsPage() {
  const events = await getEventsData();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* CORS Test Banner - Remove after fixing */}
      <div className="fixed top-20 left-0 right-0 bg-yellow-500 text-black text-center py-2 text-sm z-50">
        CORS Debug: Loaded {events.length} events | {new Date().toLocaleTimeString()}
      </div>
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-midnightBlue via-navyBlue to-black">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Events & Workshops
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join us for exciting events, workshops, and networking opportunities designed to help you grow professionally.
          </p>
        </div>
      </section>

      {/* CORS Test Section - Remove after fixing */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <CORSTest />
        </div>
      </section>

      {/* Rest of your events page content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {events.length === 0 ? (
            <div className="text-center py-16">
              {/* Your existing no events content */}
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-midnightBlue mb-4">
                  Upcoming Events
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Discover our curated events designed to provide valuable insights and networking opportunities.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => (
                  <EventCard key={event.id || event._id} event={event} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Event Card Component
function EventCard({ event, isPast = false }: { event: Event; isPast?: boolean }) {
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();
  
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 group">
      {/* Event Image */}
      

      {/* Event Content */}
      <div className="p-6">
        

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {!isPast && isUpcoming && (
            <button className="flex-1 bg-desertSun hover:bg-burntOrange text-white py-2 px-4 rounded-lg transition-colors font-semibold text-sm text-center">
              Register Now
            </button>
          )}
          
          <button className="flex-1 border-2 border-midnightBlue text-midnightBlue hover:bg-midnightBlue hover:text-white py-2 px-4 rounded-lg transition-colors font-semibold text-sm text-center">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}