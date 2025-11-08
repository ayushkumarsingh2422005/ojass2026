'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { eventAPI, authAPI, Event, CreateEventData } from '@/lib/api';
import EventForm from '@/components/EventForm';

const fakeStudents = [
  { id: 1, name: 'John Doe', email: 'john@example.com', college: 'MIT', registeredAt: '2024-01-15', events: 3, ojassId: 'OJASS001', paymentStatus: 'paid' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', college: 'Stanford', registeredAt: '2024-01-20', events: 2, ojassId: 'OJASS002', paymentStatus: 'paid' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', college: 'Harvard', registeredAt: '2024-02-01', events: 1, ojassId: 'OJASS003', paymentStatus: 'unpaid' },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com', college: 'Caltech', registeredAt: '2024-02-05', events: 4, ojassId: 'OJASS004', paymentStatus: 'paid' },
  { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', college: 'MIT', registeredAt: '2024-02-10', events: 2, ojassId: 'OJASS005', paymentStatus: 'unpaid' },
];

const fakeAmbassadors = [
  { id: 1, name: 'Sarah Connor', email: 'sarah@example.com', referrals: 25, paid: 15, unpaid: 10, status: 'Active' },
  { id: 2, name: 'Mike Tyson', email: 'mike@example.com', referrals: 18, paid: 18, unpaid: 0, status: 'Active' },
  { id: 3, name: 'Emma Watson', email: 'emma@example.com', referrals: 32, paid: 20, unpaid: 12, status: 'Active' },
  { id: 4, name: 'Tom Cruise', email: 'tom@example.com', referrals: 14, paid: 8, unpaid: 6, status: 'Inactive' },
  { id: 5, name: 'Lisa Park', email: 'lisa@example.com', referrals: 41, paid: 35, unpaid: 6, status: 'Active' },
];

const fakeTeams = [
  { id: 1, name: 'Team Alpha', eventId: 1, eventName: 'Tech Fest 2024', members: 4, leader: 'John Doe', registeredAt: '2024-01-15', ojassId: 'TEAM001', studentIds: [1, 2] },
  { id: 2, name: 'Team Beta', eventId: 1, eventName: 'Tech Fest 2024', members: 3, leader: 'Jane Smith', registeredAt: '2024-01-18', ojassId: 'TEAM002', studentIds: [2, 3] },
  { id: 3, name: 'Team Gamma', eventId: 2, eventName: 'Hackathon', members: 5, leader: 'Bob Johnson', registeredAt: '2024-02-01', ojassId: 'TEAM003', studentIds: [3, 4] },
  { id: 4, name: 'Team Delta', eventId: 2, eventName: 'Hackathon', members: 4, leader: 'Alice Williams', registeredAt: '2024-02-05', ojassId: 'TEAM004', studentIds: [4, 5] },
  { id: 5, name: 'Team Echo', eventId: 3, eventName: 'Workshop Series', members: 2, leader: 'Charlie Brown', registeredAt: '2024-02-10', ojassId: 'TEAM005', studentIds: [1, 5] },
  { id: 6, name: 'Team Zeta', eventId: 3, eventName: 'Workshop Series', members: 3, leader: 'Sarah Connor', registeredAt: '2024-02-12', ojassId: 'TEAM006', studentIds: [2, 3, 4] },
  { id: 7, name: 'Team Eta', eventId: 4, eventName: 'Coding Competition', members: 4, leader: 'Mike Tyson', registeredAt: '2024-01-20', ojassId: 'TEAM007', studentIds: [1, 3, 4, 5] },
];

export default function Dashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<'events' | 'students' | 'ambassadors' | 'team'>('events');
  const [events, setEvents] = useState<Event[]>([]);
  const [eventSearch, setEventSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [teamEventFilter, setTeamEventFilter] = useState<string | 'all'>('all');
  const [selectedEventParticipants, setSelectedEventParticipants] = useState<string | null>(null);
  const [selectedAmbassadorReferrals, setSelectedAmbassadorReferrals] = useState<number | null>(null);
  const [selectedStudentDetails, setSelectedStudentDetails] = useState<number | null>(null);
  const [selectedTeamDetails, setSelectedTeamDetails] = useState<number | null>(null);

  // Set mounted state after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load events on mount
  useEffect(() => {
    if (mounted) {
      loadEvents();
    }
  }, [mounted]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await eventAPI.getAll();
      setEvents(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load events');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      router.push('/');
    }
  };

  const handleOpenAddEvent = () => {
    setEditingEvent(null);
    setShowAddEventModal(true);
  };

  const handleCloseAddEvent = () => {
    setShowAddEventModal(false);
    setEditingEvent(null);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowAddEventModal(true);
  };

  const handleSubmitEvent = async (eventData: CreateEventData) => {
    try {
      setSubmitting(true);
      setError('');
      if (editingEvent) {
        await eventAPI.update(editingEvent._id, eventData);
      } else {
        await eventAPI.create(eventData);
      }
      await loadEvents();
      handleCloseAddEvent();
    } catch (err: any) {
      setError(err.message || 'Failed to save event');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      setError('');
      await eventAPI.delete(eventId);
      await loadEvents();
    } catch (err: any) {
      setError(err.message || 'Failed to delete event');
      alert(err.message || 'Failed to delete event');
    }
  };

  const handleViewEvent = (event: Event) => {
    setViewingEvent(event);
  };

  const handleCloseViewEvent = () => {
    setViewingEvent(null);
  };

  const getEventParticipants = (eventId: string): Array<{ student: typeof fakeStudents[0], teamName: string, teamOjassId: string }> => {
    // TODO: Fetch real participants from API
    // For now, return empty array with proper type
    return [] as Array<{ student: typeof fakeStudents[0], teamName: string, teamOjassId: string }>;
  };

  const getAmbassadorReferrals = (ambassadorId: number) => {
    // Fake referral data - in real app this would come from backend
    return fakeStudents.slice(0, 3).map(student => ({
      ...student,
      referralDate: '2024-01-15',
      paymentStatus: Math.random() > 0.5 ? 'paid' : 'unpaid'
    }));
  };

  const getTeamMembers = (teamId: number) => {
    const team = fakeTeams.find(t => t.id === teamId);
    if (!team || !team.studentIds) return [];
    
    return team.studentIds.map(studentId => {
      const student = fakeStudents.find(s => s.id === studentId);
      return student;
    }).filter(Boolean);
  };

  const filteredEvents = events.filter((event) => {
    if (!event || !event.name) return false;
    
    // If search is empty, show all events
    const searchTerm = eventSearch || '';
    if (searchTerm.trim() === '') {
      return true;
    }
    
    const searchLower = searchTerm.toLowerCase().trim();
    return (event.name?.toLowerCase().includes(searchLower) ?? false) ||
           (event._id?.toLowerCase().includes(searchLower) ?? false) ||
           (event.description?.toLowerCase().includes(searchLower) ?? false);
  });

  const filteredStudents = fakeStudents.filter((student) => {
    const searchTerm = studentSearch || '';
    if (searchTerm.trim() === '') {
      // If no search term, only filter by payment status
      return paymentFilter === 'all' || student.paymentStatus === paymentFilter;
    }
    
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = student.name.toLowerCase().includes(searchLower) ||
      student.ojassId.toLowerCase().includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower);
    
    const matchesPayment = paymentFilter === 'all' ||
      student.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesPayment;
  });

  const filteredTeams = teamEventFilter === 'all' 
    ? fakeTeams 
    : fakeTeams.filter(team => {
        // Since we're using fake data, we can't match with real event IDs
        // This is a placeholder until we integrate real team data
        return true;
      });

  // Prevent hydration mismatch by not rendering event-dependent content until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Header */}
        <header className="bg-white shadow-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                OJASS Admin Dashboard
              </h1>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center py-12">
              <p className="text-gray-500">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              OJASS Admin Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-white rounded-lg shadow-md p-2 mb-6">
          <div className="flex space-x-2">
            {[
              { key: 'events', label: 'Events' },
              { key: 'students', label: 'Students' },
              { key: 'ambassadors', label: 'Ambassadors' },
              { key: 'team', label: 'Team' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveSection(tab.key as any)}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeSection === tab.key
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Events Section */}
          {activeSection === 'events' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Events</h2>
                <button
                  onClick={handleOpenAddEvent}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                >
                  + Add Event
                </button>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              {/* Search Bar */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search by name, ID, or description..."
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading events...</p>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No events found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredEvents.map((event) => (
                    <div key={event._id} className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow relative">
                      {event.img && (
                        <img src={event.img} alt={event.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                      )}
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-semibold text-gray-800">{event.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          event.isTeamEvent ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {event.isTeamEvent ? 'Team' : 'Individual'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2"><strong>Team Size:</strong> {event.teamSizeMin}-{event.teamSizeMax}</p>
                      {event.organizer && (
                        <p className="text-gray-600 mb-2"><strong>Organizer:</strong> {event.organizer}</p>
                      )}
                      {event.description && (
                        <p className="text-gray-600 mb-4 text-sm line-clamp-2"><strong>Description:</strong> {event.description}</p>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2 mb-2">
                        <button
                          onClick={() => handleViewEvent(event)}
                          className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="flex-1 px-3 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event._id)}
                          className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Participants Modal */}
              {selectedEventParticipants && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedEventParticipants(null)}>
                  <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-2xl font-bold text-gray-800">
                        Participants - {events.find(e => e._id === selectedEventParticipants)?.name}
                      </h3>
                      <button
                        onClick={() => setSelectedEventParticipants(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team OJASS ID</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {getEventParticipants(selectedEventParticipants).map((participant, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{participant.student.name}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{participant.teamName}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{participant.teamOjassId}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* View Event Modal */}
              {viewingEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleCloseViewEvent}>
                  <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-800">Event Details</h3>
                      <button
                        onClick={handleCloseViewEvent}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-6">
                      {/* Event Image */}
                      {viewingEvent.img && (
                        <div>
                          <img 
                            src={viewingEvent.img} 
                            alt={viewingEvent.name} 
                            className="w-full h-64 object-cover rounded-lg"
                          />
                        </div>
                      )}

                      {/* Basic Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                          <p className="text-gray-900 font-semibold">{viewingEvent.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            viewingEvent.isTeamEvent ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                          }`}>
                            {viewingEvent.isTeamEvent ? 'Team Event' : 'Individual Event'}
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
                          <p className="text-gray-900">{viewingEvent.teamSizeMin} - {viewingEvent.teamSizeMax} {viewingEvent.isTeamEvent ? 'members' : 'participant'}</p>
                        </div>
                        {viewingEvent.organizer && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Organizer</label>
                            <p className="text-gray-900">{viewingEvent.organizer}</p>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <p className="text-gray-900 whitespace-pre-wrap">{viewingEvent.description}</p>
                      </div>

                      {/* Prizes */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Prizes</label>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Prize:</span>
                            <span className="text-gray-900 font-semibold">{viewingEvent.prizes?.total || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Winner:</span>
                            <span className="text-gray-900 font-semibold">{viewingEvent.prizes?.winner || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">First Runner-up:</span>
                            <span className="text-gray-900 font-semibold">{viewingEvent.prizes?.first_runner_up || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Second Runner-up:</span>
                            <span className="text-gray-900 font-semibold">{viewingEvent.prizes?.second_runner_up || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Event Details */}
                      {viewingEvent.details && viewingEvent.details.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Event Details</label>
                          <ul className="list-disc list-inside space-y-1 bg-gray-50 rounded-lg p-4">
                            {viewingEvent.details.map((detail, index) => (
                              <li key={index} className="text-gray-900">{detail}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Rules */}
                      {viewingEvent.rules && viewingEvent.rules.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Rules</label>
                          <ul className="list-disc list-inside space-y-1 bg-gray-50 rounded-lg p-4">
                            {viewingEvent.rules.map((rule, index) => (
                              <li key={index} className="text-gray-900">{rule}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Event Head */}
                      {viewingEvent.event_head && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Event Head</label>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-900"><strong>Name:</strong> {viewingEvent.event_head.name}</p>
                            <p className="text-gray-900"><strong>Phone:</strong> {viewingEvent.event_head.Phone}</p>
                          </div>
                        </div>
                      )}

                      {/* Links */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {viewingEvent.rulebookurl && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rulebook URL</label>
                            <a 
                              href={viewingEvent.rulebookurl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline break-all"
                            >
                              {viewingEvent.rulebookurl}
                            </a>
                          </div>
                        )}
                        {viewingEvent.redirect && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Redirect Path</label>
                            <p className="text-gray-900 break-all">{viewingEvent.redirect}</p>
                          </div>
                        )}
                      </div>

                      {/* Winners */}
                      {viewingEvent.winners && viewingEvent.winners.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Winners</label>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-600 text-sm">{viewingEvent.winners.length} winner(s) declared</p>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                          onClick={handleCloseViewEvent}
                          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Close
                        </button>
                        <button
                          onClick={() => {
                            setViewingEvent(null);
                            setEditingEvent(viewingEvent);
                            setShowAddEventModal(true);
                          }}
                          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                        >
                          Edit Event
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Add/Edit Event Modal */}
              {showAddEventModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleCloseAddEvent}>
                  <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-800">
                        {editingEvent ? 'Edit Event' : 'Add New Event'}
                      </h3>
                      <button
                        onClick={handleCloseAddEvent}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <EventForm
                      event={editingEvent || undefined}
                      onSubmit={handleSubmitEvent}
                      onCancel={handleCloseAddEvent}
                      loading={submitting}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Students Section */}
          {activeSection === 'students' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Students</h2>
              
              {/* Search Bar and Filter */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <input
                    type="text"
                    placeholder="Search by name, OJASS ID, or email..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Status
                  </label>
                  <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value as 'all' | 'paid' | 'unpaid')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All</option>
                    <option value="paid">With Payment</option>
                    <option value="unpaid">Without Payment</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">OJASS ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">College</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Events</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.id}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.ojassId}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{student.email}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{student.college}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              student.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {student.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{student.registeredAt}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{student.events}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            <button
                              onClick={() => setSelectedStudentDetails(student.id)}
                              className="text-indigo-600 hover:text-indigo-800 transition-colors"
                              title="View Details"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-500">
                          No students found matching your search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Student Details Modal */}
              {selectedStudentDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedStudentDetails(null)}>
                  <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-2xl font-bold text-gray-800">
                        Student Details
                      </h3>
                      <button
                        onClick={() => setSelectedStudentDetails(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {(() => {
                      const student = fakeStudents.find(s => s.id === selectedStudentDetails);
                      if (!student) return null;
                      return (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-500">Student ID</label>
                              <p className="text-lg font-semibold text-gray-900">{student.id}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">OJASS ID</label>
                              <p className="text-lg font-semibold text-gray-900">{student.ojassId}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Name</label>
                              <p className="text-lg font-semibold text-gray-900">{student.name}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Email</label>
                              <p className="text-lg text-gray-900">{student.email}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">College</label>
                              <p className="text-lg text-gray-900">{student.college}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Payment Status</label>
                              <p className="text-lg">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  student.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  {student.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                                </span>
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Registration Date</label>
                              <p className="text-lg text-gray-900">{student.registeredAt}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Events Registered</label>
                              <p className="text-lg font-semibold text-gray-900">{student.events}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Ambassadors Section */}
          {activeSection === 'ambassadors' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Ambassadors</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fakeAmbassadors.map((ambassador) => (
                  <div key={ambassador.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">{ambassador.name}</h3>
                    </div>
                    <p className="text-gray-600 mb-2 text-sm">{ambassador.email}</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Referrals:</span>
                        <span className="font-semibold">{ambassador.referrals}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-600">Paid:</span>
                        <span className="font-semibold text-green-600">{ambassador.paid}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-red-600">Unpaid:</span>
                        <span className="font-semibold text-red-600">{ambassador.unpaid}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedAmbassadorReferrals(ambassador.id)}
                      className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all"
                    >
                      View Referral Details
                    </button>
                  </div>
                ))}
              </div>

              {/* Referral Details Modal */}
              {selectedAmbassadorReferrals && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedAmbassadorReferrals(null)}>
                  <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-2xl font-bold text-gray-800">
                        Referral Details - {fakeAmbassadors.find(a => a.id === selectedAmbassadorReferrals)?.name}
                      </h3>
                      <button
                        onClick={() => setSelectedAmbassadorReferrals(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">OJASS ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">College</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referral Date</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {getAmbassadorReferrals(selectedAmbassadorReferrals).map((referral, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{referral.name}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{referral.ojassId}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{referral.email}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{referral.college}</td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  referral.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  {referral.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{referral.referralDate}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Team Section */}
          {activeSection === 'team' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Teams</h2>
                  <select
                    value={teamEventFilter}
                    onChange={(e) => setTeamEventFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Events</option>
                    {events.map((event) => (
                      <option key={event._id} value={event._id}>{event.name}</option>
                    ))}
                  </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leader</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Members</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTeams.map((team) => (
                      <tr key={team.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{team.name}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{team.eventName}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{team.leader}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{team.members}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{team.registeredAt}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                          <button
                            onClick={() => setSelectedTeamDetails(team.id)}
                            className="text-indigo-600 hover:text-indigo-800 transition-colors"
                            title="View Details"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Team Details Modal */}
              {selectedTeamDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedTeamDetails(null)}>
                  <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-2xl font-bold text-gray-800">
                        Team Details
                      </h3>
                      <button
                        onClick={() => setSelectedTeamDetails(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {(() => {
                      const team = fakeTeams.find(t => t.id === selectedTeamDetails);
                      if (!team) return null;
                      const members = getTeamMembers(team.id);
                      return (
                        <div className="space-y-6">
                          {/* Team Information */}
                          <div className="grid grid-cols-2 gap-4 pb-4 border-b">
                            <div>
                              <label className="text-sm font-medium text-gray-500">Team Name</label>
                              <p className="text-lg font-semibold text-gray-900">{team.name}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Team OJASS ID</label>
                              <p className="text-lg font-semibold text-gray-900">{team.ojassId}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Event</label>
                              <p className="text-lg text-gray-900">{team.eventName}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Team Leader</label>
                              <p className="text-lg text-gray-900">{team.leader}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Total Members</label>
                              <p className="text-lg font-semibold text-gray-900">{team.members}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Registration Date</label>
                              <p className="text-lg text-gray-900">{team.registeredAt}</p>
                            </div>
                          </div>

                          {/* Team Members */}
                          <div>
                            <h4 className="text-xl font-semibold text-gray-800 mb-4">Team Members</h4>
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">OJASS ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">College</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Status</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {members.length > 0 ? (
                                    members.map((member) => (
                                      member && (
                                        <tr key={member.id} className="hover:bg-gray-50">
                                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{member.id}</td>
                                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{member.ojassId}</td>
                                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{member.email}</td>
                                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{member.college}</td>
                                          <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                              member.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                              {member.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                                            </span>
                                          </td>
                                        </tr>
                                      )
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                                        No members found.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
