const skeletonRows = Array.from({ length: 4 }, (_, index) => index);

export const WizardTableSkeleton = () => {
  return (
    <>
      {skeletonRows.map((row) => (
        <tr key={row} className="border-b border-border/40">
          <td className="px-6 py-5">
            <div className="h-4 w-32 animate-pulse rounded bg-primary/15" />
          </td>
          <td className="px-6 py-5">
            <div className="h-4 w-24 animate-pulse rounded bg-primary/15" />
          </td>
          <td className="px-6 py-5">
            <div className="h-4 w-28 animate-pulse rounded bg-primary/15" />
          </td>
          <td className="px-6 py-5">
            <div className="flex max-w-xl gap-2">
              <div className="h-7 w-28 animate-pulse rounded-lg bg-primary/15" />
              <div className="h-7 w-24 animate-pulse rounded-lg bg-primary/10" />
              <div className="h-7 w-20 animate-pulse rounded-lg bg-primary/10" />
            </div>
          </td>
          <td className="px-6 py-5">
            <div className="ml-auto h-9 w-9 animate-pulse rounded-full bg-primary/15" />
          </td>
        </tr>
      ))}
    </>
  );
};
