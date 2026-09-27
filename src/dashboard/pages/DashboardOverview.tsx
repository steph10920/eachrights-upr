import { Link } from 'react-router-dom';
import { useDashboardOverview, useThematicAnalysis, useImplementationTrends } from '../hooks/useDashboardData';
import { StatCard, SectionHeading, LoadingBlock, ErrorBlock } from '../components/ui';
import { StatusBreakdownChart, GroupComparisonChart, TrendChart } from '../components/charts';
import { RecentUpdatesFeed } from '../components/RecentUpdatesFeed';
import { KeyAreasList } from '../components/KeyAreasList';

export function DashboardOverview() {
  const overview = useDashboardOverview();
  const thematic = useThematicAnalysis();
  const trends = useImplementationTrends();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <p className="text-sm uppercase tracking-wide text-[#A9762F]">EACHRights</p>
        <h1 className="mt-1 font-serif text-3xl text-[#16233E]">UPR Implementation Dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm text-[#5B6472]">
          A living record of Universal Periodic Review recommendations, what governments have done in
          response, and the evidence behind each assessment.
        </p>
        <Link
          to="/dashboard/recommendations"
          className="mt-4 inline-block border border-[#16233E] px-3 py-1.5 text-sm text-[#16233E] hover:bg-[#16233E] hover:text-white"
        >
          Browse all recommendations →
        </Link>
      </header>

      {overview.error && <ErrorBlock message={overview.error} />}
      {overview.loading && <LoadingBlock label="Loading dashboard…" />}

      {!overview.loading && overview.totals && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Total recommendations" value={overview.totals.total_recommendations} accent="#16233E" />
            <StatCard label="Supported by government" value={overview.totals.supported_recommendations} accent="#1F5C4C" />
            <StatCard label="Noted by government" value={overview.totals.noted_recommendations} accent="#8A5A1E" />
            <StatCard label="Other / no response on record" value={overview.totals.other_response_recommendations} accent="#5B6472" />
          </div>

          <section className="mt-10">
            <SectionHeading
              title="Implementation status"
              description="Current status across all recommendations (EACHRights assessment where available, otherwise the government's own claimed status)."
            />
            <StatusBreakdownChart rows={overview.statusBreakdown} />
          </section>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            <section>
              <SectionHeading title="Recent updates" />
              <RecentUpdatesFeed updates={overview.recentUpdates} />
            </section>
            <section>
              <SectionHeading title="Key areas requiring attention" description="Recommendations with limited progress or unassessed government claims." />
              <KeyAreasList rows={overview.keyAreas} />
            </section>
          </div>
        </>
      )}

      <section className="mt-10">
        <SectionHeading title="Recommendations by theme" />
        {thematic.error && <ErrorBlock message={thematic.error} />}
        {thematic.loading ? <LoadingBlock /> : <GroupComparisonChart rows={thematic.byTheme} nameKey="theme_name" />}
      </section>

      <section className="mt-10">
        <SectionHeading title="Recommendations by responsible institution" />
        {thematic.loading ? (
          <LoadingBlock />
        ) : (
          <GroupComparisonChart rows={thematic.byInstitution} nameKey="institution_name" />
        )}
      </section>

      <section className="mt-10">
        <SectionHeading title="Implementation trends" description="Status of recorded updates by year." />
        {trends.error && <ErrorBlock message={trends.error} />}
        {trends.loading ? <LoadingBlock /> : <TrendChart rows={trends.data} />}
      </section>
    </div>
  );
}
