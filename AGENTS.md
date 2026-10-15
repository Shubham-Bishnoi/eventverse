<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application architecture
- Use TanStack Start for the full-stack React application because this workspace does not support Next.js.
- Keep the explicitly requested continuous wedding journey at `/`, with reusable scene controls and global semantic design tokens.
- Recreate the tab-card interaction locally rather than importing remote executable Framer modules, preserving performance and framework compatibility.
- Store demo wedding choices in Cloud behind server-only capability-verified access; never expose plan records through anonymous table reads.
- Use Apple system sans-serif typography and respect reduced-motion preferences throughout scroll animations.
