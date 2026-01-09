import React from 'react';
import { describe, it, expect } from 'vitest';
import { mountWithWebContext, screen } from '../test-utils';

// Simple test component
function TestComponent() {
  return (
    <div>
      <h1>Test Component</h1>
      <p>This is a test</p>
    </div>
  );
}

describe('mountWithWebContext', () => {
  it('renders a simple component without config', () => {
    mountWithWebContext(<TestComponent />);

    expect(screen.getByText('Test Component')).toBeInTheDocument();
    expect(screen.getByText('This is a test')).toBeInTheDocument();
  });

  it('provides loader data to component', () => {
    function ComponentWithLoader({ loaderData }: { loaderData?: any }) {
      // In real usage, you'd use useLoaderData() from react-router
      // For this example, we'll use props to simulate the behavior
      return (
        <div>
          <h1>Loaded Data</h1>
          {loaderData && <p>Message: {loaderData.message}</p>}
        </div>
      );
    }

    mountWithWebContext(
      <ComponentWithLoader loaderData={{ message: 'Hello from loader' }} />
    );

    expect(screen.getByText('Loaded Data')).toBeInTheDocument();
    expect(screen.getByText(/Hello from loader/i)).toBeInTheDocument();
  });

  it('handles components with buttons', async () => {
    function ButtonComponent() {
      const [count, setCount] = React.useState(0);
      return (
        <div>
          <p>Count: {count}</p>
          <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
      );
    }

    const { userEvent } = await import('@testing-library/user-event');
    mountWithWebContext(<ButtonComponent />);

    expect(screen.getByText('Count: 0')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /increment/i }));

    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });
});

describe('Web testing setup verification', () => {
  it('has access to testing library utilities', () => {
    expect(screen).toBeDefined();
    expect(mountWithWebContext).toBeDefined();
  });
});
