import { LoadingState } from "@/components/app/page-states";

export default function ProgressLoading() {
  return (
    <LoadingState
      title="Loading progress"
      description="Pulling your counts and streaks together."
    />
  );
}
