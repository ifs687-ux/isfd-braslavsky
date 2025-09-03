import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
importar React, { useEffect, useMemo, useRef, useState } de "react";
importar ReactQuill desde "react-quill";
importar "react-quill/dist/quill.snow.css";

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

// --------------------- Ayudantes ---------------------
constante CLAVE_DE_ALMACENAMIENTO = "isfd_braslavsky_site_v4";
constante ADMIN_KEY = "isfd_braslavsky_admin";

constante uid = () =>
  (globalThis.crypto?.randomUUID?.() ?? `${Math.random().toString(36).slice(2)}${Date.now()}`);

función useLocalStorage(clave, valorinicial) {
  const [estado, establecerEstado] = usarEstado(() => {
    intentar {
      const raw = localStorage.getItem(clave);
      devuelve sin procesar? JSON.parse(raw): valorInicial;
    } atrapar {
      devolver valorInicial;
    }
  });
  usarEfecto(() => {
    intentar {
      localStorage.setItem(clave, JSON.stringify(estado));
    } atrapar {}
  }, [clave, estado]);
  devolver [estado, establecerEstado];
}

función classNames(...xs) {
  devolver xs.filter(Boolean).join(" ");
}

función encodeForUrl(obj) {
  intentar {
    constante json = JSON.stringify(obj);
    constante uri = encodeURIComponent(json);
    devuelve btoa(uri);
  } atrapar {
    devolver "";
  }
}
función decodeFromUrlParam(str) {
  intentar {
    constante uri = atob(str);
    constante json = decodeURIComponent(uri);
    devuelve JSON.parse(json);
  } atrapar {
    devuelve nulo;
  }
}
función makeShareUrl(stateObj) {
  const base = ventana.ubicación.origen + ventana.ubicación.ruta;
  constante datos = encodeForUrl(estadoObj);
  devuelve `${base}?data=${data}`;
}

