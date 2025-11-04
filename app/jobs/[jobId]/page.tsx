import Footer from "@/components/Footer";
import JobDetailsPage from "./JobDetailsPage";

interface PageProps {
  params: {
    jobId: string;
  };
}

export default function Page({ params }: PageProps) {
  console.log("Job page accessed with ID:", params.jobId);
  return (
    <>
      <JobDetailsPage jobId={params.jobId} />
      <Footer />
    </>
  );
}

export async function generateMetadata({ params }: PageProps) {
  return {
    title: `Job Details - ${params.jobId}`,
    description: "View detailed job information and apply",
  };
}
