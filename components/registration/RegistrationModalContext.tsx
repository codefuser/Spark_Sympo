"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { RegistrationModal } from "./RegistrationModal";
import { SymposiumEvent } from "@/types";

interface RegistrationModalContextType {
  openRegistrationModal: (eventId?: string) => void;
  closeRegistrationModal: () => void;
}

const RegistrationModalContext = createContext<RegistrationModalContextType | undefined>(undefined);

export function RegistrationModalProvider({
  children,
  events,
}: {
  children: React.ReactNode;
  events: SymposiumEvent[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>("");

  const openRegistrationModal = (eventId?: string) => {
    if (eventId) setSelectedEventId(eventId);
    setIsOpen(true);
  };

  const closeRegistrationModal = () => {
    setIsOpen(false);
  };

  return (
    <RegistrationModalContext.Provider
      value={{ openRegistrationModal, closeRegistrationModal }}
    >
      {children}
      <RegistrationModal
        isOpen={isOpen}
        onClose={closeRegistrationModal}
        selectedEventId={selectedEventId}
        events={events}
      />
    </RegistrationModalContext.Provider>
  );
}

export function useRegistrationModal() {
  const context = useContext(RegistrationModalContext);
  if (!context) {
    throw new Error("useRegistrationModal must be used within a RegistrationModalProvider");
  }
  return context;
}
