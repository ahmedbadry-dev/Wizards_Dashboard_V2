
const columns = ["ID", "First Name", "Last Name", "Associated Elixirs", "Actions"];

export const WizardTableHeader = () => {
  return (
    <thead className="bg-surface-raised/50">
      <tr>
        {columns.map((column) => (
          <th
            key={column}
            scope="col"
            className="px-6 py-5 text-left text-sm font-semibold uppercase tracking-[0.12em] text-body-muted last:text-right"
          >
            {column}
          </th>
        ))}
      </tr>
    </thead>
  );
};
