# XTRACY Technical Boundaries & Known Limitations

> **Initiative:** PXT sec26  
> **Team:** Anshika Goswami, Harvi Patel, Dhruvi Solanki  

---

## 1. Environment & API Key Abstractions

XTRACY is designed to run 100% locally with zero paid infrastructure dependencies. When optional third-party services are unconfigured, XTRACY seamlessly uses built-in defensive rule engines:

1. **Defensive AI Assistant (`/assistant`)**:
   - **Configured**: Calls OpenAI GPT-4o-mini API server-side when `OPENAI_API_KEY` is present.
   - **Fallback**: Uses XTRACY's built-in Defensive Cyber Safety Rule Engine providing structured defensive advice across Beginner, Student, and Professional reading modes.
2. **Database Persistence (`prisma/schema.prisma`)**:
   - **Configured**: Persists data to PostgreSQL database via Prisma ORM when `DATABASE_URL` is set.
   - **Fallback**: Routes data queries to XTRACY's local memory repository store during local development.
3. **Live Vulnerability Intelligence (`/api/threat-intelligence`)**:
   - **Configured**: Fetches live CISA KEV JSON dataset directly from CISA.gov.
   - **Fallback**: Uses XTRACY verified offline advisory dataset if external internet fetch fails.

---

## 2. Defensive Boundaries & Safety Guarantees

1. **Non-Automated Emergency Calling**: Emergency contact cards provide direct-dial `tel:` links (`tel:112`, `tel:181`, `tel:100`, `tel:1930`). XTRACY does NOT automatically place phone calls or dispatch emergency services without explicit user interaction.
2. **No Offensive Security Tools**: XTRACY strictly refuses requests or features involving credential harvesting, phishing kit creation, brute-forcing, malware generation, or unauthorized network targeting.
