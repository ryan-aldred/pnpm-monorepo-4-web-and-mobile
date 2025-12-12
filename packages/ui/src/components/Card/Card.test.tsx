import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('should render children', () => {
    render(
      <Card>
        <span>Test content</span>
      </Card>
    );

    expect(screen.getByText('Test content')).toBeDefined();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <Card className="custom-class">Content</Card>
    );

    const card = container.firstChild;
    expect(card?.className).toContain('custom-class');
  });
});
