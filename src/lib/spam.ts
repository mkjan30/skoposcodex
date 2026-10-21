// Cold sales pitches sent through our own contact form ("we checked your website…").
// Real clients describe *their* site; pitches describe *ours* and ask for a call.
// Each pattern scores 1; two or more marks the lead as spam.
const PITCH_PATTERNS: RegExp[] = [
  /\byour (web ?site|site|seo|google|rankings?|online presence|domain|search (engine )?visibility)\b/i,
  /\b(while|after) (checking|reviewing|auditing|analy[sz]ing|looking at|visiting|browsing) your\b/i,
  /\b(we|i) (found|noticed|discovered|identified|spotted)\b[^.]{0,80}\b(issue|error|problem|element|mistake|gap)s?\b/i,
  /\b(reply|respond) with your (phone|number|contact|whatsapp)/i,
  /\b(i|we) can walk you through\b/i,
  /\b(first|top|1st) page (of|on) (google|bing)\b/i,
  /\b(guest post|backlinks?|link building|white[- ]label|outsourc\w*)\b/i,
  /\b(we are|we're|i am|i'm) (a|an) [\w\s-]{0,40}(agency|company|firm|freelancer|developer|expert)\b/i,
  /\b(our|my) (services|portfolio|team) (include|can help|will)\b/i,
  /\b(competitors?) (are |continue |keep )?(taking|getting|stealing|outranking)\b/i,
  /\bnot (being )?(properly )?(crawled|indexed)\b/i,
  /\b(unsubscribe|opt[- ]out)\b/i,
];

export function pitchScore(text: string): number {
  return PITCH_PATTERNS.filter((p) => p.test(text)).length;
}

export function isSalesPitch(text: string): boolean {
  return pitchScore(text) >= 2;
}
