import React, { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Books,
  ChartBar,
  ClockCountdown,
  Funnel,
  Gear,
  List,
  MagnifyingGlass,
  MemberOf,
  NotePencil,
  Plus,
  Rows,
  SignOut,
  UserCircle,
  UserList,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type RouteKey =
  | "dashboard"
  | "livros"
  | "livro-detalhe"
  | "membros"
  | "membro-perfil"
  | "emprestimos"
  | "emprestimo-novo"
  | "configuracoes";

type BookItem = {
  id: string;
  titulo: string;
  isbn: string;
  categoria: string;
  autor: string;
  disponivel: boolean;
  capa: string;
  capaAlt: string;
};

type MemberItem = {
  id: string;
  nome: string;
  email: string;
  status: "Ativo" | "Inativo" | "Bloqueado";
  plano: "Padrão" | "Premium" | "Social";
};

type LoanItem = {
  id: string;
  membro: string;
  livro: string;
  status: "Ativo" | "Atrasado" | "Devolvido";
  dataEmprestimo: string;
  dataDevolucao: string;
};

const bookImages = [
  {
    url: "https://c.animaapp.com/moh76kjucY57WP/img/ai_2.png",
    alt: "library interior with organized bookshelves",
  },
  {
    url: "https://c.animaapp.com/moh76kjucY57WP/img/ai_3.png",
    alt: "person selecting book in community library",
  },
  {
    url: "https://c.animaapp.com/moh76kjucY57WP/img/ai_4.png",
    alt: "book exchange in library desk environment",
  },
  {
    url: "https://c.animaapp.com/moh76kjucY57WP/img/ai_5.png",
    alt: "abstract geometric illustration representing data organization",
  },
];

const initialBooks: BookItem[] = [
  {
    id: "liv-1",
    titulo: "Redes de Cuidado",
    isbn: "978-85-0001",
    categoria: "Comunidade",
    autor: "Ana Ribeiro",
    disponivel: true,
    capa: bookImages[0].url,
    capaAlt: bookImages[0].alt,
  },
  {
    id: "liv-2",
    titulo: "Mapas do Bairro",
    isbn: "978-85-0002",
    categoria: "História Local",
    autor: "Paulo Costa",
    disponivel: false,
    capa: bookImages[1].url,
    capaAlt: bookImages[1].alt,
  },
  {
    id: "liv-3",
    titulo: "Aprender em Rede",
    isbn: "978-85-0003",
    categoria: "Educação",
    autor: "Marina Souza",
    disponivel: true,
    capa: bookImages[2].url,
    capaAlt: bookImages[2].alt,
  },
  {
    id: "liv-4",
    titulo: "Gestão Comunitária",
    isbn: "978-85-0004",
    categoria: "Gestão",
    autor: "Carlos Nunes",
    disponivel: true,
    capa: bookImages[3].url,
    capaAlt: bookImages[3].alt,
  },
];

const initialMembers: MemberItem[] = [
  {
    id: "mem-1",
    nome: "Joana Lima",
    email: "joana@biblioteca.org",
    status: "Ativo",
    plano: "Premium",
  },
  {
    id: "mem-2",
    nome: "Rafael Gomes",
    email: "rafael@biblioteca.org",
    status: "Bloqueado",
    plano: "Social",
  },
  {
    id: "mem-3",
    nome: "Lucia Torres",
    email: "lucia@biblioteca.org",
    status: "Ativo",
    plano: "Padrão",
  },
  {
    id: "mem-4",
    nome: "Bruno Melo",
    email: "bruno@biblioteca.org",
    status: "Inativo",
    plano: "Padrão",
  },
];

const initialLoans: LoanItem[] = [
  {
    id: "emp-1",
    membro: "Joana Lima",
    livro: "Mapas do Bairro",
    status: "Ativo",
    dataEmprestimo: "02/04/2026",
    dataDevolucao: "16/04/2026",
  },
  {
    id: "emp-2",
    membro: "Rafael Gomes",
    livro: "Redes de Cuidado",
    status: "Atrasado",
    dataEmprestimo: "20/03/2026",
    dataDevolucao: "03/04/2026",
  },
  {
    id: "emp-3",
    membro: "Lucia Torres",
    livro: "Aprender em Rede",
    status: "Devolvido",
    dataEmprestimo: "10/03/2026",
    dataDevolucao: "24/03/2026",
  },
  {
    id: "emp-4",
    membro: "Joana Lima",
    livro: "Gestão Comunitária",
    status: "Ativo",
    dataEmprestimo: "05/04/2026",
    dataDevolucao: "19/04/2026",
  },
];

const navItems: { key: RouteKey; label: string; icon: React.ReactNode }[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <ChartBar size={32} weight="regular" />,
  },
  {
    key: "livros",
    label: "Livros",
    icon: <Books size={32} weight="regular" />,
  },
  {
    key: "membros",
    label: "Membros",
    icon: <UserList size={32} weight="regular" />,
  },
  {
    key: "emprestimos",
    label: "Empréstimos",
    icon: <ClockCountdown size={32} weight="regular" />,
  },
  {
    key: "configuracoes",
    label: "Configurações",
    icon: <Gear size={32} weight="regular" />,
  },
];

function useCountUp(target: number, duration = 900) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 30;
    const increment = target / totalFrames;
    const interval = window.setInterval(() => {
      frame += 1;
      if (frame >= totalFrames) {
        setCount(target);
        window.clearInterval(interval);
      } else {
        setCount(Math.round(increment * frame));
      }
    }, duration / totalFrames);
    return () => window.clearInterval(interval);
  }, [target, duration]);

  return count;
}

function statusBadgeClass(status: string) {
  if (status === "Ativo") return "bg-info text-info-foreground";
  if (status === "Atrasado" || status === "Bloqueado")
    return "bg-error text-error-foreground";
  if (status === "Devolvido" || status === "Inativo")
    return "bg-muted text-muted-foreground";
  return "bg-secondary text-secondary-foreground";
}

function pageMeta(route: RouteKey) {
  const map: Record<RouteKey, { title: string; description: string }> = {
    dashboard: {
      title: "Dashboard | Biblioteca Comunitária",
      description: "Resumo operacional da biblioteca comunitária.",
    },
    livros: {
      title: "Livros | Biblioteca Comunitária",
      description: "Listagem, cadastro e gestão do acervo.",
    },
    "livro-detalhe": {
      title: "Detalhe do Livro | Biblioteca Comunitária",
      description: "Informações detalhadas e histórico do livro.",
    },
    membros: {
      title: "Membros | Biblioteca Comunitária",
      description: "Gestão de membros da biblioteca comunitária.",
    },
    "membro-perfil": {
      title: "Perfil do Membro | Biblioteca Comunitária",
      description: "Perfil, histórico e empréstimos do membro.",
    },
    emprestimos: {
      title: "Empréstimos | Biblioteca Comunitária",
      description: "Controle de empréstimos ativos, atrasados e devolvidos.",
    },
    "emprestimo-novo": {
      title: "Novo Empréstimo | Biblioteca Comunitária",
      description: "Fluxo guiado para registrar um novo empréstimo.",
    },
    configuracoes: {
      title: "Configurações | Biblioteca Comunitária",
      description: "Preferências e parâmetros do sistema.",
    },
  };
  return map[route];
}

