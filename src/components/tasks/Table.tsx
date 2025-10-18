import React from "react";

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}
interface TableSectionProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}
interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}
interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}
interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {}

/**
 * Utility to combine class names safely.
 * Same effect as clsx or cn but built-in.
 */
function classNames(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export const Table: React.FC<TableProps> = ({ className, ...props }) => {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table
        data-slot="table"
        className={classNames("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
};

export const TableHeader: React.FC<TableSectionProps> = ({ className, ...props }) => (
  <thead data-slot="table-header" className={classNames("[&_tr]:border-b", className)} {...props} />
);

export const TableBody: React.FC<TableSectionProps> = ({ className, ...props }) => (
  <tbody
    data-slot="table-body"
    className={classNames("[&_tr:last-child]:border-0", className)}
    {...props}
  />
);

export const TableFooter: React.FC<TableSectionProps> = ({ className, ...props }) => (
  <tfoot
    data-slot="table-footer"
    className={classNames("bg-muted/50 border-t font-medium [&>tr]:last:border-b-0", className)}
    {...props}
  />
);

export const TableRow: React.FC<TableRowProps> = ({ className, ...props }) => (
  <tr
    data-slot="table-row"
    className={classNames(
      "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
      className
    )}
    {...props}
  />
);

export const TableHead: React.FC<TableHeadProps> = ({ className, ...props }) => (
  <th
    data-slot="table-head"
    className={classNames(
      "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
);

export const TableCell: React.FC<TableCellProps> = ({ className, ...props }) => (
  <td
    data-slot="table-cell"
    className={classNames(
      "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
);

export const TableCaption: React.FC<TableCaptionProps> = ({ className, ...props }) => (
  <caption
    data-slot="table-caption"
    className={classNames("text-muted-foreground mt-4 text-sm", className)}
    {...props}
  />
);
