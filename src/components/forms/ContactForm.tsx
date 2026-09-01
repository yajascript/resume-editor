'use client';

import React from 'react';
import { useResumeStore } from '@/store';
import { translate } from '@/i18n';
import { User, Briefcase, Mail, Phone, MapPin, Linkedin, Globe, Github } from 'lucide-react';

export const ContactForm: React.FC = () => {
  const { resumeData, updateContactInformation, editorState } = useResumeStore();
  const { contactInformation } = resumeData;
  const lang = editorState.currentLanguage;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
          <User className="w-3.5 h-3.5 text-blue-500" />
          {translate(lang, 'contact.fullName')}
        </label>
        <input
          type="text"
          value={contactInformation.fullName}
          onChange={(e) => updateContactInformation('fullName', e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
          <Briefcase className="w-3.5 h-3.5 text-blue-500" />
          {translate(lang, 'contact.jobTitle')}
        </label>
        <input
          type="text"
          value={contactInformation.jobTitle}
          onChange={(e) => updateContactInformation('jobTitle', e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
            <Mail className="w-3.5 h-3.5 text-blue-500" />
            {translate(lang, 'contact.emailAddress')}
          </label>
          <input
            type="email"
            value={contactInformation.emailAddress}
            onChange={(e) => updateContactInformation('emailAddress', e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
            <Phone className="w-3.5 h-3.5 text-blue-500" />
            {translate(lang, 'contact.phoneNumber')}
          </label>
          <input
            type="tel"
            value={contactInformation.phoneNumber}
            onChange={(e) => updateContactInformation('phoneNumber', e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
          <MapPin className="w-3.5 h-3.5 text-blue-500" />
          {translate(lang, 'contact.locationAddress')}
        </label>
        <input
          type="text"
          value={contactInformation.locationAddress}
          onChange={(e) => updateContactInformation('locationAddress', e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
            <Linkedin className="w-3.5 h-3.5 text-blue-500" />
            {translate(lang, 'contact.linkedinUrl')}
          </label>
          <input
            type="text"
            value={contactInformation.linkedinUrl || ''}
            onChange={(e) => updateContactInformation('linkedinUrl', e.target.value)}
            placeholder="linkedin.com/in/..."
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
            <Globe className="w-3.5 h-3.5 text-blue-500" />
            {translate(lang, 'contact.websiteUrl')}
          </label>
          <input
            type="text"
            value={contactInformation.websiteUrl || ''}
            onChange={(e) => updateContactInformation('websiteUrl', e.target.value)}
            placeholder="monsite.com"
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          />
        </div>
      </div>
    </div>
  );
};
