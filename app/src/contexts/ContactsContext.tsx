import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Contact } from '../data/types';
import { mockContacts } from '../data/mockContacts';
import { loadFromStorage, saveToStorage } from '../data/storage';

const STORAGE_KEY = 'nlsk-contacts-v1';

function loadInitialContacts(): Contact[] {
  const stored = loadFromStorage<Contact[]>(STORAGE_KEY);
  if (stored) return stored;
  return mockContacts;
}

interface ContactsContextValue {
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id' | 'history'>) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  importContacts: (imported: Contact[]) => void;
}

const ContactsContext = createContext<ContactsContextValue | null>(null);

export function ContactsProvider({ children }: { children: ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>(loadInitialContacts);

  useEffect(() => {
    saveToStorage(STORAGE_KEY, contacts);
  }, [contacts]);

  const addContact = useCallback((contact: Omit<Contact, 'id' | 'history'>) => {
    setContacts((prev) => [...prev, { ...contact, id: `contact-${Date.now()}`, history: [] }]);
  }, []);

  const updateContact = useCallback((id: string, updates: Partial<Contact>) => {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const deleteContact = useCallback((id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const importContacts = useCallback((imported: Contact[]) => {
    setContacts((prev) => {
      const result = [...prev];
      for (const incoming of imported) {
        const email = incoming.email.trim().toLowerCase();
        const name = incoming.name.trim().toLowerCase();
        const matchIndex = result.findIndex((c) =>
          email ? c.email.trim().toLowerCase() === email : c.name.trim().toLowerCase() === name,
        );
        if (matchIndex >= 0) {
          const existing = result[matchIndex];
          result[matchIndex] = { ...existing, ...incoming, id: existing.id, history: existing.history };
        } else {
          result.push(incoming);
        }
      }
      return result;
    });
  }, []);

  return (
    <ContactsContext.Provider value={{ contacts, addContact, updateContact, deleteContact, importContacts }}>
      {children}
    </ContactsContext.Provider>
  );
}

export function useContacts(): ContactsContextValue {
  const ctx = useContext(ContactsContext);
  if (!ctx) throw new Error('useContacts must be used within ContactsProvider');
  return ctx;
}
