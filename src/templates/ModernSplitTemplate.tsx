'use client';

import React from 'react';
import { ITemplateProps } from '@/types';
import { EditableText, PageBreakWrapper } from '@/components/editor';
import { translate } from '@/i18n';
import { useResumeStore } from '@/store';
import { Phone, Mail, MapPin, Linkedin, Globe } from 'lucide-react';

export const ModernSplitTemplate: React.FC<ITemplateProps> = ({
  resumeData,
  onFieldChange,
  accentColor = '#2563eb',
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
    customSectionsList,
    sectionVisibility,
    sectionPageBreaks = {},
  } = resumeData;

  return (
    <div
      id="resume-sheet"
      className="w-full bg-white text-slate-800 shadow-paper print:shadow-none min-h-full h-full text-[11px] leading-relaxed select-text flex flex-col flex-1"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Top Banner */}
      <header
        id="preview-section-contact"
        onClick={() => setActiveSection('contact', 'preview')}
        className={`p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer transition-all ${
          activeSec === 'contact' ? 'ring-4 ring-blue-300 shadow-lg' : 'hover:brightness-105'
        }`}
        style={{ backgroundColor: accentColor }}
      >
        <div>
          <EditableText
            tag="h1"
            className="text-2xl md:text-3xl font-extrabold tracking-tight text-white"
            value={contactInformation.fullName}
            onSave={(val) => onFieldChange('contactInformation.fullName', val)}
          />
          <EditableText
            tag="p"
            className="text-sm font-medium text-slate-100 mt-1"
            value={contactInformation.jobTitle}
            onSave={(val) => onFieldChange('contactInformation.jobTitle', val)}
          />
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[10.5px] text-slate-100">
          {contactInformation.phoneNumber && (
            <span className="flex items-center gap-1.5">
              <Phone className="w-3 h-3" />
              <EditableText
                value={contactInformation.phoneNumber}
                onSave={(val) => onFieldChange('contactInformation.phoneNumber', val)}
              />
            </span>
          )}
          {contactInformation.emailAddress && (
            <span className="flex items-center gap-1.5">
              <Mail className="w-3 h-3" />
              <EditableText
                value={contactInformation.emailAddress}
                onSave={(val) => onFieldChange('contactInformation.emailAddress', val)}
              />
            </span>
          )}
          {contactInformation.locationAddress && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3" />
              <EditableText
                value={contactInformation.locationAddress}
                onSave={(val) => onFieldChange('contactInformation.locationAddress', val)}
              />
            </span>
          )}
          {contactInformation.linkedinUrl && (
            <span className="flex items-center gap-1.5">
              <Linkedin className="w-3 h-3" />
              <EditableText
                value={contactInformation.linkedinUrl}
                onSave={(val) => onFieldChange('contactInformation.linkedinUrl', val)}
              />
            </span>
          )}
        </div>
      </header>

      {/* Two Column Body */}
      <div className="p-8 grid grid-cols-[65%_35%] gap-8 flex-1">
        {/* Main Column */}
        <div className="flex flex-col gap-6">
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
                <h2
                  className="text-[12px] font-extrabold uppercase tracking-wide pb-1 mb-2 border-b-2"
                  style={{ color: accentColor, borderColor: `${accentColor}33` }}
                >
                  {translate(lang, 'resume.sections.profile')}
                </h2>
                <p className="text-[10.5px] leading-relaxed text-slate-600 text-justify">
                  <EditableText
                    multiline
                    value={profileSummary}
                    onSave={(val) => onFieldChange('profileSummary', val)}
                  />
                </p>
              </section>
            </PageBreakWrapper>
          )}

          {/* Work Experience */}
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
                <h2
                  className="text-[12px] font-extrabold uppercase tracking-wide pb-1 mb-3 border-b-2"
                  style={{ color: accentColor, borderColor: `${accentColor}33` }}
                >
                  {translate(lang, 'resume.sections.experience')}
                </h2>
                <div className="flex flex-col gap-4">
                  {experienceList.map((exp, index) => (
                    <PageBreakWrapper
                      key={exp.identifier || index}
                      pageBreakBefore={exp.pageBreakBefore}
                      onTogglePageBreak={() => toggleItemPageBreak('experience', exp.identifier)}
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-baseline">
                          <EditableText
                            className="font-bold text-slate-900 text-[11px]"
                            value={exp.jobTitle}
                            onSave={(val) => {
                              const updated = [...experienceList];
                              updated[index] = { ...exp, jobTitle: val };
                              onFieldChange('experienceList', updated);
                            }}
                          />
                          <span className="text-[10px] text-slate-500 font-medium">
                            {exp.startDate} – {exp.endDate || translate(lang, 'resume.sections.present')}
                          </span>
                        </div>
                        <div className="text-[10.5px] text-slate-600 font-medium">
                          <EditableText
                            value={exp.companyName + (exp.locationName ? `, ${exp.locationName}` : '')}
                            onSave={(val) => {
                              const updated = [...experienceList];
                              updated[index] = { ...exp, companyName: val };
                              onFieldChange('experienceList', updated);
                            }}
                          />
                        </div>
                        <ul className="list-disc pl-4 space-y-1 mt-1">
                          {exp.bulletPoints.map((bullet, bulletIdx) => (
                            <li key={bulletIdx} className="text-[10px] text-slate-600 leading-snug text-justify">
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

          {/* Projects */}
          {sectionVisibility.projects !== false && projectsList.length > 0 && (
            <PageBreakWrapper
              pageBreakBefore={sectionPageBreaks.projects}
              onTogglePageBreak={() => toggleSectionPageBreak('projects')}
              isHeader
            >
              <section
                id="preview-section-projects"
                onClick={() => setActiveSection('projects', 'preview')}
                className={`cursor-pointer rounded-xl p-2 -m-2 transition-all ${
                  activeSec === 'projects' ? 'ring-2 ring-blue-500 bg-blue-50/20' : 'hover:ring-1 hover:ring-blue-300/40'
                }`}
              >
                <h2
                  className="text-[12px] font-extrabold uppercase tracking-wide pb-1 mb-3 border-b-2"
                  style={{ color: accentColor, borderColor: `${accentColor}33` }}
                >
                  {translate(lang, 'resume.sections.projects')}
                </h2>
                <div className="flex flex-col gap-3">
                  {projectsList.map((proj, index) => (
                    <PageBreakWrapper
                      key={proj.identifier || index}
                      pageBreakBefore={proj.pageBreakBefore}
                      onTogglePageBreak={() => toggleItemPageBreak('projects', proj.identifier)}
                    >
                      <div>
                        <div className="font-bold text-slate-900 text-[11px]">
                          <EditableText
                            value={proj.projectTitle}
                            onSave={(val) => {
                              const updated = [...projectsList];
                              updated[index] = { ...proj, projectTitle: val };
                              onFieldChange('projectsList', updated);
                            }}
                          />
                        </div>
                        {proj.bulletPoints.map((b, bIdx) => (
                          <p key={bIdx} className="text-[10px] text-slate-600 mt-0.5 text-justify">
                            {b}
                          </p>
                        ))}
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
                <h2
                  className="text-[12px] font-extrabold uppercase tracking-wide pb-1 mb-3 border-b-2"
                  style={{ color: accentColor, borderColor: `${accentColor}33` }}
                >
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
                <div className="flex flex-col gap-3">
                  {sec.items.map((item, itemIdx) => (
                    <PageBreakWrapper
                      key={item.identifier || itemIdx}
                      pageBreakBefore={item.pageBreakBefore}
                      onTogglePageBreak={() => toggleItemPageBreak('custom', sec.identifier, item.identifier)}
                    >
                      <div className="flex flex-col gap-0.5">
                        <div className="flex justify-between items-baseline">
                          <EditableText
                            className="font-bold text-slate-900 text-[11px]"
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
                          {item.dateRange && (
                            <span className="text-[10px] text-slate-400">{item.dateRange}</span>
                          )}
                        </div>
                        {item.bulletPoints.map((b, bIdx) => (
                          <p key={bIdx} className="text-[10px] text-slate-600 mt-0.5 text-justify">
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
        </div>

        {/* Right Sidebar Column */}
        <div className="flex flex-col gap-6">
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
                <h2
                  className="text-[12px] font-extrabold uppercase tracking-wide pb-1 mb-3 border-b-2"
                  style={{ color: accentColor, borderColor: `${accentColor}33` }}
                >
                  {translate(lang, 'resume.sections.education')}
                </h2>
                <div className="flex flex-col gap-3">
                  {educationList.map((edu, index) => (
                    <PageBreakWrapper
                      key={edu.identifier || index}
                      pageBreakBefore={edu.pageBreakBefore}
                      onTogglePageBreak={() => toggleItemPageBreak('education', edu.identifier)}
                    >
                      <div className="flex flex-col gap-0.5">
                        <div className="font-bold text-slate-900 text-[10.5px]">
                          <EditableText
                            value={edu.degreeName}
                            onSave={(val) => {
                              const updated = [...educationList];
                              updated[index] = { ...edu, degreeName: val };
                              onFieldChange('educationList', updated);
                            }}
                          />
                        </div>
                        <div className="text-slate-600 text-[10px]">
                          <EditableText
                            value={edu.institutionName}
                            onSave={(val) => {
                              const updated = [...educationList];
                              updated[index] = { ...edu, institutionName: val };
                              onFieldChange('educationList', updated);
                            }}
                          />
                        </div>
                        <span className="text-[9.5px] text-slate-400 font-medium">
                          {edu.startDate} – {edu.endDate}
                        </span>
                      </div>
                    </PageBreakWrapper>
                  ))}
                </div>
              </section>
            </PageBreakWrapper>
          )}

          {/* Skills */}
          {sectionVisibility.skills !== false && skillsList.length > 0 && (
            <section
              id="preview-section-skills"
              onClick={() => setActiveSection('skills', 'preview')}
              className={`cursor-pointer rounded-xl p-2 -m-2 transition-all ${
                activeSec === 'skills' ? 'ring-2 ring-blue-500 bg-blue-50/20' : 'hover:ring-1 hover:ring-blue-300/40'
              }`}
            >
              <h2
                className="text-[12px] font-extrabold uppercase tracking-wide pb-1 mb-3 border-b-2"
                style={{ color: accentColor, borderColor: `${accentColor}33` }}
              >
                {translate(lang, 'resume.sections.skills')}
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skillsList.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium text-slate-700 bg-slate-100 border border-slate-200"
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

          {/* Languages */}
          {sectionVisibility.languages !== false && languagesList.length > 0 && (
            <section
              id="preview-section-languages"
              onClick={() => setActiveSection('languages', 'preview')}
              className={`cursor-pointer rounded-xl p-2 -m-2 transition-all ${
                activeSec === 'languages' ? 'ring-2 ring-blue-500 bg-blue-50/20' : 'hover:ring-1 hover:ring-blue-300/40'
              }`}
            >
              <h2
                className="text-[12px] font-extrabold uppercase tracking-wide pb-1 mb-3 border-b-2"
                style={{ color: accentColor, borderColor: `${accentColor}33` }}
              >
                {translate(lang, 'resume.sections.languages')}
              </h2>
              <ul className="list-disc pl-4 text-[10px] text-slate-600 space-y-1">
                {languagesList.map((langItem, index) => (
                  <li key={index}>
                    <EditableText
                      value={langItem}
                      onSave={(val) => {
                        const updated = [...languagesList];
                        updated[index] = val;
                        onFieldChange('languagesList', updated);
                      }}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Certifications */}
          {sectionVisibility.certifications !== false && certificationsList.length > 0 && (
            <section
              id="preview-section-certifications"
              onClick={() => setActiveSection('certifications', 'preview')}
              className={`cursor-pointer rounded-xl p-2 -m-2 transition-all ${
                activeSec === 'certifications' ? 'ring-2 ring-blue-500 bg-blue-50/20' : 'hover:ring-1 hover:ring-blue-300/40'
              }`}
            >
              <h2
                className="text-[12px] font-extrabold uppercase tracking-wide pb-1 mb-3 border-b-2"
                style={{ color: accentColor, borderColor: `${accentColor}33` }}
              >
                {translate(lang, 'resume.sections.certifications')}
              </h2>
              <ul className="flex flex-col gap-2 text-[10px] text-slate-600">
                {certificationsList.map((cert, index) => (
                  <li key={cert.identifier || index} className="flex flex-col">
                    <span className="font-semibold text-slate-800">
                      <EditableText
                        value={cert.certificationName}
                        onSave={(val) => {
                          const updated = [...certificationsList];
                          updated[index] = { ...cert, certificationName: val };
                          onFieldChange('certificationsList', updated);
                        }}
                      />
                    </span>
                    {cert.issueYear && (
                      <span className="text-[9.5px] text-slate-400">{cert.issueYear}</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
