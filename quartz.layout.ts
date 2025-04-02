import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import * as ExtraComponent from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.Comments({
      provider: 'giscus',
      options: {
        repo: 'wangzipai/quartz',
        repoId: 'R_kgDONHTeAQ',
        category: 'Announcements',
        categoryId: 'DIC_kwDONHTeAc4Cj0YK',
        mapping: "pathname",
        strict: false,
        reactionsEnabled: true,
        inputPosition: "top",
      }
    }),
  ],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
      "Scroll to top ↑": "#",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.MobileOnly(ExtraComponent.OverlayExplorer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(
      Component.RecentNotes({
        title: "最近更新",
        showTags: false,
        limit: 4,
        filter: (f) => {
          if (f.filePath?.endsWith("index.md")) {
            return false
          }
          return true
        },
        sort: (f1, f2) => {
          // 尝试从文件路径中提取日期（如果文件名包含日期格式如：2023-04-01-title.md）
          const extractDateFromPath = (path: string | undefined) => {
            if (!path) return null;
            // 匹配YYYY-MM-DD格式的日期
            const match = path.match(/(\d{4}-\d{2}-\d{2})/);
            if (match && match[1]) {
              return new Date(match[1]);
            }
            return null;
          };

          // 首先尝试使用frontmatter日期
          if (f1.dates?.created && f2.dates?.created) {
            return f2.dates.created.getTime() - f1.dates.created.getTime();
          }
          
          // 如果frontmatter日期不可用，尝试从文件名获取日期
          const date1 = extractDateFromPath(f1.filePath);
          const date2 = extractDateFromPath(f2.filePath);
          
          if (date1 && date2) {
            return date2.getTime() - date1.getTime();
          } else if (date1 && !date2) {
            return -1;
          } else if (!date1 && date2) {
            return 1;
          }
          
          // 默认按文件路径排序
          return (f1.filePath || '').localeCompare(f2.filePath || '');
        }
      })
    ),
    // Component.DesktopOnly(Component.TableOfContents()),
  ],
  right: [
    Component.Graph({
        localGraph: {
          drag: true, // whether to allow panning the view around
          zoom: true, // whether to allow zooming in and out
          depth: 2, // how many hops of notes to display
          scale: 1.1, // default view scale
          repelForce: 0.5, // how much nodes should repel each other
          centerForce: 0.3, // how much force to use when trying to center the nodes
          linkDistance: 30, // how long should the links be by default?
          fontSize: 0.6, // what size should the node labels be?
          opacityScale: 1, // how quickly do we fade out the labels when zooming out?
          removeTags: [], // what tags to remove from the graph
          showTags: true, // whether to show tags in the graph
        },
        globalGraph: {
          drag: true,
          zoom: true,
          depth: 2,
          scale: 0.9,
          repelForce: 0.5,
          centerForce: 0.3,
          linkDistance: 30,
          fontSize: 0.6,
          opacityScale: 1,
          removeTags: [], // what tags to remove from the graph
          showTags: true, // whether to show tags in the graph
        },
      }),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.MobileOnly(ExtraComponent.OverlayExplorer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer()),
  ],
  right: [],
}
