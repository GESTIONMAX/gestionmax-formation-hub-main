import FormationDetailsPage from "../../components/catalogue/FormationDetailsPage";

export default function FormationDetailPage() {
  // Le composant FormationDetailsPage utilise useParams() pour récupérer l'ID de la formation
  // Next.js injecte automatiquement le paramètre [id] dans le contexte de la page
  return <FormationDetailsPage />;
}
