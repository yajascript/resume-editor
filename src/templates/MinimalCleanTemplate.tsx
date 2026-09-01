'use client';

import React from 'react';
import { ITemplateProps } from '@/types';
import { EditableText } from '@/components/editor/EditableText';
import { translate } from '@/i18n';
import { useResumeStore } from '@/store';

export const MinimalCleanTemplate: React.FC<ITemplateProps> = ({
  resumeData,
  onFieldChange,
  accentColor = '#111827',
}) => {
  const { editorState, setActiveSection } = useResumeStore();
  const lang = editorState.currentLanguage;
  const activeSec = editorState.activeSection;
  const {
    contactInformation,
    profileSummary,
    skillsList,
    languagesList,
    certificationsList,
    educationList,
    projectsList,
    experienceList,
    customSectionsList,
    sectionVisibility,
  } = resumeData;

  return (
    <div
      id="resume-sheet"
      className="w-full bg-white text-[#1f2937] p-10 flex flex-col gap-6 shadow-paper print:shadow-none min-h-[1056px] text-[11px] leading-normal select-text"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Header */}
      <header
        id="preview-section-contact"
        onClick={() => setActiveSection('contact', 'preview')}
        className={`border-b border-gray-200 pb-5 cursor-pointer rounded-xl p-2 -m-2 transition-all ${
          activeSec === 'contact' ? 'ring-2 ring-blue-500 bg-blue-50/20' : 'hover:ring-1 hover:ring-blue-300/40'
        }`}
      >
        <div className="flex justify-between items-baseline gap-4">
          <div>
            <EditableText
              tag="h1"
              className="text-3xl font-black tracking-tight text-gray-900"
              value={contactInformation.fullName}
              onSave={(val) => onFieldChange('contactInformation.fullName', val)}
            />
            <EditableText
              tag="p"
              className="text-[13px] font-semibold tracking-wide text-gray-600 mt-1"
              style={{ color: accentColor }}
              value={contactInformation.jobTitle}
              onSave={(val) => onFieldChange('contactInformation.jobTitle', val)}
            />
          </div>
          <div className="text-right text-[10.5px] text-gray-500 flex flex-col gap-0.5">
            {contactInformation.emailAddress && (
              <EditableText
                value={contactInformation.emailAddress}
                onSave={(val) => onFieldChange('contactInformation.emailAddress', val)}
              />
            )}
            {contactInformation.phoneNumber && (
              <EditableText
                value={contactInformation.phoneNumber}
                onSave={(val) => onFieldChange('contactInformation.phoneNumber', val)}
              />
            )}
            {contactInformation.locationAddress && (
              <EditableText
                value={contactInformation.locationAddress}
                onSave={(val) => onFieldChange('contactInformation.locationAddress', val)}
              />
            )}
            {contactInformation.linkedinUrl && (
              <EditableText
                value={contactInformation.linkedinUrl}
                onSave={(val) => onFieldChange('contactInformation.linkedinUrl', val)}
              />
            )}
          </div>
        </div>
      </header>

      {/* Profile Summary */}
      {sectionVisibility.profile !== false && profileSummary && (
        <section
          id="preview-section-summary"
          onClick={() => setActiveSection('summary', 'preview')}
          className={`cursor-pointer rounded-xl p-2 -m-2 transition-all ${
            activeSec === 'summary' ? 'ring-2 ring-blue-500 bg-blue-50/20' : 'hover:ring-1 hover:ring-blue-300/40'
          }`}
        >
          <h2
            className="text-[11.5px] font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1 mb-2"
            style={{ color: accentColor }}
          >
            {translate(lang, 'resume.sections.profile')}
          </h2>
          <p className="text-[10.5px] leading-relaxed text-gray-700 text-justify">
            <EditableText
              multiline
              value={profileSummary}
              onSave={(val) => onFieldChange('profileSummary', val)}
            />
          </p>
        </section>
      )}

      {/* Experience */}
      {sectionVisibility.experience !== false && experienceList.length > 0 && (
        <section
          id="preview-section-experience"
          onClick={() => setActiveSection('experience', 'preview')}
          className={`cursor-pointer rounded-xl p-2 -m-2 transition-all ${
            activeSec === 'experience' ? 'ring-2 ring-blue-500 bg-blue-50/20' : 'hover:ring-1 hover:ring-blue-300/40'
          }`}
        >
          <h2
            className="text-[11.5px] font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1 mb-3"
            style={{ color: accentColor }}
          >
            {translate(lang, 'resume.sections.experience')}
          </h2>
          <div className="flex flex-col gap-4">
            {experienceList.map((exp, index) => (
              <div key={exp.identifier || index}>
                <div className="flex justify-between items-baseline">
                  <div className="font-bold text-gray-900 text-[11.5px]">
                    <EditableText
                      value={exp.jobTitle}
                      onSave={(val) => {
                        const updated = [...experienceList];
                        updated[index] = { ...exp, jobTitle: val };
                        onFieldChange('experienceList', updated);
                      }}
                    />
                    <span className="font-medium text-gray-600 ml-1">
                      @{' '}
                      <EditableText
                        value={exp.companyName}
                        onSave={(val) => {
                          const updated = [...experienceList];
                          updated[index] = { ...exp, companyName: val };
                          onFieldChange('experienceList', updated);
                        }}
                      />
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">
                    <EditableText
                      value={`${exp.startDate} – ${exp.endDate || translate(lang, 'resume.sections.present')}`}
                      onSave={(val) => {
                        const parts = val.split(/[–-]/).map((s) => s.trim());
                        const updated = [...experienceList];
                        updated[index] = { ...exp, startDate: parts[0] || '', endDate: parts[1] || '' };
                        onFieldChange('experienceList', updated);
                      }}
                    />
                  </span>
                </div>
                <ul className="list-disc pl-4 mt-1.5 space-y-1">
                  {exp.bulletPoints.map((bullet, bulletIdx) => (
                    <li key={bulletIdx} className="text-[10.5px] text-gray-700 leading-snug text-justify">
                      <EditableText
                        multiline
                        value={bullet}
                        onSave={(val) => {
                          const updated = [...experienceList];
                          const bullets = [...exp.bulletPoints];
                          bullets[bulletIdx] = val;
                          updated[index] = { ...exp, bulletPoints: bullets };
                          onFieldChange('experienceList', updated);
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {sectionVisibility.education !== false && educationList.length > 0 && (
        <section
          id="preview-section-education"
          onClick={() => setActiveSection('education', 'preview')}
          className={`cursor-pointer rounded-xl p-2 -m-2 transition-all ${
            activeSec === 'education' ? 'ring-2 ring-blue-500 bg-blue-50/20' : 'hover:ring-1 hover:ring-blue-300/40'
          }`}
        >
          <h2
            className="text-[11.5px] font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1 mb-3"
            style={{ color: accentColor }}
          >
            {translate(lang, 'resume.sections.education')}
          </h2>
          <div className="flex flex-col gap-3">
            {educationList.map((edu, index) => (
              <div key={edu.identifier || index} className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-gray-900 text-[11px]">
                    <EditableText
                      value={edu.degreeName}
                      onSave={(val) => {
                        const updated = [...educationList];
                        updated[index] = { ...edu, degreeName: val };
                        onFieldChange('educationList', updated);
                      }}
                    />
                  </div>
                  <div className="text-gray-600 text-[10.5px]">
                    <EditableText
                      value={edu.institutionName + (edu.locationName ? `, ${edu.locationName}` : '')}
                      onSave={(val) => {
                        const updated = [...educationList];
                        updated[index] = { ...edu, institutionName: val };
                        onFieldChange('educationList', updated);
                      }}
                    />
                  </div>
                  {edu.specialization && (
                    <div className="text-gray-500 text-[10px] italic">
                      <EditableText
                        value={edu.specialization}
                        onSave={(val) => {
                          const updated = [...educationList];
                          updated[index] = { ...edu, specialization: val };
                          onFieldChange('educationList', updated);
                        }}
                      />
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-gray-500 font-medium">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills & Certifications Grid */}
      <div className="grid grid-cols-2 gap-6">
        {sectionVisibility.skills !== false && skillsList.length > 0 && (
          <section
            id="preview-section-skills"
            onClick={() => setActiveSection('skills', 'preview')}
            className={`cursor-pointer rounded-xl p-2 -m-2 transition-all ${
              activeSec === 'skills' ? 'ring-2 ring-blue-500 bg-blue-50/20' : 'hover:ring-1 hover:ring-blue-300/40'
            }`}
          >
            <h2
              className="text-[11.5px] font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1 mb-2"
              style={{ color: accentColor }}
            >
              {translate(lang, 'resume.sections.skills')}
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skillsList.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-[10px] text-gray-700"
                >
                  <EditableText
                    value={skill}
                    onSave={(val) => {
                      const updated = [...skillsList];
                      updated[index] = val;
                      onFieldChange('skillsList', updated);
                    }}
                  />
                </span>
              ))}
            </div>
          </section>
        )}

        {sectionVisibility.certifications !== false && certificationsList.length > 0 && (
          <section
            id="preview-section-certifications"
            onClick={() => setActiveSection('certifications', 'preview')}
            className={`cursor-pointer rounded-xl p-2 -m-2 transition-all ${
              activeSec === 'certifications' ? 'ring-2 ring-blue-500 bg-blue-50/20' : 'hover:ring-1 hover:ring-blue-300/40'
            }`}
          >
            <h2
              className="text-[11.5px] font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1 mb-2"
              style={{ color: accentColor }}
            >
              {translate(lang, 'resume.sections.certifications')}
            </h2>
            <ul className="list-disc pl-4 text-[10.5px] text-gray-700 space-y-1">
              {certificationsList.map((cert, index) => (
                <li key={cert.identifier || index}>
                  <EditableText
                    value={cert.certificationName}
                    onSave={(val) => {
                      const updated = [...certificationsList];
                      updated[index] = { ...cert, certificationName: val };
                      onFieldChange('certificationsList', updated);
                    }}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};
