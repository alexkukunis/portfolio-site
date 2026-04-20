export type BlockType =
  | 'hero'
  | 'heading'
  | 'text'
  | 'image'
  | 'list'
  | 'quote'
  | 'twocolumn'
  | 'carousel'
  | 'appstore-screenshots'
  | 'feature-grid';

export type BlockCategory = 'template' | 'content' | 'media';

export interface HeroContent {
  title: string;
  summary: string;
  role: string;
  company: string;
  year: string;
  duration: string;
  coverImageUrl: string;
  logoUrl: string;
  logoUrlDark: string;
}

export interface HeadingContent {
  text: string;
  level: 2 | 3;
}

export interface TextContent {
  body: string;
}

export interface ImageBlockContent {
  url: string;
  caption: string;
  alt: string;
}

export interface ListContent {
  items: string[];
  ordered: boolean;
}

export interface QuoteContent {
  text: string;
  attribution: string;
}

export interface TwoColumnContent {
  side: 'left' | 'right';
  text: string;
  label: string;
}

export interface CarouselSlide {
  url: string;
  alt: string;
}

export interface CarouselContent {
  slides: CarouselSlide[];
}

export interface AppStoreScreenshotsContent {
  title: string;
  subtitle: string;
  screenshots: Array<{ url: string; alt: string }>;
  featureImage: { url: string; caption: string; alt: string };
}

export interface FeatureGridItem {
  icon: string;
  title: string;
  description: string;
}

export interface FeatureGridContent {
  title: string;
  subtitle?: string;
  features: FeatureGridItem[];
}

export interface BlockContentMap {
  hero: HeroContent;
  heading: HeadingContent;
  text: TextContent;
  image: ImageBlockContent;
  list: ListContent;
  quote: QuoteContent;
  twocolumn: TwoColumnContent;
  carousel: CarouselContent;
  'appstore-screenshots': AppStoreScreenshotsContent;
  'feature-grid': FeatureGridContent;
}

export type Block<T extends BlockType = BlockType> = {
  id?: string;
  type: T;
  content: BlockContentMap[T];
  order: number;
};

export type AnyBlock = { [K in BlockType]: Block<K> }[BlockType];

export interface EditorProps<T extends BlockType> {
  value: BlockContentMap[T];
  onChange: (next: BlockContentMap[T]) => void;
}

export interface RenderProps<T extends BlockType> {
  content: BlockContentMap[T];
}
