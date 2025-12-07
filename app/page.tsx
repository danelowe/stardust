import { AddBookmarkForm } from "@components/AddBookmarkForm"
import { BookmarksList } from "@components/BookmarksList"
import { MetricsOverview } from "@components/MetricsOverview"
import { Section } from "@components/Section"
import { Analytics } from "@components/analytics/Analytics"

export default function Home() {
  return (
    <div className="space-y-8">
      <Section title="Overview">
        <MetricsOverview />
      </Section>
      <Section title="Analytics">
        <Analytics />
      </Section>
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-3">
              <AddBookmarkForm />
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-6">Your Bookmarks</h2>
            <BookmarksList />
          </div>
        </div>
      </section>
    </div>
  )
}
