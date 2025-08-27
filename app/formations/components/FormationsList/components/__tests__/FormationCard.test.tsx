import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FormationCard from '../FormationCard';
import { ProgrammeFormation } from '@/types/ProgrammeFormation';

// Mock des fonctions
const mockViewDetail = jest.fn();
const mockEdit = jest.fn();
const mockDelete = jest.fn();
const mockGeneratePDF = jest.fn();
const mockToggleActive = jest.fn();
const mockDuplicate = jest.fn();

// Mock d'un programme de formation pour les tests
const mockProgramme: Partial<ProgrammeFormation> = {
  id: '1',
  titre: 'Formation Test',
  code: 'TEST-001',
  description: 'Description de la formation test',
  duree: '3 jours',
  type: 'catalogue',
  publicConcerne: 'Tout public',
  prerequis: 'Aucun',
  actif: true,
  pictogramme: '🧪',
  categorieId: '123',
  categorie: {
    id: '123',
    titre: 'Catégorie Test'
  }
};

describe('FormationCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders formation information correctly', () => {
    render(
      <FormationCard
        programme={mockProgramme as ProgrammeFormation}
        onViewDetail={mockViewDetail}
        onEdit={mockEdit}
        onDelete={mockDelete}
        onGeneratePDF={mockGeneratePDF}
        onToggleActive={mockToggleActive}
        onDuplicate={mockDuplicate}
      />
    );

    // Vérifier le titre et les informations essentielles
    expect(screen.getByText('Formation Test')).toBeInTheDocument();
    expect(screen.getByText('Description de la formation test')).toBeInTheDocument();
    expect(screen.getByText('3 jours')).toBeInTheDocument();
    expect(screen.getByText('Catalogue')).toBeInTheDocument();
    expect(screen.getByText('Public: Tout public')).toBeInTheDocument();
    expect(screen.getByText('Prérequis: Aucun')).toBeInTheDocument();
    expect(screen.getByText('Code: TEST-001')).toBeInTheDocument();
    expect(screen.getByText('Catégorie: Catégorie Test')).toBeInTheDocument();
  });

  test('renders "Sans titre" when titre and code are missing', () => {
    const programmeWithoutTitle = { ...mockProgramme, titre: undefined, code: undefined };
    
    render(
      <FormationCard
        programme={programmeWithoutTitle as ProgrammeFormation}
        onViewDetail={mockViewDetail}
        onEdit={mockEdit}
        onDelete={mockDelete}
      />
    );

    expect(screen.getByText('Sans titre')).toBeInTheDocument();
  });

  test('shows "Sur-mesure" badge for sur-mesure type', () => {
    const surMesureProgramme = { ...mockProgramme, type: 'sur-mesure', beneficiaireId: 'client-123' };
    
    render(
      <FormationCard
        programme={surMesureProgramme as ProgrammeFormation}
        onViewDetail={mockViewDetail}
        onEdit={mockEdit}
        onDelete={mockDelete}
      />
    );

    expect(screen.getByText('Sur-mesure')).toBeInTheDocument();
    expect(screen.getByText('client-123')).toBeInTheDocument();
  });

  test('calls onViewDetail when Details button is clicked', () => {
    render(
      <FormationCard
        programme={mockProgramme as ProgrammeFormation}
        onViewDetail={mockViewDetail}
        onEdit={mockEdit}
        onDelete={mockDelete}
      />
    );

    const detailsButton = screen.getByRole('button', { name: /détails/i });
    fireEvent.click(detailsButton);
    expect(mockViewDetail).toHaveBeenCalledWith(mockProgramme);
  });

  test('calls onEdit when Modifier button is clicked', () => {
    render(
      <FormationCard
        programme={mockProgramme as ProgrammeFormation}
        onViewDetail={mockViewDetail}
        onEdit={mockEdit}
        onDelete={mockDelete}
      />
    );

    const editButton = screen.getByRole('button', { name: /modifier/i });
    fireEvent.click(editButton);
    expect(mockEdit).toHaveBeenCalledWith(mockProgramme);
  });

  test('calls onDelete when Supprimer button is clicked', () => {
    render(
      <FormationCard
        programme={mockProgramme as ProgrammeFormation}
        onViewDetail={mockViewDetail}
        onEdit={mockEdit}
        onDelete={mockDelete}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /supprimer/i });
    fireEvent.click(deleteButton);
    expect(mockDelete).toHaveBeenCalledWith(mockProgramme.id);
  });

  test('calls onGeneratePDF when PDF button is clicked', () => {
    render(
      <FormationCard
        programme={mockProgramme as ProgrammeFormation}
        onViewDetail={mockViewDetail}
        onEdit={mockEdit}
        onDelete={mockDelete}
        onGeneratePDF={mockGeneratePDF}
      />
    );

    const pdfButton = screen.getByRole('button', { name: /pdf/i });
    fireEvent.click(pdfButton);
    expect(mockGeneratePDF).toHaveBeenCalledWith(mockProgramme);
  });

  test('calls onDuplicate when Dupliquer button is clicked', () => {
    render(
      <FormationCard
        programme={mockProgramme as ProgrammeFormation}
        onViewDetail={mockViewDetail}
        onEdit={mockEdit}
        onDelete={mockDelete}
        onDuplicate={mockDuplicate}
      />
    );

    const duplicateButton = screen.getByRole('button', { name: /dupliquer/i });
    fireEvent.click(duplicateButton);
    expect(mockDuplicate).toHaveBeenCalledWith(mockProgramme.id);
  });

  test('shows active/inactive button with correct status', () => {
    render(
      <FormationCard
        programme={{ ...mockProgramme, actif: true } as ProgrammeFormation}
        onViewDetail={mockViewDetail}
        onEdit={mockEdit}
        onDelete={mockDelete}
        onToggleActive={mockToggleActive}
      />
    );

    const statusButton = screen.getByRole('button', { name: /désactiver/i });
    expect(statusButton).toBeInTheDocument();
    fireEvent.click(statusButton);
    expect(mockToggleActive).toHaveBeenCalledWith(mockProgramme.id, false);
    
    // Test with inactive programme
    jest.clearAllMocks();
    render(
      <FormationCard
        programme={{ ...mockProgramme, actif: false } as ProgrammeFormation}
        onViewDetail={mockViewDetail}
        onEdit={mockEdit}
        onDelete={mockDelete}
        onToggleActive={mockToggleActive}
      />
    );

    const activateButton = screen.getByRole('button', { name: /activer/i });
    expect(activateButton).toBeInTheDocument();
    fireEvent.click(activateButton);
    expect(mockToggleActive).toHaveBeenCalledWith(mockProgramme.id, true);
  });
});
