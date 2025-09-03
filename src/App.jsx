import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
/**
 * ISFD Cecilia Braslavsky — Sitio institucional (versión estable)
 * ---------------------------------------------------------------
 * ✔ Navegación funcional (Inicio, Carreras, Noticias, Formación)
 * ✔ Inicio con carrusel de imágenes/textos
 * ✔ Edición enriquecida (WYSIWYG) con ReactQuill en descripciones, materias, noticias y formación
 * ✔ Modo admin con clave (demo): braslavsky
 * ✔ Persistencia en localStorage + Importar/Exportar/Compartir por URL (?data=...)
 * ✔ Botón Compartir (Web Share o copia al portapapeles)
 */

// --------------------- Helpers ---------------------
const STORAGE_KEY = "isfd_braslavsky_site_v4";
const ADMIN_KEY = "isfd_braslavsky_admin";

const uid = () =>
  (globalThis.crypto?.randomUUID?.() ?? `${Math.random().toString(36).slice(2)}${Date.now()}`);

function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState];
}

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

function encodeForUrl(obj) {
  try {
    const json = JSON.stringify(obj);
    const uri = encodeURIComponent(json);
    return btoa(uri);
  } catch {
    return "";
  }
}
function decodeFromUrlParam(str) {
  try {
    const uri = atob(str);
    const json = decodeURIComponent(uri);
    return JSON.parse(json);
  } catch {
    return null;
  }
}
function makeShareUrl(stateObj) {
  const base = window.location.origin + window.location.pathname;
  const data = encodeForUrl(stateObj);
  return `${base}?data=${data}`;
}

