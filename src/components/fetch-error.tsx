import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function FetchError() {
  return (
    <Alert
      variant="destructive"
      className="fixed w-[90%] md:w-2/3 lg:w-1/4 bg-black top-[10vh] left-1/2 z-[1000] -translate-x-1/2"
    >
      <AlertCircleIcon />
      <AlertTitle>Error Loading Data</AlertTitle>
      <AlertDescription>
        <p>There was an issue fetching data from the database.</p>
        <ul className="list-inside list-disc text-sm">
          <li>Check your internet connection</li>
          <li>Verify server status</li>
          <li>Contact your system administrator if the problem persists</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
}

export default FetchError;
