
import ExcelToMarc from '@/components/excel-to-marc/ExcelToMarc';
import FeatureSection from '@/components/FeatureSection';
import Footer from '@/components/Footer';
import ThemeToggle from '@/components/ThemeToggle';

const Index = () => {
  return (
    <>
      <ThemeToggle />
      <ExcelToMarc />
      <FeatureSection />
      <Footer />
    </>
  );
};

export default Index;
