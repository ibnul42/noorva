// ViewEmployeeDetails.tsx (SERVER COMPONENT)
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { fetchEmployeeByIdAction } from "./actions";
import ViewEmployeeDetailsClient from "./ViewEmployeeDetailsClient";
import { getQueryClient } from "@/components/providers/queryClient";

interface Props {
  employeeId: string;
}

export default async function ViewEmployeeDetails({ employeeId }: Props) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["employee", employeeId],
    queryFn: () => fetchEmployeeByIdAction(employeeId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ViewEmployeeDetailsClient employeeId={employeeId} />
    </HydrationBoundary>
  );
}
