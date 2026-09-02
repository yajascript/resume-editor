'use client';

import React from 'react';
import { ITemplateProps } from '@/types';
import { EditableText, PageBreakWrapper } from '@/components/editor';
import { translate } from '@/i18n';
import { useResumeStore } from '@/store';

export const ExecutiveClassicTemplate: React.FC<ITemplateProps> = ({
  resumeData,
  onFieldChange,
  accentColor = '#1e293b',
}) => {
  const { editorState, setActiveSection, toggleItemPageBreak, toggleSectionPageBreak } = useResumeStore();
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
    customSectionsList = [],
    sectionVisibility,
    sectionPageBreaks = {},
  } = resumeData;

  return (
    <div
      id="resume-sheet"
      className="w-full bg-white text-slate-900 p-12 flex flex-col gap-5 shadow-paper print:shadow-none min-h-full h-full text-[11px] leading-normal select-text flex-1"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Centered Classic Header */}
      <header
        id="preview-section-contact"
        onClick={() => setActiveSection('contact', 'preview')}
        className={`text-center pb-3 border-b-2 border-slate-900 cursor-pointer rounded-xl p-2 -m-2 transition-all ${
          activeSec === 'contact' ? 'ring-2 ring-blue-500 bg-blue-50/20' : 'hover:ring-1 hover:ring-blue-300/40'
        }`}
      >
        <EditableText
          tag="h1"
          className="text-2xl font-bold uppercase tracking-wider text-slate-900"
          value={contactInformation.fullName}
          onSave={(val) => onFieldChange('contactInformation.fullName', val)}
        />
        {contactInformation.jobTitle && (
          <EditableText
            tag="p"
            className="text-xs font-semibold italic text-slate-700 mt-1"
            value={contactInformation.jobTitle}
            onSave={(val) => onFieldChange('contactInformation.jobTitle', val)}
          />
        )}
        <div className="text-[10px] text-slate-600 mt-1.5 flex justify-center flex-wrap gap-x-3">
          {contactInformation.locationAddress && (
            <EditableText
              value={contactInformation.locationAddress}
              onSave={(val) => onFieldChange('contactInformation.locationAddress', val)}
            />
          )}
          {contactInformation.phoneNumber && <span>•</span>}
          {contactInformation.phoneNumber && (
            <EditableText
              value={contactInformation.phoneNumber}
              onSave={(val) => onFieldChange('contactInformation.phoneNumber', val)}
            />
          )}
          {contactInformation.emailAddress && <span>•</span>}
          {contactInformation.emailAddress && (
            <EditableText
              value={contactInformation.emailAddress}
              onSave={(val) => onFieldChange('contactInformation.emailAddress', val)}
            />
          )}
          {contactInformation.linkedinUrl && <span>•</span>}
          {contactInformation.linkedinUrl && (
            <EditableText
              value={contactInformation.linkedinUrl}
              onSave={(val) => onFieldChange('contactInformation.linkedinUrl', val)}
            />
          )}
        </div>
      </header>

      {/* Profile */}
      {sectionVisibility.profile !== false && profileSummary && (
        <PageBreakWrapper
          pageBreakBefore={sectionPageBreaks.profile}
          onTogglePageBreak={() => toggleSectionPageBreak('profile')}
          isHeader
        >
          <section
            id="preview-section-summary"
            onClick={() => setActiveSection('summary', 'preview')}
            className={`cursor-pointer rounded-xl p-2 -m-2 transition-all ${
              activeSec === 'summary' ? 'ring-2 ring-blue-500 bg-blue-50/20' : 'hover:ring-1 hover:ring-blue-300/40'
            }`}
          >
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-center border-b border-slate-300 pb-0.5 mb-2">
              {translate(lang, 'resume.sections.profile')}
            </h2>
            <p className="text-[10.5px] leading-relaxed text-slate-800 text-justify">
              <EditableText
                multiline
                value={profileSummary}
                onSave={(val) => onFieldChange('profileSummary', val)}
              />
            </p>
          </section>
        </PageBreakWrapper>
      )}

      {/* Experience */}
      {sectionVisibility.experience !== false && experienceList.length > 0 && (
        <PageBreakWrapper
          pageBreakBefore={sectionPageBreaks.experience}
          onTogglePageBreak={() => toggleSectionPageBreak('experience')}
          isHeader
        >
          <section
            id="preview-section-experience"
            onClick={() => setActiveSection('experience', 'preview')}
            className={`cursor-pointer rounded-xl p-2 -m-2 transition-all ${
              activeSec === 'experience' ? 'ring-2 ring-blue-500 bg-blue-50/20' : 'hover:ring-1 hover:ring-blue-300/40'
            }`}
          >
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-center border-b border-slate-300 pb-0.5 mb-3">
              {translate(lang, 'resume.sections.experience')}
            </h2>
            <div className="flex flex-col gap-3.5">
              {experienceList.map((exp, index) => (
                <PageBreakWrapper
                  key={exp.identifier || index}
                  pageBreakBefore={exp.pageBreakBefore}
                  onTogglePageBreak={() => toggleItemPageBreak('experience', exp.identifier)}
                >
                  <div>
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-[11px]">
                        <EditableText
                          value={exp.companyName}
                          onSave={(val) => {
                            const updated = [...experienceList];
                            updated[index] = { ...exp, companyName: val };
                            onFieldChange('experienceList', updated);
                          }}
                        />
                        {exp.locationName ? `, ${exp.locationName}` : ''}
                      </span>
                      <span className="text-[10px] italic">
                        {exp.startDate} – {exp.endDate || translate(lang, 'resume.sections.present')}
                      </span>
                    </div>
                    <div className="italic text-[10.5px] font-semibold text-slate-700">
                      <EditableText
                        value={exp.jobTitle}
                        onSave={(val) => {
                          const updated = [...experienceList];
                          updated[index] = { ...exp, jobTitle: val };
                          onFieldChange('experienceList', updated);
                        }}
                      />
                    </div>
                    <ul className="list-disc pl-5 mt-1 space-y-0.5">
                      {exp.bulletPoints.map((bullet, bulletIdx) => (
                        <li key={bulletIdx} className="text-[10px] leading-snug text-justify">
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
                </PageBreakWrapper>
              ))}
            </div>
          </section>
        </PageBreakWrapper>
      )}

      {/* Education */}
      {sectionVisibility.education !== false && educationList.length > 0 && (
        <PageBreakWrapper
          pageBreakBefore={sectionPageBreaks.education}
          onTogglePageBreak={() => toggleSectionPageBreak('education')}
          isHeader
        >
          <section
            id="preview-section-education"
            onClick={() => setActiveSection('education', 'preview')}
            className={`cursor-pointer rounded-xl p-2 -m-2 transition-all ${
              activeSec === 'education' ? 'ring-2 ring-blue-500 bg-blue-50/20' : 'hover:ring-1 hover:ring-blue-300/40'
            }`}
          >
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-center border-b border-slate-300 pb-0.5 mb-3">
              {translate(lang, 'resume.sections.education')}
            </h2>
            <div className="flex flex-col gap-2.5">
              {educationList.map((edu, index) => (
                <PageBreakWrapper
                  key={edu.identifier || index}
                  pageBreakBefore={edu.pageBreakBefore}
                  onTogglePageBreak={() => toggleItemPageBreak('education', edu.identifier)}
                >
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="font-bold text-[11px]">
                        <EditableText
                          value={edu.institutionName}
                          onSave={(val) => {
                            const updated = [...educationList];
                            updated[index] = { ...edu, institutionName: val };
                            onFieldChange('educationList', updated);
                          }}
                        />
                      </span>
                      <div className="italic text-[10.5px]">
                        <EditableText
                          value={edu.degreeName + (edu.specialization ? ` (${edu.specialization})` : '')}
                          onSave={(val) => {
                            const updated = [...educationList];
                            updated[index] = { ...edu, degreeName: val };
                            onFieldChange('educationList', updated);
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-[10px] italic">
                      {edu.startDate} – {edu.endDate}
                    </span>
                  </div>
                </PageBreakWrapper>
              ))}
            </div>
          </section>
        </PageBreakWrapper>
      )}

      {/* Custom Sections */}
      {customSectionsList.map((sec) => (
        <PageBreakWrapper
          key={sec.identifier}
          pageBreakBefore={sec.pageBreakBefore || sectionPageBreaks[sec.identifier]}
          onTogglePageBreak={() => toggleItemPageBreak('custom', sec.identifier)}
          isHeader
        >
          <section
            id="preview-section-custom"
            onClick={() => setActiveSection('custom', 'preview')}
            className={`cursor-pointer rounded-xl p-2 -m-2 transition-all ${
              activeSec === 'custom' ? 'ring-2 ring-blue-500 bg-blue-50/20' : 'hover:ring-1 hover:ring-blue-300/40'
            }`}
          >
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-center border-b border-slate-300 pb-0.5 mb-2">
              <EditableText
                value={sec.sectionTitle}
                onSave={(val) => {
                  const updated = customSectionsList.map((s) =>
                    s.identifier === sec.identifier ? { ...s, sectionTitle: val } : s
                  );
                  onFieldChange('customSectionsList', updated);
                }}
              />
            </h2>
            <div className="flex flex-col gap-2">
              {sec.items.map((item, itemIdx) => (
                <PageBreakWrapper
                  key={item.identifier || itemIdx}
                  pageBreakBefore={item.pageBreakBefore}
                  onTogglePageBreak={() => toggleItemPageBreak('custom', sec.identifier, item.identifier)}
                >
                  <div>
                    <div className="font-semibold text-slate-800">
                      <EditableText
                        value={item.itemTitle}
                        onSave={(val) => {
                          const updated = customSectionsList.map((s) => {
                            if (s.identifier !== sec.identifier) return s;
                            return {
                              ...s,
                              items: s.items.map((it) =>
                                it.identifier === item.identifier ? { ...it, itemTitle: val } : it
                              ),
                            };
                          });
                          onFieldChange('customSectionsList', updated);
                        }}
                      />
                    </div>
                    {item.bulletPoints.map((b, bIdx) => (
                      <p key={bIdx} className="text-[10px] text-slate-700 mt-0.5">
                        {b}
                      </p>
                    ))}
                  </div>
                </PageBreakWrapper>
              ))}
            </div>
          </section>
        </PageBreakWrapper>
      ))}

      {/* Skills & Certifications */}
      <section
        id="preview-section-skills"
        onClick={() => setActiveSection('skills', 'preview')}
        className={`cursor-pointer rounded-xl p-2 -m-2 transition-all ${
          activeSec === 'skills' || activeSec === 'languages' || activeSec === 'certifications'
            ? 'ring-2 ring-blue-500 bg-blue-50/20'
            : 'hover:ring-1 hover:ring-blue-300/40'
        }`}
      >
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-center border-b border-slate-300 pb-0.5 mb-2">
          {translate(lang, 'resume.sections.skills')} & {translate(lang, 'resume.sections.certifications')}
        </h2>
        <div className="text-[10px] text-slate-800 leading-relaxed">
          {skillsList.length > 0 && (
            <p>
              <span className="font-bold">{translate(lang, 'resume.sections.skills')}: </span>
              {skillsList.join(', ')}
            </p>
          )}
          {languagesList.length > 0 && (
            <p className="mt-1">
              <span className="font-bold">{translate(lang, 'resume.sections.languages')}: </span>
              {languagesList.join(', ')}
            </p>
          )}
          {certificationsList.length > 0 && (
            <p className="mt-1">
              <span className="font-bold">{translate(lang, 'resume.sections.certifications')}: </span>
              {certificationsList.map((c) => c.certificationName).join(' • ')}
            </p>
          )}
        </div>
      </section>
    </div>
  );
};
