'use client';
import { Button } from '../button';

type DataTableResetFilterProps = {
  isFilterActive: boolean;
  onReset: () => void;
};

export function DataTableResetFilter({
  isFilterActive,
  onReset
}: DataTableResetFilterProps) {
  return (
    <>
      {isFilterActive ? (
        <Button size={"sm"} variant="outline" onClick={onReset} className='text-red-600 border-none '>
          <i className="bi-arrow-clockwise"></i>
          {/* Reset Filters */}
        </Button>
      ) : null}
    </>
  );
}