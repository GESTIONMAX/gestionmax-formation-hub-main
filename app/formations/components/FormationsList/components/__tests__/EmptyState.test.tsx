import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EmptyState from '../EmptyState';

describe('EmptyState Component', () => {
  const mockOnCreate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders with default message when no type is provided', () => {
    render(<EmptyState onCreate={mockOnCreate} />);
    
    expect(screen.getByText('Aucun programme disponible')).toBeInTheDocument();
    expect(screen.getByText('Commencez par créer votre premier programme de formation')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /nouveau programme/i })).toBeInTheDocument();
  });
  
  test('renders with catalogue-specific message when type is "catalogue"', () => {
    render(<EmptyState type="catalogue" onCreate={mockOnCreate} />);
    
    expect(screen.getByText('Aucun programme catalogue disponible')).toBeInTheDocument();
    expect(screen.getByText('Commencez par créer votre premier programme catalogue standardisé')).toBeInTheDocument();
  });
  
  test('renders with sur-mesure-specific message when type is "sur-mesure"', () => {
    render(<EmptyState type="sur-mesure" onCreate={mockOnCreate} />);
    
    expect(screen.getByText('Aucun programme sur-mesure disponible')).toBeInTheDocument();
    expect(screen.getByText('Dupliquez un programme catalogue ou créez un programme sur-mesure')).toBeInTheDocument();
  });
  
  test('calls onCreate when button is clicked', () => {
    render(<EmptyState onCreate={mockOnCreate} />);
    
    const button = screen.getByRole('button', { name: /nouveau programme/i });
    fireEvent.click(button);
    
    expect(mockOnCreate).toHaveBeenCalledTimes(1);
  });
});
