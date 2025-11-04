import Footer from "@/components/Footer";
import JobBoard from "@/components/JobBoard";

interface PageProps {
  params: {
    name: string;
    category: string;
  };
}

export default function CategoryPage({ params }: PageProps) {
  return (
    <>
      <JobBoard category={params.name} />
      <Footer />
    </>
  );
}
