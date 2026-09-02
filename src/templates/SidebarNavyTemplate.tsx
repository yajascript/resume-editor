'use client';

import React from 'react';
import { ITemplateProps } from '@/types';
import { EditableText, PageBreakWrapper } from '@/components/editor';
import {
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Globe,
  User,
  GraduationCap,
  Briefcase,
  Award,
  IdCard,
  Shield,
  PlusSquare,
  FolderGit2,
} from 'lucide-react';
import { translate } from '@/i18n';
import { useResumeStore } from '@/store';

export const SidebarNavyTemplate: React.FC<ITemplateProps> = ({
  resumeData,
  onFieldChange,
  accentColor = '#0b2545',
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

  const getCertIcon = (iconName?: string) => {
    switch (iconName) {
      case 'shield':
        return <Shield className="w-3.5 h-3.5 text-[#3897f0] shrink-0 mt-0.5" />;
      case 'plus-square':
        return <PlusSquare className="w-3.5 h-3.5 text-[#3897f0] shrink-0 mt-0.5" />;
      default:
        return <IdCard className="w-3.5 h-3.5 text-[#3897f0] shrink-0 mt-0.5" />;
    }
  };

  return (
    <div
      id="resume-sheet"
      className="w-full bg-white text-[#333333] flex flex-row items-stretch min-h-full h-full shadow-paper print:shadow-none text-[11px] leading-relaxed select-text flex-1"
      style={{ fontFamily: "'Open Sans', Arial, sans-serif" }}
    >
      {/* LEFT SIDEBAR (32%) - Stretches full multi-page height */}
      <aside
        className="w-[32%] text-white p-7 flex flex-col gap-6 shrink-0 self-stretch min-h-full print:bg-[#0b2545]"
        style={{ backgroundColor: accentColor || '#0b2545' }}
      >
        {/* Contact Block */}
        <div
          id="preview-section-contact"
          onClick={() => setActiveSection('contact', 'preview')}
          className={`border-b-2 border-[#2980b9] pb-5 cursor-pointer transition-all ${
            activeSec === 'contact' ? 'outline-none ring-1 ring-blue-300/60 pl-1' : 'hover:opacity-95'
          }`}
        >
          <EditableText
            tag="h1"
            className="text-[23px] font-extrabold leading-tight text-white tracking-tight break-words"
            value={contactInformation.fullName}
            onSave={(val) => onFieldChange('contactInformation.fullName', val)}
            placeholder="Votre Nom"
          />
          {contactInformation.jobTitle && (
            <EditableText
              tag="p"
              className="text-[12px] font-semibold text-[#85b9e0] mt-1.5"
              value={contactInformation.jobTitle}
              onSave={(val) => onFieldChange('contactInformation.jobTitle', val)}
              placeholder="Titre Professionnel"
            />
          )}

          {/* Contact List */}
          <ul className="flex flex-col gap-2.5 text-[11px] text-[#d1d8e0] mt-4">
            {contactInformation.phoneNumber && (
              <li className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-[#3897f0] shrink-0" />
                <EditableText
                  value={contactInformation.phoneNumber}
                  onSave={(val) => onFieldChange('contactInformation.phoneNumber', val)}
                  className="text-[#d1d8e0]"
                />
              </li>
            )}

            {contactInformation.emailAddress && (
              <li className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-[#3897f0] shrink-0" />
                <EditableText
                  value={contactInformation.emailAddress}
                  onSave={(val) => onFieldChange('contactInformation.emailAddress', val)}
                  className="text-[#d1d8e0] break-all"
                />
              </li>
            )}

            {contactInformation.locationAddress && (
              <li className="flex items-center gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-[#3897f0] shrink-0" />
                <EditableText
                  value={contactInformation.locationAddress}
                  onSave={(val) => onFieldChange('contactInformation.locationAddress', val)}
                  className="text-[#d1d8e0]"
                />
              </li>
            )}

            {contactInformation.linkedinUrl && (
              <li className="flex items-center gap-2.5">
                <Linkedin className="w-3.5 h-3.5 text-[#3897f0] shrink-0" />
                <EditableText
                  value={contactInformation.linkedinUrl}
                  onSave={(val) => onFieldChange('contactInformation.linkedinUrl', val)}
                  className="text-[#d1d8e0] break-all"
                />
              </li>
            )}

            {contactInformation.websiteUrl && (
              <li className="flex items-center gap-2.5">
                <Globe className="w-3.5 h-3.5 text-[#3897f0] shrink-0" />
                <EditableText
                  value={contactInformation.websiteUrl}
                  onSave={(val) => onFieldChange('contactInformation.websiteUrl', val)}
                  className="text-[#d1d8e0] break-all"
                />
              </li>
            )}
          </ul>
        </div>

        {/* Skills Section */}
        {sectionVisibility.skills !== false && skillsList.length > 0 && (
          <div
            id="preview-section-skills"
            onClick={() => setActiveSection('skills', 'preview')}
            className={`border-t border-[#1c3b63] pt-4.5 cursor-pointer transition-all ${
              activeSec === 'skills' ? 'outline-none ring-1 ring-blue-300/60 pl-1' : 'hover:opacity-95'
            }`}
          >
            <h3 className="text-[11.5px] font-bold uppercase tracking-wider text-white mb-2.5">
              {translate(lang, 'resume.sections.skills')}
            </h3>
            <ul className="list-disc pl-4 text-[11px] leading-relaxed text-[#d1d8e0] space-y-1">
              {skillsList.map((skill, index) => (
                <li key={index}>
                  <EditableText
                    value={skill}
                    onSave={(val) => {
                      const updated = [...skillsList];
                      updated[index] = val;
                      onFieldChange('skillsList', updated);
                    }}
                    className="text-[#d1d8e0]"
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Languages Section */}
        {sectionVisibility.languages !== false && languagesList.length > 0 && (
          <div
            id="preview-section-languages"
            onClick={() => setActiveSection('languages', 'preview')}
            className={`border-t border-[#1c3b63] pt-4.5 cursor-pointer transition-all ${
              activeSec === 'languages' ? 'outline-none ring-1 ring-blue-300/60 pl-1' : 'hover:opacity-95'
            }`}
          >
            <h3 className="text-[11.5px] font-bold uppercase tracking-wider text-white mb-2.5">
              {translate(lang, 'resume.sections.languages')}
            </h3>
            <ul className="list-disc pl-4 text-[11px] leading-relaxed text-[#d1d8e0] space-y-1">
              {languagesList.map((language, index) => (
                <li key={index}>
                  <EditableText
                    value={language}
                    onSave={(val) => {
                      const updated = [...languagesList];
                      updated[index] = val;
                      onFieldChange('languagesList', updated);
                    }}
                    className="text-[#d1d8e0]"
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Certifications Section */}
        {sectionVisibility.certifications !== false && certificationsList.length > 0 && (
          <div
            id="preview-section-certifications"
            onClick={() => setActiveSection('certifications', 'preview')}
            className={`border-t border-[#1c3b63] pt-4.5 cursor-pointer transition-all ${
              activeSec === 'certifications' ? 'outline-none ring-1 ring-blue-300/60 pl-1' : 'hover:opacity-95'
            }`}
          >
            <h3 className="text-[11.5px] font-bold uppercase tracking-wider text-white mb-2.5">
              {translate(lang, 'resume.sections.certifications')}
            </h3>
            <ul className="flex flex-col gap-3 text-[10.5px] text-[#d1d8e0] leading-snug">
              {certificationsList.map((cert, index) => (
                <li key={cert.identifier || index} className="flex items-start gap-2.5">
                  {getCertIcon(cert.iconName)}
                  <div>
                    <EditableText
                      value={cert.certificationName}
                      onSave={(val) => {
                        const updated = [...certificationsList];
                        updated[index] = { ...cert, certificationName: val };
                        onFieldChange('certificationsList', updated);
                      }}
                      className="text-[#d1d8e0] font-medium"
                    />
                    {cert.issueYear && (
                      <span className="text-[10px] text-[#8fa7c2] ml-1">
                        ({cert.issueYear})
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      {/* RIGHT MAIN CONTENT (68%) */}
      <main className="w-[68%] p-8 flex flex-col gap-5 shrink-0 flex-1">
        {/* Profile Summary */}
        {sectionVisibility.profile !== false && profileSummary && (
          <PageBreakWrapper
            pageBreakBefore={sectionPageBreaks.profile}
            onTogglePageBreak={() => toggleSectionPageBreak('profile')}
            isHeader
          >
            <section
              id="preview-section-summary"
              onClick={() => setActiveSection('summary', 'preview')}
              className={`cursor-pointer rounded-xl p-2.5 -m-2.5 transition-all ${
                activeSec === 'summary' ? 'ring-2 ring-blue-500 bg-blue-50/20' : 'hover:ring-1 hover:ring-blue-300/40'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <div
                  className="w-6 h-6 rounded-full text-white flex items-center justify-center text-[11px] shrink-0"
                  style={{ backgroundColor: accentColor || '#1a4473' }}
                >
                  <User className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-[12px] font-extrabold uppercase tracking-wide text-black whitespace-nowrap">
                  {translate(lang, 'resume.sections.profile')}
                </h2>
                <div className="grow h-[1px] bg-[#b0bec5] ml-1" />
              </div>
              <p className="text-[11px] leading-relaxed text-[#333333] pl-8 text-justify">
                <EditableText
                  multiline
                  value={profileSummary}
                  onSave={(val) => onFieldChange('profileSummary', val)}
                  className="text-[#333333]"
                />
              </p>
            </section>
          </PageBreakWrapper>
        )}

        {/* Education Section */}
        {sectionVisibility.education !== false && educationList.length > 0 && (
          <PageBreakWrapper
            pageBreakBefore={sectionPageBreaks.education}
            onTogglePageBreak={() => toggleSectionPageBreak('education')}
            isHeader
          >
            <section
              id="preview-section-education"
              onClick={() => setActiveSection('education', 'preview')}
              className={`cursor-pointer rounded-xl p-2.5 -m-2.5 transition-all ${
                activeSec === 'education' ? 'ring-2 ring-blue-500 bg-blue-50/20' : 'hover:ring-1 hover:ring-blue-300/40'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div
                  className="w-6 h-6 rounded-full text-white flex items-center justify-center text-[11px] shrink-0"
                  style={{ backgroundColor: accentColor || '#1a4473' }}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-[12px] font-extrabold uppercase tracking-wide text-black whitespace-nowrap">
                  {translate(lang, 'resume.sections.education')}
                </h2>
                <div className="grow h-[1px] bg-[#b0bec5] ml-1" />
              </div>

              <div className="flex flex-col gap-3.5 pl-0.5">
                {educationList.map((edu, index) => (
                  <PageBreakWrapper
                    key={edu.identifier || index}
                    pageBreakBefore={edu.pageBreakBefore}
                    onTogglePageBreak={() => toggleItemPageBreak('education', edu.identifier)}
                  >
                    <div className="grid grid-cols-[76px_12px_1fr] gap-x-2 text-[10.5px]">
                      {/* Date Column */}
                      <div className="text-right font-semibold text-[#333333] text-[10px] leading-tight pt-0.5">
                        <EditableText
                          value={`${edu.startDate}${edu.endDate ? ` – ${edu.endDate}` : ''}`}
                          onSave={(val) => {
                            const parts = val.split(/[–-]/).map((s) => s.trim());
                            const updated = [...educationList];
                            updated[index] = { ...edu, startDate: parts[0] || '', endDate: parts[1] || '' };
                            onFieldChange('educationList', updated);
                          }}
                        />
                      </div>

                      {/* Timeline Dot & Line */}
                      <div className="relative flex justify-center">
                        <div
                          className="w-1.5 h-1.5 rounded-full mt-1.5 z-10"
                          style={{ backgroundColor: accentColor || '#1a4473' }}
                        />
                        {index < educationList.length - 1 && (
                          <div className="absolute top-2.5 bottom-[-14px] w-[1px] bg-[#b0bec5]" />
                        )}
                      </div>

                      {/* Details Column */}
                      <div className="flex flex-col gap-0.5 pl-1">
                        <div>
                          <EditableText
                            className="font-bold text-black text-[11px]"
                            value={edu.degreeName}
                            onSave={(val) => {
                              const updated = [...educationList];
                              updated[index] = { ...edu, degreeName: val };
                              onFieldChange('educationList', updated);
                            }}
                          />
                          {edu.institutionName && (
                            <div className="text-[#4f5b66] text-[10.5px]">
                              <EditableText
                                value={edu.institutionName + (edu.locationName ? `, ${edu.locationName}` : '')}
                                onSave={(val) => {
                                  const updated = [...educationList];
                                  updated[index] = { ...edu, institutionName: val };
                                  onFieldChange('educationList', updated);
                                }}
                              />
                            </div>
                          )}
                        </div>

                        {edu.specialization && (
                          <ul className="list-disc pl-3.5 mt-0.5">
                            <li className="text-[10px] text-[#333333] leading-snug">
                              <span className="font-semibold">{translate(lang, 'resume.sections.specialization')}: </span>
                              <EditableText
                                value={edu.specialization}
                                onSave={(val) => {
                                  const updated = [...educationList];
                                  updated[index] = { ...edu, specialization: val };
                                  onFieldChange('educationList', updated);
                                }}
                              />
                            </li>
                          </ul>
                        )}
                      </div>
                    </div>
                  </PageBreakWrapper>
                ))}
              </div>
            </section>
          </PageBreakWrapper>
        )}

        {/* Projects Section */}
        {sectionVisibility.projects !== false && projectsList.length > 0 && (
          <PageBreakWrapper
            pageBreakBefore={sectionPageBreaks.projects}
            onTogglePageBreak={() => toggleSectionPageBreak('projects')}
            isHeader
          >
            <section
              id="preview-section-projects"
              onClick={() => setActiveSection('projects', 'preview')}
              className={`cursor-pointer rounded-xl p-2.5 -m-2.5 transition-all ${
                activeSec === 'projects' ? 'ring-2 ring-blue-500 bg-blue-50/20' : 'hover:ring-1 hover:ring-blue-300/40'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div
                  className="w-6 h-6 rounded-full text-white flex items-center justify-center text-[11px] shrink-0"
                  style={{ backgroundColor: accentColor || '#1a4473' }}
                >
                  <FolderGit2 className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-[12px] font-extrabold uppercase tracking-wide text-black whitespace-nowrap">
                  {translate(lang, 'resume.sections.projects')}
                </h2>
                <div className="grow h-[1px] bg-[#b0bec5] ml-1" />
              </div>

              <div className="flex flex-col gap-3.5 pl-0.5">
                {projectsList.map((proj, index) => (
                  <PageBreakWrapper
                    key={proj.identifier || index}
                    pageBreakBefore={proj.pageBreakBefore}
                    onTogglePageBreak={() => toggleItemPageBreak('projects', proj.identifier)}
                  >
                    <div className="grid grid-cols-[76px_12px_1fr] gap-x-2 text-[10.5px]">
                      {/* Date Column */}
                      <div className="text-right font-semibold text-[#333333] text-[10px] leading-tight pt-0.5">
                        <EditableText
                          value={`${proj.startDate || ''}${proj.endDate ? ` –\n${proj.endDate}` : ''}`}
                          onSave={(val) => {
                            const parts = val.split(/[–-]/).map((s) => s.trim());
                            const updated = [...projectsList];
                            updated[index] = { ...proj, startDate: parts[0] || '', endDate: parts[1] || '' };
                            onFieldChange('projectsList', updated);
                          }}
                        />
                      </div>

                      {/* Timeline Dot & Line */}
                      <div className="relative flex justify-center">
                        <div
                          className="w-1.5 h-1.5 rounded-full mt-1.5 z-10"
                          style={{ backgroundColor: accentColor || '#1a4473' }}
                        />
                        {index < projectsList.length - 1 && (
                          <div className="absolute top-2.5 bottom-[-14px] w-[1px] bg-[#b0bec5]" />
                        )}
                      </div>

                      {/* Details Column */}
                      <div className="flex flex-col gap-0.5 pl-1">
                        <div>
                          <EditableText
                            className="font-bold text-black text-[11px]"
                            value={proj.projectTitle}
                            onSave={(val) => {
                              const updated = [...projectsList];
                              updated[index] = { ...proj, projectTitle: val };
                              onFieldChange('projectsList', updated);
                            }}
                          />
                          {proj.projectSubtitle && (
                            <span className="text-[#4f5b66] text-[10.5px]">
                              {' – '}
                              <EditableText
                                value={proj.projectSubtitle}
                                onSave={(val) => {
                                  const updated = [...projectsList];
                                  updated[index] = { ...proj, projectSubtitle: val };
                                  onFieldChange('projectsList', updated);
                                }}
                              />
                            </span>
                          )}
                        </div>

                        {proj.bulletPoints.length > 0 && (
                          <ul className="list-disc pl-3.5 mt-0.5 space-y-1">
                            {proj.bulletPoints.map((bullet, bulletIdx) => (
                              <li key={bulletIdx} className="text-[10px] text-[#333333] leading-snug text-justify">
                                <EditableText
                                  multiline
                                  value={bullet}
                                  onSave={(val) => {
                                    const updated = [...projectsList];
                                    const bullets = [...proj.bulletPoints];
                                    bullets[bulletIdx] = val;
                                    updated[index] = { ...proj, bulletPoints: bullets };
                                    onFieldChange('projectsList', updated);
                                  }}
                                />
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </PageBreakWrapper>
                ))}
              </div>
            </section>
          </PageBreakWrapper>
        )}

        {/* Work Experience Section */}
        {sectionVisibility.experience !== false && experienceList.length > 0 && (
          <PageBreakWrapper
            pageBreakBefore={sectionPageBreaks.experience}
            onTogglePageBreak={() => toggleSectionPageBreak('experience')}
            isHeader
          >
            <section
              id="preview-section-experience"
              onClick={() => setActiveSection('experience', 'preview')}
              className={`cursor-pointer rounded-xl p-2.5 -m-2.5 transition-all ${
                activeSec === 'experience' ? 'ring-2 ring-blue-500 bg-blue-50/20' : 'hover:ring-1 hover:ring-blue-300/40'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div
                  className="w-6 h-6 rounded-full text-white flex items-center justify-center text-[11px] shrink-0"
                  style={{ backgroundColor: accentColor || '#1a4473' }}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-[12px] font-extrabold uppercase tracking-wide text-black whitespace-nowrap">
                  {translate(lang, 'resume.sections.experience')}
                </h2>
                <div className="grow h-[1px] bg-[#b0bec5] ml-1" />
              </div>

              <div className="flex flex-col gap-3.5 pl-0.5">
                {experienceList.map((exp, index) => (
                  <PageBreakWrapper
                    key={exp.identifier || index}
                    pageBreakBefore={exp.pageBreakBefore}
                    onTogglePageBreak={() => toggleItemPageBreak('experience', exp.identifier)}
                  >
                    <div className="grid grid-cols-[76px_12px_1fr] gap-x-2 text-[10.5px]">
                      {/* Date Column */}
                      <div className="text-right font-semibold text-[#333333] text-[10px] leading-tight pt-0.5">
                        <EditableText
                          value={`${exp.startDate} –\n${exp.endDate || (exp.isCurrentRole ? translate(lang, 'resume.sections.present') : '')}`}
                          onSave={(val) => {
                            const parts = val.split(/[–-]/).map((s) => s.trim());
                            const updated = [...experienceList];
                            updated[index] = { ...exp, startDate: parts[0] || '', endDate: parts[1] || '' };
                            onFieldChange('experienceList', updated);
                          }}
                        />
                      </div>

                      {/* Timeline Dot & Line */}
                      <div className="relative flex justify-center">
                        <div
                          className="w-1.5 h-1.5 rounded-full mt-1.5 z-10"
                          style={{ backgroundColor: accentColor || '#1a4473' }}
                        />
                        {index < experienceList.length - 1 && (
                          <div className="absolute top-2.5 bottom-[-14px] w-[1px] bg-[#b0bec5]" />
                        )}
                      </div>

                      {/* Details Column */}
                      <div className="flex flex-col gap-0.5 pl-1">
                        <div>
                          <EditableText
                            className="font-bold text-black text-[11px]"
                            value={exp.jobTitle}
                            onSave={(val) => {
                              const updated = [...experienceList];
                              updated[index] = { ...exp, jobTitle: val };
                              onFieldChange('experienceList', updated);
                            }}
                          />
                          {exp.companyName && (
                            <div className="text-[#4f5b66] text-[10.5px]">
                              <EditableText
                                value={exp.companyName + (exp.locationName ? `, ${exp.locationName}` : '')}
                                onSave={(val) => {
                                  const updated = [...experienceList];
                                  updated[index] = { ...exp, companyName: val };
                                  onFieldChange('experienceList', updated);
                                }}
                              />
                            </div>
                          )}
                        </div>

                        {exp.bulletPoints.length > 0 && (
                          <ul className="list-disc pl-3.5 mt-1 space-y-0.5">
                            {exp.bulletPoints.map((bullet, bulletIdx) => (
                              <li key={bulletIdx} className="text-[10px] text-[#333333] leading-snug text-justify">
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
                        )}
                      </div>
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
              className={`cursor-pointer rounded-xl p-2.5 -m-2.5 transition-all ${
                activeSec === 'custom' ? 'ring-2 ring-blue-500 bg-blue-50/20' : 'hover:ring-1 hover:ring-blue-300/40'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div
                  className="w-6 h-6 rounded-full text-white flex items-center justify-center text-[11px] shrink-0"
                  style={{ backgroundColor: accentColor || '#1a4473' }}
                >
                  <Award className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-[12px] font-extrabold uppercase tracking-wide text-black whitespace-nowrap">
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
                <div className="grow h-[1px] bg-[#b0bec5] ml-1" />
              </div>

              <div className="flex flex-col gap-3 pl-0.5">
                {sec.items.map((item, itemIdx) => (
                  <PageBreakWrapper
                    key={item.identifier || itemIdx}
                    pageBreakBefore={item.pageBreakBefore}
                    onTogglePageBreak={() => toggleItemPageBreak('custom', sec.identifier, item.identifier)}
                  >
                    <div className="pl-8 text-[10.5px]">
                      <div className="flex justify-between items-baseline">
                        <EditableText
                          className="font-bold text-black"
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
                          <span className="text-[10px] text-[#666666]">{item.dateRange}</span>
                        )}
                      </div>
                      {item.bulletPoints.map((b, bIdx) => (
                        <p key={bIdx} className="text-[10px] text-[#333333] mt-0.5 text-justify">
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
      </main>
    </div>
  );
};