// --------------------- Datos por defecto ---------------------
const DEFAULT_DATA = {
  institucion: {
    nombre: "ISFD Cecilia Braslavsky",
    lema: "Formación docente con sentido y calidad",
    contacto: {
      email: "isfd.cecilia.braslavsky@gmail.com",
      direccion: "Aristóbulo del Valle, Misiones, Argentina",
    },
  },
  slides: [
    {
      id: uid(),
      titulo: "Bienvenidos al ISFD Cecilia Braslavsky",
      texto:
        "Un espacio de formación docente comprometido con la comunidad, la innovación y la calidad educativa.",
      imagen:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&q=80&auto=format&fit=crop",
    },
    {
      id: uid(),
      titulo: "Prácticas en territorio",
      texto:
        "Articulación con escuelas de la región, proyectos interdisciplinarios y aprendizaje situado.",
      imagen:
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&q=80&auto=format&fit=crop",
    },
    {
      id: uid(),
      titulo: "Formación continua",
      texto:
        "Trayectos de actualización y pos-títulos para fortalecer la profesión docente.",
      imagen:
        "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1600&q=80&auto=format&fit=crop",
    },
  ],
  carreras: [
    {
      id: uid(),
      nombre: "Profesorado de Matemática",
      color: "from-indigo-500 to-sky-500",
      descripcionHtml:
        "<p>Formación sólida en contenidos matemáticos, didáctica específica y uso de tecnologías digitales.</p>",
      materiasHtml:
        "<ul><li>Álgebra I</li><li>Análisis I</li><li>Geometría</li><li>Probabilidad y Estadística</li><li>Didáctica de la Matemática</li><li>Prácticas I–IV</li></ul>",
      imagen:
        "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?w=1600&q=80&auto=format&fit=crop",
    },
    {
      id: uid(),
      nombre: "Profesorado de Biología",
      color: "from-emerald-500 to-teal-500",
      descripcionHtml:
        "<p>Enfoque en ciencias biológicas, educación ambiental y trabajo en laboratorio y campo.</p>",
      materiasHtml:
        "<ul><li>Biología General</li><li>Genética</li><li>Ecología</li><li>Microbiología</li><li>Didáctica de la Biología</li><li>Prácticas I–IV</li></ul>",
      imagen:
        "https://images.unsplash.com/photo-1559757175-08c6d5c9cde7?w=1600&q=80&auto=format&fit=crop",
    },
    {
      id: uid(),
      nombre: "Profesorado de Educación Física",
      color: "from-orange-500 to-yellow-500",
      descripcionHtml:
        "<p>Formación integral en movimiento, salud, deportes y didáctica de la educación física.</p>",
      materiasHtml:
        "<ul><li>Anatomía</li><li>Fisiología</li><li>Juegos y Deportes</li><li>Didáctica de la EF</li><li>Prácticas I–IV</li></ul>",
      imagen:
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1600&q=80&auto=format&fit=crop",
    },
    {
      id: uid(),
      nombre: "Profesorado de Historia",
      color: "from-rose-500 to-fuchsia-500",
      descripcionHtml:
        "<p>Historia local, regional y mundial con enfoque crítico y construcción de ciudadanía.</p>",
      materiasHtml:
        "<ul><li>Historia Argentina</li><li>Historia Universal</li><li>Metodología</li><li>Didáctica de la Historia</li><li>Prácticas I–IV</li></ul>",
      imagen:
        "https://images.unsplash.com/photo-1457694587812-e8bf29a43845?w=1600&q=80&auto=format&fit=crop",
    },
    {
      id: uid(),
      nombre: "Profesorado de Lengua y Literatura",
      color: "from-purple-500 to-violet-500",
      descripcionHtml:
        "<p>Estudios literarios, lingüística y didáctica de la lengua con integración de medios digitales.</p>",
      materiasHtml:
        "<ul><li>Gramática</li><li>Literatura Argentina</li><li>Literatura Latinoamericana</li><li>Didáctica de la Lengua</li><li>Prácticas I–IV</li></ul>",
      imagen:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=80&auto=format&fit=crop",
    },
    {
      id: uid(),
      nombre: "Profesorado de Educación Especial",
      color: "from-cyan-500 to-blue-500",
      descripcionHtml:
        "<p>Perspectivas de inclusión, diseño universal para el aprendizaje y trabajo interdisciplinario.</p>",
      materiasHtml:
        "<ul><li>Psicología del Desarrollo</li><li>Trastornos del Neurodesarrollo</li><li>Didáctica de la EE</li><li>Prácticas I–IV</li></ul>",
      imagen:
        "https://images.unsplash.com/photo-1544531585-9847b68c8c86?w=1600&q=80&auto=format&fit=crop",
    },
  ],
  noticias: [
    {
      id: uid(),
      titulo: "Inscripciones abiertas 2026",
      fecha: new Date().toISOString().slice(0, 10),
      cuerpoHtml:
        "<p>Se encuentran abiertas las preinscripciones para los profesorados. Consultá requisitos y cronograma.</p>",
    },
    {
      id: uid(),
      titulo: "Jornada institucional",
      fecha: new Date().toISOString().slice(0, 10),
      cuerpoHtml:
        "<p>Convocatoria a docentes y estudiantes para la jornada de trabajo sobre mejora de prácticas.</p>",
    },
  ],
  formacion: [
    {
      id: uid(),
      titulo: "Actualización en Enseñanza de la Matemática",
      cuerpoHtml:
        "<p>Trayecto formativo con foco en estadística, probabilidad y tecnologías digitales aplicadas a la enseñanza.</p>",
    },
    {
      id: uid(),
      titulo: "Seminario de Educación Inclusiva",
      cuerpoHtml:
        "<p>Estrategias de DUA, adaptaciones curriculares y recursos accesibles para el aula.</p>",
    },
  ],
};

