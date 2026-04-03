import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

export default function Layout({ children, noFooter = false }) {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main>{children}</main>
      {!noFooter && <Footer />}
    </div>
  )
}
