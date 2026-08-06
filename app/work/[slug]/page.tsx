import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SiteNav from '../../components/SiteNav'
import SiteFooter from '../../components/SiteFooter'
import { projects, getProject, nextProject } from '../projects'

/*
  One file serves all six project pages. The [slug] in the folder name is a
  placeholder that gets filled from the address — /work/ember loads the entry
  with slug 'ember' from projects.ts.

  To add a project you only edit projects.ts. Nothing here needs touching.
*/

type Params = { params: Promise<{ slug: string }> }

// Tells Next which addresses exist, so all six are built ahead of time
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return { title: 'Not found — CENG' }

  return {
    title: `${project.title} — ${project.tag} — CENG`,
    description: project.summary,
  }
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params
  const project = getProject(slug)

  // An address that does not match a project falls through to the 404 page
  if (!project) notFound()

  const next = nextProject(project.slug)

  return (
    <>
      <SiteNav />

      <main id="top">
        <article className="project">
          <div className="shell">

            <a className="project__back" href="/#work" data-reveal>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M13 8H3M7 4 3 8l4 4" />
              </svg>
              All work
            </a>

            <header className="project__head" data-stagger="90">
              <p className="eyebrow" data-reveal><em>{project.index}</em> {project.tag}</p>
              <h1 className="project__title" data-split>{project.title}</h1>
              <p className="project__summary" data-reveal>{project.summary}</p>
            </header>

            <div className="project__media" data-reveal>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image}
                alt={project.alt}
                width={project.width}
                height={project.height}
              />
            </div>

            {/* The brief description, sitting under the image */}
            <div className="project__grid">
              <div className="project__body prose" data-reveal>
                {project.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              <aside className="project__facts" data-reveal data-stagger="60">
                <div className="fact" data-reveal>
                  <dt>Year</dt>
                  <dd>{project.year}</dd>
                </div>
                {project.facts.map((f) => (
                  <div className="fact" key={f.k} data-reveal>
                    <dt>{f.k}</dt>
                    <dd>{f.v}</dd>
                  </div>
                ))}
              </aside>
            </div>

          </div>
        </article>

        {/* Straight on to the next piece rather than a dead end */}
        <section className="project-next">
          <a className="project-next__link" href={`/work/${next.slug}`}>
            <div className="shell project-next__inner">
              <span className="project-next__label">Next project</span>
              <span className="project-next__title">{next.title}</span>
              <span className="project-next__tag">{next.tag}</span>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </div>
          </a>
        </section>

        <section className="section project-cta">
          <div className="shell">
            <h2 className="section__title" data-split>Want something like this?</h2>
            <p className="section__note" data-reveal>
              Send the game and the screens you need. I&apos;ll tell you honestly whether
              I&apos;m the right fit and what it&apos;ll take.
            </p>
            <a href="/#contact" className="btn btn--solid magnetic" data-reveal>
              Start a project
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
