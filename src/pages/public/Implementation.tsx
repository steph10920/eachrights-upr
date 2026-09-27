import PublicLayout from "../../components/layout/PublicLayout";

export default function Recommendations() {
  return (
    <PublicLayout>
      <div className="px-5 py-10 sm:px-8 lg:px-10">
        <h1 className="text-3xl font-bold text-slate-900">
          Recommendations
        </h1>

        <p className="mt-2 text-slate-500">
          UPR recommendations will appear here.
        </p>
      </div>
    </PublicLayout>
  );
}