// --------------------- UI ---------------------
function Navbar({ route, setRoute, admin, onLoginToggle, onShare }) {
  const tabs = [
    { id: "inicio", label: "Inicio" },
    { id: "carreras", label: "Carreras" },
    { id: "noticias", label: "Noticias" },
    { id: "formacion", label: "Formación" },
  ];
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-500" />
          <div>
            <h1 className="text-lg font-semibold leading-tight">ISFD Cecilia Braslavsky</h1>
            <p className="text-xs text-gray-500 -mt-0.5">Formación docente con sentido y calidad</p>
          </div>
        </div>
        <nav className="hidden md:flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setRoute(t.id)}
              className={classNames(
                "px-3 py-2 rounded-xl text-sm font-medium",
                route === t.id ? "bg-gray-900 text-white" : "hover:bg-gray-100 text-gray-700"
              )}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={onShare} className="px-3 py-1.5 rounded-xl text-sm border border-gray-300">Compartir</button>
          <button
            onClick={onLoginToggle}
            className={classNames(
              "px-3 py-1.5 rounded-xl text-sm",
              admin ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-900 text-white hover:bg-black"
            )}
          >
            {admin ? "Salir" : "Ingresar"}
          </button>
          <button
            className="md:hidden px-3 py-1.5 rounded-xl text-sm border border-gray-300"
            onClick={() => {
              const next = prompt("Ir a sección (inicio, carreras, noticias, formacion):", route);
              if (["inicio", "carreras", "noticias", "formacion"].includes(next)) setRoute(next);
            }}
            aria-label="Cambiar sección"
          >
            Menú
          </button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6 text-sm">
        <div>
          <h4 className="font-semibold">ISFD Cecilia Braslavsky</h4>
          <p className="text-gray-600">Aristóbulo del Valle, Misiones, Argentina</p>
        </div>
        <div>
          <h4 className="font-semibold">Contacto</h4>
          <p className="text-gray-600">isfd.cecilia.braslavsky@gmail.com</p>
          <p className="text-gray-600">+54 93755 659796</p>
        </div>
        <div>
          <h4 className="font-semibold">Créditos</h4>
          <p className="text-gray-600">Sitio demo, Prof. Schvartz Ivan</p>
        </div>
      </div>
    </footer>
  );
}

function Section({ title, subtitle, children, actions }) {
  return (
    <section className="max-w-6xl mx-auto px-4 mt-8">
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          {subtitle && <p className="text-gray-600 text-sm mt-1">{subtitle}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

function TextInput({ label, value, onChange, placeholder, textarea }) {
  return (
    <label className="block text-sm mb-3">
      <span className="block font-medium text-gray-700 mb-1">{label}</span>
      {textarea ? (
        <textarea
          className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </label>
  );
}

function RichTextEditor({ label, value, onChange, placeholder }) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike", { color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      ["link", "image", "video"],
      ["clean"],
    ],
    clipboard: { matchVisual: false },
  };
  const formats = [
    "header","font","size","bold","italic","underline","strike","color","background","script","list","indent","align","blockquote","code-block","link","image","video","clean"
  ];
  return (
    <label className="block text-sm mb-3">
      <span className="block font-medium text-gray-700 mb-1">{label}</span>
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        theme="snow"
        placeholder={placeholder || "Escribí aquí…"}
      />
    </label>
  );
}

// --------------------- Carrusel ---------------------
function Carousel({ slides, admin, onAdd, onUpdate, onDelete }) {
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    if (!slides.length) return;
    timer.current = setInterval(() => setIdx((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(timer.current);
  }, [slides.length]);

  const current = slides[idx];
  if (!current)
    return (
      <div className="aspect-[16/6] w-full rounded-2xl bg-gradient-to-br from-gray-200 to-gray-100 grid place-items-center text-center">
        <div className="p-6">
          <p className="text-lg text-gray-600">Agregá diapositivas para el inicio</p>
        </div>
      </div>
    );

  return (
    <div className="relative">
      <div className="aspect-[16/6] w-full rounded-2xl overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${current.imagen})` }}
          role="img"
          aria-label={current.titulo}
        >
          <div className="w-full h-full bg-black/40">
            <div className="max-w-6xl mx-auto px-4 h-full flex items-center">
              <div className="text-white max-w-2xl">
                <h3 className="text-2xl md:text-4xl font-bold drop-shadow-sm">{current.titulo}</h3>
                <p className="mt-2 md:mt-3 text-sm md:text-base text-white/90">{current.texto}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 flex items-end justify-between p-3">
        <div className="flex gap-1">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIdx(i)}
              className={classNames("w-2.5 h-2.5 rounded-full", i === idx ? "bg-white" : "bg-white/50")}
              aria-label={`Ir a slide ${i + 1}`}
            />
          ))}
        </div>
        {admin && (
          <CarouselEditor slides={slides} onAdd={onAdd} onUpdate={onUpdate} onDelete={onDelete} />
        )}
      </div>
    </div>
  );
}

