"use server"

import "server-only"

export const Section: React.FC<
  React.PropsWithChildren<{ title?: React.ReactNode }>
> = async ({ title, children }) => {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      {children}
    </section>
  )
}
