import { UserSafetyProfile, RelevanceLevel } from '@/types';

export function calculatePersonalRelevance(
  affectedTags: string[],
  profile: UserSafetyProfile
): { level: RelevanceLevel; matchedTags: string[]; score: number } {
  if (!profile.isConfigured || affectedTags.length === 0) {
    return { level: 'Possibly Relevant', matchedTags: [], score: 50 };
  }

  const userItemsList = [
    ...profile.operatingSystems,
    ...profile.devices,
    ...profile.browsers,
    ...profile.emailProviders,
    ...profile.socialMedia,
    ...profile.onlineServices,
  ].map((item) => item.toLowerCase());

  const userItemsSet = new Set(userItemsList);

  const matched: string[] = [];

  affectedTags.forEach((tag) => {
    const lowerTag = tag.toLowerCase();
    if (userItemsSet.has(lowerTag)) {
      matched.push(tag);
    } else {
      for (let i = 0; i < userItemsList.length; i++) {
        const item = userItemsList[i];
        if (lowerTag.includes(item) || item.includes(lowerTag)) {
          matched.push(tag);
          break;
        }
      }
    }
  });

  if (matched.length >= 2) {
    return { level: 'Highly Relevant', matchedTags: matched, score: 95 };
  } else if (matched.length === 1) {
    return { level: 'Possibly Relevant', matchedTags: matched, score: 65 };
  }

  return { level: 'Not Relevant', matchedTags: [], score: 10 };
}
