import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TabNavigation from '../TabNavigation';

describe('TabNavigation Component', () => {
  const mockOnChange = jest.fn();
  const tabs = [
    { key: 'all', label: 'Toutes' },
    { key: 'catalogue', label: 'Catalogue' },
    { key: 'sur-mesure', label: 'Sur-mesure' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all tabs correctly', () => {
    render(<TabNavigation tabs={tabs} activeTab="all" onChange={mockOnChange} />);

    expect(screen.getByText('Toutes')).toBeInTheDocument();
    expect(screen.getByText('Catalogue')).toBeInTheDocument();
    expect(screen.getByText('Sur-mesure')).toBeInTheDocument();
  });

  test('highlights active tab correctly', () => {
    render(<TabNavigation tabs={tabs} activeTab="catalogue" onChange={mockOnChange} />);

    const activeTab = screen.getByText('Catalogue').closest('button');
    const inactiveTab1 = screen.getByText('Toutes').closest('button');
    const inactiveTab2 = screen.getByText('Sur-mesure').closest('button');

    // Vérifie que le tab actif a la classe ou le style approprié
    // Cette vérification dépend de la façon dont vous avez implémenté la mise en évidence
    // Voici un exemple basé sur une classe de style commune
    expect(activeTab?.className).toContain('active');
    expect(inactiveTab1?.className).not.toContain('active');
    expect(inactiveTab2?.className).not.toContain('active');
  });

  test('calls onChange when a tab is clicked', () => {
    render(<TabNavigation tabs={tabs} activeTab="all" onChange={mockOnChange} />);

    // Clique sur le tab "Catalogue"
    fireEvent.click(screen.getByText('Catalogue'));
    expect(mockOnChange).toHaveBeenCalledWith('catalogue');

    // Clique sur le tab "Sur-mesure"
    fireEvent.click(screen.getByText('Sur-mesure'));
    expect(mockOnChange).toHaveBeenCalledWith('sur-mesure');
  });

  test('does not call onChange when clicking the already active tab', () => {
    render(<TabNavigation tabs={tabs} activeTab="catalogue" onChange={mockOnChange} />);

    // Clique sur le tab déjà actif "Catalogue"
    fireEvent.click(screen.getByText('Catalogue'));
    
    // La fonction ne devrait pas être appelée car le tab est déjà actif
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  test('renders with custom classes when provided', () => {
    render(
      <TabNavigation 
        tabs={tabs} 
        activeTab="all" 
        onChange={mockOnChange} 
        containerClassName="custom-container"
        tabClassName="custom-tab"
        activeTabClassName="custom-active"
      />
    );

    const container = screen.getByRole('tablist');
    expect(container.className).toContain('custom-container');
    
    const tab = screen.getByText('Toutes').closest('button');
    expect(tab?.className).toContain('custom-tab');
    expect(tab?.className).toContain('custom-active'); // Car "all" est actif
  });
});
