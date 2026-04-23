import React from "react";
import {
  ClerkProvider as BaseClerkProvider,
  UserButton as BaseUserButton,
  useAuth as clerkUseAuth,
  useClerk as clerkUseClerk,
  useUser as clerkUseUser,
} from "@clerk/clerk-react";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export const isClerkEnabled =
  typeof publishableKey === "string" &&
  publishableKey.trim() !== "" &&
  !publishableKey.includes("-----");

const noopAsync = async () => null;

export const ClerkProvider = ({ children }) => {
  if (!isClerkEnabled) {
    return children;
  }

  return (
    <BaseClerkProvider publishableKey={publishableKey} afterSignOutUrl="/">
      {children}
    </BaseClerkProvider>
  );
};

export const useAuth = () => {
  if (!isClerkEnabled) {
    return {
      isLoaded: true,
      isSignedIn: false,
      getToken: noopAsync,
      signOut: noopAsync,
    };
  }

  return clerkUseAuth();
};

export const useUser = () => {
  if (!isClerkEnabled) {
    return {
      isLoaded: true,
      isSignedIn: false,
      user: null,
    };
  }

  return clerkUseUser();
};

export const useClerk = () => {
  if (!isClerkEnabled) {
    return {
      openSignIn: () => {
        console.warn("Clerk is not configured for this client build.");
      },
    };
  }

  return clerkUseClerk();
};

export const UserButton = (props) => {
  if (!isClerkEnabled) {
    return null;
  }

  return <BaseUserButton {...props} />;
};