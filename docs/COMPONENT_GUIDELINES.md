# Component Guidelines

## Component Organization

### File Structure
```typescript
// imports
import React from 'react';
import { useEffect, useState } from 'react';
import { ComponentProps } from './types';

// types/interfaces (if not in separate file)
interface LocalTypes {
  // ...
}

// component
export function Component({ prop1, prop2 }: ComponentProps) {
  // hooks
  const [state, setState] = useState();
  
  // effects
  useEffect(() => {
    // ...
  }, []);

  // handlers
  const handleClick = () => {
    // ...
  };

  // render helpers
  const renderItem = (item: Item) => {
    // ...
  };

  // main render
  return (
    // ...
  );
}
```

### Best Practices

1. **Single Responsibility**
   - Each component should do one thing well
   - Extract complex logic into custom hooks
   - Split large components into smaller ones

2. **Props**
   - Use TypeScript interfaces for props
   - Provide default props when appropriate
   - Document complex props

3. **State Management**
   - Keep state as local as possible
   - Use appropriate React hooks
   - Consider using context for shared state

4. **Performance**
   - Implement useMemo for expensive calculations
   - Use useCallback for handlers passed as props
   - Avoid unnecessary re-renders