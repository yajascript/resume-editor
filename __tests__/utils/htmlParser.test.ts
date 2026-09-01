import { describe, it, expect } from 'vitest';
import { SmartResumeParser } from '@/utils/htmlParser';

describe('SmartResumeParser', () => {
  it('should parse HTML templates and extract contact and section data accurately', () => {
    const sampleHtml = `
      <div class="resume-container">
        <div class="name-block">
          <h1>John Smith, ing.</h1>
        </div>
        <ul class="contact-list">
          <li><span>(514) 555-0199</span></li>
          <li><span>john.smith@example.com</span></li>
          <li><span>Montréal, QC</span></li>
        </ul>
        <main class="main-content">
          <section>
            <div class="section-title">Profil</div>
            <p class="profile-text">Ingénieur civil avec plus de 2 ans d'expérience.</p>
          </section>
        </main>
      </div>
    `;

    const result = SmartResumeParser.parse(sampleHtml);

    expect(result.contactInformation.fullName).toBe('John Smith, ing.');
    expect(result.contactInformation.phoneNumber).toBe('(514) 555-0199');
    expect(result.contactInformation.emailAddress).toBe('john.smith@example.com');
    expect(result.contactInformation.locationAddress).toBe('Montréal, QC');
    expect(result.profileSummary).toBe("Ingénieur civil avec plus de 2 ans d'expérience.");
  });

  it('should parse standard JSON resume formats', () => {
    const sampleJsonResume = JSON.stringify({
      basics: {
        name: 'Jane Doe',
        label: 'Senior Architect',
        email: 'jane.doe@example.com',
        phone: '(555) 123-4567',
        summary: 'Experienced cloud architect.',
        location: { city: 'Boston', region: 'MA' },
      },
      work: [
        {
          position: 'Lead Engineer',
          name: 'Tech Corp',
          startDate: '2020',
          endDate: '2023',
          highlights: ['Architected distributed infrastructure.'],
        },
      ],
      skills: ['TypeScript', 'Kubernetes'],
    });

    const result = SmartResumeParser.parse(sampleJsonResume);

    expect(result.contactInformation.fullName).toBe('Jane Doe');
    expect(result.contactInformation.jobTitle).toBe('Senior Architect');
    expect(result.contactInformation.emailAddress).toBe('jane.doe@example.com');
    expect(result.experienceList).toHaveLength(1);
    expect(result.experienceList[0].jobTitle).toBe('Lead Engineer');
    expect(result.experienceList[0].companyName).toBe('Tech Corp');
    expect(result.skillsList).toContain('TypeScript');
  });

  it('should parse plain text resumes gracefully', () => {
    const rawText = `
      Alex Martin
      Software Developer
      alex.martin@example.com
      (123) 456-7890
      Full stack engineer with a passion for web technologies.
    `;

    const result = SmartResumeParser.parse(rawText);

    expect(result.contactInformation.fullName).toBe('Alex Martin');
    expect(result.contactInformation.jobTitle).toBe('Software Developer');
    expect(result.contactInformation.emailAddress).toBe('alex.martin@example.com');
    expect(result.contactInformation.phoneNumber).toBe('(123) 456-7890');
  });
});