// --------------------- Datos por defecto ---------------------
constante DATOS_PREDETERMINADOS = {
  Institución: {
    nombre: "ISFD Cecilia Braslavsky",
    lema: "Formación docente con sentido y calidad",
    contacto: {
      correo electrónico: "isfd.cecilia.braslavsky@gmail.com",
      dirección: "Aristóbulo del Valle, Misiones, Argentina",
    },
  },
  diapositivas: [
    {
      identificación: uid(),
      título: "Bienvenidos al ISFD Cecilia Braslavsky",
      texto:
        "Un espacio de formación docente comprometido con la comunidad, la innovación y la calidad educativa.",
      imagen:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&q=80&auto=format&fit=crop",
    },
    {
      identificación: uid(),
      título: "Prácticas en territorio",
      texto:
        "Articulación con escuelas de la región, proyectos interdisciplinarios y aprendizaje situado.",
      imagen:
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&q=80&auto=format&fit=crop",
    },
    {
      identificación: uid(),
      título: "Formación continua",
      texto:
        "Trayectos de actualización y pos-títulos para fortalecer la profesión docente.",
      imagen:
        "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1600&q=80&auto=format&fit=crop",
    },
  ],
  carreras: [
    {
      identificación: uid(),
      nombre: "Profesorado de Matemática",
      color: "del índigo 500 al cielo 500",
      DescripciónHTML:
        "<p>Formación sólida en contenidos matemáticos, didáctica específica y uso de tecnologías digitales.</p>",
      materiasHtml:
        "<ul><li>Álgebra I</li><li>Análisis I</li><li>Geometría</li><li>Probabilidad y Estadística</li><li>Didáctica de la Matemática</li><li>Prácticas I–IV</li></ul>",
      imagen:
        "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?w=1600&q=80&auto=format&fit=crop",
    },
    {
      identificación: uid(),
      nombre: "Profesorado de Biología",
      color: "de esmeralda 500 a verde azulado 500",
      DescripciónHTML:
        "<p>Enfoque en ciencias biológicas, educación ambiental y trabajo en laboratorio y campo.</p>",
      materiasHtml:
        "<ul><li>Biología General</li><li>Genética</li><li>Ecología</li><li>Microbiología</li><li>Didáctica de la Biología</li><li>Prácticas I–IV</li></ul>",
      imagen:
        "https://images.unsplash.com/photo-1559757175-08c6d5c9cde7?w=1600&q=80&auto=format&fit=crop",
    },
    {
      identificación: uid(),
      nombre: "Profesorado de Educación Física",
      color: "de-naranja-500 a-amarillo-500",
      DescripciónHTML:
        "<p>Formación integral en movimiento, salud, deportes y didáctica de la educación física.</p>",
      materiasHtml:
        "<ul><li>Anatomía</li><li>Fisiología</li><li>Juegos y Deportes</li><li>Didáctica de la EF</li><li>Prácticas I–IV</li></ul>",
      imagen:
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1600&q=80&auto=format&fit=crop",
    },
    {
      identificación: uid(),
      nombre: "Profesorado de Historia",
      color: "de-rosa-500 a-fucsia-500",
      DescripciónHTML:
        "<p>Historia local, regional y mundial con enfoque crítico y construcción de ciudadanía.</p>",
      materiasHtml:
        "<ul><li>Historia Argentina</li><li>Historia Universal</li><li>Metodología</li><li>Didáctica de la Historia</li><li>Prácticas I–IV</li></ul>",
      imagen:
        "https://images.unsplash.com/photo-1457694587812-e8bf29a43845?w=1600&q=80&auto=format&fit=crop",
    },
    {
      identificación: uid(),
      nombre: "Profesorado de Lengua y Literatura",
      color: "de morado-500 a violeta-500",
      DescripciónHTML:
        "<p>Estudios literarios, lingüística y didáctica de la lengua con integración de medios digitales.</p>",
      materiasHtml:
        "<ul><li>Gramática</li><li>Literatura Argentina</li><li>Literatura Latinoamericana</li><li>Didáctica de la Lengua</li><li>Prácticas I–IV</li></ul>",
      imagen:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=80&auto=format&fit=crop",
    },
    {
      identificación: uid(),
      nombre: "Profesorado de Educación Especial",
      color: "de cian-500 a azul-500",
      DescripciónHTML:
        "<p>Perspectivas de inclusión, diseño universal para el aprendizaje y trabajo interdisciplinario.</p>",
      materiasHtml:
        "<ul><li>Psicología del Desarrollo</li><li>Trastornos del Neurodesarrollo</li><li>Didáctica de la EE</li><li>Prácticas I–IV</li></ul>",
      imagen:
        "https://images.unsplash.com/photo-1544531585-9847b68c8c86?w=1600&q=80&auto=format&fit=crop",
    },
  ],
  noticias: [
    {
      identificación: uid(),
      título: "Inscripciones abiertas 2026",
      fecha: nueva Fecha().toISOString().slice(0, 10),
      cuerpoHtml:
        "<p>Se encuentran abiertas las preinscripciones para los profesorados. Consultará requisitos y cronograma.</p>",
    },
    {
      identificación: uid(),
      título: "Jornada institucional",
      fecha: nueva Fecha().toISOString().slice(0, 10),
      cuerpoHtml:
        "<p>Convocatoria a docentes y estudiantes para la jornada de trabajo sobre mejora de prácticas.</p>",
    },
  ],
  Formación: [
    {
      identificación: uid(),
      título: "Actualización en Enseñanza de la Matemática",
      cuerpoHtml:
        "<p>Trayecto formativo con foco en estadística, probabilidad y tecnologías digitales aplicadas a la enseñanza.</p>",
    },
    {
      identificación: uid(),
      título: "Seminario de Educación Inclusiva",
      cuerpoHtml:
        "<p>Estrategias de DUA, adaptaciones curriculares y recursos accesibles para el aula.</p>",
    },
  ],
};

// --------------------- Interfaz de usuario ---------------------
función Navbar({ ruta, setRoute, admin, onLoginToggle, onShare }) {
  constantes tabulaciones = [
    { id: "inicio", etiqueta: "Inicio" },
    { id: "carreras", etiqueta: "Carreras" },
    { id: "noticias", etiqueta: "Noticias" },
    { id: "formación", etiqueta: "Formación" },
  ];
  devolver (
    <header className="pegajoso superior-0 z-40 fondo-desenfoque fondo-blanco/70 borde-b borde-gris-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="elementos flexibles-centro espacio-3">
          <div className="w-9 h-9 redondeado-2xl fondo degradado a br de índigo 600 a cielo 500" />
          <div>
            Cecilia Braslavsky, directora ejecutiva de ISFD
            <p className="text-xs text-gray-500 -mt-0.5">Formación docente con sentido y calidad</p>
          </div>
        </div>
        <nav className="hidden md:flex gap-1">
          {tabs.map((t) => (
            <botón
              clave={t.id}
              onClick={() => setRoute(t.id)}
              nombreDeClase={NombresDeClase(
                "px-3 py-2 redondeado-xl texto-sm fuente-mediana",
                ruta === t.id ? "bg-gray-900 texto-blanco" : "hover:bg-gray-100 texto-gris-700"
              )}
            >
              {t.etiqueta}
            </botón>
          ))}
        </nav>
        <div className="elementos flexibles-centro espacio-2">
          Compartir
          <botón
            onClick={onLoginToggle}
            nombreDeClase={NombresDeClase(
              "px-3 py-1.5 redondeado-xl texto-sm",
              Administrador: "bg-rojo-600 texto-blanco pasar el cursor:bg-rojo-700": "bg-gris-900 texto-blanco pasar el cursor:bg-negro"
            )}
          >
            {administrador? "Salir" : "Ingresar"}
          </botón>
          <botón
            className="md:hidden px-3 py-1.5 redondeado-xl texto-pequeño borde borde-gris-300"
            al hacer clic={() => {
              const next = Prompt("Ir a sección (inicio, carreras, noticias, formacion):", ruta);
              if (["inicio", "carreras", "noticias", "formacion"].includes(next)) setRoute(next);
            }}
            aria-label="Cambiar sección"
          >
            Menú
          </botón>
        </div>
      </div>
    </encabezado>
  );
}

