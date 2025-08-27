-- AlterTable
ALTER TABLE "public"."programmes_formation" ADD COLUMN     "action_non_respect" TEXT,
ADD COLUMN     "commentaire_controle" TEXT,
ADD COLUMN     "competences_visees" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "contenu_detaille_html" TEXT,
ADD COLUMN     "date_controle" TIMESTAMP(3),
ADD COLUMN     "date_verification_juridique" TIMESTAMP(3),
ADD COLUMN     "organisme_controle" TEXT,
ADD COLUMN     "reference_texte" TEXT,
ADD COLUMN     "resultat_controle" TEXT,
ADD COLUMN     "tarif_inter_entreprise" DOUBLE PRECISION,
ADD COLUMN     "tarif_intra_entreprise" DOUBLE PRECISION,
ADD COLUMN     "verification_juridique" BOOLEAN NOT NULL DEFAULT false;
