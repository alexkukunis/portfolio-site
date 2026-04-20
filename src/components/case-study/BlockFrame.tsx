import type { ReactNode } from 'react';

export default function BlockFrame({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <div id={id} className="scroll-mt-20">
      {children}
    </div>
  );
}
