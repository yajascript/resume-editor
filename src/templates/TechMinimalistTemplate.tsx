'use client';

import React from 'react';
import { ITemplateProps } from '@/types';
import { EditableText, PageBreakWrapper } from '@/components/editor';
import { translate } from '@/i18n';
import { useResumeStore } from '@/store';
import { Terminal, Mail, MapPin, Linkedin } from 'lucide-react';

export const TechMinimalistTemplate: React.FC<ITemplateProps> = ({
  resumeData,
  onFieldChange,
  accentColor = '#0f172a',
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
      className="w-full bg-white text-slate-900 p-8 flex flex-col gap-5 shadow-paper print:shadow-none min-h-full h-full text-[11px] leading-relaxed select-text flex-1"
      style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
    >
      {/* Tech Top Header */}
      <header
        id="preview-section-contact"
        onClick={() => setActiveSection('contact', 'preview')}
        className={`border-b-2 border-slate-900 pb-4 cursor-pointer rounded-xl p-2 -m-2 transition-all ${
          activeSec === 'contact' ? 'ring-2 ring-emerald-500 bg-emerald-50/20' : 'hover:ring-1 hover:ring-emerald-300/40'
        }`}
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-600" />
              <EditableText
                tag="h1"
                className="text-2xl font-bold tracking-tight text-slate-900"
                value={contactInformation.fullName}
                onSave={(val) => onFieldChange('contactInformation.fullName', val)}
              />
            </div>
            <EditableText
              tag="p"
              className="text-xs font-semibold text-emerald-700 mt-1"
              value={contactInformation.jobTitle}
              onSave={(val) => onFieldChange('contactInformation.jobTitle', val)}
            />
          </div>

          <div className="text-right text-[10px] text-slate-600 space-y-0.5">
            {contactInformation.emailAddress && (
              <div className="flex items-center justify-end gap-1.5">
                <Mail className="w-3 h-3 text-slate-500" />
                <EditableText
                  value={contactInformation.emailAddress}
                  onSave={(val) => onFieldChange('contactInformation.emailAddress', val)}
                />
              </div>
            )}
            {contactInformation.locationAddress && (
              <div className="flex items-center justify-end gap-1.5">
                <MapPin className="w-3 h-3 text-slate-500" />
                <EditableText
                  value={contactInformation.locationAddress}
                  onSave={(val) => onFieldChange('contactInformation.locationAddress', val)}
                />
              </div>
            )}
            {contactInformation.linkedinUrl && (
              <div className="flex items-center justify-end gap-1.5">
                <Linkedin className="w-3 h-3 text-slate-500" />
                <EditableText
                  value={contactInformation.linkedinUrl}
                  onSave={(val) => onFieldChange('contactInformation.linkedinUrl', val)}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Tech Stack Chips */}
      {sectionVisibility.skills !== false && skillsList.length > 0 && (
        <section
          id="preview-section-skills"
          onClick={() => setActiveSection('skills', 'preview')}
          className={`bg-slate-50 border border-slate-200 p-3 rounded cursor-pointer transition-all ${
            activeSec === 'skills' ? 'ring-2 ring-emerald-500 bg-emerald-50/30' : 'hover:ring-1 hover:ring-emerald-300/40'
          }`}
        >
          <h2 className="text-[10.5px] font-bold uppercase text-slate-700 mb-1.5">
            {'>'} {translate(lang, 'resume.sections.skills')}
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {skillsList.map((skill, index) => (
              <span
                key={index}
                className="bg-white border border-slate-300 px-2 py-0.5 rounded text-[10px] text-slate-800 font-medium"
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
              activeSec === 'summary' ? 'ring-2 ring-emerald-500 bg-emerald-50/20' : 'hover:ring-1 hover:ring-emerald-300/40'
            }`}
          >
            <h2 className="text-[11px] font-bold uppercase text-slate-900 border-b border-slate-200 pb-1 mb-1.5">
              {'>'} {translate(lang, 'resume.sections.profile')}
            </h2>
            <p className="text-[10px] text-slate-700 leading-relaxed text-justify">
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
              activeSec === 'experience' ? 'ring-2 ring-emerald-500 bg-emerald-50/20' : 'hover:ring-1 hover:ring-emerald-300/40'
            }`}
          >
            <h2 className="text-[11px] font-bold uppercase text-slate-900 border-b border-slate-200 pb-1 mb-2.5">
              {'>'} {translate(lang, 'resume.sections.experience')}
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
                      <div className="font-bold text-[11px] text-slate-900">
                        <EditableText
                          value={exp.jobTitle}
                          onSave={(val) => {
                            const updated = [...experienceList];
                            updated[index] = { ...exp, jobTitle: val };
                            onFieldChange('experienceList', updated);
                          }}
                        />
                        <span className="text-emerald-700 font-semibold ml-1.5">
                          @{exp.companyName}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        [{exp.startDate} - {exp.endDate || translate(lang, 'resume.sections.present')}]
                      </span>
                    </div>
                    <ul className="list-none pl-2 mt-1 space-y-0.5">
                      {exp.bulletPoints.map((bullet, bulletIdx) => (
                        <li key={bulletIdx} className="text-[10px] text-slate-700 leading-snug flex items-start gap-1.5 text-justify">
                          <span className="text-emerald-600 font-bold shrink-0">$</span>
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
              activeSec === 'projects' ? 'ring-2 ring-emerald-500 bg-emerald-50/20' : 'hover:ring-1 hover:ring-emerald-300/40'
            }`}
          >
            <h2 className="text-[11px] font-bold uppercase text-slate-900 border-b border-slate-200 pb-1 mb-2">
              {'>'} {translate(lang, 'resume.sections.projects')}
            </h2>
            <div className="flex flex-col gap-2.5">
              {projectsList.map((proj, index) => (
                <PageBreakWrapper
                  key={proj.identifier || index}
                  pageBreakBefore={proj.pageBreakBefore}
                  onTogglePageBreak={() => toggleItemPageBreak('projects', proj.identifier)}
                >
                  <div>
                    <div className="font-bold text-[10.5px] text-slate-900">
                      <EditableText
                        value={proj.projectTitle}
                        onSave={(val) => {
                          const updated = [...projectsList];
                          updated[index] = { ...proj, projectTitle: val };
                          onFieldChange('projectsList', updated);
                        }}
                      />
                      {proj.projectSubtitle && (
                        <span className="text-slate-500 font-normal ml-1">
                          ({proj.projectSubtitle})
                        </span>
                      )}
                    </div>
                    {proj.bulletPoints.map((b, bIdx) => (
                      <p key={bIdx} className="text-[10px] text-slate-700 pl-2 mt-0.5 text-justify">
                        - {b}
                      </p>
                    ))}
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
              activeSec === 'education' ? 'ring-2 ring-emerald-500 bg-emerald-50/20' : 'hover:ring-1 hover:ring-emerald-300/40'
            }`}
          >
            <h2 className="text-[11px] font-bold uppercase text-slate-900 border-b border-slate-200 pb-1 mb-2">
              {'>'} {translate(lang, 'resume.sections.education')}
            </h2>
            <div className="flex flex-col gap-1.5">
              {educationList.map((edu, index) => (
                <PageBreakWrapper
                  key={edu.identifier || index}
                  pageBreakBefore={edu.pageBreakBefore}
                  onTogglePageBreak={() => toggleItemPageBreak('education', edu.identifier)}
                >
                  <div className="flex justify-between items-baseline text-[10px]">
                    <div>
                      <span className="font-bold text-slate-900">{edu.degreeName}</span>
                      <span className="text-slate-600 ml-1.5">[{edu.institutionName}]</span>
                    </div>
                    <span className="text-slate-500">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                </PageBreakWrapper>
              ))}
            </div>
          </section>
        </PageBreakWrapper>
      )}
    </div>
  );
};
