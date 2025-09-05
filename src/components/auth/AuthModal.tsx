"use client";

import React, { useState, useEffect } from "react";
import { AuthDialog } from "./AuthDialog";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "login" | "register";
}

export function AuthModal({
  isOpen,
  onClose,
  defaultMode = "login",
}: AuthModalProps) {
  const [currentMode, setCurrentMode] = useState<"login" | "register">(
    defaultMode
  );

  useEffect(() => {
    if (isOpen) {
      setCurrentMode(defaultMode);
    }
  }, [isOpen, defaultMode]);

  const handleSwitchToRegister = () => {
    setCurrentMode("register");
  };

  const handleSwitchToLogin = () => {
    setCurrentMode("login");
  };

  const handleClose = () => {
    setCurrentMode(defaultMode);
    onClose();
  };

  return (
    <AuthDialog
      isOpen={isOpen}
      onClose={handleClose}
      title={currentMode === "login" ? "Sign In" : "Create Account"}
    >
      <div className="p-6">
        {currentMode === "login" && (
          <LoginForm
            onSwitchToRegister={handleSwitchToRegister}
            onClose={handleClose}
          />
        )}

        {currentMode === "register" && (
          <RegisterForm
            onSwitchToLogin={handleSwitchToLogin}
            onClose={handleClose}
          />
        )}
      </div>
    </AuthDialog>
  );
}
