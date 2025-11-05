# Migration Pain Points

This document summarizes the key pain points experienced during the component migration process:

1. **Wrong background class usage**
   - `.theme-card` and modals/cards were using the wrong background variable (`--color-background` or incorrect color codes) instead of the correct `--color-surface` (main theme color).

2. **Not following the SOT/spec**
   - Migrations were not consistently referencing or following the DESIGN-SYSTEM-SOT.md, leading to repeated mistakes in background color and class usage.

3. **No pre-migration audit/checklist**
   - There was no systematic pre-migration audit or checklist, so mistakes (like wrong classes or missing requirements) were repeated.

4. **Missing mobile responsiveness**
   - Migrated components (especially modals) were not always made mobile responsive, missing proper padding, breakpoints, and layout adjustments.

5. **Hardcoded or non-semantic color classes**
   - Use of hardcoded Tailwind classes (e.g., `text-gray-*`, `bg-slate-*`, `dark:`, `text-white`, `bg-white`) instead of semantic tokens.

6. **Lack of systematic prevention**
   - No enforced process or documentation to prevent the same mistakes from happening again in future migrations.

7. **Theme color inconsistency**
   - The main theme color for elevated elements (modals/cards) was not always consistent with the intended design system value (e.g., dark theme should use `#121212`).
8. **No pre and post mandatory workflow followed**
   - There was no mandatory workflow to be followed before and after migration to ensure quality and consistency. 
   - Thats why mistakes were repeated without checks in place. 
9. **Partial Migration and false reporting**
   - Some components were only partially migrated, leading to inconsistencies and confusion about the migration status.
   - Reporting mechanisms did not accurately reflect the completion status of migrations, leading to oversight of incomplete tasks. 
   - Most of the time it did not detect the compoenents within a modal completely. e.g a modal with multiple steps where only one step was migrated but reported as fully migrated. or a modal had a button component inside it which was not migrated but the modal was reported as fully migrated.
10. **Inadequate testing and validation**
   - There was a lack of thorough testing and validation after migration, leading to undetected issues and inconsistencies in the migrated components.
11. **overcompilication of migration process**
   - The migration process was overly complicated, leading to confusion and errors among team members.
   - Simplifying the process and providing clear guidelines could help reduce mistakes and improve efficiency.
12. **no mobile first UI approach**
   - The migration process did not prioritize a mobile-first UI approach, leading to components that were not optimized for mobile devices.
   - Adopting a mobile-first strategy could help ensure better responsiveness and user experience across all devices.
13. **No legacy code cleanup**
   - There was no systematic approach to cleaning up legacy code after migration, leading to clutter and potential conflicts in the codebase.
   - Implementing a cleanup process could help maintain a clean and efficient codebase post-migration.
14. **Too much documentation updates**
   - The migration process resulted in excessive updates to documentation, leading to potential inconsistencies and confusion. No need to update documentation for every small change or even all changes. Only create documentation if asked. 
15. **Layout consistency issues**
   - Migrated components often had layout inconsistencies, such as misaligned elements or inconsistent spacing, which detracted from the overall user experience.
   - Establishing clear layout guidelines and conducting thorough reviews could help address these issues.
   - Also there is no SOT for layout consistency.
   