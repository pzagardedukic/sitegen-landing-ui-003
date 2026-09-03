import { isSectionEnabled } from "@/core/static";
import CataloguesPage from "@/page-content/pages/catalogues/Catalogues";
import { redirect } from "next/navigation";

export default function Catalogues() {
  if(!isSectionEnabled('catalogues')) {
    redirect('/404');
  } 
  
  return <CataloguesPage />;
}
