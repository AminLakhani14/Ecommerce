import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiArrowUpRight, FiBox, FiChevronRight, FiGrid, FiSettings, FiShoppingBag } from 'react-icons/fi';
import { useAppSelector } from '../redux/hooks';
import Breadcrumbs, { routeCrumbs } from '../components/Breadcrumbs';

export default function AdminShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const user = useAppSelector(state => state.auth.userInfo);
  const links = [
    { label: 'Products', to: '/admin/productlist', icon: FiBox, active: pathname.startsWith('/admin/product') },
    { label: 'Orders', to: '/admin/orderlist', icon: FiShoppingBag, active: pathname.startsWith('/admin/order') },
    { label: 'Settings', to: '/admin/settings', icon: FiSettings, active: pathname.startsWith('/admin/settings') },
  ];
  return <div className='admin-shell'>
    <aside className='admin-sidebar'>
      <Link to='/' className='admin-brand'><span className='brand-mark'>AG</span><span>AG-Store<small>ADMIN WORKSPACE</small></span></Link>
      <div className='workspace-label'><FiGrid /> Store management</div>
      <nav aria-label='Admin navigation' className='admin-nav'>
        {links.map(item => <Link key={item.to} to={item.to} className={item.active ? 'active' : ''} aria-current={item.active ? 'page' : undefined}><item.icon />{item.label}{item.active && <FiChevronRight className='nav-chevron' />}</Link>)}
      </nav>
      <div className='admin-sidebar-bottom'><span className='store-status'><i /> Your storefront</span><p>Everything your store needs, in one place.</p><Link to='/'>View store <FiArrowUpRight /></Link></div>
    </aside>
    <div className='admin-main'>
      <header className='admin-topbar'>
        <Breadcrumbs items={routeCrumbs(pathname)} />
        <div className='admin-topbar-actions'><Link to='/' className='store-preview-link'>View storefront <FiArrowUpRight /></Link><Link to='/profile' className='admin-account' aria-label='Your account'><span>{user?.name?.charAt(0).toUpperCase() || 'A'}</span><div>{user?.name || 'Admin'}<small>Store administrator</small></div></Link></div>
      </header>
      <main className='admin-content'>{children}</main>
    </div>
  </div>;
}
