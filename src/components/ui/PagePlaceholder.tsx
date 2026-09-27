
interface PagePlaceholderProps {
  title: string;
}

const PagePlaceholder = ({
  title,
}: PagePlaceholderProps) => {
  return (
    <div className="flex min-h-[400px] items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <span className="text-xl text-gray-500">•</span>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900">
          {title}
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          This section is currently being developed.
        </p>
      </div>
    </div>
  );
};

export default PagePlaceholder;
