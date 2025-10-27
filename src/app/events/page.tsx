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
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Events Scheduled</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                We are currently planning our next events. Please check back later for updates on upcoming workshops and networking opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-desertSun hover:bg-burntOrange text-white px-6 py-3 rounded-lg transition-colors font-semibold">
                  Get Notified
                </button>
                <button className="border-2 border-midnightBlue text-midnightBlue hover:bg-midnightBlue hover:text-white px-6 py-3 rounded-lg transition-colors font-semibold">
                  Contact Us
                </button>
              </div>
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
                {events.map((event, index) => {
                  try {
                    // Create a safe event ID with fallbacks
                    const eventId = event._id || event.id || `event-${index}`;
                    return <EventCard key={`${eventId}-${index}`} event={event} />;
                  } catch (err) {
                    console.error("⚠️ Failed to render event:", event, err);
                    return null;
                  }
                }).filter(Boolean) // Remove any null entries from failed renders
                }
              </div>

              {/* Past Events Section */}
              <div className="mt-20">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-midnightBlue mb-4">
                    Past Events
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Take a look at some of our previous successful events and workshops.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {events
                    .filter(event => {
                      try {
                        return new Date(event.date) < new Date();
                      } catch (err) {
                        console.error("⚠️ Invalid event date:", event.date, err);
                        return false;
                      }
                    })
                    .map((event, index) => {
                      try {
                        const eventId = event._id || event.id || `past-event-${index}`;
                        return <EventCard key={`${eventId}-${index}`} event={event} isPast={true} />;
                      } catch (err) {
                        console.error("⚠️ Failed to render past event:", event, err);
                        return null;
                      }
                    }).filter(Boolean) // Remove any null entries
                  }
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navyBlue">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Want to Host an Event With Us?
          </h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Partner with us to create meaningful events that drive professional growth and community engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-burntOrange hover:bg-opacity-90 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
              Partner With Us
            </button>
            <button className="bg-transparent hover:bg-white/10 border-2 border-white text-white font-semibold py-3 px-8 rounded-lg transition-colo">
              Contact Our Team
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Event Card Component
function EventCard({ event, isPast = false }: { event: Event; isPast?: boolean }) {
  // Add error boundary for individual event cards
  try {
    const eventDate = new Date(event.date);
    const isUpcoming = eventDate > new Date();
    
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 group">
        {/* Event Image */}
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          {event.imageUrl ? (
            <img 
              src={event.imageUrl} 
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // Fallback if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-midnightBlue to-navyBlue flex items-center justify-center">
              <svg className="w-12 h-12 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Status Badge */}
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${
            isPast 
              ? 'bg-gray-500 text-white' 
              : isUpcoming 
              ? 'bg-desertSun text-white' 
              : 'bg-burntOrange text-white'
          }`}>
            {isPast ? 'Past Event' : isUpcoming ? 'Upcoming' : 'Today'}
          </div>
          
          {/* Date Overlay */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-center min-w-16">
            <div className="text-midnightBlue font-bold text-lg leading-none">
              {eventDate.getDate()}
            </div>
            <div className="text-gray-600 text-xs font-medium uppercase">
              {eventDate.toLocaleDateString('en-US', { month: 'short' })}
            </div>
          </div>
        </div>

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
  } catch (error) {
    console.error("❌ EventCard rendering failed for event:", event, error);
    
    // Fallback UI for failed event cards
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-red-200 p-6">
        <div className="text-center text-gray-500">
          <svg className="w-12 h-12 text-red-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Event Not Available</h3>
          <p className="text-sm text-gray-500">This event could not be displayed.</p>
        </div>
      </div>
    );
  }
}