import { Tabs, TabsList, TabsTrigger } from "../../../../components/ui/tabs";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  catalogueCount: number;
  surMesureCount: number;
  totalCount: number;
}

/**
 * Composant de navigation par onglets pour les différents types de programmes
 */
const TabNavigation = ({ 
  activeTab, 
  onTabChange, 
  catalogueCount, 
  surMesureCount, 
  totalCount 
}: TabNavigationProps) => {
  return (
    <TabsList className="mb-6">
      <TabsTrigger value="tous" onClick={() => onTabChange("tous")}>
        Tous ({totalCount})
      </TabsTrigger>
      <TabsTrigger value="catalogue" onClick={() => onTabChange("catalogue")}>
        Catalogue ({catalogueCount})
      </TabsTrigger>
      <TabsTrigger value="sur-mesure" onClick={() => onTabChange("sur-mesure")}>
        Sur-mesure ({surMesureCount})
      </TabsTrigger>
      <TabsTrigger value="mentions" onClick={() => onTabChange("mentions")}>
        Mentions légales
      </TabsTrigger>
    </TabsList>
  );
};

export default TabNavigation;
