import Footer from "@/components/Footer";
import JobBoard from "@/components/JobBoard";
import NavBar from "@/components/NavBar";

interface PageProps {
  params: {
    name: string;
    category: string;
  };
}

export default function CategoryPage({ params }: PageProps) {
  return (
    <>
      <div className="bg-black">
        <NavBar />
      </div>
      <JobBoard category={params.name} />
      <Footer />
    </>
  );
}
