import '../globals.css'
import DocsDrawer from '@/components/DocsDrawer'
import { DrawerProvider } from '@/context/DrawerProvider'
import { Metadata } from 'next'

async function getFrameworkVersions(): Promise<
  {
    name: string
    url: string
  }[]
> {
  const response = await fetch(
    'https://api.github.com/repos/emilohlund-git/metaroute/tags'
  )
  const data = await response.json()
  const versions = data.map(
    (tag: { name: string; commit: { url: string } }) => ({
      name: tag.name,
      url: `https://github.com/emilohlund-git/metaroute/releases/tag/${tag.name}`
    })
  )

  return versions
}

export const metadata: Metadata = {
  title: 'MetaRoute - API Documentation',
  description: 'API framework',
  manifest: '/site.webmanifest'
}

export default async function DrawerLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const frameworkVersions = await getFrameworkVersions()
  return (
    <html lang="en">
      <body className="font-mono">
        <DrawerProvider>
          <DocsDrawer frameworkVersions={frameworkVersions}>
            {children}
          </DocsDrawer>
        </DrawerProvider>
      </body>
    </html>
  )
}