function CarouselEditor({ slides, onAdd, onUpdate, onDelete }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ titulo: "", texto: "", imagen: "" });
  return (
    <div>
      <button onClick={() => setOpen((o) => !o)} className="px-3 py-1.5 rounded-xl text-sm bg-white/95 hover:bg-white font-medium">
        {open ? "Cerrar edición" : "Editar carrusel"}
      </button>
      {open && (
        <div className="mt-3 bg-white/95 backdrop-blur rounded-xl p-3 shadow">
          <div className="grid md:grid-cols-2 gap-3">
            {slides.map((s) => (
              <div key={s.id} className="border border-gray-200 rounded-xl p-3">
                <p className="text-sm font-medium">{s.titulo}</p>
                <p className="text-xs text-gray-500 line-clamp-2">{s.texto}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    className="px-2 py-1 text-xs rounded-lg bg-gray-900 text-white"
                    onClick={() => {
                      const titulo = prompt("Título", s.titulo) ?? s.titulo;
                      const texto = prompt("Texto", s.texto) ?? s.texto;
                      const imagen = prompt("URL de imagen", s.imagen) ?? s.imagen;
                      onUpdate({ ...s, titulo, texto, imagen });
                    }}
                  >
                    Editar
                  </button>
                  <button className="px-2 py-1 text-xs rounded-lg bg-red-600 text-white" onClick={() => onDelete(s.id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 border-t border-gray-200 pt-3">
            <p className="text-sm font-medium mb-2">Agregar diapositiva</p>
            <div className="grid md:grid-cols-3 gap-2">
              <TextInput label="Título" value={draft.titulo} onChange={(v) => setDraft((d) => ({ ...d, titulo: v }))} placeholder="Ej.: Bienvenidos" />
              <TextInput label="Texto" value={draft.texto} onChange={(v) => setDraft((d) => ({ ...d, texto: v }))} placeholder="Subtítulo o descripción" />
              <TextInput label="URL de imagen" value={draft.imagen} onChange={(v) => setDraft((d) => ({ ...d, imagen: v }))} placeholder="https://..." />
            </div>
            <div className="mt-2">
              <button
                className="px-3 py-1.5 rounded-xl text-sm bg-indigo-600 text-white"
                onClick={() => {
                  if (!draft.titulo || !draft.imagen) return alert("Completá título e imagen");
                  onAdd({ id: uid(), ...draft });
                  setDraft({ titulo: "", texto: "", imagen: "" });
                }}
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --------------------- Carreras ---------------------
function CarrerasGrid({ carreras, onOpen }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {carreras.map((c) => (
        <button
          key={c.id}
          onClick={() => onOpen(c.id)}
          className="text-left group border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow bg-white"
        >
          <div className="h-36 bg-cover bg-center" style={{ backgroundImage: `url(${c.imagen})` }} aria-hidden />
          <div className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className={classNames("inline-block w-2 h-2 rounded-full bg-gradient-to-br", c.color)} />
              <h3 className="font-semibold group-hover:underline">{c.nombre}</h3>
            </div>
            <div className="text-sm text-gray-600 line-clamp-2" dangerouslySetInnerHTML={{ __html: c.descripcionHtml }} />
          </div>
        </button>
      ))}
    </div>
  );
}

function CarreraDetalle({ carrera, admin, onClose, onSave, onDelete }) {
  const [draft, setDraft] = useState(carrera);
  useEffect(() => setDraft(carrera), [carrera?.id]);
  if (!carrera) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur p-4 overflow-auto">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl overflow-hidden shadow-lg">
        <div className="relative h-44">
          <img src={draft.imagen} alt={draft.nombre} className="w-full h-full object-cover" />
          <button onClick={onClose} className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1.5 rounded-xl text-sm">Cerrar</button>
        </div>
        <div className="p-4 md:p-6">
          {admin ? (
            <>
              <TextInput label="Nombre" value={draft.nombre} onChange={(v) => setDraft((d) => ({ ...d, nombre: v }))} />
              <RichTextEditor label="Descripción" value={draft.descripcionHtml || ""} onChange={(v) => setDraft((d) => ({ ...d, descripcionHtml: v }))} />
              <RichTextEditor label="Materias (formato libre)" value={draft.materiasHtml || ""} onChange={(v) => setDraft((d) => ({ ...d, materiasHtml: v }))} />
              <TextInput label="URL de imagen" value={draft.imagen} onChange={(v) => setDraft((d) => ({ ...d, imagen: v }))} />
              <div className="flex items-center gap-2 mt-2">
                <button className="px-3 py-1.5 rounded-xl text-sm bg-indigo-600 text-white" onClick={() => onSave(draft)}>Guardar cambios</button>
                <button className="px-3 py-1.5 rounded-xl text-sm bg-red-600 text-white" onClick={() => onDelete(draft.id)}>Eliminar carrera</button>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold mb-1">{draft.nombre}</h3>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: draft.descripcionHtml || "" }} />
              <h4 className="font-semibold mt-3">Materias destacadas</h4>
              <div className="prose max-w-none mt-1" dangerouslySetInnerHTML={{ __html: draft.materiasHtml || "" }} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// --------------------- Noticias y Formación ---------------------
function ItemsEditor({ items, admin, title, onAdd, onUpdate, onDelete }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ titulo: "", cuerpoHtml: "" });

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((n) => (
          <div key={n.id} className="border border-gray-200 rounded-2xl p-4 bg-white">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold">{n.titulo}</h3>
                {n.fecha && <p className="text-xs text-gray-500">{n.fecha}</p>}
              </div>
              {admin && (
                <div className="flex gap-2">
                  <button
                    className="px-2 py-1 text-xs rounded-lg bg-gray-900 text-white"
                    onClick={() => {
                      const titulo = prompt("Título", n.titulo) ?? n.titulo;
                      onUpdate({ ...n, titulo });
                    }}
                  >
                    Renombrar
                  </button>
                  <button className="px-2 py-1 text-xs rounded-lg bg-red-600 text-white" onClick={() => onDelete(n.id)}>
                    Eliminar
                  </button>
                </div>
              )}
            </div>
            <div className="prose max-w-none mt-1" dangerouslySetInnerHTML={{ __html: n.cuerpoHtml || "" }} />
          </div>
        ))}
      </div>

      {admin && (
        <div className="mt-4">
          <button onClick={() => setOpen((o) => !o)} className="px-3 py-1.5 rounded-xl text-sm bg-gray-900 text-white">
            {open ? `Cerrar ${title}` : `Agregar a ${title}`}
          </button>
          {open && (
            <div className="mt-3 grid gap-3">
              <TextInput label="Título" value={draft.titulo} onChange={(v) => setDraft((d) => ({ ...d, titulo: v }))} />
              <RichTextEditor label="Contenido" value={draft.cuerpoHtml} onChange={(v) => setDraft((d) => ({ ...d, cuerpoHtml: v }))} />
              <div>
                <button
                  className="px-3 py-1.5 rounded-xl text-sm bg-indigo-600 text-white"
                  onClick={() => {
                    if (!draft.titulo) return alert("Completá el título");
                    onAdd({ id: uid(), ...draft, fecha: new Date().toISOString().slice(0, 10) });
                    setDraft({ titulo: "", cuerpoHtml: "" });
                  }}
                >
                  Agregar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// --------------------- Compartir flotante ---------------------
function ShareFab({ data }) {
  if (!data) return null;
  const onClick = async () => {
    const url = makeShareUrl(data);
    try {
      if (navigator.share) {
        await navigator.share({ title: "ISFD Cecilia Braslavsky", text: "Mirá el estado del sitio", url });
      } else {
        await navigator.clipboard?.writeText(url);
        alert("Enlace copiado al portapapeles");
      }
    } catch {
      await navigator.clipboard?.writeText(url);
      alert("Enlace copiado al portapapeles");
    }
  };
  return (
    <button onClick={onClick} className="fixed bottom-4 right-4 z-40 px-4 py-3 rounded-2xl shadow-lg bg-gray-900 text-white text-sm" aria-label="Compartir" title="Compartir">
      Compartir
    </button>
  );
}

// --------------------- Admin / Backup ---------------------
function AdminBar({ data, setData, onRestore, onShareUrl }) {
  const [open, setOpen] = useState(false);
  const jsonText = useMemo(() => JSON.stringify(data, null, 2), [data]);
  const [importText, setImportText] = useState("");
  const [shareUrl, setShareUrl] = useState("");

  return (
    <div className="mt-4">
      <button onClick={() => setOpen((o) => !o)} className="px-3 py-1.5 rounded-xl text-sm bg-yellow-400 hover:bg-yellow-500 font-medium">
        {open ? "Ocultar herramientas" : "Herramientas (exportar/importar)"}
      </button>
      {open && (
        <div className="mt-3 grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold mb-1">Exportar contenido</p>
            <textarea className="w-full h-48 rounded-xl border border-gray-300 px-3 py-2 text-xs" readOnly value={jsonText} />
            <div className="flex flex-wrap gap-2 mt-2">
              <button
                className="px-3 py-1.5 rounded-xl text-sm border border-gray-300"
                onClick={() => {
                  try {
                    const blob = new Blob([jsonText], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "isfd_braslavsky_contenido.json";
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(url);
                  } catch {}
                }}
              >
                Descargar JSON
              </button>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-1">Importar contenido</p>
            <textarea className="w-full h-48 rounded-xl border border-gray-300 px-3 py-2 text-xs" value={importText} onChange={(e) => setImportText(e.target.value)} placeholder="Pegá aquí el JSON exportado y presioná Importar" />
            <div className="flex flex-wrap gap-2 mt-2">
              <button
                className="px-3 py-1.5 rounded-xl text-sm bg-indigo-600 text-white"
                onClick={() => {
                  try {
                    const obj = JSON.parse(importText);
                    setData(obj);
                    alert("Contenido importado");
                  } catch {
                    alert("JSON inválido");
                  }
                }}
              >
                Importar
              </button>
              <button className="px-3 py-1.5 rounded-xl text-sm bg-red-600 text-white" onClick={onRestore}>Restaurar por defecto</button>
            </div>
            <div className="mt-4 border-t border-gray-200 pt-3">
              <p className="text-sm font-semibold mb-1">Compartir como enlace</p>
              <div className="flex gap-2 flex-wrap">
                <button
                  className="px-3 py-1.5 rounded-xl text-sm border border-gray-300"
                  onClick={() => {
                    const url = makeShareUrl(data);
                    setShareUrl(url);
                    onShareUrl?.(url);
                    navigator.clipboard?.writeText(url);
                    alert("Enlace generado y copiado al portapapeles");
                  }}
                >
                  Generar enlace
                </button>
                <input className="flex-1 min-w-[200px] rounded-xl border border-gray-300 px-3 py-2 text-xs" value={shareUrl} readOnly placeholder="Presioná 'Generar enlace' para obtener una URL compartible" />
              </div>
              <p className="text-xs text-gray-500 mt-1">El enlace incluye el contenido actual embebido en la URL. Ideal para compartir un estado puntual del sitio.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LoginModal({ onClose, onOk }) {
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(true);
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur grid place-items-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-lg">
        <h3 className="text-lg font-semibold">Ingresar al modo edición</h3>
        <p className="text-sm text-gray-600 mt-1">Clave de demostración: <code>braslavsky</code></p>
        <TextInput label="Clave" value={pwd} onChange={setPwd} placeholder="Ingresá la clave" />
        <div className="flex items-center justify-end gap-2">
          <button className="px-3 py-1.5 rounded-xl text-sm border border-gray-300" onClick={() => { setShow(false); onClose(); }}>Cancelar</button>
          <button
            className="px-3 py-1.5 rounded-xl text-sm bg-gray-900 text-white"
            onClick={() => {
              if (pwd.trim() === "braslavsky") { onOk(); setShow(false); onClose(); } else alert("Clave incorrecta");
            }}
          >
            Ingresar
          </button>
        </div>
      </div>
    </div>
  );
}

// --------------------- App ---------------------
export default function App() {
  const [data, setData] = useLocalStorage(STORAGE_KEY, DEFAULT_DATA);
  const [route, setRoute] = useState("inicio");
  const [admin, setAdmin] = useState(() => localStorage.getItem(ADMIN_KEY) === "1");
  const [showLogin, setShowLogin] = useState(false);
  const [detalleId, setDetalleId] = useState(null);

  useEffect(() => {
    try { localStorage.setItem(ADMIN_KEY, admin ? "1" : "0"); } catch {}
  }, [admin]);

  // Importar estado compartido por URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("data");
    if (encoded) {
      const obj = decodeFromUrlParam(encoded);
      if (obj) {
        const ok = confirm("Se detectó un contenido compartido por enlace. ¿Cargarlo ahora? (Reemplaza el contenido actual)");
        if (ok) {
          setData(obj);
          const base = window.location.origin + window.location.pathname;
          window.history.replaceState({}, "", base);
        }
      }
    }
  }, []);

  const openCarrera = (id) => setDetalleId(id);
  const currentCarrera = data.carreras.find((c) => c.id === detalleId) || null;

  return (
    <div className="min-h-dvh bg-gray-50 text-gray-900">
      <Navbar
        route={route}
        setRoute={setRoute}
        admin={admin}
        onLoginToggle={() => { if (admin) setAdmin(false); else setShowLogin(true); }}
        onShare={async () => {
          const url = makeShareUrl(data);
          try {
            if (navigator.share) {
              await navigator.share({ title: "ISFD Cecilia Braslavsky", text: "Mirá el estado del sitio", url });
            } else {
              await navigator.clipboard?.writeText(url);
              alert("Enlace copiado al portapapeles");
            }
          } catch {
            await navigator.clipboard?.writeText(url);
            alert("No se pudo abrir el diálogo nativo. Enlace copiado al portapapeles.");
          }
        }}
      />

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onOk={() => setAdmin(true)} />}

      {/* INICIO */}
      {route === "inicio" && (
        <main className="max-w-6xl mx-auto px-4 mt-6">
          <Carousel
            slides={data.slides}
            admin={admin}
            onAdd={(s) => setData({ ...data, slides: [...data.slides, s] })}
            onUpdate={(s) => setData({ ...data, slides: data.slides.map((x) => (x.id === s.id ? s : x)) })}
            onDelete={(id) => setData({ ...data, slides: data.slides.filter((x) => x.id !== id) })}
          />
          <Section title="Nuestra propuesta" subtitle="Prácticas en territorio, actualización permanente y enfoque interdisciplinario.">
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { t: "Prácticas y residencias", d: "Acompañamiento situado, articulación con escuelas y evaluación formativa." },
                { t: "Tecnologías para enseñar", d: "Integración de recursos digitales, accesibilidad y producción multimedia." },
                { t: "Vinculación", d: "Trabajo con la comunidad y proyectos regionales." },
              ].map((x, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-gray-200">
                  <h3 className="font-semibold">{x.t}</h3>
                  <p className="text-gray-700 mt-1 text-sm">{x.d}</p>
                </div>
              ))}
            </div>
          </Section>
        </main>
      )}

      {/* CARRERAS */}
      {route === "carreras" && (
        <Section
          title="Carreras del instituto"
          subtitle="Hacé clic en una carrera para ver el detalle (o editar si estás en modo edición)."
          actions={
            admin && (
              <div className="flex gap-2">
                <button
                  className="px-3 py-1.5 rounded-xl text-sm bg-indigo-600 text-white"
                  onClick={() => {
                    const nombre = prompt("Nombre de la carrera");
                    if (!nombre) return;
                    const imagen = prompt("URL de imagen", "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?w=1600&q=80&auto=format&fit=crop") || "";
                    setData({
                      ...data,
                      carreras: [
                        ...data.carreras,
                        {
                          id: uid(),
                          nombre,
                          color: "from-indigo-500 to-sky-500",
                          descripcionHtml: "<p>Descripción de la carrera…</p>",
                          materiasHtml: "<ul><li>Materia 1</li><li>Materia 2</li></ul>",
                          imagen,
                        },
                      ],
                    });
                  }}
                >
                  Agregar carrera
                </button>
                <button className="px-3 py-1.5 rounded-xl text-sm border border-gray-300" onClick={() => setRoute("inicio")}>
                  Ir a Inicio
                </button>
              </div>
            )
          }
        >
          <CarrerasGrid carreras={data.carreras} onOpen={(id) => setDetalleId(id)} />
          {currentCarrera && (
            <CarreraDetalle
              carrera={currentCarrera}
              admin={admin}
              onClose={() => setDetalleId(null)}
              onSave={(draft) => {
                setData({ ...data, carreras: data.carreras.map((c) => (c.id === draft.id ? draft : c)) });
                alert("Cambios guardados");
              }}
              onDelete={(id) => {
                if (!confirm("¿Eliminar la carrera?")) return;
                setDetalleId(null);
                setData({ ...data, carreras: data.carreras.filter((c) => c.id !== id) });
              }}
            />
          )}
        </Section>
      )}

      {/* NOTICIAS */}
      {route === "noticias" && (
        <Section title="Noticias" subtitle="Novedades institucionales">
          <ItemsEditor
            items={data.noticias}
            admin={admin}
            title="Noticias"
            onAdd={(n) => setData({ ...data, noticias: [n, ...data.noticias] })}
            onUpdate={(n) => setData({ ...data, noticias: data.noticias.map((x) => (x.id === n.id ? n : x)) })}
            onDelete={(id) => setData({ ...data, noticias: data.noticias.filter((x) => x.id !== id) })}
          />
        </Section>
      )}

      {/* FORMACIÓN CONTINUA */}
      {route === "formacion" && (
        <Section
          title="Formación continua"
          subtitle="Trayectos, cursos y pos-títulos"
          actions={
            admin && (
              <AdminBar data={data} setData={setData} onRestore={() => setData(DEFAULT_DATA)} onShareUrl={() => {}} />
            )
          }
        >
          <ItemsEditor
            items={data.formacion}
            admin={admin}
            title="Formación"
            onAdd={(n) => setData({ ...data, formacion: [n, ...data.formacion] })}
            onUpdate={(n) => setData({ ...data, formacion: data.formacion.map((x) => (x.id === n.id ? n : x)) })}
            onDelete={(id) => setData({ ...data, formacion: data.formacion.filter((x) => x.id !== id) })}
          />
        </Section>
      )}

      <ShareFab data={data} />
      <Footer />
    </div>
  );
}
