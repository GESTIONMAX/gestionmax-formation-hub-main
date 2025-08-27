import { renderHook, act } from '@testing-library/react';
import useFormationsView from '../useFormationsView';
import { useProgrammesFormation } from '../../../../../_lib/hooks/useProgrammesFormation';
import { useToast } from '../../../../../_lib/hooks/use-toast';
import { ProgrammeFormation } from '@/types/ProgrammeFormation';

// Mock des dépendances
jest.mock('../../../../../_lib/hooks/useProgrammesFormation', () => ({
  useProgrammesFormation: jest.fn(),
}));

jest.mock('../../../../../_lib/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

// Mock des données de test
const mockProgrammes = [
  { 
    id: '1', 
    titre: 'Formation A', 
    type: 'catalogue', 
    actif: true,
    categorieId: '100',
    categorie: { id: '100', titre: 'Catégorie 1' }
  },
  { 
    id: '2', 
    titre: 'Formation B', 
    type: 'sur-mesure', 
    actif: true,
    categorieId: '100',
    categorie: { id: '100', titre: 'Catégorie 1' }
  },
  { 
    id: '3', 
    titre: 'Formation C', 
    type: 'catalogue', 
    actif: false,
    categorieId: '101',
    categorie: { id: '101', titre: 'Catégorie 2' }
  },
] as unknown as ProgrammeFormation[];

describe('useFormationsView Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configuration des mocks
    (useProgrammesFormation as jest.Mock).mockReturnValue({
      programmes: mockProgrammes,
      categories: [
        { id: '100', titre: 'Catégorie 1' },
        { id: '101', titre: 'Catégorie 2' },
      ],
      loading: false,
      createProgramme: jest.fn(),
      updateProgramme: jest.fn(),
      deleteProgramme: jest.fn(),
      toggleProgrammeActive: jest.fn(),
      duplicateProgramme: jest.fn(),
    });
    
    (useToast as jest.Mock).mockReturnValue({
      toast: jest.fn(),
    });
  });

  test('initializes with default values', () => {
    const { result } = renderHook(() => useFormationsView());
    
    expect(result.current.view).toBe('list');
    expect(result.current.activeTab).toBe('tous');
    expect(result.current.editingFormation).toBeNull();
    expect(result.current.selectedFormation).toBeNull();
    expect(result.current.programmes).toEqual(mockProgrammes);
    expect(result.current.programmesFiltered).toHaveProperty('catalogue');
    expect(result.current.programmesFiltered).toHaveProperty('surMesure');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.totalCount).toBe(mockProgrammes.length);
  });
  
  test('programmesFiltered properly separates programmes by type', () => {
    const { result } = renderHook(() => useFormationsView());
    
    expect(result.current.programmesFiltered.catalogue).toHaveLength(2);
    expect(result.current.programmesFiltered.surMesure).toHaveLength(1);
    
    expect(result.current.programmesFiltered.catalogue.map(p => p.id)).toEqual(expect.arrayContaining(['1', '3']));
    expect(result.current.programmesFiltered.surMesure[0].id).toBe('2');
  });
  
  test('handleTabChange updates activeTab correctly', () => {
    const { result } = renderHook(() => useFormationsView());
    
    expect(result.current.activeTab).toBe('tous');
    
    act(() => {
      result.current.handleTabChange('catalogue');
    });
    
    expect(result.current.activeTab).toBe('catalogue');
  });
  
  test('handleDelete calls deleteProgramme and shows toast', async () => {
    const deleteProgrammeMock = jest.fn().mockResolvedValue(true);
    (useProgrammesFormation as jest.Mock).mockReturnValue({
      ...useProgrammesFormation(),
      deleteProgramme: deleteProgrammeMock,
      programmes: mockProgrammes,
      loading: false
    });
    
    const mockToast = jest.fn();
    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast
    });
    
    const { result } = renderHook(() => useFormationsView());
    
    await act(async () => {
      await result.current.handleDelete('1');
    });
    
    expect(deleteProgrammeMock).toHaveBeenCalledWith('1');
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
      title: "Programme supprimé"
    }));
  });
  
  test('handleToggleActive toggles programme status and shows toast', async () => {
    const toggleProgrammeActiveMock = jest.fn().mockResolvedValue(true);
    (useProgrammesFormation as jest.Mock).mockReturnValue({
      ...useProgrammesFormation(),
      toggleProgrammeActive: toggleProgrammeActiveMock,
      programmes: mockProgrammes,
      loading: false
    });
    
    const mockToast = jest.fn();
    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast
    });
    
    const { result } = renderHook(() => useFormationsView());
    
    await act(async () => {
      await result.current.handleToggleActive('1', true);
    });
    
    expect(toggleProgrammeActiveMock).toHaveBeenCalledWith('1', true);
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
      title: "Programme activé"
    }));
    
    await act(async () => {
      await result.current.handleToggleActive('2', false);
    });
    
    expect(toggleProgrammeActiveMock).toHaveBeenCalledWith('2', false);
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
      title: "Programme désactivé"
    }));
  });
  
  test('handleSubmit creates new programme when editingFormation is null', async () => {
    const createProgrammeMock = jest.fn().mockResolvedValue(true);
    (useProgrammesFormation as jest.Mock).mockReturnValue({
      ...useProgrammesFormation(),
      createProgramme: createProgrammeMock,
      programmes: mockProgrammes,
      loading: false
    });
    
    const mockToast = jest.fn();
    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast
    });
    
    const { result } = renderHook(() => useFormationsView());
    
    const formData = { 
      titre: 'Nouvelle Formation', 
      type: 'catalogue' as const,
      categorieId: '100' 
    };
    
    await act(async () => {
      await result.current.handleSubmit(formData);
    });
    
    expect(createProgrammeMock).toHaveBeenCalledWith(formData);
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
      title: "Programme créé"
    }));
    expect(result.current.view).toBe('list');
    expect(result.current.editingFormation).toBeNull();
  });
});