function AppInner() {
  const { toast } = useToast();
  const [route, setRoute] = useState<RouteKey>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [bookView, setBookView] = useState<"lista" | "grade">("lista");
  const [bookSearch, setBookSearch] = useState("");
  const [bookCategory, setBookCategory] = useState("todos");
  const [bookAvailability, setBookAvailability] = useState("todos");
  const [memberSearch, setMemberSearch] = useState("");
  const [memberStatus, setMemberStatus] = useState("todos");
  const [memberPlan, setMemberPlan] = useState("todos");
  const [loanSearch, setLoanSearch] = useState("");
  const [loanStatus, setLoanStatus] = useState("todos");
  const [bookDialogOpen, setBookDialogOpen] = useState(false);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [authorDialogOpen, setAuthorDialogOpen] = useState(false);
  const [returnDrawerOpen, setReturnDrawerOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(
    initialBooks[0],
  );
  const [selectedMember, setSelectedMember] = useState<MemberItem | null>(
    initialMembers[0],
  );
  const [books, setBooks] = useState<BookItem[]>(initialBooks);
  const [members, setMembers] = useState<MemberItem[]>(initialMembers);
  const [loans, setLoans] = useState<LoanItem[]>(initialLoans);
  const [newBook, setNewBook] = useState({
    titulo: "",
    isbn: "",
    categoria: "",
    autor: "",
    disponivel: true,
  });
  const [newMember, setNewMember] = useState({
    nome: "",
    email: "",
    plano: "Padrão",
    status: "Ativo",
  });
  const [loanStep, setLoanStep] = useState(1);
  const [selectedLoanMember, setSelectedLoanMember] = useState("");
  const [selectedLoanBook, setSelectedLoanBook] = useState("");
  const [loanMemberOpen, setLoanMemberOpen] = useState(false);
  const [loanBookOpen, setLoanBookOpen] = useState(false);
  const [loanDate, setLoanDate] = useState("2026-04-10");
  const [loanReturnDate, setLoanReturnDate] = useState("2026-04-24");
  const [submitting, setSubmitting] = useState(false);

  const meta = pageMeta(route);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [route]);

  const activeLoans = loans.filter((item) => item.status === "Ativo").length;
  const overdueLoans = loans.filter(
    (item) => item.status === "Atrasado",
  ).length;
  const completionRate = Math.round(
    ((loans.filter((item) => item.status === "Devolvido").length || 1) /
      loans.length) *
      100,
  );

  const countActive = useCountUp(activeLoans);
  const countOverdue = useCountUp(overdueLoans);
  const countBooks = useCountUp(books.length);
  const countMembers = useCountUp(members.length);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const searchMatch =
        book.titulo.toLowerCase().includes(bookSearch.toLowerCase()) ||
        book.isbn.toLowerCase().includes(bookSearch.toLowerCase());
      const categoryMatch =
        bookCategory === "todos" || book.categoria === bookCategory;
      const availabilityMatch =
        bookAvailability === "todos" ||
        (bookAvailability === "disponivel" && book.disponivel) ||
        (bookAvailability === "indisponivel" && !book.disponivel);
      return searchMatch && categoryMatch && availabilityMatch;
    });
  }, [books, bookSearch, bookCategory, bookAvailability]);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const searchMatch =
        member.nome.toLowerCase().includes(memberSearch.toLowerCase()) ||
        member.email.toLowerCase().includes(memberSearch.toLowerCase());
      const statusMatch =
        memberStatus === "todos" || member.status === memberStatus;
      const planMatch = memberPlan === "todos" || member.plano === memberPlan;
      return searchMatch && statusMatch && planMatch;
    });
  }, [members, memberSearch, memberStatus, memberPlan]);

  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      const searchMatch =
        loan.membro.toLowerCase().includes(loanSearch.toLowerCase()) ||
        loan.livro.toLowerCase().includes(loanSearch.toLowerCase());
      const statusMatch = loanStatus === "todos" || loan.status === loanStatus;
      return searchMatch && statusMatch;
    });
  }, [loans, loanSearch, loanStatus]);

  const topBooks = [
    { nome: "Mapas do Bairro", total: 18 },
    { nome: "Redes de Cuidado", total: 14 },
    { nome: "Aprender em Rede", total: 11 },
    { nome: "Gestão Comunitária", total: 9 },
    { nome: "Memória Viva", total: 7 },
  ];

  const topMembers = [
    { nome: "Joana Lima", total: 12 },
    { nome: "Lucia Torres", total: 9 },
    { nome: "Rafael Gomes", total: 8 },
    { nome: "Bruno Melo", total: 6 },
    { nome: "Carla Dias", total: 5 },
  ];

  const navigateTo = (next: RouteKey) => {
    setRoute(next);
    setMobileMenuOpen(false);
  };

  const handleBookSave = async () => {
    setSubmitting(true);
    const optimisticBook: BookItem = {
      id: `liv-${Date.now()}`,
      titulo: newBook.titulo,
      isbn: newBook.isbn,
      categoria: newBook.categoria,
      autor: newBook.autor,
      disponivel: newBook.disponivel,
      capa: bookImages[books.length % bookImages.length].url,
      capaAlt: bookImages[books.length % bookImages.length].alt,
    };
    const previous = books;
    setBooks([optimisticBook, ...books]);

    await new Promise((resolve) => setTimeout(resolve, 900));

    if (!newBook.titulo || !newBook.isbn || !newBook.autor) {
      setBooks(previous);
      toast({
        title: "Erro ao salvar livro",
        description: "Preencha título, ISBN e autor para continuar.",
        className: "border-error bg-error text-error-foreground",
      });
      setSubmitting(false);
      return;
    }

    toast({
      title: "Livro salvo com sucesso",
      description: `${newBook.titulo} foi adicionado ao acervo.`,
      className: "border-success bg-success text-success-foreground",
    });
    setNewBook({
      titulo: "",
      isbn: "",
      categoria: "",
      autor: "",
      disponivel: true,
    });
    setBookDialogOpen(false);
    setSubmitting(false);
  };

  const handleMemberSave = async () => {
    setSubmitting(true);
    const emailValid = /\S+@\S+\.\S+/.test(newMember.email);
    const optimisticMember: MemberItem = {
      id: `mem-${Date.now()}`,
      nome: newMember.nome,
      email: newMember.email,
      plano: newMember.plano as MemberItem["plano"],
      status: newMember.status as MemberItem["status"],
    };
    const previous = members;
    setMembers([optimisticMember, ...members]);

    await new Promise((resolve) => setTimeout(resolve, 900));

    if (!newMember.nome || !emailValid) {
      setMembers(previous);
      toast({
        title: "Erro ao salvar membro",
        description: "Informe um nome e e-mail válido.",
        className: "border-error bg-error text-error-foreground",
      });
      setSubmitting(false);
      return;
    }

    toast({
      title: "Membro cadastrado",
      description: `${newMember.nome} foi adicionado com sucesso.`,
      className: "border-success bg-success text-success-foreground",
    });
    setNewMember({ nome: "", email: "", plano: "Padrão", status: "Ativo" });
    setMemberDialogOpen(false);
    setSubmitting(false);
  };

  const handleNewLoan = async () => {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    const selectedBookLabel = books.find(
      (item) => item.id === selectedLoanBook,
    )?.titulo;
    const selectedMemberLabel = members.find(
      (item) => item.id === selectedLoanMember,
    )?.nome;

    if (!selectedBookLabel || !selectedMemberLabel) {
      toast({
        title: "Atenção",
        description: "Selecione um membro e um livro para concluir.",
        className: "border-warning bg-warning text-warning-foreground",
      });
      setSubmitting(false);
      return;
    }

    setLoans([
      {
        id: `emp-${Date.now()}`,
        membro: selectedMemberLabel,
        livro: selectedBookLabel,
        status: "Ativo",
        dataEmprestimo: loanDate,
        dataDevolucao: loanReturnDate,
      },
      ...loans,
    ]);

    toast({
      title: "Empréstimo concluído",
      description: `Empréstimo registrado para ${selectedMemberLabel}.`,
      className: "border-success bg-success text-success-foreground",
    });
    setLoanStep(1);
    setSelectedLoanMember("");
    setSelectedLoanBook("");
    setRoute("emprestimos");
    setSubmitting(false);
  };

  const handleReturn = () => {
    toast({
      title: "Devolução registrada",
      description: "O empréstimo foi atualizado como devolvido.",
      className: "border-success bg-success text-success-foreground",
    });
    setReturnDrawerOpen(false);
  };

  const fabLabel =
    route === "livros" || route === "livro-detalhe"
      ? "Novo Livro"
      : route === "membros" || route === "membro-perfil"
        ? "Novo Membro"
        : route === "emprestimos"
          ? "Novo Empréstimo"
          : "Novo Livro";

  const fabAction = () => {
    if (route === "livros" || route === "livro-detalhe")
      setBookDialogOpen(true);
    else if (route === "membros" || route === "membro-perfil")
      setMemberDialogOpen(true);
    else if (route === "emprestimos") setRoute("emprestimo-novo");
    else setBookDialogOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
      </Helmet>

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-background focus:px-4 focus:py-3 focus:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Pular para o conteúdo
      </a>

      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 md:px-6">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                aria-label="Abrir menu"
                onClick={() => setMobileMenuOpen(true)}
                className="bg-secondary text-secondary-foreground hover:bg-secondary-hover md:hidden"
              >
                <List size={32} weight="regular" />
              </Button>
              <button
                type="button"
                onClick={() => navigateTo("dashboard")}
                className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 transition-all duration-200 ease-in-out hover:bg-tertiary focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <div className="rounded-lg bg-gradient-primary p-2">
                  <BookOpen
                    size={32}
                    weight="regular"
                    className="text-primary-foreground"
                  />
                </div>
                <div className="hidden sm:block">
                  <p className="font-heading text-lg font-medium tracking-tight text-foreground">
                    Biblioteca Comunitária
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Gestão de acervo, membros e empréstimos
                  </p>
                </div>
              </button>
            </div>

            <div className="hidden flex-1 items-center justify-center px-4 lg:flex">
              <button
                type="button"
                onClick={() => setCommandOpen(true)}
                className="flex min-h-11 w-full max-w-xl cursor-pointer items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-left transition-all duration-200 ease-in-out hover:bg-tertiary focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <span className="flex items-center gap-3 text-muted-foreground">
                  <MagnifyingGlass size={32} weight="regular" />
                  <span className="text-sm text-muted-foreground">
                    Buscar livros, membros e páginas
                  </span>
                </span>
                <span className="rounded-md bg-tertiary px-3 py-1 text-xs text-foreground">
                  Ctrl+K
                </span>
              </button>
            </div>

            <NavigationMenu className="hidden md:block">
              <NavigationMenuList className="flex gap-2">
                {navItems.map((item) => {
                  const active =
                    route === item.key ||
                    (item.key === "livros" && route === "livro-detalhe") ||
                    (item.key === "membros" && route === "membro-perfil") ||
                    (item.key === "emprestimos" && route === "emprestimo-novo");
                  return (
                    <NavigationMenuItem key={item.key}>
                      <button
                        type="button"
                        onClick={() => navigateTo(item.key)}
                        className={`min-h-11 cursor-pointer rounded-md px-4 py-3 text-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring ${
                          active
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-background text-foreground hover:bg-tertiary"
                        }`}
                      >
                        {item.label}
                      </button>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                onClick={() => setCommandOpen(true)}
                className="bg-background text-foreground hover:bg-tertiary lg:hidden"
                aria-label="Abrir busca rápida"
              >
                <MagnifyingGlass size={32} weight="regular" />
              </Button>
              <button
                type="button"
                className="flex min-h-11 cursor-pointer items-center gap-3 rounded-full border border-border bg-background px-3 py-2 transition-all duration-200 ease-in-out hover:bg-tertiary focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Abrir perfil do usuário"
              >
                <UserCircle
                  size={32}
                  weight="regular"
                  className="text-primary"
                />
                <span className="hidden text-sm text-foreground sm:block">
                  Equipe
                </span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex">
          <aside
            className={`hidden border-r border-border bg-surface md:block ${sidebarCollapsed ? "w-20" : "w-[260px]"} transition-all duration-200 ease-in-out`}
          >
            <div className="flex h-[calc(100vh-64px)] flex-col justify-between p-4">
              <div className="space-y-4">
                <Button
                  type="button"
                  onClick={() => setSidebarCollapsed((prev) => !prev)}
                  className="w-full justify-center bg-background text-foreground hover:bg-tertiary"
                >
                  {sidebarCollapsed ? (
                    <Rows size={32} weight="regular" />
                  ) : (
                    <List size={32} weight="regular" />
                  )}
                </Button>
                <NavigationMenu orientation="vertical" className="max-w-none">
                  <NavigationMenuList className="flex w-full flex-col gap-2">
                    {navItems.map((item) => {
                      const active =
                        route === item.key ||
                        (item.key === "livros" && route === "livro-detalhe") ||
                        (item.key === "membros" && route === "membro-perfil") ||
                        (item.key === "emprestimos" &&
                          route === "emprestimo-novo");
                      return (
                        <NavigationMenuItem key={item.key} className="w-full">
                          <button
                            type="button"
                            onClick={() => navigateTo(item.key)}
                            className={`flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-md border-l-4 px-4 py-3 text-left transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring ${
                              active
                                ? "border-l-primary bg-secondary text-secondary-foreground"
                                : "border-l-transparent bg-surface text-foreground hover:bg-tertiary"
                            }`}
                          >
                            <span className="text-primary">{item.icon}</span>
                            {!sidebarCollapsed && (
                              <span className="text-sm text-inherit">
                                {item.label}
                              </span>
                            )}
                          </button>
                        </NavigationMenuItem>
                      );
                    })}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>

              <div className="space-y-3">
                {!sidebarCollapsed && (
                  <Card className="border-border bg-tertiary p-4">
                    <p className="font-heading text-sm font-medium text-foreground">
                      Acesso rápido
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Use Ctrl+K para navegar entre livros, membros e ações.
                    </p>
                  </Card>
                )}
                <Button
                  type="button"
                  className="w-full bg-background text-foreground hover:bg-tertiary"
                >
                  <SignOut size={32} weight="regular" />
                  {!sidebarCollapsed && (
                    <span className="text-sm text-foreground">Sair</span>
                  )}
                </Button>
              </div>
            </div>
          </aside>

          <main
            id="main-content"
            className="min-h-[calc(100vh-64px)] flex-1 bg-background"
          >
            <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-6">
              <div className="animate-in fade-in-0 slide-in-from-bottom-1 duration-200">
                {route === "dashboard" && (
                  <section
                    aria-labelledby="dashboard-title"
                    className="space-y-8"
                  >
                    <div className="overflow-hidden rounded-xl border border-border bg-gradient-primary p-6">
                      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                        <div className="space-y-3">
                          <h1
                            id="dashboard-title"
                            className="font-heading text-3xl font-medium tracking-tight text-primary-foreground"
                          >
                            Dashboard operacional
                          </h1>
                          <p className="max-w-2xl text-base text-primary-foreground">
                            Visualize empréstimos ativos, atrasos e desempenho
                            do acervo em uma única área de trabalho.
                          </p>
                        </div>
                        <img
                          src="https://c.animaapp.com/moh76kjucY57WP/img/ai_1.png"
                          alt="abstract representation of community knowledge sharing"
                          loading="lazy"
                          className="h-40 w-full rounded-lg border border-primary-foreground/20 object-cover"
                        />
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                      <StatsCard
                        title="Empréstimos Ativos"
                        value={countActive}
                        trend="+6% nesta semana"
                        icon={<ClockCountdown size={32} weight="regular" />}
                      />
                      <StatsCard
                        title="Empréstimos Atrasados"
                        value={countOverdue}
                        trend="-2% em relação ontem"
                        icon={<WarningCircle size={32} weight="regular" />}
                      />
                      <StatsCard
                        title="Livros no Acervo"
                        value={countBooks}
                        trend="+4 novos títulos"
                        icon={<Books size={32} weight="regular" />}
                      />
                      <StatsCard
                        title="Membros Ativos"
                        value={countMembers}
                        trend="+3 cadastros recentes"
                        icon={<MemberOf size={32} weight="regular" />}
                      />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr_1.2fr]">
                      <Card className="border-border bg-surface p-6">
                        <h2 className="font-heading text-xl font-medium tracking-tight text-foreground">
                          Taxa de conclusão
                        </h2>
                        <div className="mt-6 flex items-center justify-center">
                          <div className="relative flex h-44 w-44 items-center justify-center rounded-full border-[14px] border-secondary">
                            <div
                              className="absolute inset-0 rounded-full"
                              style={{
                                background: `conic-gradient(hsl(204 80% 45%) ${completionRate}%, hsl(210 15% 90%) ${completionRate}% 100%)`,
                                borderRadius: "9999px",
                                mask: "radial-gradient(transparent 58%, black 59%)",
                                WebkitMask:
                                  "radial-gradient(transparent 58%, black 59%)",
                              }}
                            />
                            <div className="relative text-center">
                              <p className="font-heading text-4xl font-medium text-foreground">
                                {completionRate}%
                              </p>
                              <p className="mt-1 text-sm text-muted-foreground">
                                devoluções concluídas
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>

                      <TopList
                        title="Livros mais emprestados"
                        items={topBooks}
                      />
                      <TopList title="Membros mais ativos" items={topMembers} />
                    </div>
                  </section>
                )}

                {route === "livros" && (
                  <section aria-labelledby="livros-title" className="space-y-8">
                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                      <div>
                        <h1
                          id="livros-title"
                          className="font-heading text-3xl font-medium tracking-tight text-foreground"
                        >
                          Livros
                        </h1>
                        <p className="mt-2 text-base text-muted-foreground">
                          Gerencie cadastro, disponibilidade e histórico do
                          acervo.
                        </p>
                      </div>
                      <Button
                        type="button"
                        onClick={() => setBookDialogOpen(true)}
                        className="bg-primary text-primary-foreground hover:bg-primary-hover"
                      >
                        <Plus size={32} weight="regular" />
                        <span className="text-sm text-primary-foreground">
                          Novo Livro
                        </span>
                      </Button>
                    </div>

                    <Card className="border-border bg-surface p-6">
                      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr_1fr_auto]">
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                            Buscar
                          </Label>
                          <div className="relative">
                            <MagnifyingGlass
                              size={32}
                              weight="regular"
                              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            />
                            <Input
                              aria-label="Buscar por título ou ISBN"
                              value={bookSearch}
                              onChange={(e) => setBookSearch(e.target.value)}
                              className="pl-12 text-foreground"
                              placeholder="Título ou ISBN"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                            Categoria
                          </Label>
                          <Select
                            value={bookCategory}
                            onValueChange={setBookCategory}
                          >
                            <SelectTrigger className="text-foreground">
                              <SelectValue placeholder="Todas" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="todos">Todas</SelectItem>
                              <SelectItem value="Comunidade">
                                Comunidade
                              </SelectItem>
                              <SelectItem value="História Local">
                                História Local
                              </SelectItem>
                              <SelectItem value="Educação">Educação</SelectItem>
                              <SelectItem value="Gestão">Gestão</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                            Disponibilidade
                          </Label>
                          <Select
                            value={bookAvailability}
                            onValueChange={setBookAvailability}
                          >
                            <SelectTrigger className="text-foreground">
                              <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="todos">Todos</SelectItem>
                              <SelectItem value="disponivel">
                                Disponível
                              </SelectItem>
                              <SelectItem value="indisponivel">
                                Indisponível
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-end gap-2">
                          <Button
                            type="button"
                            onClick={() => setBookView("lista")}
                            className={
                              bookView === "lista"
                                ? "bg-primary text-primary-foreground hover:bg-primary-hover"
                                : "bg-background text-foreground hover:bg-tertiary"
                            }
                          >
                            <Rows size={32} weight="regular" />
                          </Button>
                          <Button
                            type="button"
                            onClick={() => setBookView("grade")}
                            className={
                              bookView === "grade"
                                ? "bg-primary text-primary-foreground hover:bg-primary-hover"
                                : "bg-background text-foreground hover:bg-tertiary"
                            }
                          >
                            <List size={32} weight="regular" />
                          </Button>
                        </div>
                      </div>
                    </Card>

                    {filteredBooks.length === 0 ? (
                      <EmptyState
                        title="Nenhum livro encontrado"
                        description="Ajuste os filtros ou cadastre seu primeiro livro para começar a organizar o acervo."
                        actionLabel="Cadastrar Livro"
                        onAction={() => setBookDialogOpen(true)}
                      />
                    ) : bookView === "lista" ? (
                      <>
                        <div className="hidden overflow-hidden rounded-xl border border-border bg-surface lg:block">
                          <div className="grid grid-cols-[1.6fr_1fr_1fr_0.8fr_0.8fr] gap-4 border-b border-border bg-tertiary px-6 py-4">
                            {[
                              "Título",
                              "Autor",
                              "Categoria",
                              "Status",
                              "Ações",
                            ].map((label) => (
                              <p
                                key={label}
                                className="text-sm font-normal text-foreground"
                              >
                                {label}
                              </p>
                            ))}
                          </div>
                          <div className="divide-y divide-border">
                            {filteredBooks.map((book) => (
                              <div
                                key={book.id}
                                className="grid grid-cols-[1.6fr_1fr_1fr_0.8fr_0.8fr] gap-4 px-6 py-5 transition-all duration-200 ease-in-out hover:bg-gray-50"
                              >
                                <div className="flex items-center gap-4">
                                  <img
                                    src={book.capa}
                                    alt={book.capaAlt}
                                    loading="lazy"
                                    className="h-16 w-20 rounded-md border border-border object-cover"
                                  />
                                  <div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedBook(book);
                                        setRoute("livro-detalhe");
                                      }}
                                      className="cursor-pointer text-left text-base text-foreground underline-offset-4 transition-all duration-200 ease-in-out hover:underline focus:outline-none focus:ring-2 focus:ring-ring"
                                    >
                                      {book.titulo}
                                    </button>
                                    <p className="text-sm text-muted-foreground">
                                      ISBN {book.isbn}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-sm text-foreground">
                                  {book.autor}
                                </p>
                                <p className="text-sm text-foreground">
                                  {book.categoria}
                                </p>
                                <div>
                                  <Badge
                                    className={
                                      book.disponivel
                                        ? "bg-success text-success-foreground"
                                        : "bg-warning text-warning-foreground"
                                    }
                                  >
                                    {book.disponivel
                                      ? "Disponível"
                                      : "Emprestado"}
                                  </Badge>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    type="button"
                                    className="bg-background text-foreground hover:bg-tertiary"
                                  >
                                    <NotePencil size={32} weight="regular" />
                                  </Button>
                                  <Button
                                    type="button"
                                    className="bg-background text-foreground hover:bg-tertiary"
                                    onClick={() => {
                                      const previous = books;
                                      setBooks((current) =>
                                        current.filter(
                                          (item) => item.id !== book.id,
                                        ),
                                      );
                                      toast({
                                        title: "Livro removido",
                                        description: `${book.titulo} foi excluído da listagem.`,
                                        className:
                                          "border-warning bg-warning text-warning-foreground",
                                      });
                                      if (previous.length === 1)
                                        setBooks(previous);
                                    }}
                                  >
                                    <X size={32} weight="regular" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid gap-4 lg:hidden">
                          {filteredBooks.map((book) => (
                            <Card
                              key={book.id}
                              className="border-border bg-surface p-4"
                            >
                              <div className="flex gap-4">
                                <img
                                  src={book.capa}
                                  alt={book.capaAlt}
                                  loading="lazy"
                                  className="h-24 w-24 rounded-md border border-border object-cover"
                                />
                                <div className="min-w-0 flex-1 space-y-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedBook(book);
                                      setRoute("livro-detalhe");
                                    }}
                                    className="cursor-pointer text-left text-base text-foreground underline-offset-4 transition-all duration-200 ease-in-out hover:underline focus:outline-none focus:ring-2 focus:ring-ring"
                                  >
                                    {book.titulo}
                                  </button>
                                  <p className="text-sm text-muted-foreground">
                                    {book.autor}
                                  </p>
                                  <p className="text-sm text-foreground">
                                    {book.categoria}
                                  </p>
                                  <Badge
                                    className={
                                      book.disponivel
                                        ? "bg-success text-success-foreground"
                                        : "bg-warning text-warning-foreground"
                                    }
                                  >
                                    {book.disponivel
                                      ? "Disponível"
                                      : "Emprestado"}
                                  </Badge>
                                  <div className="flex gap-2 pt-2">
                                    <Button
                                      type="button"
                                      className="bg-background text-foreground hover:bg-tertiary"
                                    >
                                      <NotePencil size={32} weight="regular" />
                                    </Button>
                                    <Button
                                      type="button"
                                      className="bg-background text-foreground hover:bg-tertiary"
                                    >
                                      <X size={32} weight="regular" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {filteredBooks.map((book) => (
                          <Card
                            key={book.id}
                            className="overflow-hidden border-border bg-surface p-0"
                          >
                            <img
                              src={book.capa}
                              alt={book.capaAlt}
                              loading="lazy"
                              className="h-48 w-full object-cover"
                            />
                            <div className="space-y-4 p-6">
                              <div className="space-y-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedBook(book);
                                    setRoute("livro-detalhe");
                                  }}
                                  className="cursor-pointer text-left font-heading text-xl font-medium tracking-tight text-foreground underline-offset-4 transition-all duration-200 ease-in-out hover:underline focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                  {book.titulo}
                                </button>
                                <p className="text-sm text-muted-foreground">
                                  {book.autor}
                                </p>
                              </div>
                              <div className="flex items-center justify-between">
                                <Badge className="bg-secondary text-secondary-foreground">
                                  {book.categoria}
                                </Badge>
                                <Badge
                                  className={
                                    book.disponivel
                                      ? "bg-success text-success-foreground"
                                      : "bg-warning text-warning-foreground"
                                  }
                                >
                                  {book.disponivel
                                    ? "Disponível"
                                    : "Emprestado"}
                                </Badge>
                              </div>
                              <div className="flex gap-3">
                                <Button
                                  type="button"
                                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary-hover"
                                >
                                  <NotePencil size={32} weight="regular" />
                                  <span className="text-sm text-primary-foreground">
                                    Editar
                                  </span>
                                </Button>
                                <Button
                                  type="button"
                                  className="bg-background text-foreground hover:bg-tertiary"
                                >
                                  <X size={32} weight="regular" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}

                    <Card className="border-border bg-surface p-6">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <h2 className="font-heading text-xl font-medium tracking-tight text-foreground">
                            Gestão de autores e categorias
                          </h2>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Mantenha listas de apoio organizadas para o cadastro
                            do acervo.
                          </p>
                        </div>
                        <Button
                          type="button"
                          onClick={() => setAuthorDialogOpen(true)}
                          className="bg-secondary text-secondary-foreground hover:bg-secondary-hover"
                        >
                          <Plus size={32} weight="regular" />
                          <span className="text-sm text-secondary-foreground">
                            Gerenciar
                          </span>
                        </Button>
                      </div>
                    </Card>
                  </section>
                )}

                {route === "livro-detalhe" && selectedBook && (
                  <section
                    aria-labelledby="livro-detalhe-title"
                    className="space-y-8"
                  >
                    <div className="flex flex-col gap-6 lg:flex-row">
                      <img
                        src={selectedBook.capa}
                        alt={selectedBook.capaAlt}
                        loading="lazy"
                        className="h-64 w-full rounded-xl border border-border object-cover lg:w-80"
                      />
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <Badge className="bg-secondary text-secondary-foreground">
                            {selectedBook.categoria}
                          </Badge>
                          <Badge
                            className={
                              selectedBook.disponivel
                                ? "bg-success text-success-foreground"
                                : "bg-warning text-warning-foreground"
                            }
                          >
                            {selectedBook.disponivel
                              ? "Disponível"
                              : "Emprestado"}
                          </Badge>
                        </div>
                        <h1
                          id="livro-detalhe-title"
                          className="font-heading text-3xl font-medium tracking-tight text-foreground"
                        >
                          {selectedBook.titulo}
                        </h1>
                        <p className="text-base text-muted-foreground">
                          Autor: {selectedBook.autor}
                        </p>
                        <p className="text-base text-foreground">
                          ISBN: {selectedBook.isbn}
                        </p>
                        <div className="flex gap-3">
                          <Button
                            type="button"
                            onClick={() => setRoute("livros")}
                            className="bg-background text-foreground hover:bg-tertiary"
                          >
                            <Books size={32} weight="regular" />
                            <span className="text-sm text-foreground">
                              Voltar
                            </span>
                          </Button>
                          <Button
                            type="button"
                            onClick={() => setBookDialogOpen(true)}
                            className="bg-primary text-primary-foreground hover:bg-primary-hover"
                          >
                            <NotePencil size={32} weight="regular" />
                            <span className="text-sm text-primary-foreground">
                              Editar Livro
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Tabs defaultValue="info" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-tertiary">
                        <TabsTrigger value="info" className="text-foreground">
                          Informações Gerais
                        </TabsTrigger>
                        <TabsTrigger
                          value="historico"
                          className="text-foreground"
                        >
                          Histórico de Empréstimos
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="info" className="mt-6">
                        <Card className="border-border bg-surface p-6">
                          <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                Resumo
                              </p>
                              <p className="text-base text-foreground">
                                Título alinhado ao acervo comunitário com
                                classificação clara e disponibilidade
                                atualizada.
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                Metadados
                              </p>
                              <p className="text-base text-foreground">
                                Categoria: {selectedBook.categoria}
                              </p>
                              <p className="text-base text-foreground">
                                Autor: {selectedBook.autor}
                              </p>
                              <p className="text-base text-foreground">
                                ISBN: {selectedBook.isbn}
                              </p>
                            </div>
                          </div>
                        </Card>
                      </TabsContent>
                      <TabsContent value="historico" className="mt-6">
                        <Card className="border-border bg-surface p-6">
                          <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <h2 className="font-heading text-xl font-medium tracking-tight text-foreground">
                              Histórico recente
                            </h2>
                            <div className="relative max-w-sm">
                              <Funnel
                                size={32}
                                weight="regular"
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                              />
                              <Input
                                placeholder="Filtrar histórico"
                                className="pl-12 text-foreground"
                              />
                            </div>
                          </div>
                          <div className="space-y-3">
                            {loans
                              .filter(
                                (loan) => loan.livro === selectedBook.titulo,
                              )
                              .map((loan) => (
                                <div
                                  key={loan.id}
                                  className="flex flex-col gap-3 rounded-lg border border-border px-4 py-4 md:flex-row md:items-center md:justify-between"
                                >
                                  <div>
                                    <p className="text-base text-foreground">
                                      {loan.membro}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {loan.dataEmprestimo} até{" "}
                                      {loan.dataDevolucao}
                                    </p>
                                  </div>
                                  <Badge
                                    className={statusBadgeClass(loan.status)}
                                  >
                                    {loan.status}
                                  </Badge>
                                </div>
                              ))}
                          </div>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </section>
                )}

                {route === "membros" && (
                  <section
                    aria-labelledby="membros-title"
                    className="space-y-8"
                  >
                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                      <div>
                        <h1
                          id="membros-title"
                          className="font-heading text-3xl font-medium tracking-tight text-foreground"
                        >
                          Membros
                        </h1>
                        <p className="mt-2 text-base text-muted-foreground">
                          Acompanhe status, plano e ações rápidas de cada
                          membro.
                        </p>
                      </div>
                      <Button
                        type="button"
                        onClick={() => setMemberDialogOpen(true)}
                        className="bg-primary text-primary-foreground hover:bg-primary-hover"
                      >
                        <Plus size={32} weight="regular" />
                        <span className="text-sm text-primary-foreground">
                          Novo Membro
                        </span>
                      </Button>
                    </div>

                    <Card className="border-border bg-surface p-6">
                      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr_1fr]">
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                            Buscar
                          </Label>
                          <div className="relative">
                            <MagnifyingGlass
                              size={32}
                              weight="regular"
                              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            />
                            <Input
                              value={memberSearch}
                              onChange={(e) => setMemberSearch(e.target.value)}
                              className="pl-12 text-foreground"
                              placeholder="Nome ou e-mail"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                            Status
                          </Label>
                          <Select
                            value={memberStatus}
                            onValueChange={setMemberStatus}
                          >
                            <SelectTrigger className="text-foreground">
                              <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="todos">Todos</SelectItem>
                              <SelectItem value="Ativo">Ativo</SelectItem>
                              <SelectItem value="Inativo">Inativo</SelectItem>
                              <SelectItem value="Bloqueado">
                                Bloqueado
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                            Plano
                          </Label>
                          <Select
                            value={memberPlan}
                            onValueChange={setMemberPlan}
                          >
                            <SelectTrigger className="text-foreground">
                              <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="todos">Todos</SelectItem>
                              <SelectItem value="Padrão">Padrão</SelectItem>
                              <SelectItem value="Premium">Premium</SelectItem>
                              <SelectItem value="Social">Social</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </Card>

                    <div className="hidden overflow-hidden rounded-xl border border-border bg-surface lg:block">
                      <div className="grid grid-cols-[1.2fr_1.2fr_0.8fr_0.8fr_1fr] gap-4 border-b border-border bg-tertiary px-6 py-4">
                        {["Nome", "E-mail", "Status", "Plano", "Ações"].map(
                          (label) => (
                            <p key={label} className="text-sm text-foreground">
                              {label}
                            </p>
                          ),
                        )}
                      </div>
                      <div className="divide-y divide-border">
                        {filteredMembers.map((member) => (
                          <div
                            key={member.id}
                            className="grid grid-cols-[1.2fr_1.2fr_0.8fr_0.8fr_1fr] gap-4 px-6 py-5 transition-all duration-200 ease-in-out hover:bg-gray-50"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedMember(member);
                                setRoute("membro-perfil");
                              }}
                              className="cursor-pointer text-left text-sm text-foreground underline-offset-4 transition-all duration-200 ease-in-out hover:underline focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                              {member.nome}
                            </button>
                            <p className="text-sm text-foreground">
                              {member.email}
                            </p>
                            <div>
                              <Badge
                                className={statusBadgeClass(member.status)}
                              >
                                {member.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-foreground">
                              {member.plano}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                onClick={() => {
                                  setSelectedMember(member);
                                  setRoute("membro-perfil");
                                }}
                                className="bg-background text-foreground hover:bg-tertiary"
                              >
                                <UserCircle size={32} weight="regular" />
                              </Button>
                              <Button
                                type="button"
                                onClick={() => {
                                  const nextStatus =
                                    member.status === "Bloqueado"
                                      ? "Ativo"
                                      : "Bloqueado";
                                  setMembers((current) =>
                                    current.map((item) =>
                                      item.id === member.id
                                        ? { ...item, status: nextStatus }
                                        : item,
                                    ),
                                  );
                                  toast({
                                    title:
                                      nextStatus === "Bloqueado"
                                        ? "Membro bloqueado"
                                        : "Membro desbloqueado",
                                    description: `${member.nome} agora está com status ${nextStatus}.`,
                                    className:
                                      nextStatus === "Bloqueado"
                                        ? "border-warning bg-warning text-warning-foreground"
                                        : "border-success bg-success text-success-foreground",
                                  });
                                }}
                                className="bg-background text-foreground hover:bg-tertiary"
                              >
                                <WarningCircle size={32} weight="regular" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 lg:hidden">
                      {filteredMembers.map((member) => (
                        <Card
                          key={member.id}
                          className="border-border bg-surface p-4"
                        >
                          <div className="space-y-3">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedMember(member);
                                setRoute("membro-perfil");
                              }}
                              className="cursor-pointer text-left font-heading text-lg font-medium tracking-tight text-foreground underline-offset-4 transition-all duration-200 ease-in-out hover:underline focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                              {member.nome}
                            </button>
                            <p className="text-sm text-foreground">
                              {member.email}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <Badge
                                className={statusBadgeClass(member.status)}
                              >
                                {member.status}
                              </Badge>
                              <Badge className="bg-secondary text-secondary-foreground">
                                {member.plano}
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                className="bg-background text-foreground hover:bg-tertiary"
                              >
                                <UserCircle size={32} weight="regular" />
                              </Button>
                              <Button
                                type="button"
                                className="bg-background text-foreground hover:bg-tertiary"
                              >
                                <WarningCircle size={32} weight="regular" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </section>
                )}

                {route === "membro-perfil" && selectedMember && (
                  <section aria-labelledby="membro-title" className="space-y-8">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            className={statusBadgeClass(selectedMember.status)}
                          >
                            {selectedMember.status}
                          </Badge>
                          <Badge className="bg-secondary text-secondary-foreground">
                            {selectedMember.plano}
                          </Badge>
                        </div>
                        <h1
                          id="membro-title"
                          className="font-heading text-3xl font-medium tracking-tight text-foreground"
                        >
                          {selectedMember.nome}
                        </h1>
                        <p className="text-base text-muted-foreground">
                          {selectedMember.email}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          onClick={() => setRoute("membros")}
                          className="bg-background text-foreground hover:bg-tertiary"
                        >
                          <UserList size={32} weight="regular" />
                          <span className="text-sm text-foreground">
                            Voltar
                          </span>
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            const nextStatus =
                              selectedMember.status === "Bloqueado"
                                ? "Ativo"
                                : "Bloqueado";
                            setSelectedMember({
                              ...selectedMember,
                              status: nextStatus,
                            });
                            setMembers((current) =>
                              current.map((item) =>
                                item.id === selectedMember.id
                                  ? { ...item, status: nextStatus }
                                  : item,
                              ),
                            );
                          }}
                          className="bg-primary text-primary-foreground hover:bg-primary-hover"
                        >
                          <WarningCircle size={32} weight="regular" />
                          <span className="text-sm text-primary-foreground">
                            {selectedMember.status === "Bloqueado"
                              ? "Desbloquear"
                              : "Bloquear"}
                          </span>
                        </Button>
                      </div>
                    </div>

                    <Tabs defaultValue="pessoal" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 bg-tertiary">
                        <TabsTrigger
                          value="pessoal"
                          className="text-foreground"
                        >
                          Informações Pessoais
                        </TabsTrigger>
                        <TabsTrigger value="ativos" className="text-foreground">
                          Empréstimos Ativos
                        </TabsTrigger>
                        <TabsTrigger
                          value="historico"
                          className="text-foreground"
                        >
                          Histórico
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="pessoal" className="mt-6">
                        <Card className="border-border bg-surface p-6">
                          <div className="grid gap-6 md:grid-cols-2">
                            <FieldRead
                              label="Nome"
                              value={selectedMember.nome}
                            />
                            <FieldRead
                              label="E-mail"
                              value={selectedMember.email}
                            />
                            <FieldRead
                              label="Status"
                              value={selectedMember.status}
                            />
                            <FieldRead
                              label="Plano"
                              value={selectedMember.plano}
                            />
                          </div>
                        </Card>
                      </TabsContent>
                      <TabsContent value="ativos" className="mt-6">
                        <Card className="border-border bg-surface p-6">
                          <div className="space-y-3">
                            {loans
                              .filter(
                                (loan) =>
                                  loan.membro === selectedMember.nome &&
                                  loan.status !== "Devolvido",
                              )
                              .map((loan) => (
                                <div
                                  key={loan.id}
                                  className="flex flex-col gap-3 rounded-lg border border-border px-4 py-4 md:flex-row md:items-center md:justify-between"
                                >
                                  <div>
                                    <p className="text-base text-foreground">
                                      {loan.livro}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {loan.dataEmprestimo} até{" "}
                                      {loan.dataDevolucao}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Badge
                                      className={statusBadgeClass(loan.status)}
                                    >
                                      {loan.status}
                                    </Badge>
                                    <Button
                                      type="button"
                                      onClick={() => setRoute("emprestimos")}
                                      className="bg-background text-foreground hover:bg-tertiary"
                                    >
                                      <ClockCountdown
                                        size={32}
                                        weight="regular"
                                      />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </Card>
                      </TabsContent>
                      <TabsContent value="historico" className="mt-6">
                        <Card className="border-border bg-surface p-6">
                          <div className="space-y-3">
                            {loans
                              .filter(
                                (loan) => loan.membro === selectedMember.nome,
                              )
                              .map((loan) => (
                                <div
                                  key={loan.id}
                                  className="flex items-center justify-between rounded-lg border border-border px-4 py-4"
                                >
                                  <div>
                                    <p className="text-base text-foreground">
                                      {loan.livro}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {loan.dataEmprestimo}
                                    </p>
                                  </div>
                                  <Badge
                                    className={statusBadgeClass(loan.status)}
                                  >
                                    {loan.status}
                                  </Badge>
                                </div>
                              ))}
                          </div>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </section>
                )}

                {route === "emprestimos" && (
                  <section
                    aria-labelledby="emprestimos-title"
                    className="space-y-8"
                  >
                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                      <div>
                        <h1
                          id="emprestimos-title"
                          className="font-heading text-3xl font-medium tracking-tight text-foreground"
                        >
                          Empréstimos
                        </h1>
                        <p className="mt-2 text-base text-muted-foreground">
                          Controle empréstimos ativos, devolvidos e atrasados
                          com ações rápidas.
                        </p>
                      </div>
                      <Button
                        type="button"
                        onClick={() => setRoute("emprestimo-novo")}
                        className="bg-primary text-primary-foreground hover:bg-primary-hover"
                      >
                        <Plus size={32} weight="regular" />
                        <span className="text-sm text-primary-foreground">
                          Novo Empréstimo
                        </span>
                      </Button>
                    </div>

                    <Card className="border-border bg-surface p-6">
                      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                            Buscar
                          </Label>
                          <div className="relative">
                            <MagnifyingGlass
                              size={32}
                              weight="regular"
                              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            />
                            <Input
                              value={loanSearch}
                              onChange={(e) => setLoanSearch(e.target.value)}
                              className="pl-12 text-foreground"
                              placeholder="Membro ou livro"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                            Status
                          </Label>
                          <Select
                            value={loanStatus}
                            onValueChange={setLoanStatus}
                          >
                            <SelectTrigger className="text-foreground">
                              <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="todos">Todos</SelectItem>
                              <SelectItem value="Ativo">Ativo</SelectItem>
                              <SelectItem value="Atrasado">Atrasado</SelectItem>
                              <SelectItem value="Devolvido">
                                Devolvido
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </Card>

                    <div className="hidden overflow-hidden rounded-xl border border-border bg-surface lg:block">
                      <div className="grid grid-cols-[0.8fr_1fr_1fr_1fr_1fr_0.9fr] gap-4 border-b border-border bg-tertiary px-6 py-4">
                        {[
                          "Status",
                          "Membro",
                          "Livro",
                          "Data Empréstimo",
                          "Data Devolução",
                          "Ação",
                        ].map((label) => (
                          <p key={label} className="text-sm text-foreground">
                            {label}
                          </p>
                        ))}
                      </div>
                      <div className="divide-y divide-border">
                        {filteredLoans.map((loan) => (
                          <div
                            key={loan.id}
                            className="grid grid-cols-[0.8fr_1fr_1fr_1fr_1fr_0.9fr] gap-4 px-6 py-5 transition-all duration-200 ease-in-out hover:bg-gray-50"
                          >
                            <div>
                              <Badge className={statusBadgeClass(loan.status)}>
                                {loan.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-foreground">
                              {loan.membro}
                            </p>
                            <p className="text-sm text-foreground">
                              {loan.livro}
                            </p>
                            <p className="text-sm text-foreground">
                              {loan.dataEmprestimo}
                            </p>
                            <p className="text-sm text-foreground">
                              {loan.dataDevolucao}
                            </p>
                            <div>
                              {loan.status !== "Devolvido" && (
                                <Button
                                  type="button"
                                  onClick={() => setReturnDrawerOpen(true)}
                                  className="bg-background text-foreground hover:bg-tertiary"
                                >
                                  <ClockCountdown size={32} weight="regular" />
                                  <span className="text-sm text-foreground">
                                    Devolução
                                  </span>
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 lg:hidden">
                      {filteredLoans.map((loan) => (
                        <Card
                          key={loan.id}
                          className="border-border bg-surface p-4"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-base text-foreground">
                                {loan.livro}
                              </p>
                              <Badge className={statusBadgeClass(loan.status)}>
                                {loan.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-foreground">
                              Membro: {loan.membro}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {loan.dataEmprestimo} até {loan.dataDevolucao}
                            </p>
                            {loan.status !== "Devolvido" && (
                              <Button
                                type="button"
                                onClick={() => setReturnDrawerOpen(true)}
                                className="w-full bg-background text-foreground hover:bg-tertiary"
                              >
                                <ClockCountdown size={32} weight="regular" />
                                <span className="text-sm text-foreground">
                                  Realizar Devolução
                                </span>
                              </Button>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </section>
                )}

                {route === "emprestimo-novo" && (
                  <section
                    aria-labelledby="novo-emprestimo-title"
                    className="space-y-8"
                  >
                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                      <div>
                        <h1
                          id="novo-emprestimo-title"
                          className="font-heading text-3xl font-medium tracking-tight text-foreground"
                        >
                          Novo Empréstimo
                        </h1>
                        <p className="mt-2 text-base text-muted-foreground">
                          Fluxo guiado com seleção de membro, livro e
                          confirmação de datas.
                        </p>
                      </div>
                      <Button
                        type="button"
                        onClick={() => setRoute("emprestimos")}
                        className="bg-background text-foreground hover:bg-tertiary"
                      >
                        <ClockCountdown size={32} weight="regular" />
                        <span className="text-sm text-foreground">Voltar</span>
                      </Button>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                      <Card className="border-border bg-surface p-6">
                        <h2 className="font-heading text-xl font-medium tracking-tight text-foreground">
                          Etapas
                        </h2>
                        <div className="mt-6 space-y-4">
                          {[1, 2, 3].map((step) => (
                            <button
                              key={step}
                              type="button"
                              onClick={() => setLoanStep(step)}
                              className={`flex w-full cursor-pointer items-center gap-4 rounded-lg border px-4 py-4 text-left transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring ${
                                loanStep === step
                                  ? "border-primary bg-secondary text-secondary-foreground"
                                  : "border-border bg-background text-foreground hover:bg-tertiary"
                              }`}
                            >
                              <div
                                className={`flex h-10 w-10 items-center justify-center rounded-full ${loanStep === step ? "bg-primary text-primary-foreground" : "bg-tertiary text-foreground"}`}
                              >
                                <span className="text-sm text-inherit">
                                  {step}
                                </span>
                              </div>
                              <div>
                                <p className="text-base text-inherit">
                                  {step === 1
                                    ? "Selecionar Membro"
                                    : step === 2
                                      ? "Selecionar Livro"
                                      : "Confirmar Datas"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {step === 1
                                    ? "Escolha quem fará o empréstimo."
                                    : step === 2
                                      ? "Vincule um livro disponível."
                                      : "Revise e conclua o processo."}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </Card>

                      <Card className="border-border bg-surface p-6">
                        {loanStep === 1 && (
                          <div className="space-y-6">
                            <h2 className="font-heading text-xl font-medium tracking-tight text-foreground">
                              Selecionar membro
                            </h2>
                            <SelectWithSearch
                              open={loanMemberOpen}
                              onOpenChange={setLoanMemberOpen}
                              value={selectedLoanMember}
                              items={members.map((member) => ({
                                value: member.id,
                                label: member.nome,
                              }))}
                              placeholder="Buscar membro"
                              selectedLabel={
                                members.find(
                                  (member) => member.id === selectedLoanMember,
                                )?.nome
                              }
                              onSelect={(value) => {
                                setSelectedLoanMember(value);
                                setLoanMemberOpen(false);
                              }}
                            />
                            <div className="flex justify-end">
                              <Button
                                type="button"
                                onClick={() => setLoanStep(2)}
                                className="bg-primary text-primary-foreground hover:bg-primary-hover"
                              >
                                <span className="text-sm text-primary-foreground">
                                  Continuar
                                </span>
                              </Button>
                            </div>
                          </div>
                        )}

                        {loanStep === 2 && (
                          <div className="space-y-6">
                            <h2 className="font-heading text-xl font-medium tracking-tight text-foreground">
                              Selecionar livro
                            </h2>
                            <SelectWithSearch
                              open={loanBookOpen}
                              onOpenChange={setLoanBookOpen}
                              value={selectedLoanBook}
                              items={books
                                .filter((book) => book.disponivel)
                                .map((book) => ({
                                  value: book.id,
                                  label: book.titulo,
                                }))}
                              placeholder="Buscar livro disponível"
                              selectedLabel={
                                books.find(
                                  (book) => book.id === selectedLoanBook,
                                )?.titulo
                              }
                              onSelect={(value) => {
                                setSelectedLoanBook(value);
                                setLoanBookOpen(false);
                              }}
                            />
                            <div className="flex justify-between gap-3">
                              <Button
                                type="button"
                                onClick={() => setLoanStep(1)}
                                className="bg-background text-foreground hover:bg-tertiary"
                              >
                                <span className="text-sm text-foreground">
                                  Voltar
                                </span>
                              </Button>
                              <Button
                                type="button"
                                onClick={() => setLoanStep(3)}
                                className="bg-primary text-primary-foreground hover:bg-primary-hover"
                              >
                                <span className="text-sm text-primary-foreground">
                                  Continuar
                                </span>
                              </Button>
                            </div>
                          </div>
                        )}

                        {loanStep === 3 && (
                          <div className="space-y-6">
                            <h2 className="font-heading text-xl font-medium tracking-tight text-foreground">
                              Confirmar e definir datas
                            </h2>
                            <div className="grid gap-6 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label className="text-sm text-foreground">
                                  Data de Empréstimo
                                </Label>
                                <Input
                                  type="date"
                                  value={loanDate}
                                  onChange={(e) => setLoanDate(e.target.value)}
                                  className="text-foreground"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm text-foreground">
                                  Data de Devolução
                                </Label>
                                <Input
                                  type="date"
                                  value={loanReturnDate}
                                  onChange={(e) =>
                                    setLoanReturnDate(e.target.value)
                                  }
                                  className="text-foreground"
                                />
                              </div>
                            </div>

                            <div className="rounded-lg border border-border bg-tertiary p-4">
                              <p className="text-sm text-foreground">
                                Membro:{" "}
                                {members.find(
                                  (member) => member.id === selectedLoanMember,
                                )?.nome || "Não selecionado"}
                              </p>
                              <p className="mt-2 text-sm text-foreground">
                                Livro:{" "}
                                {books.find(
                                  (book) => book.id === selectedLoanBook,
                                )?.titulo || "Não selecionado"}
                              </p>
                            </div>

                            <div className="flex justify-between gap-3">
                              <Button
                                type="button"
                                onClick={() => setLoanStep(2)}
                                className="bg-background text-foreground hover:bg-tertiary"
                              >
                                <span className="text-sm text-foreground">
                                  Voltar
                                </span>
                              </Button>
                              <Button
                                type="button"
                                disabled={submitting}
                                onClick={handleNewLoan}
                                className="bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-40"
                              >
                                <span className="text-sm text-primary-foreground">
                                  {submitting ? "Concluindo..." : "Concluir"}
                                </span>
                              </Button>
                            </div>
                          </div>
                        )}
                      </Card>
                    </div>
                  </section>
                )}

                {route === "configuracoes" && (
                  <section
                    aria-labelledby="configuracoes-title"
                    className="space-y-8"
                  >
                    <div>
                      <h1
                        id="configuracoes-title"
                        className="font-heading text-3xl font-medium tracking-tight text-foreground"
                      >
                        Configurações
                      </h1>
                      <p className="mt-2 text-base text-muted-foreground">
                        Ajuste preferências operacionais e parâmetros de
                        notificações.
                      </p>
                    </div>
                    <div className="grid gap-6 lg:grid-cols-2">
                      <Card className="border-border bg-surface p-6">
                        <h2 className="font-heading text-xl font-medium tracking-tight text-foreground">
                          Preferências gerais
                        </h2>
                        <div className="mt-6 space-y-6">
                          <SettingRow
                            title="Mostrar tendências no dashboard"
                            description="Exibe indicadores de crescimento e redução."
                          />
                          <SettingRow
                            title="Ativar busca rápida"
                            description="Permite abrir a paleta com Ctrl+K."
                            enabled
                          />
                          <SettingRow
                            title="Receber alertas de atraso"
                            description="Destaca empréstimos com devolução pendente."
                            enabled
                          />
                        </div>
                      </Card>
                      <Card className="border-border bg-surface p-6">
                        <h2 className="font-heading text-xl font-medium tracking-tight text-foreground">
                          Resumo institucional
                        </h2>
                        <img
                          src="https://c.animaapp.com/moh76kjucY57WP/img/ai_4.png"
                          alt="book exchange in library desk environment"
                          loading="lazy"
                          className="mt-6 h-56 w-full rounded-lg border border-border object-cover"
                        />
                        <p className="mt-4 text-base text-foreground">
                          Mantenha cadastros organizados, rotinas previsíveis e
                          experiência acessível para toda a equipe da
                          biblioteca.
                        </p>
                      </Card>
                    </div>
                  </section>
                )}
              </div>
            </div>
          </main>
        </div>

        <Button
          type="button"
          onClick={fabAction}
          aria-label={fabLabel}
          className="fixed bottom-6 right-6 z-30 min-h-14 rounded-full bg-primary text-primary-foreground hover:bg-primary-hover"
        >
          <Plus size={32} weight="regular" />
          <span className="hidden text-sm text-primary-foreground sm:inline">
            {fabLabel}
          </span>
        </Button>

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent
            side="left"
            className="w-[300px] border-border bg-surface p-0"
          >
            <SheetHeader className="border-b border-border p-6">
              <SheetTitle className="font-heading text-xl font-medium tracking-tight text-foreground">
                Navegação
              </SheetTitle>
            </SheetHeader>
            <div className="p-4">
              <NavigationMenu orientation="vertical" className="max-w-none">
                <NavigationMenuList className="flex w-full flex-col gap-2">
                  {navItems.map((item) => (
                    <NavigationMenuItem key={item.key} className="w-full">
                      <button
                        type="button"
                        onClick={() => navigateTo(item.key)}
                        className={`flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-md px-4 py-3 text-left transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring ${
                          route === item.key
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-background text-foreground hover:bg-tertiary"
                        }`}
                      >
                        <span className="text-primary">{item.icon}</span>
                        <span className="text-sm text-inherit">
                          {item.label}
                        </span>
                      </button>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </SheetContent>
        </Sheet>

        <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
          <DialogContent className="border-border bg-surface p-0 sm:max-w-2xl">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle className="font-heading text-xl font-medium tracking-tight text-foreground">
                Paleta de comandos
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Navegue rapidamente entre telas e registros.
              </DialogDescription>
            </DialogHeader>
            <Command className="rounded-none">
              <CommandInput
                placeholder="Digite para buscar páginas, livros ou membros"
                className="text-foreground"
              />
              <CommandList>
                <CommandEmpty className="px-6 py-6 text-sm text-muted-foreground">
                  Nenhum resultado encontrado.
                </CommandEmpty>
                <CommandGroup heading="Páginas">
                  {navItems.map((item) => (
                    <CommandItem
                      key={item.key}
                      value={item.label}
                      onSelect={() => {
                        navigateTo(item.key);
                        setCommandOpen(false);
                      }}
                      className="cursor-pointer text-foreground"
                    >
                      {item.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandGroup heading="Livros">
                  {books.map((book) => (
                    <CommandItem
                      key={book.id}
                      value={book.titulo}
                      onSelect={() => {
                        setSelectedBook(book);
                        navigateTo("livro-detalhe");
                        setCommandOpen(false);
                      }}
                      className="cursor-pointer text-foreground"
                    >
                      {book.titulo}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandGroup heading="Membros">
                  {members.map((member) => (
                    <CommandItem
                      key={member.id}
                      value={member.nome}
                      onSelect={() => {
                        setSelectedMember(member);
                        navigateTo("membro-perfil");
                        setCommandOpen(false);
                      }}
                      className="cursor-pointer text-foreground"
                    >
                      {member.nome}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </DialogContent>
        </Dialog>

        <Dialog open={bookDialogOpen} onOpenChange={setBookDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-surface sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl font-medium tracking-tight text-foreground">
                Cadastro de Livro
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Use valores padrão inteligentes para acelerar o cadastro.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-6">
                <InputGroup
                  label="Título"
                  hint="Informe o nome principal do livro."
                >
                  <Input
                    value={newBook.titulo}
                    onChange={(e) =>
                      setNewBook({ ...newBook, titulo: e.target.value })
                    }
                    className="text-foreground"
                  />
                  {!newBook.titulo && (
                    <ValidationHint message="Campo obrigatório." tone="error" />
                  )}
                </InputGroup>
                <InputGroup
                  label="ISBN"
                  hint="Identificador único para consulta rápida."
                >
                  <Input
                    value={newBook.isbn}
                    onChange={(e) =>
                      setNewBook({ ...newBook, isbn: e.target.value })
                    }
                    className="text-foreground"
                  />
                  {!newBook.isbn && (
                    <ValidationHint message="Campo obrigatório." tone="error" />
                  )}
                </InputGroup>
                <InputGroup label="Autor" hint="Nome principal do autor.">
                  <Input
                    value={newBook.autor}
                    onChange={(e) =>
                      setNewBook({ ...newBook, autor: e.target.value })
                    }
                    className="text-foreground"
                  />
                  {!newBook.autor && (
                    <ValidationHint message="Campo obrigatório." tone="error" />
                  )}
                </InputGroup>
              </div>
              <div className="space-y-6">
                <InputGroup
                  label="Categoria"
                  hint="Ajuda a organizar filtros e relatórios."
                >
                  <Input
                    value={newBook.categoria}
                    onChange={(e) =>
                      setNewBook({ ...newBook, categoria: e.target.value })
                    }
                    className="text-foreground"
                  />
                </InputGroup>
                <div className="rounded-lg border border-border bg-tertiary p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-foreground">
                        Disponível para empréstimo
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Ativado por padrão no novo cadastro.
                      </p>
                    </div>
                    <Switch
                      checked={newBook.disponivel}
                      onCheckedChange={(checked) =>
                        setNewBook({ ...newBook, disponivel: checked })
                      }
                    />
                  </div>
                </div>
                <img
                  src="https://c.animaapp.com/moh76kjucY57WP/img/ai_2.png"
                  alt="library interior with organized bookshelves"
                  loading="lazy"
                  className="h-52 w-full rounded-lg border border-border object-cover"
                />
              </div>
            </div>
            <Separator className="bg-border" />
            <div className="sticky bottom-0 flex justify-end gap-3 bg-surface pt-2">
              <Button
                type="button"
                onClick={() => setBookDialogOpen(false)}
                className="bg-background text-foreground hover:bg-tertiary"
              >
                <span className="text-sm text-foreground">Cancelar</span>
              </Button>
              <Button
                type="button"
                disabled={submitting}
                onClick={handleBookSave}
                className="bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-40"
              >
                <span className="text-sm text-primary-foreground">
                  {submitting ? "Salvando..." : "Salvar"}
                </span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={memberDialogOpen} onOpenChange={setMemberDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-surface sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl font-medium tracking-tight text-foreground">
                Cadastro de Membro
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Validação em tempo real para nome, e-mail, plano e status.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-6">
                <InputGroup label="Nome" hint="Nome completo do membro.">
                  <Input
                    value={newMember.nome}
                    onChange={(e) =>
                      setNewMember({ ...newMember, nome: e.target.value })
                    }
                    className="text-foreground"
                  />
                  {!newMember.nome && (
                    <ValidationHint message="Campo obrigatório." tone="error" />
                  )}
                </InputGroup>
                <InputGroup
                  label="E-mail"
                  hint="Usado para comunicação e identificação."
                >
                  <Input
                    value={newMember.email}
                    onChange={(e) =>
                      setNewMember({ ...newMember, email: e.target.value })
                    }
                    className="text-foreground"
                  />
                  {newMember.email && !/\S+@\S+\.\S+/.test(newMember.email) && (
                    <ValidationHint
                      message="Informe um e-mail válido."
                      tone="error"
                    />
                  )}
                </InputGroup>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm text-foreground">Plano</Label>
                  <Select
                    value={newMember.plano}
                    onValueChange={(value) =>
                      setNewMember({ ...newMember, plano: value })
                    }
                  >
                    <SelectTrigger className="text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Padrão">Padrão</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="Social">Social</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-foreground">Status</Label>
                  <Select
                    value={newMember.status}
                    onValueChange={(value) =>
                      setNewMember({ ...newMember, status: value })
                    }
                  >
                    <SelectTrigger className="text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                      <SelectItem value="Bloqueado">Bloqueado</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge className={statusBadgeClass(newMember.status)}>
                    {newMember.status}
                  </Badge>
                </div>
                <img
                  src="https://c.animaapp.com/moh76kjucY57WP/img/ai_3.png"
                  alt="person selecting book in community library"
                  loading="lazy"
                  className="h-52 w-full rounded-lg border border-border object-cover"
                />
              </div>
            </div>
            <Separator className="bg-border" />
            <div className="sticky bottom-0 flex justify-end gap-3 bg-surface pt-2">
              <Button
                type="button"
                onClick={() => setMemberDialogOpen(false)}
                className="bg-background text-foreground hover:bg-tertiary"
              >
                <span className="text-sm text-foreground">Cancelar</span>
              </Button>
              <Button
                type="button"
                disabled={submitting}
                onClick={handleMemberSave}
                className="bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-40"
              >
                <span className="text-sm text-primary-foreground">
                  {submitting ? "Salvando..." : "Salvar"}
                </span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={authorDialogOpen} onOpenChange={setAuthorDialogOpen}>
          <DialogContent className="border-border bg-surface sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl font-medium tracking-tight text-foreground">
                Autores e Categorias
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Gerencie listas auxiliares com operações simples em modal.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-border bg-background p-4">
                <h3 className="font-heading text-lg font-medium tracking-tight text-foreground">
                  Autores
                </h3>
                <div className="mt-4 space-y-3">
                  {["Ana Ribeiro", "Paulo Costa", "Marina Souza"].map(
                    (item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between rounded-md border border-border px-3 py-3"
                      >
                        <p className="text-sm text-foreground">{item}</p>
                        <Button
                          type="button"
                          className="bg-background text-foreground hover:bg-tertiary"
                        >
                          <NotePencil size={32} weight="regular" />
                        </Button>
                      </div>
                    ),
                  )}
                </div>
              </Card>
              <Card className="border-border bg-background p-4">
                <h3 className="font-heading text-lg font-medium tracking-tight text-foreground">
                  Categorias
                </h3>
                <div className="mt-4 space-y-3">
                  {["Comunidade", "História Local", "Educação"].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-md border border-border px-3 py-3"
                    >
                      <p className="text-sm text-foreground">{item}</p>
                      <Button
                        type="button"
                        className="bg-background text-foreground hover:bg-tertiary"
                      >
                        <NotePencil size={32} weight="regular" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </DialogContent>
        </Dialog>

        <Drawer open={returnDrawerOpen} onOpenChange={setReturnDrawerOpen}>
          <DrawerContent className="ml-auto h-[85vh] max-w-2xl border-border bg-surface">
            <DrawerHeader className="text-left">
              <DrawerTitle className="font-heading text-2xl font-medium tracking-tight text-foreground">
                Registrar devolução
              </DrawerTitle>
              <DrawerDescription className="text-sm text-muted-foreground">
                Atualize a data de devolução e inclua observações opcionais.
              </DrawerDescription>
            </DrawerHeader>
            <div className="space-y-6 px-4 pb-8 md:px-6">
              <div className="space-y-2">
                <Label className="text-sm text-foreground">
                  Data de Devolução
                </Label>
                <Input
                  type="date"
                  defaultValue="2026-04-11"
                  className="text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-foreground">Observação</Label>
                <Textarea
                  className="min-h-32 text-foreground"
                  placeholder="Observações sobre o estado do livro ou retorno."
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  onClick={() => setReturnDrawerOpen(false)}
                  className="bg-background text-foreground hover:bg-tertiary"
                >
                  <span className="text-sm text-foreground">Cancelar</span>
                </Button>
                <Button
                  type="button"
                  onClick={handleReturn}
                  className="bg-primary text-primary-foreground hover:bg-primary-hover"
                >
                  <span className="text-sm text-primary-foreground">
                    Salvar devolução
                  </span>
                </Button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        <Toaster />
      </div>
    </>
  );
}

function StatsCard({
  title,
  value,
  trend,
  icon,
}: {
  title: string;
  value: number;
  trend: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="border-border bg-surface p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">
            {title}
          </p>
          <p className="font-heading text-4xl font-medium tracking-tight text-foreground">
            {value}
          </p>
          <p className="text-sm text-muted-foreground">{trend}</p>
        </div>
        <div className="rounded-lg bg-secondary p-3 text-secondary-foreground">
          {icon}
        </div>
      </div>
    </Card>
  );
}

function TopList({
  title,
  items,
}: {
  title: string;
  items: { nome: string; total: number }[];
}) {
  const max = Math.max(...items.map((item) => item.total));
  return (
    <Card className="border-border bg-surface p-6">
      <h2 className="font-heading text-xl font-medium tracking-tight text-foreground">
        {title}
      </h2>
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item.nome} className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-foreground">{item.nome}</p>
              <p className="text-sm text-muted-foreground">{item.total}</p>
            </div>
            <div className="h-3 rounded-full bg-tertiary">
              <div
                className="h-3 rounded-full bg-primary"
                style={{ width: `${(item.total / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <Card className="border-border bg-tertiary p-8">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <div className="rounded-full bg-secondary p-4">
          <BookOpen
            size={32}
            weight="regular"
            className="text-secondary-foreground"
          />
        </div>
        <h2 className="mt-4 font-heading text-2xl font-medium tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-3 text-base text-muted-foreground">{description}</p>
        <Button
          type="button"
          onClick={onAction}
          className="mt-6 bg-primary text-primary-foreground hover:bg-primary-hover"
        >
          <Plus size={32} weight="regular" />
          <span className="text-sm text-primary-foreground">{actionLabel}</span>
        </Button>
      </div>
    </Card>
  );
}

function FieldRead({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-base text-foreground">{value}</p>
    </div>
  );
}

function InputGroup({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm text-foreground">{label}</Label>
      {children}
      <p className="text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}

function ValidationHint({
  message,
  tone,
}: {
  message: string;
  tone: "error" | "success";
}) {
  return (
    <p
      className={
        tone === "error" ? "text-sm text-error" : "text-sm text-success"
      }
    >
      {message}
    </p>
  );
}

function SettingRow({
  title,
  description,
  enabled = false,
}: {
  title: string;
  description: string;
  enabled?: boolean;
}) {
  const [checked, setChecked] = useState(enabled);
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background p-4">
      <div>
        <p className="text-base text-foreground">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={setChecked} />
    </div>
  );
}

function SelectWithSearch({
  open,
  onOpenChange,
  value,
  items,
  placeholder,
  selectedLabel,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  items: { value: string; label: string }[];
  placeholder: string;
  selectedLabel?: string;
  onSelect: (value: string) => void;
}) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          className="w-full justify-between bg-background text-foreground hover:bg-tertiary"
        >
          <span className="truncate text-sm text-foreground">
            {selectedLabel || placeholder}
          </span>
          <MagnifyingGlass size={32} weight="regular" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] border-border bg-surface p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder={placeholder} className="text-foreground" />
          <CommandList>
            <CommandEmpty className="px-4 py-4 text-sm text-muted-foreground">
              Nenhum resultado encontrado.
            </CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.label}
                  onSelect={() => onSelect(item.value)}
                  className="cursor-pointer text-foreground"
                >
                  {item.label}
                  {value === item.value && (
                    <span className="ml-auto text-sm text-primary">
                      Selecionado
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <AppInner />
    </HelmetProvider>
  );
}
