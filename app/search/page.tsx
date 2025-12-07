import Footer from "@/components/Footer";
import JobBoard from "@/components/JobBoard";
import JobSearchComponent from "@/components/JobSearchComponent";
import NavBar from "@/components/NavBar";

interface PageProps {
  params: {
    jobId: string;
  };
}

export default function Page({ params }: PageProps) {
  console.log("Job page accessed with ID:", params.jobId);
  return (
    <>
      <div className="bg-black">
        <NavBar />
      </div>
      <JobSearchComponent />
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
