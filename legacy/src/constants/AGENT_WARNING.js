/**
 * 🚨 AI Agent Warning Constant
 * 
 * Import this in any component to remind AI agents of the rules.
 * Can be logged in development or used as a reference.
 */

export const AGENT_WARNING = `
🚨 AI Agent Notice
This is a bilingual EN/FR project.
You MUST use t('...') for all strings.
Never hardcode English or French.
See /docs/AI_AGENT_WORKFLOW.md
`;

export const I18N_RULES = {
    EN_FILE: 'src/app/i18n/en.global.json',
    FR_FILE: 'src/app/i18n/fr.fr.json',
    CHECK_COMMAND: 'npm run i18n:check',
    WORKFLOW_DOC: '/docs/AI_AGENT_WORKFLOW.md',
};

export default AGENT_WARNING;
