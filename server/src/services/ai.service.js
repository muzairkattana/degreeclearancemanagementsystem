/**
 * Institutional Clearance Knowledge Base for UET Mardan
 */
const KNOWLEDGE_BASE = [
  {
    topic: 'clearance_steps',
    keywords: ['how to apply', 'clearance process', 'steps', 'procedure', 'how does clearance work', 'clearance'],
    answer: `The UET Mardan Degree Clearance workflow operates across 8 departmental checks concurrently:
1. Submit your application online through this portal under "Apply Clearance".
2. The system dispatches parallel verification requests to all 8 offices: Admission, Accounts, Library, Hostel, Store, Transport, FYP Coordinator, and Career Liaison Office (CLO).
3. Track each department's review live on your Student Dashboard.
4. When all 8 departments approve, your official Degree Clearance Certificate is generated automatically with a verified ID.
5. Present the Clearance Certificate to the Examination Branch to receive your Degree and Transcripts.`
  },
  {
    topic: 'accounts',
    keywords: ['fee', 'dues', 'challan', 'accounts', 'fine', 'payment'],
    answer: `Accounts Office Clearance Requirements:
- All semester tuition fees, examination fees, and any pending semester charges must be paid in full.
- If you made recent manual bank payments via Bank of Khyber, upload the verified bank-stamped challan copy.
- Once the Accounts Officer verifies no balance is owed, your Accounts verification is marked Approved.`
  },
  {
    topic: 'library',
    keywords: ['book', 'library', 'borrowed', 'security deposit', 'deposit'],
    answer: `University Library Clearance Requirements:
- Return all issued textbooks, reference manuals, or borrowed library materials.
- Any overdue library fine must be cleared at the library desk.
- Once returned, the Librarian approves your library record and triggers your library security refund status.`
  },
  {
    topic: 'hostel',
    keywords: ['hostel', 'room', 'warden', 'allotment', 'mess', 'hall'],
    answer: `Hostel Office Clearance:
- Applicable for resident students. You must hand over room keys and inventory (furniture, fittings) to your Hostel Warden.
- Outstanding hostel mess or utility dues must be settled.
- Non-resident (day-scholar) students are automatically marked clear by the Provost/Hostel Officer upon verification.`
  },
  {
    topic: 'fyp',
    keywords: ['fyp', 'project', 'coordinator', 'hard copy', 'thesis', 'cd'],
    answer: `Final Year Project (FYP) Clearance:
- Submit the final approved project hardcopy book signed by your project supervisor and internal/external examiners.
- Submit the project source code and documentation repository to the departmental FYP Coordinator.
- The FYP Coordinator will then grant final academic project clearance.`
  },
  {
    topic: 'certificate_download',
    keywords: ['download', 'certificate', 'pdf', 'print', 'where is certificate'],
    answer: `To download your official Degree Clearance Certificate:
- Check your Student Dashboard. Once all 8 departments show "VERIFIED / APPROVED", the status turns green to "COMPLETED".
- A "Download Clearance Certificate (PDF)" button appears immediately.
- The generated PDF includes official stamps, certificate serial number, and sign-off blocks accepted by the Controller of Examinations.`
  }
];

export const processChatMessage = async (userMessage) => {
  const query = userMessage.toLowerCase().trim();

  // Find best matching topic
  let bestMatch = null;
  let maxScore = 0;

  for (const item of KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of item.keywords) {
      if (query.includes(kw)) {
        score += 2;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && maxScore > 0) {
    return {
      reply: bestMatch.answer,
      topic: bestMatch.topic,
      source: 'UET Mardan Academic ERP Knowledge Base',
    };
  }

  // Friendly Fallback
  return {
    reply: `Hello! I am your UET Mardan AI Clearance Assistant. 
You can ask me about:
• How to start or track your Clearance Application
• Accounts & tuition fee dues clearance
• Library book returns & security clearance
• Hostel room handover procedures
• Final Year Project (FYP) thesis sign-off
• How to download your official Clearance Certificate once approved.`,
    topic: 'general',
    source: 'UET Mardan AI System',
  };
};
