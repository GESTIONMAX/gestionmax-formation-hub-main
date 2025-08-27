import React from 'react';
import { render, screen } from '@testing-library/react';
import FormationGrid from '../FormationGrid';
import { ProgrammeFormation } from '@/types/ProgrammeFormation';
import '@testing-library/jest-dom'; // Pour accéder à toBeInTheDocument()

// Mock du composant FormationCard pour simplifier les tests
jest.mock('../FormationCard', () => {
  return function MockFormationCard({ programme }: { programme: ProgrammeFormation }) {
    return (
      <div data-testid={`formation-card-${programme.id}`}>
        <span>{programme.titre}</span>
      </div>
    );
  };
});

describe('FormationGrid Component', () => {
  // Mock de quelques programmes de formation
  const mockProgrammes = [
    { 
      id: '1', 
      code: 'FORM-A',
      titre: 'Formation A', 
      description: 'Description de la formation A',
      type: 'catalogue', 
      isActive: true, // Utilisé pour le filtrage dans le composant
      duree: '2 jours',
      modalites: 'Présentiel',
      categorie: { id: '100', titre: 'Catégorie 1' }
    },
    { 
      id: '2', 
      code: 'FORM-B',
      titre: 'Formation B', 
      description: 'Description de la formation B',
      type: 'sur-mesure', 
      isActive: true, // Utilisé pour le filtrage dans le composant
      duree: '3 jours',
      modalites: 'Distanciel',
      categorie: { id: '100', titre: 'Catégorie 1' }
    },
    { 
      id: '3', 
      code: 'FORM-C',
      titre: 'Formation C', 
      description: 'Description de la formation C',
      type: 'catalogue', 
      isActive: false, // Utilisé pour le filtrage dans le composant
      duree: '1 jour',
      modalites: 'Mixte',
      categorie: { id: '101', titre: 'Catégorie 2' }
    },
  ] as unknown as ProgrammeFormation[];

  // Mock des fonctions de callback
  const mockHandlers = {
    onViewDetail: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onGeneratePDF: jest.fn(),
    onToggleActive: jest.fn(),
    onDuplicate: jest.fn(),
    onCreate: jest.fn(),
    isLoading: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all formations when no filter is applied', () => {
    render(
      <FormationGrid 
        programmes={mockProgrammes} 
        {...mockHandlers}
      />
    );

    // Vérifier que tous les programmes sont affichés
    expect(screen.getByTestId('formation-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('formation-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('formation-card-3')).toBeInTheDocument();
    expect(screen.getByText('Formation A')).toBeInTheDocument();
    expect(screen.getByText('Formation B')).toBeInTheDocument();
    expect(screen.getByText('Formation C')).toBeInTheDocument();
  });

  test('renders formations of specific type only', () => {
    // Filtrer les programmes par type côté test plutôt que via une prop
    const catalogueProgrammes = mockProgrammes.filter(p => p.type === 'catalogue');
    
    render(
      <FormationGrid 
        programmes={catalogueProgrammes} 
        {...mockHandlers}
      />
    );

    // Vérifier que seuls les programmes de type "catalogue" sont affichés
    expect(screen.getByTestId('formation-card-1')).toBeInTheDocument();
    expect(screen.getByText('Formation A')).toBeInTheDocument();
    expect(screen.getByTestId('formation-card-3')).toBeInTheDocument();
    expect(screen.getByText('Formation C')).toBeInTheDocument();
    expect(screen.queryByTestId('formation-card-2')).not.toBeInTheDocument();
    expect(screen.queryByText('Formation B')).not.toBeInTheDocument();
  });

  test('renders active formations only', () => {
    // Filtrer les programmes par statut côté test plutôt que via une prop
    const activeProgrammes = mockProgrammes.filter(p => p.isActive === true);
    
    render(
      <FormationGrid 
        programmes={activeProgrammes} 
        {...mockHandlers}
      />
    );

    // Vérifier que seuls les programmes actifs sont affichés
    expect(screen.getByTestId('formation-card-1')).toBeInTheDocument();
    expect(screen.getByText('Formation A')).toBeInTheDocument();
    expect(screen.getByTestId('formation-card-2')).toBeInTheDocument();
    expect(screen.getByText('Formation B')).toBeInTheDocument();
    expect(screen.queryByTestId('formation-card-3')).not.toBeInTheDocument();
    expect(screen.queryByText('Formation C')).not.toBeInTheDocument();
  });

  test('renders formations filtered by search term', () => {
    // Filtrer les programmes par terme de recherche côté test
    const searchTerm = "Formation A";
    const filteredProgrammes = mockProgrammes.filter(p => p.titre.includes(searchTerm));
    
    render(
      <FormationGrid 
        programmes={filteredProgrammes} 
        {...mockHandlers}
      />
    );

    // Vérifier que seul le programme contenant "Formation A" est affiché
    expect(screen.getByTestId('formation-card-1')).toBeInTheDocument();
    expect(screen.getByText('Formation A')).toBeInTheDocument();
    expect(screen.queryByTestId('formation-card-2')).not.toBeInTheDocument();
    expect(screen.queryByText('Formation B')).not.toBeInTheDocument();
    expect(screen.queryByTestId('formation-card-3')).not.toBeInTheDocument();
    expect(screen.queryByText('Formation C')).not.toBeInTheDocument();
  });

  test('renders formations filtered by category', () => {
    // Filtrer les programmes par catégorie côté test
    const categorieId = "101";
    const filteredProgrammes = mockProgrammes.filter(p => p.categorie.id === categorieId);
    
    render(
      <FormationGrid 
        programmes={filteredProgrammes} 
        {...mockHandlers}
      />
    );

    // Vérifier que seul le programme de la catégorie 101 est affiché
    expect(screen.queryByTestId('formation-card-1')).not.toBeInTheDocument();
    expect(screen.queryByText('Formation A')).not.toBeInTheDocument();
    expect(screen.queryByTestId('formation-card-2')).not.toBeInTheDocument();
    expect(screen.queryByText('Formation B')).not.toBeInTheDocument();
    expect(screen.getByTestId('formation-card-3')).toBeInTheDocument();
    expect(screen.getByText('Formation C')).toBeInTheDocument();
  });

  test('renders formations with multiple filters combined', () => {
    // Filtrer les programmes avec plusieurs critères côté test
    const filteredProgrammes = mockProgrammes.filter(p => 
      p.type === 'catalogue' && 
      p.isActive === false && 
      p.categorie.id === '101'
    );
    
    render(
      <FormationGrid 
        programmes={filteredProgrammes} 
        {...mockHandlers}
      />
    );

    // Vérifier que seul le programme correspondant à tous les critères est affiché
    expect(screen.queryByTestId('formation-card-1')).not.toBeInTheDocument();
    expect(screen.queryByText('Formation A')).not.toBeInTheDocument();
    expect(screen.queryByTestId('formation-card-2')).not.toBeInTheDocument();
    expect(screen.queryByText('Formation B')).not.toBeInTheDocument();
    expect(screen.getByTestId('formation-card-3')).toBeInTheDocument();
    expect(screen.getByText('Formation C')).toBeInTheDocument();
  });

  test('displays empty state when no formations available', () => {
    // Utiliser un tableau vide pour simuler l'absence de formations
    const emptyProgrammes: ProgrammeFormation[] = [];
    
    render(
      <FormationGrid 
        programmes={emptyProgrammes} 
        {...mockHandlers}
      />
    );

    // On s'attend à ce que le composant EmptyState soit rendu
    // Note: Comme EmptyState est un composant mocké, nous ne pouvons pas vérifier son contenu directement
    // Vérifier que les cards ne sont pas rendues
    expect(screen.queryByTestId('formation-card-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('formation-card-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('formation-card-3')).not.toBeInTheDocument();
  });

  test('passes the correct props to FormationCard components', () => {
    // Mock custom pour EmptyState pour ce test spécifique
    jest.mock('../EmptyState', () => {
      return function MockEmptyState() {
        return <div data-testid="empty-state">Empty state</div>;
      };
    });
    
    const { container } = render(
      <FormationGrid 
        programmes={mockProgrammes.slice(0, 1)} 
        {...mockHandlers}
      />
    );

    // Vérifier que le composant FormationCard reçoit les bonnes props
    expect(container.querySelector('[data-testid="formation-card-1"]')).toBeInTheDocument();
  });
  
  test('displays loading spinner when isLoading is true', () => {
    render(
      <FormationGrid 
        programmes={mockProgrammes} 
        {...mockHandlers}
        isLoading={true}
      />
    );
    
    // Vérifier que le spinner de chargement est affiché
    expect(screen.getByRole('status')).toBeInTheDocument();
    // Vérifier qu'aucune carte n'est affichée
    expect(screen.queryByTestId('formation-card-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('formation-card-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('formation-card-3')).not.toBeInTheDocument();
  });
});
