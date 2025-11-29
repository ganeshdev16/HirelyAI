import Footer from "@/components/Footer";
import JobDetailsPage from "./JobDetailsPage";

interface PageProps {
  params: Promise<{
    jobId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { jobId } = await params;
  console.log("Job page accessed with ID:", jobId);
  return (
    <>
      <JobDetailsPage jobId={jobId} />
      <Footer />
    </>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { jobId } = await params;
  return {
    title: `Job Details - ${jobId}`,
    description: "View detailed job information and apply",
  };
}
