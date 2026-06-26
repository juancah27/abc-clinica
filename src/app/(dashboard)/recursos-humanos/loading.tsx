import { Skeleton } from "@/components/ui/skeleton";

export default function RrhhLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-56" />
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}