función Pie de página() {
  devolver (
    <footer className="mt-16 borde-t borde-gris-200">
      <div className="max-w-6xl mx-auto px-4 py-8 cuadrícula md:cuadrícula-cols-3 espacio-6 texto-sm">
        <div>
          Cecilia Braslavsky, directora de la Fundación ISFD
          <p className="text-gray-600">Aristóbulo del Valle, Misiones, Argentina</p>
        </div>
        <div>
          <h4 className="font-semibold">Contacto</h4>
          <p className="text-gray-600">isfd.cecilia.braslavsky@gmail.com</p>
          <p className="text-gray-600">+54 93755 659796</p>
        </div>
        <div>
          Créditos
          <p className="text-gray-600">Demostración del sitio, Prof. Schvartz Ivan</p>
        </div>
      </div>
    </pie de página>
  );
}

función Sección({ título, subtítulo, hijos, acciones }) {
  devolver (
    <sección className="max-w-6xl mx-auto px-4 mt-8">
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{título}</h2>
          {subtítulo && <p className="text-gray-600 text-sm mt-1">{subtítulo}</p>}
        </div>
        {comportamiento}
      </div>
      {niños}
    </sección>
  );
}

función TextInput({ etiqueta, valor, onChange, marcador de posición, área de texto }) {
  devolver (
    <label className="bloque de texto-sm mb-3">
      <span className="bloque fuente-mediana texto-gris-700 mb-1">{etiqueta}</span>
      {área de texto ? (
        <área de texto
          className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          filas={4}
          valor={valor}
          onChange={(e) => onChange(e.objetivo.valor)}
          marcador de posición={marcador de posición}
        />
      ) : (
        <entrada
          className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          valor={valor}
          onChange={(e) => onChange(e.objetivo.valor)}
          marcador de posición={marcador de posición}
        />
      )}
    </etiqueta>
  );
}

función RichTextEditor({ etiqueta, valor, onChange, marcador de posición }) {
  módulos constantes = {
    barra de herramientas: [
      [{ encabezado: [1, 2, 3, 4, 5, 6, falso] }],
      [{ fuente: [] }],
      [{ tamaño: ["pequeño", falso, "grande", "enorme"] }],
      ["negrita", "cursiva", "subrayado", "tachado", { color: [] }, { fondo: [] }],
      [{script: "sub"}, {script: "super"}],
      [{ lista: "ordenada" }, { lista: "viñeta" }, { sangría: "-1" }, { sangría: "+1" }],
      [{ alinear: [] }],
      ["blockquote", "bloque de código"],
      ["enlace", "imagen", "vídeo"],
      ["limpio"],
    ],
    portapapeles: {matchVisual: falso},
  };
  formatos constantes = [
    Encabezado, fuente, tamaño, negrita, cursiva, subrayado, tachado, color, fondo, guion, lista, sangría, alineación, cita en bloque, bloque de código, enlace, imagen, vídeo, limpio.
  ];
  devolver (
    <label className="bloque de texto-sm mb-3">
      <span className="bloque fuente-mediana texto-gris-700 mb-1">{etiqueta}</span>
      <ReactQuill
        valor={valor}
        onChange={onChange}
        módulos={módulos}
        formatos={formatos}
        tema="nieve"
        marcador de posición={marcador de posición || "Escribí aquí..."}
      />
    </etiqueta>
  );
}

