import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Changelog from '@/components/Changelog'

export default function ChangelogPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '80px' }}>
        <section>
          <div className="section-label">changelog</div>
          <h1 className="section-title">Release history</h1>
          <p className="section-desc">
            Notable changes across every hono-forge release. Data is pulled from npm and the GitHub CHANGELOG.
          </p>
        </section>
        <Changelog />
      </main>
      <Footer />
    </>
  );
}
