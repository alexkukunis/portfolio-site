import type { ComponentType } from 'react';
import type { BlockType, BlockCategory, BlockContentMap, EditorProps, RenderProps } from './types';
import { blockSchemas } from './schemas';
import { heroDefault, heroMeta, HeroEditor, HeroRender } from './components/HeroBlock';
import { headingDefault, headingMeta, HeadingEditor, HeadingRender } from './components/HeadingBlock';
import { textDefault, textMeta, TextEditor, TextRender } from './components/TextBlock';
import { imageDefault, imageMeta, ImageEditor, ImageRender } from './components/ImageBlock';
import { listDefault, listMeta, ListEditor, ListRender } from './components/ListBlock';
import { quoteDefault, quoteMeta, QuoteEditor, QuoteRender } from './components/QuoteBlock';
import { twocolumnDefault, twocolumnMeta, TwoColumnEditor, RenderTwoColumn } from './components/TwoColumnBlock';
import { carouselDefault, carouselMeta, CarouselEditor, RenderCarousel } from './components/CarouselBlock';
import { appStoreScreenshotsDefault, appStoreScreenshotsMeta, RenderAppStoreScreenshots } from './components/AppStoreScreenshotsBlock';
import { AppStoreScreenshotsEditor } from './components/AppStoreScreenshotsEditor';

export interface BlockDefinition<T extends BlockType> {
  type: T;
  label: string;
  icon: string;
  category: BlockCategory;
  defaultContent: BlockContentMap[T];
  Editor: ComponentType<EditorProps<T>>;
  Render: ComponentType<RenderProps<T>>;
  schema: typeof blockSchemas[T];
}

type Registry = { [K in BlockType]: BlockDefinition<K> };

export const blockRegistry: Registry = {
  hero: {
    ...heroMeta,
    defaultContent: heroDefault,
    Editor: HeroEditor,
    Render: HeroRender,
    schema: blockSchemas.hero,
  },
  heading: {
    ...headingMeta,
    defaultContent: headingDefault,
    Editor: HeadingEditor,
    Render: HeadingRender,
    schema: blockSchemas.heading,
  },
  text: {
    ...textMeta,
    defaultContent: textDefault,
    Editor: TextEditor,
    Render: TextRender,
    schema: blockSchemas.text,
  },
  image: {
    ...imageMeta,
    defaultContent: imageDefault,
    Editor: ImageEditor,
    Render: ImageRender,
    schema: blockSchemas.image,
  },
  list: {
    ...listMeta,
    defaultContent: listDefault,
    Editor: ListEditor,
    Render: ListRender,
    schema: blockSchemas.list,
  },
  quote: {
    ...quoteMeta,
    defaultContent: quoteDefault,
    Editor: QuoteEditor,
    Render: QuoteRender,
    schema: blockSchemas.quote,
  },
  twocolumn: {
    ...twocolumnMeta,
    defaultContent: twocolumnDefault,
    Editor: TwoColumnEditor,
    Render: RenderTwoColumn,
    schema: blockSchemas.twocolumn,
  },
  carousel: {
    ...carouselMeta,
    defaultContent: carouselDefault,
    Editor: CarouselEditor,
    Render: RenderCarousel,
    schema: blockSchemas.carousel,
  },
  'appstore-screenshots': {
    ...appStoreScreenshotsMeta,
    defaultContent: appStoreScreenshotsDefault,
    Editor: AppStoreScreenshotsEditor,
    Render: RenderAppStoreScreenshots,
    schema: blockSchemas['appstore-screenshots'],
  },
};

export const blockList: BlockDefinition<BlockType>[] = Object.values(blockRegistry) as BlockDefinition<BlockType>[];

export function blocksByCategory(): Record<BlockCategory, BlockDefinition<BlockType>[]> {
  const out: Record<BlockCategory, BlockDefinition<BlockType>[]> = {
    template: [],
    content: [],
    media: [],
  };
  for (const def of blockList) out[def.category].push(def);
  return out;
}
