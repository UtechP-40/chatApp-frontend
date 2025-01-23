import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next'; 
import { logoutUser } from '../redux/features/userAuthSlice';
import { LogOut, MessageSquare, Settings, Contact, User, Search } from "lucide-react";

function Navbar() {
  const { i18n } = useTranslation(); 
  const dispatch = useDispatch();
  const { authUser } = useSelector(store => store.userAuth);
  // console.clear()
  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">{i18n.t('navbar.chitChat')}</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {authUser && (
              <>
                <Link to="/search" className="btn btn-sm gap-2">
                  <Search className="size-5" />
                  <span className="hidden sm:inline">{i18n.t('navbar.search')}</span>
                </Link>
                <Link to="/friends" className="btn btn-sm gap-2">
                  <Contact className="size-5" />
                  <span className="hidden sm:inline">{i18n.t('navbar.friends')}</span>
                </Link>
              </>
            )}
            <Link to="/settings" className="btn btn-sm gap-2 transition-colors">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">{i18n.t('navbar.settings')}</span>
            </Link>

            {authUser && (
              <>
                <Link to="/profile" className="btn btn-sm gap-2">
                  <User className="size-5" />
                  <span className="hidden sm:inline">{i18n.t('navbar.profile')}</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={() => dispatch(logoutUser())}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">{i18n.t('navbar.logout')}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
