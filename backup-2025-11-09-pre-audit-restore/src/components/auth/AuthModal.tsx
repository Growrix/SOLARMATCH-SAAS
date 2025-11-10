'use client';

import React, { useEffect } from 'react';
import { XIcon } from '@/components/icons/auth';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * AuthModal - Base modal wrapper for all authentication dialogs
 * Provides consistent layout, animations, and keyboard handling
 * Uses design system tokens and neumorphic styling
 */
export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  icon,
  children,
  maxWidth = 'md',
  className = '',
}) => {
  // Handle escape key and body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <div
      className="fixed inset-0 bg-overlay backdrop-blur-sm z-50 flex items-center justify-center px-4 py-20 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      aria-describedby="auth-modal-description"
    >
      <div
        className={`theme-card relative w-full ${maxWidthClasses[maxWidth]} p-8 max-h-[90vh] overflow-y-auto animate-slide-in-up ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-subtle hover:text-foreground transition-colors"
          aria-label="Close modal"
        >
          <XIcon />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          {/* Icon container */}
          <div className="auth-icon-container mx-auto mb-6">
            {icon}
          </div>

          {/* Title */}
          <h2 id="auth-modal-title" className="text-heading-2 text-foreground mb-2">
            {title}
          </h2>

          {/* Description */}
          <p id="auth-modal-description" className="text-body-small text-subtle">
            {description}
          </p>
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default AuthModal;
