import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getEvents, Event } from "@/api/api";

async function getEventsData(): Promise<Event[]> {
  try {
    const events = await getEvents();
    return events || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export default async function EventsPage() {
  const events = await getEventsData();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-midnightBlue via-navyBlue to-black">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            News & Events
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join us for exciting events, news, and networking opportunities designed to help you grow professionally.
          </p>
        </div>
      </section>

      {/* Events Grid Section */}
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
                  News & Events
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Stay informed with our latest updates, announcements, and industry insights.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => (
                  <EventCard key={event.id || event._id} event={event} />
                ))}
              </div>

              {/* Past Events Section (Optional) */}
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
                    .filter(event => new Date(event.date) < new Date())
                    .map((event) => (
                      <EventCard key={event.id || event._id} event={event} isPast={true} />
                    ))
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
        <h3 className="text-xl font-bold text-midnightBlue mb-3 group-hover:text-desertSun transition-colors line-clamp-2">
          {event.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {event.location}
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {eventDate.toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          
          <button className="flex-1 border-2 border-midnightBlue text-midnightBlue hover:bg-midnightBlue hover:text-white py-2 px-4 rounded-lg transition-colors font-semibold text-sm text-center">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}