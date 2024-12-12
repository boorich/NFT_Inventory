# NFT Inventory Development Guidelines

## Core Principles

1. **Type Safety First**
   - All code must be fully typed
   - No `any` types unless absolutely necessary
   - Use branded types for domain-specific values
   - Document complex type decisions

2. **Component Architecture**
   - Each component must have a single responsibility
   - Props must be fully typed
   - Use composition over inheritance
   - Follow atomic design principles
   ```typescript
   // Good
   interface ButtonProps {
     variant: 'primary' | 'secondary';
     size: 'sm' | 'md' | 'lg';
     children: React.ReactNode;
   }
   ```

3. **State Management**
   - Use hooks for local state
   - Document state shape and transitions
   - Keep global state minimal
   - Use context sparingly

4. **Testing Standards**
   - Unit tests for utilities
   - Integration tests for components
   - E2E tests for critical paths
   - Test accessibility
   ```typescript
   describe('NFTCard', () => {
     it('should be keyboard navigable', () => {
       // Test implementation
     });
   });
   ```

5. **Performance Guidelines**
   - Lazy load components when possible
   - Memoize expensive calculations
   - Monitor bundle size
   - Profile rendering performance

6. **Code Organization**
   ```
   src/
   ├── components/    # Reusable UI components
   ├── features/      # Feature-specific code
   ├── hooks/         # Custom React hooks
   ├── utils/         # Utility functions
   ├── types/         # TypeScript types
   └── services/      # External service integrations
   ```

7. **Documentation Requirements**
   - JSDoc for public APIs
   - README for each directory
   - Usage examples in Storybook
   - Architecture decision records (ADRs)

## Quality Checklist

Before submitting PR:
- [ ] Types are comprehensive and meaningful
- [ ] Tests cover critical paths
- [ ] Documentation is updated
- [ ] Performance impact is considered
- [ ] Accessibility is maintained
- [ ] Bundle size impact is reasonable

## Common Patterns

```typescript
// Use discriminated unions for state
type NFTState = 
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: NFT[] };

// Use branded types for domain values
type TokenId = string & { readonly brand: unique symbol };

// Use builder pattern for complex objects
class NFTBuilder {
  private nft: Partial<NFT> = {};
  
  withId(id: string): this {
    this.nft.id = id;
    return this;
  }
  
  build(): NFT {
    // Validate and return
  }
}
```

## Contribution Guidelines

1. Branch naming: `feature/`, `fix/`, `docs/`
2. Commit message format: `type(scope): message`
3. PR template must be followed
4. Changes must be documented
5. Tests must pass

## Review Process

1. Self-review checklist
2. Code review by peer
3. Technical review for architecture impact
4. Final review for consistency
