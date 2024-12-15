# Custom Hooks Guidelines

## Hook Organization

### File Structure
```typescript
// imports
import { useState, useEffect } from 'react';
import { HookProps, HookReturn } from './types';

// types (if not in separate file)
interface LocalTypes {
  // ...
}

// hook
export function useCustomHook(props: HookProps): HookReturn {
  // state
  const [state, setState] = useState();

  // effects
  useEffect(() => {
    // ...
  }, []);

  // handlers
  const handleChange = () => {
    // ...
  };

  // return
  return {
    state,
    handleChange,
  };
}
```

### Best Practices

1. **Naming**
   - Always prefix with 'use'
   - Name should reflect the hook's purpose
   - Be consistent with naming conventions

2. **Composition**
   - Compose hooks from other hooks
   - Keep hooks focused and reusable
   - Extract common patterns

3. **State Management**
   - Initialize state properly
   - Handle side effects cleanly
   - Clean up resources in useEffect

4. **Error Handling**
   - Implement proper error boundaries
   - Handle edge cases
   - Provide meaningful error messages