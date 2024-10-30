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
          if (f1.dates && f2.dates) {
            if (Math.abs(f2.dates.modified.getDay() - f1.dates.modified.getDay())<=3) {
              return f2.dates.created.getTime() - f1.dates.created.getTime()
            }
            return f2.dates.modified.getTime() - f1.dates.modified.getTime()
          } else if (f1.dates && !f2.dates) {
            return -1
          }
          return 1
        }
      })
    ),
    Component.DesktopOnly(Component.TableOfContents()),
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
