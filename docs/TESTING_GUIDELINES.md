# Testing Guidelines

## Test Organization

### File Structure
```typescript
// imports
import { render, screen } from '@testing-library/react';
import { Component } from './Component';

// test suite
describe('Component', () => {
  // setup
  beforeEach(() => {
    // ...
  });

  // tests
  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByText('...')).toBeInTheDocument();
  });

  // cleanup
  afterEach(() => {
    // ...
  });
});
```

### Best Practices

1. **Test Structure**
   - Use descriptive test names
   - Follow AAA pattern (Arrange, Act, Assert)
   - Keep tests focused and isolated

2. **Coverage**
   - Test component behavior
   - Test edge cases
   - Test error scenarios

3. **Mocking**
   - Mock external dependencies
   - Use meaningful mock data
   - Clean up mocks after tests

4. **Integration Tests**
   - Test component integration
   - Test user workflows
   - Test error boundaries