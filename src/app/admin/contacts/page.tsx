"use client";

import { useState, useEffect } from "react";
import { getAdminContacts, markContactAsRead, deleteContact, Contact, getContactId } from "@/api/api";

export default function ContactsManagement() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const contactsData = await getAdminContacts();
      setContacts(contactsData);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      alert('Error fetching contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const updatedContact = await markContactAsRead(id);
      setContacts(contacts.map(contact => 
        getContactId(contact) === id ? updatedContact : contact
      ));
      if (selectedContact && getContactId(selectedContact) === id) {
        setSelectedContact(updatedContact);
      }
    } catch (error) {
      console.error('Error marking contact as read:', error);
      alert('Error updating contact status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact message?')) return;
    
    setDeleteLoading(id);
    try {
      await deleteContact(id);
      setContacts(contacts.filter(contact => getContactId(contact) !== id));
      if (selectedContact && getContactId(selectedContact) === id) {
        setSelectedContact(null);
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Error deleting contact');
    } finally {
      setDeleteLoading(null);
    }
  };

  const unreadCount = contacts.filter(contact => !contact.read).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-midnightBlue">Loading contacts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-midnightBlue">Contact Messages</h1>
          <p className="text-gray-600 mt-2">Manage and respond to customer inquiries</p>
          <div className="mt-1 text-sm text-gray-500">
            Total: {contacts.length} message{contacts.length !== 1 ? 's' : ''} 
            {unreadCount > 0 && (
              <span className="ml-2 text-desertSun font-semibold">
                ({unreadCount} unread)
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {contacts.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <p>No contact messages yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {contacts.map((contact) => {
                    const contactId = getContactId(contact);
                    return (
                      <div
                        key={contactId}
                        className={`p-4 cursor-pointer transition-colors ${
                          selectedContact && getContactId(selectedContact) === contactId
                            ? 'bg-desertSun bg-opacity-10 border-r-2 border-desertSun'
                            : 'hover:bg-gray-50'
                        } ${!contact.read ? 'bg-blue-50' : ''}`}
                        onClick={() => setSelectedContact(contact)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {contact.name}
                            {!contact.read && (
                              <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </h3>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {new Date(contact.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{contact.email}</p>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {contact.message}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="lg:col-span-2">
          {selectedContact ? (
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedContact.name}</h2>
                    <p className="text-gray-600">{selectedContact.email}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Received: {new Date(selectedContact.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {!selectedContact.read && (
                      <button
                        onClick={() => handleMarkAsRead(getContactId(selectedContact))}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(getContactId(selectedContact))}
                      disabled={deleteLoading === getContactId(selectedContact)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
                    >
                      {deleteLoading === getContactId(selectedContact) ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Message</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>

                <div className="mt-6 flex space-x-4">
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="inline-flex items-center px-4 py-2 bg-desertSun text-white rounded-lg hover:bg-burntOrange transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Reply via Email
                  </a>
                  
                  <button
                    onClick={() => navigator.clipboard.writeText(selectedContact.email)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Email
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Message</h3>
              <p className="text-gray-500">Choose a contact message from the list to view details and respond.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}