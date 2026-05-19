import Header from "@/templates/template-1/Header";

interface TemplateHeaderProps {
  brandName: string;
  template: string;
  logoSrc?: string;
}

export default function TemplateHeader({ brandName, logoSrc }: TemplateHeaderProps) {
  return <Header brandName={brandName} logoSrc={logoSrc} />;
}
