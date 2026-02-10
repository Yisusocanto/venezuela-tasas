import { Rate } from "@/types/Rate";
import { Card } from "@heroui/react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

dayjs.locale("es");

interface RateResultsTableProps {
  rates: Rate[] | null;
  error: string | null;
}

function RateResultsTable({ rates, error }: RateResultsTableProps) {
  const columnHelper = createColumnHelper<Rate>();

  const columns = [
    columnHelper.accessor(
      (row) => dayjs(row.date).format("D [de] MMMM [del] YYYY"),
      {
        id: "date",
        header: "DATE",
      },
    ),
    columnHelper.accessor("name", {
      header: "DIVISA",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("currencyCode", {
      header: "CODIGO",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("rate", {
      header: "TASA",
      cell: (info) => info.getValue(),
    }),
  ];

  if (error) {
    return (
      <Card className="bg-danger-50 border-danger-200 border p-4">
        <p className="text-danger text-center font-medium">{error}</p>
      </Card>
    );
  }

  if (!rates || rates.length === 0) {
    return (
      <Card className="bg-default-50 border-default-200 border p-4">
        <p className="text-default-500 text-center">
          No se encontraron resultados para la búsqueda.
        </p>
      </Card>
    );
  }

  const table = useReactTable({
    data: rates,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card variant="secondary" className="border p-0">
      <table>
        <thead className="table-auto bg-surface">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="p-4 border-b text-muted text-start"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <th key={cell.id} className="p-4 border-b text-start">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

export default RateResultsTable;