// --------------------- Carrusel ---------------------
función Carrusel({ diapositivas, admin, onAdd, onUpdate, onDelete }) {
  const[idx, setIdx] = useState(0);
  temporizador constante = useRef(null);

  usarEfecto(() => {
    si (!diapositivas.longitud) retorna;
    temporizador.actual = setInterval(() => setIdx((i) => (i + 1) % diapositivas.longitud), 6000);
    return() => clearInterval(temporizador.actual);
  }, [diapositivas.longitud]);

  constante actual = diapositivas[idx];
  si (!actual)
    devolver (
      <div className="aspecto-[16/6] an-completo redondeado-2xl fondo-degradado-a-br de-gris-200 a-gris-100 cuadrícula colocar-elementos-centrar texto-centrar">
        <div className="p-6">
          <p className="text-lg text-gray-600">Agregá diapositivas para el inicio</p>
        </div>
      </div>
    );

  devolver (
    <div className="relativo">
      <div className="aspecto-[16/6] w-redondeado completo-2xl desbordamiento oculto">
        <división
          className="w-full h-full fondo-cubierta fondo-centro"
          estilo={{imagenDeFondo: `url(${current.imagen})` }}
          rol="img"
          aria-label={current.titulo}
        >
          <div className="w-full h-full bg-black/40">
            <div className="max-w-6xl mx-auto px-4 h-full flex items-center">
              <div className="texto-blanco max-w-2xl">
                <h3 className="text-2xl md:text-4xl font-bold drop-shadow-sm">{título actual}</h3>
                <p className="mt-2 md:mt-3 texto-sm md:text-base texto-blanco/90">{current.texto}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 flex items-end justify-between p-3">
        <div className="flex gap-1">
          {diapositivas.map((s, i) => (
            <botón
              clave={s.id}
              al hacer clic={() => setIdx(i)}
              className={classNames("w-2.5 h-2.5 redondeado-completo", i === idx ? "bg-blanco" : "bg-blanco/50")}
              aria-label={`Ir a diapositiva ${i + 1}`}
            />
          ))}
        </div>
        {admin && (
          <CarouselEditor slides={diapositivas} onAdd={onAdd} onUpdate={onUpdate} onDelete={onDelete} />
        )}
      </div>
    </div>
  );
}

