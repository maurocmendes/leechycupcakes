import { Home, ShoppingBag, ShoppingCart, User, Mail, Menu, UserPlus, LogIn, LogOut, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Define types for menu items
type BaseMenuItem = {
  icon: typeof Home;
  label: string;
};

type NavigationMenuItem = BaseMenuItem & {
  path: string;
  onClick?: never;
};

type ActionMenuItem = BaseMenuItem & {
  onClick: () => void | Promise<void>;
  path?: never;
};

type MenuItem = NavigationMenuItem | ActionMenuItem;

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial auth state and admin status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (session) {
        checkAdminStatus(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        checkAdminStatus(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();
    
    setIsAdmin(!!profile?.is_admin);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "Logout realizado com sucesso!",
        description: "Você foi desconectado da sua conta.",
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro ao tentar desconectar.",
        variant: "destructive",
      });
    }
  };

  const getMenuItems = (): MenuItem[] => {
    const baseItems: NavigationMenuItem[] = [
      { icon: Home, label: "Home", path: "/" },
      { icon: ShoppingBag, label: "Cardápio", path: "/menu" },
      { icon: ShoppingCart, label: "Carrinho", path: "/cart" },
    ];

    if (isAuthenticated) {
      const authenticatedItems = [
        { icon: User, label: "Conta", path: "/account" },
        { icon: Mail, label: "Contato", path: "/contact" },
      ];

      // Add the Manage option only for administrators
      if (isAdmin) {
        authenticatedItems.push({ icon: Settings, label: "Gerenciar", path: "/admin" });
      }

      return [
        ...baseItems,
        ...authenticatedItems,
        { icon: LogOut, label: "Logout", onClick: handleLogout },
      ];
    }

    return [
      ...baseItems,
      { icon: UserPlus, label: "Cadastro", path: "/register" },
      { icon: LogIn, label: "Login", path: "/login" },
      { icon: Mail, label: "Contato", path: "/contact" },
    ];
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-cupcake-100 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:w-64 z-40 shadow-lg`}
      >
        <div className="p-4 pt-16">
          <div className="flex flex-col items-center justify-center text-center gap-3 mb-8">
            <img src="/logo.png" alt="Leechy Cupcakes Logo" className="w-24 h-24" />
            <h1 className="text-3xl font-bold text-cupcake-600 text-center">Leechy Cupcakes</h1>
          </div>
          <nav className="space-y-2">
            {getMenuItems().map((item) => (
              'onClick' in item ? (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="flex w-full items-center space-x-3 p-3 rounded-lg hover:bg-white/50 transition-colors text-cupcake-800"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              ) : (
                <Link
                  key={item.label}
                  to={item.path}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/50 transition-colors text-cupcake-800"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};