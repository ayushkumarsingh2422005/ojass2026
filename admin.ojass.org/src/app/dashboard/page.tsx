'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Fake data
const initialEvents = [
  { id: 1, name: 'Tech Fest 2024', date: '2024-03-15', participants: 150, status: 'Active', description: 'A comprehensive technology festival showcasing the latest innovations in tech industry.' },
  { id: 2, name: 'Hackathon', date: '2024-04-20', participants: 89, status: 'Active', description: '48-hour coding competition where teams build innovative solutions to real-world problems.' },
  { id: 3, name: 'Workshop Series', date: '2024-05-10', participants: 234, status: 'Upcoming', description: 'Series of hands-on workshops covering various topics in software development and emerging technologies.' },
  { id: 4, name: 'Coding Competition', date: '2024-03-01', participants: 67, status: 'Completed', description: 'Competitive programming contest challenging participants with algorithmic problems.' },
];

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
  const [teamEventFilter, setTeamEventFilter] = useState<number | 'all'>('all');
  const [events, setEvents] = useState(initialEvents);
  const [eventSearch, setEventSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [selectedEventParticipants, setSelectedEventParticipants] = useState<number | null>(null);
  const [selectedAmbassadorReferrals, setSelectedAmbassadorReferrals] = useState<number | null>(null);
  const [selectedStudentDetails, setSelectedStudentDetails] = useState<number | null>(null);
  const [selectedTeamDetails, setSelectedTeamDetails] = useState<number | null>(null);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    date: '',
    description: '',
    status: 'Upcoming' as 'Active' | 'Upcoming' | 'Completed',
    participants: 0,
  });

  const handleLogout = () => {
    router.push('/');
  };

  const handleOpenAddEvent = () => {
    setShowAddEventModal(true);
    setNewEvent({
      name: '',
      date: '',
      description: '',
      status: 'Upcoming',
      participants: 0,
    });
  };

  const handleCloseAddEvent = () => {
    setShowAddEventModal(false);
    setNewEvent({
      name: '',
      date: '',
      description: '',
      status: 'Upcoming',
      participants: 0,
    });
  };

  const handleSubmitEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = Math.max(...events.map(e => e.id), 0) + 1;
    const eventToAdd = {
      id: newId,
      ...newEvent,
    };
    setEvents([...events, eventToAdd]);
    handleCloseAddEvent();
  };

  const handleDeleteEvent = (eventId: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event.id !== eventId));
    }
  };

  const handleViewEvent = (eventId: number) => {
    alert(`View event ${eventId} - This would show event details`);
  };

  const handleEditEvent = (eventId: number) => {
    alert(`Edit event ${eventId} - This would open edit form`);
  };

  const getEventParticipants = (eventId: number) => {
    const teams = fakeTeams.filter(team => team.eventId === eventId);
    const participants: Array<{ student: typeof fakeStudents[0], teamName: string, teamOjassId: string }> = [];
    
    teams.forEach(team => {
      team.studentIds?.forEach(studentId => {
        const student = fakeStudents.find(s => s.id === studentId);
        if (student) {
          participants.push({
            student,
            teamName: team.name,
            teamOjassId: team.ojassId
          });
        }
      });
    });
    
    return participants;
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
    const searchLower = eventSearch.toLowerCase();
    return event.name.toLowerCase().includes(searchLower) ||
           event.id.toString().includes(eventSearch) ||
           event.date.includes(eventSearch);
  });

  const filteredStudents = fakeStudents.filter((student) => {
    const searchLower = studentSearch.toLowerCase();
    const matchesSearch = studentSearch === '' ||
      student.name.toLowerCase().includes(searchLower) ||
      student.ojassId.toLowerCase().includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower);
    
    const matchesPayment = paymentFilter === 'all' ||
      student.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesPayment;
  });

  const filteredTeams = teamEventFilter === 'all' 
    ? fakeTeams 
    : fakeTeams.filter(team => team.eventId === teamEventFilter);

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
              
              {/* Search Bar */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search by name, ID, or email..."
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow relative">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-gray-800">{event.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.status === 'Active' ? 'bg-green-100 text-green-700' :
                        event.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2"><strong>Date:</strong> {event.date}</p>
                    <p className="text-gray-600 mb-2"><strong>Participants:</strong> {event.participants}</p>
                    {event.description && (
                      <p className="text-gray-600 mb-4 text-sm line-clamp-2"><strong>Description:</strong> {event.description}</p>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 mb-2">
                      <button
                        onClick={() => handleViewEvent(event.id)}
                        className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditEvent(event.id)}
                        className="flex-1 px-3 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setSelectedEventParticipants(event.id)}
                        className="px-3 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
                        title="View Participants"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Participants Modal */}
              {selectedEventParticipants && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedEventParticipants(null)}>
                  <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-2xl font-bold text-gray-800">
                        Participants - {events.find(e => e.id === selectedEventParticipants)?.name}
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

              {/* Add Event Modal */}
              {showAddEventModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleCloseAddEvent}>
                  <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-800">Add New Event</h3>
                      <button
                        onClick={handleCloseAddEvent}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <form onSubmit={handleSubmitEvent} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Event Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={newEvent.name}
                          onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                          placeholder="Enter event name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Event Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          value={newEvent.date}
                          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          required
                          value={newEvent.description}
                          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                          placeholder="Enter event description"
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          value={newEvent.status}
                          onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value as 'Active' | 'Upcoming' | 'Completed' })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="Upcoming">Upcoming</option>
                          <option value="Active">Active</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Initial Participants
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={newEvent.participants}
                          onChange={(e) => setNewEvent({ ...newEvent, participants: parseInt(e.target.value) || 0 })}
                          placeholder="Enter initial participant count"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          type="button"
                          onClick={handleCloseAddEvent}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all"
                        >
                          Add Event
                        </button>
                      </div>
                    </form>
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
                  onChange={(e) => setTeamEventFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Events</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>{event.name}</option>
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
