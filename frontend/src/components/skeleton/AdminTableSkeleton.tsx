type AdminTableSkeletonProps = {
  columns?: number;
  rows?: number;
};

export function AdminTableSkeleton({ columns = 7, rows = 6 }: AdminTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="nx-admin-table-skel-row" aria-hidden="true">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex}>
              <div
                className="nx-admin-skel-cell nx-shimmer"
                style={{
                  width: colIndex === 0 ? "70%" : colIndex === 1 ? "90%" : "60%",
                }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default AdminTableSkeleton;
