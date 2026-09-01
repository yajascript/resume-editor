import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
} from 'docx';
import { saveAs } from 'file-saver';
import { IResumeData } from '@/types';

export class DocxExporter {
  public static async export(resumeData: IResumeData, fileName?: string): Promise<void> {
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
    } = resumeData;

    const targetName = fileName || `${contactInformation.fullName.replace(/\s+/g, '_')}_CV.docx`;

    // Build Word Document
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: { top: 720, bottom: 720, left: 720, right: 720 }, // 0.5 inch margins
              size: { width: 12240, height: 15840 }, // Standard US Letter (DXA)
            },
          },
          children: [
            // Header / Contact Info Table
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.SINGLE, size: 12, color: '0B2545' },
                right: { style: BorderStyle.NONE },
                insideHorizontal: { style: BorderStyle.NONE },
                insideVertical: { style: BorderStyle.NONE },
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 100, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.LEFT,
                          children: [
                            new TextRun({
                              text: contactInformation.fullName,
                              bold: true,
                              size: 36, // 18pt
                              color: '0B2545',
                              font: 'Arial',
                            }),
                          ],
                        }),
                        new Paragraph({
                          alignment: AlignmentType.LEFT,
                          children: [
                            new TextRun({
                              text: contactInformation.jobTitle,
                              bold: true,
                              size: 24, // 12pt
                              color: '2980B9',
                              font: 'Arial',
                            }),
                          ],
                        }),
                        new Paragraph({
                          spacing: { after: 120 },
                          children: [
                            new TextRun({
                              text: [
                                contactInformation.emailAddress,
                                contactInformation.phoneNumber,
                                contactInformation.locationAddress,
                                contactInformation.linkedinUrl,
                              ]
                                .filter(Boolean)
                                .join('  |  '),
                              size: 20,
                              color: '555555',
                              font: 'Arial',
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),

            // Profile Summary Section
            ...(profileSummary
              ? [
                  new Paragraph({
                    spacing: { before: 200, after: 60 },
                    children: [
                      new TextRun({
                        text: 'PROFIL',
                        bold: true,
                        size: 22,
                        color: '0B2545',
                        font: 'Arial',
                      }),
                    ],
                  }),
                  new Paragraph({
                    spacing: { after: 160 },
                    children: [
                      new TextRun({
                        text: profileSummary,
                        size: 20,
                        color: '333333',
                        font: 'Arial',
                      }),
                    ],
                  }),
                ]
              : []),

            // Experience Section
            ...(experienceList.length > 0
              ? [
                  new Paragraph({
                    spacing: { before: 200, after: 80 },
                    children: [
                      new TextRun({
                        text: 'EXPÉRIENCE DE TRAVAIL',
                        bold: true,
                        size: 22,
                        color: '0B2545',
                        font: 'Arial',
                      }),
                    ],
                  }),
                  ...experienceList.flatMap((exp) => [
                    new Paragraph({
                      spacing: { before: 100, after: 40 },
                      children: [
                        new TextRun({
                          text: exp.jobTitle,
                          bold: true,
                          size: 21,
                          color: '111111',
                          font: 'Arial',
                        }),
                        new TextRun({
                          text: exp.companyName ? ` – ${exp.companyName}` : '',
                          italics: true,
                          size: 20,
                          color: '444444',
                          font: 'Arial',
                        }),
                        new TextRun({
                          text: exp.startDate ? ` (${exp.startDate} – ${exp.endDate || 'Présent'})` : '',
                          size: 19,
                          color: '666666',
                          font: 'Arial',
                        }),
                      ],
                    }),
                    ...exp.bulletPoints.map(
                      (bullet) =>
                        new Paragraph({
                          bullet: { level: 0 },
                          spacing: { after: 30 },
                          children: [
                            new TextRun({
                              text: bullet,
                              size: 19,
                              color: '333333',
                              font: 'Arial',
                            }),
                          ],
                        })
                    ),
                  ]),
                ]
              : []),

            // Education Section
            ...(educationList.length > 0
              ? [
                  new Paragraph({
                    spacing: { before: 200, after: 80 },
                    children: [
                      new TextRun({
                        text: 'ÉDUCATION',
                        bold: true,
                        size: 22,
                        color: '0B2545',
                        font: 'Arial',
                      }),
                    ],
                  }),
                  ...educationList.flatMap((edu) => [
                    new Paragraph({
                      spacing: { before: 80, after: 30 },
                      children: [
                        new TextRun({
                          text: edu.degreeName,
                          bold: true,
                          size: 21,
                          color: '111111',
                          font: 'Arial',
                        }),
                        new TextRun({
                          text: edu.institutionName ? ` – ${edu.institutionName}` : '',
                          italics: true,
                          size: 20,
                          color: '444444',
                          font: 'Arial',
                        }),
                        new TextRun({
                          text: edu.startDate ? ` (${edu.startDate} – ${edu.endDate})` : '',
                          size: 19,
                          color: '666666',
                          font: 'Arial',
                        }),
                      ],
                    }),
                    ...(edu.specialization
                      ? [
                          new Paragraph({
                            bullet: { level: 0 },
                            children: [
                              new TextRun({
                                text: `Spécialisation: ${edu.specialization}`,
                                size: 19,
                                color: '444444',
                                font: 'Arial',
                              }),
                            ],
                          }),
                        ]
                      : []),
                  ]),
                ]
              : []),

            // Projects Section
            ...(projectsList.length > 0
              ? [
                  new Paragraph({
                    spacing: { before: 200, after: 80 },
                    children: [
                      new TextRun({
                        text: 'PROJETS',
                        bold: true,
                        size: 22,
                        color: '0B2545',
                        font: 'Arial',
                      }),
                    ],
                  }),
                  ...projectsList.flatMap((proj) => [
                    new Paragraph({
                      spacing: { before: 80, after: 30 },
                      children: [
                        new TextRun({
                          text: proj.projectTitle,
                          bold: true,
                          size: 21,
                          color: '111111',
                          font: 'Arial',
                        }),
                        new TextRun({
                          text: proj.projectSubtitle ? ` – ${proj.projectSubtitle}` : '',
                          italics: true,
                          size: 20,
                          color: '444444',
                          font: 'Arial',
                        }),
                        new TextRun({
                          text: proj.startDate ? ` (${proj.startDate} – ${proj.endDate || ''})` : '',
                          size: 19,
                          color: '666666',
                          font: 'Arial',
                        }),
                      ],
                    }),
                    ...proj.bulletPoints.map(
                      (bullet) =>
                        new Paragraph({
                          bullet: { level: 0 },
                          spacing: { after: 30 },
                          children: [
                            new TextRun({
                              text: bullet,
                              size: 19,
                              color: '333333',
                              font: 'Arial',
                            }),
                          ],
                        })
                    ),
                  ]),
                ]
              : []),

            // Skills & Languages Section
            ...(skillsList.length > 0 || languagesList.length > 0
              ? [
                  new Paragraph({
                    spacing: { before: 200, after: 80 },
                    children: [
                      new TextRun({
                        text: 'COMPÉTENCES & LANGUES',
                        bold: true,
                        size: 22,
                        color: '0B2545',
                        font: 'Arial',
                      }),
                    ],
                  }),
                  ...(skillsList.length > 0
                    ? [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: 'Compétences: ',
                              bold: true,
                              size: 20,
                              color: '333333',
                              font: 'Arial',
                            }),
                            new TextRun({
                              text: skillsList.join(', '),
                              size: 20,
                              color: '333333',
                              font: 'Arial',
                            }),
                          ],
                        }),
                      ]
                    : []),
                  ...(languagesList.length > 0
                    ? [
                        new Paragraph({
                          spacing: { before: 40 },
                          children: [
                            new TextRun({
                              text: 'Langues: ',
                              bold: true,
                              size: 20,
                              color: '333333',
                              font: 'Arial',
                            }),
                            new TextRun({
                              text: languagesList.join(', '),
                              size: 20,
                              color: '333333',
                              font: 'Arial',
                            }),
                          ],
                        }),
                      ]
                    : []),
                ]
              : []),

            // Certifications
            ...(certificationsList.length > 0
              ? [
                  new Paragraph({
                    spacing: { before: 200, after: 80 },
                    children: [
                      new TextRun({
                        text: 'PERMIS & CERTIFICATIONS',
                        bold: true,
                        size: 22,
                        color: '0B2545',
                        font: 'Arial',
                      }),
                    ],
                  }),
                  ...certificationsList.map(
                    (cert) =>
                      new Paragraph({
                        bullet: { level: 0 },
                        children: [
                          new TextRun({
                            text: `${cert.certificationName}${
                              cert.issuingOrganization ? ` (${cert.issuingOrganization})` : ''
                            }${cert.issueYear ? ` - ${cert.issueYear}` : ''}`,
                            size: 19,
                            color: '333333',
                            font: 'Arial',
                          }),
                        ],
                      })
                  ),
                ]
              : []),

            // Custom Sections
            ...customSectionsList.flatMap((sec) => [
              new Paragraph({
                spacing: { before: 200, after: 80 },
                children: [
                  new TextRun({
                    text: sec.sectionTitle.toUpperCase(),
                    bold: true,
                    size: 22,
                    color: '0B2545',
                    font: 'Arial',
                  }),
                ],
              }),
              ...sec.items.flatMap((item) => [
                new Paragraph({
                  spacing: { before: 60, after: 30 },
                  children: [
                    new TextRun({
                      text: item.itemTitle,
                      bold: true,
                      size: 20,
                      color: '111111',
                      font: 'Arial',
                    }),
                    new TextRun({
                      text: item.itemSubtitle ? ` – ${item.itemSubtitle}` : '',
                      italics: true,
                      size: 19,
                      color: '444444',
                      font: 'Arial',
                    }),
                    new TextRun({
                      text: item.dateRange ? ` (${item.dateRange})` : '',
                      size: 18,
                      color: '666666',
                      font: 'Arial',
                    }),
                  ],
                }),
                ...item.bulletPoints.map(
                  (bullet) =>
                    new Paragraph({
                      bullet: { level: 0 },
                      children: [
                        new TextRun({
                          text: bullet,
                          size: 19,
                          color: '333333',
                          font: 'Arial',
                        }),
                      ],
                    })
                ),
              ]),
            ]),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, targetName);
  }
}