función CarouselEditor({ diapositivas, onAdd, onUpdate, onDelete }) {
  const [abrir, establecerAbierto] = useState(falso);
  const [borrador, setDraft] = useState({ titulo: "", texto: "", imagen: "" });
  devolver (
    <div>
      <button onClick={() => setOpen((o) => !o)} className="px-3 py-1.5 redondeado-xl texto-pequeño fondo-blanco/95 pasar el cursor sobre: ​​fondo-blanco fuente-mediana">
        {abierto ? "Cerrar edición" : "Editar carrusel"}
      </botón>
      {abierto && (
        <div className="mt-3 fondo blanco/95 fondo desenfocado redondeado xl p-3 sombra">
          <div className="cuadrícula md:cuadrícula-cols-2 espacio-3">
            {diapositivas.mapa((s) => (
              <div key={s.id} className="borde borde-gris-200 redondeado-xl p-3">
                <p className="text-sm font-medium">{s.titulo}</p>
                <p className="text-xs text-gray-500 line-clamp-2">{s.texto}</p>
                <div className="flex gap-2 mt-2">
                  <botón
                    Nombre de clase="px-2 py-1 texto-xs redondeado-lg fondo-gris-900 texto-blanco"
                    al hacer clic={() => {
                      const titulo = Prompt("Título", s.titulo) ?? s.titulo;
                      const texto = Prompt("Texto", s.texto) ?? s.texto;
                      const imagen = Prompt("URL de imagen", s.imagen) ?? s.imagen;
                      onUpdate({ ...s, titulo, texto, imagen });
                    }}
                  >
                    Editar
                  </botón>
                  <button className="px-2 py-1 texto-xs redondeado-lg fondo-rojo-600 texto-blanco" onClick={() => onDelete(s.id)}>
                    Eliminar
                  </botón>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 borde-t borde-gris-200 pt-3">
            <p className="text-sm font-medium mb-2">Agregar diapositiva</p>
            <div className="cuadrícula md:cuadrícula-cols-3 espacio-2">
              <TextInput label="Título" value={draft.titulo} onChange={(v) => setDraft((d) => ({ ...d, titulo: v }))} placeholder="Ej.: Bienvenidos" />
              <TextInput label="Texto" value={draft.texto} onChange={(v) => setDraft((d) => ({ ...d, texto: v }))} placeholder="Subtítulo o descripción" />
              <TextInput label="URL de la imagen" value={draft.imagen} onChange={(v) => setDraft((d) => ({ ...d, imagen: v }))} placeholder="https://..." />
            </div>
            <div className="mt-2">
              <botón
                Nombre de clase="px-3 py-1.5 redondeado-xl texto-pequeño fondo-índigo-600 texto-blanco"
                al hacer clic={() => {
                  if (!draft.titulo || !draft.imagen) return alert("Completá título e imagen");
                  onAdd({ id: uid(), ...borrador });
                  setDraft({ título: "", texto: "", imagen: "" });
                }}
              >
                Agregar
              </botón>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --------------------- Carreras ---------------------
function CarrerasGrid({ carreras, onOpen }) {
  devolver (
    <div className="cuadrícula pequeña: cuadrícula-columnas-2 grande: cuadrícula-columnas-3 espacio-4">
      {carreras.map((c) => (
        <botón
          clave={c.id}
          al hacer clic={() => al abrir(c.id)}
          Nombre de clase="texto-izquierdo, borde de grupo, borde-gris-200, redondeado-2xl, desbordamiento-oculto, pasar el cursor: sombra-md, transición-sombra, fondo-blanco"
        >
          <div className="h-36 fondo-cubierta fondo-centro" estilo={{ backgroundImage: `url(${c.imagen})` }} aria-hidden />
          <div className="p-4">
            <div className="elementos flexibles-centro espacio-2 mb-1">
              <span className={classNames("bloque en línea w-2 h-2 redondeado completo bg-gradient-to-br", c.color)} />
              <h3 className="font-semibold group-hover:underline">{c.nombre}</h3>
            </div>
            <div className="text-sm text-gray-600 line-clamp-2" dangerouslySetInnerHTML={{ __html: c.descripcionHtml }} />
          </div>
        </botón>
      ))}
    </div>
  );
}

function CarreraDetalle({ carrera, admin, onClose, onSave, onDelete }) {
  const [borrador, setDraft] = useState(carrera);
  useEffect(() => setDraft(carrera), [carrera?.id]);
  si (!carrera) devuelve nulo;

  devolver (
    <div className="inserción fija-0 z-50 fondo negro/40 desenfoque de fondo p-4 desbordamiento automático">
      <div className="max-w-3xl mx-auto bg-blanco redondeado-2xl desbordamiento-sombra oculta-lg">
        <div className="relativo h-44">
          <img src={borrador.imagen} alt={borrador.nombre} className="w-full h-full object-cover" />
          <button onClick={onClose} className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1.5 rounded-xl text-sm">Cerrar</button>
        </div>
        <div className="p-4 md:p-6">
          {admin ? (
            <>
              <TextInput label="Nombre" value={draft.nombre} onChange={(v) => setDraft((d) => ({ ...d, nombre: v }))} />
              <RichTextEditor label="Descripción" value={draft.descripcionHtml || ""} onChange={(v) => setDraft((d) => ({ ...d, descripcionHtml:v }))} />
              <RichTextEditor label="Materias (formato libre)" value={draft.materiasHtml || ""} onChange={(v) => setDraft((d) => ({ ...d, materiasHtml: v }))} />
              <TextInput label="URL de imagen" value={draft.imagen} onChange={(v) => setDraft((d) => ({ ...d, imagen: v }))} />
              <div className="elementos flexibles-centro espacio-2 mt-2">
                Guardar cambios
                Eliminar carrera
              </div>
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold mb-1">{borrador.nombre}</h3>
              <div className="prosa max-w-none" dangerouslySetInnerHTML={{ __html: borrador.descripcionHtml || "" }} />
              <h4 className="font-semibold mt-3">Materiales destacados</h4>
              <div className="prosa max-w-none mt-1" dangerouslySetInnerHTML={{ __html: borrador.materiasHtml || "" }} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// --------------------- Noticias y Formación ---------------------
función ItemsEditor({ items, admin, title, onAdd, onUpdate, onDelete }) {
  const [abrir, establecerAbierto] = useState(falso);
  const [borrador, setDraft] = useState({ titulo: "", cuerpoHtml: "" });

  devolver (
    <div>
      <div className="cuadrícula md:cuadrícula-cols-2 espacio-4">
        {elementos.map((n) => (
          <div key={n.id} className="borde borde-gris-200 redondeado-2xl p-4 fondo-blanco">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold">{n.titulo}</h3>
                {n.fecha && <p className="text-xs text-gray-500">{n.fecha}</p>}
              </div>
              {admin && (
                <div className="flex gap-2">
                  <botón
                    Nombre de clase="px-2 py-1 texto-xs redondeado-lg fondo-gris-900 texto-blanco"
                    al hacer clic={() => {
                      const titulo = Prompt("Título", n.titulo) ?? n.titulo;
                      onUpdate({ ...n, título });
                    }}
                  >
                    Renombrar
                  </botón>
                  <button className="px-2 py-1 texto-xs redondeado-lg fondo-rojo-600 texto-blanco" onClick={() => onDelete(n.id)}>
                    Eliminar
                  </botón>
                </div>
              )}
            </div>
            <div className="prosa max-w-none mt-1" dangerouslySetInnerHTML={{ __html: n.cuerpoHtml || "" }} />
          </div>
        ))}
      </div>

      {admin && (
        <div className="mt-4">
          <button onClick={() => setOpen((o) => !o)} className="px-3 py-1.5 redondeado-xl texto-sm bg-gris-900 texto-blanco">
            {abierto ? `Cerrar ${title}` : `Agregar a ${title}`}
          </botón>
          {abierto && (
            <div className="mt-3 espacio en la cuadrícula-3">
              <TextInput label="Título" value={draft.titulo} onChange={(v) => setDraft((d) => ({ ...d, titulo: v }))} />
              <RichTextEditor label="Contenido" value={draft.cuerpoHtml} onChange={(v) => setDraft((d) => ({ ...d, cuerpoHtml: v }))} />
              <div>
                <botón
                  Nombre de clase="px-3 py-1.5 redondeado-xl texto-pequeño fondo-índigo-600 texto-blanco"
                  al hacer clic={() => {
                    if (!draft.titulo) return alert("Completá el título");
                    onAdd({ id: uid(), ...draft, fecha: new Date().toISOString().slice(0, 10) });
                    setDraft({ titulo: "", cuerpoHtml: "" });
                  }}
                >
                  Agregar
                </botón>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// --------------------- Compartir flotante ---------------------
función ShareFab({ datos }) {
  si (!data) devuelve nulo;
  constante onClick = async () => {
    const url = makeShareUrl(datos);
    intentar {
      si (navegador.compartir) {
        await navigator.share({ título: "ISFD Cecilia Braslavsky", texto: "Mirá el estado del sitio", url });
      } demás {
        esperar navigator.clipboard?.writeText(url);
        alert("Enlace copiado al portapapeles");
      }
    } atrapar {
      esperar navigator.clipboard?.writeText(url);
      alert("Enlace copiado al portapapeles");
    }
  };
  devolver (
    <button onClick={onClick} className="fijo inferior-4 derecha-4 z-40 px-4 py-3 redondeado-2xl sombra-lg fondo-gris-900 texto-blanco texto-pequeño" aria-label="Compartir" title="Compartir">
      Compartir
    </botón>
  );
}

// --------------------- Administrador / Copia de seguridad ---------------------
función AdminBar({ datos, setData, onRestore, onShareUrl }) {
  const [abrir, establecerAbierto] = useState(falso);
  const jsonText = useMemo(() => JSON.stringify(datos, null, 2), [datos]);
  const [importText, setImportText] = useState("");
  const [shareUrl, setShareUrl] = useState("");

  devolver (
    <div className="mt-4">
      <button onClick={() => setOpen((o) => !o)} className="px-3 py-1.5 redondeado-xl texto-pequeño fondo-amarillo-400 hover: fondo-amarillo-500 fuente-mediana">
        {abierto ? "Ocultar herramientas" : "Herramientas (exportar/importar)"}
      </botón>
      {abierto && (
        <div className="mt-3 cuadrícula md:grid-cols-2 espacio-4">
          <div>
            <p className="text-sm font-semibold mb-1">Exportar contenido</p>
            <textarea className="w-full h-48 rounded-xl border border-gray-300 px-3 py-2 text-xs" readOnly value={jsonText} />
            <div className="flex flex-wrap gap-2 mt-2">
              <botón
                Nombre de clase="px-3 py-1.5 redondeado-xl texto-pequeño borde borde-gris-300"
                al hacer clic={() => {
                  intentar {
                    const blob = new Blob([jsonText], { tipo: "application/json" });
                    constante url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "isfd_braslavsky_contenido.json";
                    documento.cuerpo.appendChild(a);
                    a.click();
                    a.eliminar();
                    URL.revokeObjectURL(url);
                  } atrapar {}
                }}
              >
                Descargar JSON
              </botón>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-1">Importar contenido</p>
            <textarea className="w-full h-48 rounded-xl border border-gray-300 px-3 py-2 text-xs" value={importText} onChange={(e) => setImportText(e.target.value)} placeholder="Pegá aquí el JSON exportado y presioná Importar" />
            <div className="flex flex-wrap gap-2 mt-2">
              <botón
                Nombre de clase="px-3 py-1.5 redondeado-xl texto-pequeño fondo-índigo-600 texto-blanco"
                al hacer clic={() => {
                  intentar {
                    constante obj = JSON.parse(importText);
                    establecerDatos(obj);
                    alerta("Contenido importado");
                  } atrapar {
                    alert("JSON inválido");
                  }
                }}
              >
                Importar
              </botón>
              Restaurar por defecto
            </div>
            <div className="mt-4 border-t border-gray-200 pt-3">
              <p className="text-sm font-semibold mb-1">Compartir como enlace</p>
              <div className="flex gap-2 flex-wrap">
                <botón
                  Nombre de clase="px-3 py-1.5 redondeado-xl texto-pequeño borde borde-gris-300"
                  al hacer clic={() => {
                    const url = makeShareUrl(datos);
                    setShareUrl(url);
                    enShareUrl?.(url);
                    navegador.clipboard?.writeText(url);
                    alert("Enlace generado y copiado al portapapeles");
                  }}
                >
                  Generar enlace
                </botón>
                <input className="flex-1 min-w-[200px] rounded-xl border border-gray-300 px-3 py-2 text-xs" value={shareUrl} readOnly placeholder="Presioná 'Generar enlace' para obtener una URL compatible" />
              </div>
              <p className="text-xs text-gray-500 mt-1">El enlace incluye el contenido actual embebido en la URL. Ideal para compartir un estado puntual del sitio.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

función LoginModal({ onClose, onOk }) {
  const [pwd, setPwd] = useState("");
  const [mostrar, establecerMostrar] = useState(true);
  si (!mostrar) devuelve nulo;
  devolver (
    <div className="recuadro fijo 0 z-50 fondo negro/40 fondo desenfocado cuadrícula colocar elementos centrados p-4">
      <div className="bg-blanco redondeado-2xl w-full máx.-w-pequeño p-5 shadow-lg">
        <h3 className="text-lg font-semibold">Ingresar al modo edición</h3>
        <p className="text-sm text-gray-600 mt-1">Clave de demostración: <code>braslavsky</code></p>
        <TextInput label="Clave" value={pwd} onChange={setPwd} placeholder="Ingresá la clave" />
        <div className="flex items-center justify-end gap-2">
          Cancelar
          <botón
            Nombre de clase="px-3 py-1.5 redondeado-xl texto-pequeño fondo gris-900 texto-blanco"
            al hacer clic={() => {
              if (pwd.trim() === "braslavsky") { onOk(); setShow(false); onClose(); } else alert("Clave incorrecta");
            }}
          >
            Ingresar
          </botón>
        </div>
      </div>
    </div>
  );
}

// --------------------- Aplicación ---------------------
exportar función predeterminada App() {
  const [datos, setData] = useLocalStorage(CLAVE_ALMACENAMIENTO, DATOS_PREDETERMINADOS);
  const [ruta, setRoute] = useState("inicio");
  constante [admin, setAdmin] = useState(() => localStorage.getItem(ADMIN_KEY) === "1");
  const [mostrarInicioDeSesión, establecerMostrarInicioDeSesión] = useState(false);
  const [detalleId, setDetalleId] = useState(nulo);

  usarEfecto(() => {
    prueba { localStorage.setItem(ADMIN_KEY, admin ? "1" : "0"); } captura {}
  }, [admin]);

  // Importar estado compartido por URL
  usarEfecto(() => {
    const params = new URLSearchParams(ventana.ubicación.búsqueda);
    const codificado = params.get("datos");
    si (codificado) {
      const obj = decodeFromUrlParam(codificado);
      si (obj) {
        const ok = confirm("Se detectó un contenido compartido por enlace. ¿Cargarlo ahora? (Reemplaza el contenido actual)");
        si (ok) {
          establecerDatos(obj);
          const base = ventana.ubicación.origen + ventana.ubicación.ruta;
          ventana.history.replaceState({}, "", base);
        }
      }
    }
  }, []);

  const openCarrera = (id) => setDetalleId(id);
  const currentCarrera = data.carreras.find((c) => c.id === detalleId) || nulo;

  devolver (
    <div className="min-h-dvh bg-gray-50 text-gray-900">
      <Barra de navegación
        ruta={ruta}
        establecerRuta={establecerRuta}
        administrador={admin}
        onLoginToggle={() => { if (admin) setAdmin(false); de lo contrario setShowLogin(true); }}
        onShare={async() => {
          const url = makeShareUrl(datos);
          intentar {
            si (navegador.compartir) {
              await navigator.share({ título: "ISFD Cecilia Braslavsky", texto: "Mirá el estado del sitio", url });
            } demás {
              esperar navigator.clipboard?.writeText(url);
              alert("Enlace copiado al portapapeles");
            }
          } atrapar {
            esperar navigator.clipboard?.writeText(url);
            alert("No se pudo abrir el diálogo nativo. Enlace copiado al portapapeles.");
          }
        }}
      />

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onOk={() => setAdmin(true)} />}

      {/* INICIO */}
      {ruta === "inicio" && (
        <nombre de clase principal="max-w-6xl mx-auto px-4 mt-6">
          <Carrusel
            diapositivas={datos.diapositivas}
            administrador={admin}
            onAdd={(s) => setData({ ...datos, diapositivas: [...datos.diapositivas, s] })}
            onUpdate={(s) => setData({ ...datos, diapositivas: datos.diapositivas.mapa((x) => (x.id === s.id ? s : x)) })}
            onDelete={(id) => setData({ ...datos, diapositivas: datos.diapositivas.filter((x) => x.id !== id) })}
          />
          <Section title="Nuestra propuesta" subtitle="Prácticas en territorio, actualización permanente y enfoque interdisciplinario.">
            <div className="cuadrícula md:cuadrícula-cols-3 espacio-4">
              {[
                { t: "Prácticas y residencias", d: "Acompañamiento situado, articulación con escuelas y evaluación formativa." },
                { t: "Tecnologías para enseñar", d: "Integración de recursos digitales, accesibilidad y producción multimedia." },
                { t: "Vinculación", d: "Trabajo con la comunidad y proyectos regionales." },
              ].map((x, i) => (
                <div key={i} className="bg-blanco redondeado-2xl p-4 borde borde-gris-200">
                  <h3 className="font-semibold">{xt}</h3>
                  <p className="text-gray-700 mt-1 text-sm">{xd}</p>
                </div>
              ))}
            </div>
          </Sección>
        </principal>
      )}

      {/* CARRERAS */}
      {ruta === "carreras" && (
        <Sección
          title="Carreras del instituto"
          subtitle="Hacé clic en una carrera para ver el detalle (o editar si estás en modo edición)."
          acciones={
            administrador && (
              <div className="flex gap-2">
                <botón
                  Nombre de clase="px-3 py-1.5 redondeado-xl texto-pequeño fondo-índigo-600 texto-blanco"
                  al hacer clic={() => {
                    const nombre = Prompt("Nombre de la carrera");
                    si (!nombre) retorna;
                    const imagen = Prompt("URL de imagen", "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?w=1600&q=80&auto=format&fit=crop") || "";
                    establecerDatos({
                      ...datos,
                      carreras: [
                        ...datos.carreras,
                        {
                          identificación: uid(),
                          nombre,
                          color: "del índigo 500 al cielo 500",
                          descripcionHtml: "<p>Descripción de la carrera…</p>",
                          materiasHtml: "<ul><li>Materia 1</li><li>Materia 2</li></ul>",
                          imagen,
                        },
                      ],
                    });
                  }}
                >
                  Agregar carrera
                </botón>
                <button className="px-3 py-1.5 redondeado-xl texto-sm borde borde-gris-300" onClick={() => setRoute("inicio")}>
                  Ir a Inicio
                </botón>
              </div>
            )
          }
        >
          <CarrerasGrid carreras={data.carreras} onOpen={(id) => setDetalleId(id)} />
          {carreraactual && (
            <Detalles de la carrera
              carrera={carreraactual}
              administrador={admin}
              al cerrar={() => setDetalleId(null)}
              onSave={(borrador) => {
                setData({ ...data, carreras: data.carreras.map((c) => (c.id === draft.id ? draft : c)) });
                alert("Cambios guardados");
              }}
              al eliminar={(id) => {
                if (!confirm("¿Eliminar la carrera?")) return;
                setDetalleId(nulo);
                setData({ ...data, carreras: data.carreras.filter((c) => c.id !== id) });
              }}
            />
          )}
        </Sección>
      )}

      {/*NOTICIAS*/}
      {ruta === "noticias" && (
        <Section title="Noticias" subtitle="Novedades institucionales">
          <Editor de artículos
            items={datos.noticias}
            administrador={admin}
            título="Noticias"
            onAdd={(n) => setData({ ...datos, noticias: [n, ...datos.noticias] })}
            onUpdate={(n) => setData({ ...data, noticias: data.noticias.map((x) => (x.id === n.id ? n : x)) })}
            onDelete={(id) => setData({ ...data, noticias: data.noticias.filter((x) => x.id !== id) })}
          />
        </Sección>
      )}

      {/*FORMACIÓN CONTINUA*/}
      {ruta === "formación" && (
        <Sección
          título="Formación continua"
          subtitle="Trayectos, cursos y post-títulos"
          acciones={
            administrador && (
              <AdminBar datos={datos} establecerDatos={establecerDatos} onRestore={() => establecerDatos(DATOS_POR_DEFECTO)} onShareUrl={() => {}} />
            )
          }
        >
          <Editor de artículos
            items={data.formacion}
            administrador={admin}
            título="Formación"
            onAdd={(n) => setData({ ...datos, formacion: [n, ...datos.formacion] })}
            onUpdate={(n) => setData({ ...data, formacion: data.formacion.map((x) => (x.id === n.id ? n : x)) })}
            onDelete={(id) => setData({ ...datos, formacion: data.formacion.filter((x) => x.id !== id) })}
          />
        </Sección>
      )}

      <ShareFab data={datos} />
      <Pie de página />
    </div>
  );
}
