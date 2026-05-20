import type {
  ResumeLabels,
  ResumeProject,
  ResumeProjectShowcaseBlock,
} from '@devfolio-blog/shared-types';

export interface ResumeShowcaseDialogData {
  project: ResumeProject;
  labels: ResumeLabels;
}

export interface ResumeImagePreviewDialogData {
  src: string;
  alt: string;
}

export interface ShowcaseBlockGroup {
  key: string;
  blocks: ResumeProjectShowcaseBlock[];
}
