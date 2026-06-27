// Lógica de Galaxia, YouTube Audio y 3D
let player;
let isVideoReady = false;
let globalControls = null; // Para poder pausarlos desde el modal
let deepEventState = 0; // 0=espera 10s, 1=asteroide gigante, 2=mensaje, 3=fin, -1=pausado
let deepEventTimer = 0;
let grandAsteroidGroup = null;
let grandAsteroidMesh = null;
let finaleState = 0; // 0=off, 1=init, 2=forming, 3=done
let finaleTimer = 0;
let finaleParticles = [];
let finaleLight = null; // Luz del gran corazón
let starsClickedCount = 0; // Para el toast

// Inicializar API de YouTube
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '0',
    width: '0',
    videoId: 'UPbTubQqv4g', // Entre tantas voces te senti
    playerVars: {
      'autoplay': 0,
      'controls': 0,
      'showinfo': 0,
      'rel': 0,
      'loop': 1,
      'playlist': 'UPbTubQqv4g', // Requerido para loop
      'origin': window.location.origin
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerStateChange(event) {
  // YT.PlayerState.ENDED = 0
  if (event.data === 0) {
    player.playVideo(); // Forzar bucle siempre
  }
}

function onPlayerReady(event) {
  isVideoReady = true;
}

document.addEventListener('DOMContentLoaded', () => {
  const startModal = document.getElementById('startModal');
  const startBtn = document.getElementById('startBtn');
  const photoModal = document.getElementById('photoModal');
  const closePhotoBtn = document.getElementById('closePhotoBtn');
  const photoViewer = document.getElementById('photoViewer');
  const photoMessage = document.getElementById('photoMessage');
  const err = document.getElementById('err');

  const galleryModal = document.getElementById('galleryModal');
  const closeGalleryBtn = document.getElementById('closeGalleryBtn');
  const viewGalleryBtn = document.getElementById('viewGalleryBtn');
  const galleryGrid = document.getElementById('galleryGrid');
  const grandFinaleBtn = document.getElementById('grandFinaleBtn');
  
  const romanticMessages = [
    "Daría mi propia vida por verte sonreír cada día. Eres lo más sagrado que tengo.",
    "No importa cuántos universos existan, en todos y cada uno de ellos yo te elegiría a ti, mi osita.",
    "Eres el refugio de mi alma y la dueña absoluta de mi corazón. Te amo más allá de las palabras.",
    "Desde que llegaste a mi vida, le diste luz a mis días más oscuros. Te amo con cada partícula de mi ser.",
    "Mi amor por ti trasciende el tiempo y el espacio; es eterno, puro e inquebrantable.",
    "No me alcanzan las palabras ni los años en este mundo para demostrarte todo lo que te amo.",
    "Tus ojos son mi galaxia favorita, y tu voz es la única melodía que calma mi vida entera.",
    "Prometo cuidarte, protegerte y amarte hasta mi último aliento, mi osita hermosa.",
    "Si volviera a nacer, ten por seguro que te buscaría más temprano para poder amarte más tiempo.",
    "Eres mi ángel en la tierra, la mujer por la que respiro y por quien doy absolutamente todo de mí.",
    "Mi hogar no es un lugar, mi verdadero y único hogar está justo entre tus brazos.",
    "Cada vez que te miro, confirmo que eres el milagro más hermoso que la vida me regaló.",
    "Quiero ser el motivo de tu sonrisa hoy y todos los días de tu vida. Feliz cumpleaños, mi amor.",
    "Me haces sentir vivo, me haces ser mejor. Todo lo que hago, lo hago pensando en ti.",
    "Aunque el universo entero colapse, mi amor por ti seguirá intacto y brillante.",
    "Eres el sueño del que nunca quiero despertar. Mi realidad a tu lado es perfecta.",
    "Si el amor tuviera forma, tendría tu rostro y llevaría tu nombre, mi dulce osita.",
    "Mi corazón late exclusivamente al ritmo de tu amor. Eres dueña de todos mis latidos.",
    "Amo cada detalle tuyo, tus virtudes y tus defectos. Para mí, eres la perfección absoluta.",
    "Contigo descubrí lo que realmente significa amar con el alma entera, sin reservas.",
    "Eres el sol que calienta mi mundo y la luna que ilumina mis noches más largas.",
    "Por ti cruzaría océanos y movería galaxias enteras, solo para verte feliz un segundo.",
    "No hay tesoro en esta vida que se compare con el inmenso valor de tenerte a mi lado.",
    "Te amo hoy más que ayer, y te aseguro que mañana te amaré mucho más que hoy.",
    "Mi vida comenzó a tener sentido exacto en el instante en que nuestros ojos se cruzaron.",
    "Eres la casualidad más hermosa, el destino más perfecto y la bendición más grande.",
    "Quiero caminar de tu mano hasta que seamos viejitos, amándonos como el primer día.",
    "En mi universo, tú eres el centro. Todo gira en torno al inmenso amor que te tengo.",
    "Gracias por existir, por ser tú, y por dejarme ser el hombre que cuide tu corazón.",
    "Te prometo un amor sincero, leal y profundo que te acompañará hasta la eternidad.",
    "Cuando entrelazamos nuestras manos, siento que sostengo el mundo entero.",
    "Me enamoro de ti cada mañana al despertar, como si fuera la primera vez.",
    "Eres la poesía más hermosa que el destino decidió escribir en el libro de mi vida.",
    "Tu sonrisa tiene el poder de curar cualquier tristeza en mi corazón.",
    "A tu lado, hasta el silencio es cómodo, porque nuestras almas saben hablar.",
    "No te amo por lo que eres, sino por lo que soy cuando estoy contigo.",
    "Has llenado mi existencia de un color que no sabía que existía.",
    "Tu amor es el faro que me guía a casa cuando me siento perdido en la oscuridad.",
    "Si pudiera darte una cosa en la vida, te daría la capacidad de verte a través de mis ojos.",
    "Amarte no fue una elección, fue lo más natural que le ha pasado a mi corazón.",
    "Eres la pieza que le faltaba a mi rompecabezas, mi complemento perfecto.",
    "El mejor lugar en el que he estado en toda mi vida es dentro de tus abrazos.",
    "Podría pasarme toda la eternidad contemplándote y nunca me cansaría.",
    "Tú eres la respuesta a todas mis oraciones, el milagro que tanto esperaba.",
    "Cada noche cuento las estrellas, pero ninguna brilla tanto como tú, mi vida.",
    "La vida es corta, pero a tu lado siento que estoy viviendo mil vidas maravillosas.",
    "Solo quiero hacerte feliz, porque tu felicidad es el oxígeno que respiro.",
    "Eres el latido extra que da mi corazón cuando algo me emociona de verdad.",
    "Te amo no solo por tu belleza exterior, sino por el alma tan preciosa que tienes.",
    "Tu amor me hace invencible, contigo a mi lado siento que puedo lograr cualquier cosa.",
    "No quiero un final feliz contigo, simplemente quiero una historia sin final.",
    "Eres mi primer pensamiento al despertar y el último antes de dormir.",
    "Mi lugar en el mundo está exactamente a tu lado, en ningún otro sitio más.",
    "Me bastó solo una sonrisa tuya para saber que quería el resto de mis sonrisas contigo.",
    "Si tu amor fuera un océano, yo sería el naufrago más feliz del mundo entero.",
    "Tú le das sentido a cada una de mis palabras y razón a cada uno de mis pasos.",
    "Si la vida me diera a elegir otra vez, sin dudarlo te volvería a elegir mil veces.",
    "La magia existe, y me di cuenta de ello en el momento en que me besaste.",
    "Mi corazón lleva tu nombre grabado a fuego y mi alma lleva la tuya como abrigo.",
    "Haces que los momentos ordinarios se conviertan en recuerdos extraordinarios.",
    "Te cuidaré como a la flor más delicada, pero te admiraré como a la guerrera más fuerte.",
    "No necesito el paraíso porque ya te encontré a ti, y tú eres todo mi paraíso.",
    "Si mi amor por ti fuera tiempo, te aseguro que serías la dueña de la eternidad.",
    "Caminar a tu lado es el viaje más hermoso que he emprendido en toda mi vida.",
    "Me haces tanta falta cuando no estás, que hasta el aire parece extrañarte.",
    "Solo basta escuchar tu voz para que todos mis miedos y angustias desaparezcan.",
    "Mi amor, eres el destello de luz que iluminó para siempre mi oscuro universo.",
    "Podrán pasar los años, pero mi mirada hacia ti siempre estará llena de ternura.",
    "Eres el 'para siempre' más seguro que he sentido en toda mi corta vida.",
    "Cuando te abrazo, siento que tengo el pedacito de cielo que me correspondía.",
    "Tú eres mi principio, mi medio y mi final. Mi todo absoluto y definitivo.",
    "Mi felicidad tiene nombre, apellido y una sonrisa que me vuelve loco.",
    "No hay invierno que enfríe mi corazón desde que tú decidiste ser mi primavera.",
    "Conocerte fue el golpe de suerte más espectacular que me dio el destino.",
    "Tengo la fortuna de amar a la persona más maravillosa que pisa esta tierra.",
    "Si el destino nos juntó, yo me encargaré de que ninguna fuerza nos separe jamás.",
    "El brillo de tus ojos ilumina mi camino mucho mejor que cualquier estrella.",
    "En el libro de mi vida, tú eres sin duda el capítulo más hermoso e importante.",
    "Tú y yo formamos el equipo perfecto, unidos por un hilo rojo irrompible.",
    "No hay distancia, tiempo ni adversidad que pueda disminuir lo mucho que te amo.",
    "Cada beso tuyo es como probar una pequeña fracción del mismísimo paraíso.",
    "Te elegí a ti, y te volveré a elegir cada día de mi vida sin pensarlo dos veces.",
    "Eres el refugio de paz que mi alma atormentada estuvo buscando por años.",
    "Gracias por enseñarme que el amor verdadero no duele, sino que sana y fortalece.",
    "Si mi corazón pudiera hablar, pronunciaría tu nombre en cada latido.",
    "Me encanta la forma en que iluminas la habitación solo con tu presencia.",
    "Tu amor es el regalo más inmenso que he recibido, y lo atesoraré por siempre.",
    "No hay paisaje en este mundo que supere la belleza de tenerte frente a mí.",
    "Amo la paz que me transmites y la pasión con la que llenas mi corazón.",
    "Has tejido con amor cada herida de mi alma, y ahora solo te pertenezco a ti.",
    "Junto a ti, incluso las tareas más simples se convierten en la mejor aventura.",
    "Si tuviera que vivir mi vida de nuevo, te juro que te encontraría mucho antes.",
    "Mi amor por ti crece cada segundo, expandiéndose sin límite como este universo.",
    "Tu nombre es mi palabra favorita, la oración que calma todos mis tormentos.",
    "Nunca dudes del amor que te tengo, porque nací destinado a estar a tu lado.",
    "Eres la dueña de mis madrugadas, de mis pensamientos y de mis mejores sueños.",
    "Tú eres la obra de arte más hermosa que el universo se ha atrevido a crear.",
    "Nada en este mundo podrá igualar jamás la pureza y la inmensidad de este amor.",
    "Soy el hombre más afortunado del universo por poder llamarte 'mi amor'.",
    "Te amo hoy, te amaré mañana, te amaré a los 80 años y te amaré en la otra vida."
  ];
  
  function showError(msg){ 
    err.textContent = msg; 
    err.style.display = 'block'; 
  }

  // Lista de imágenes locales (las 100 de la carpeta img)
  const imgFiles = [
    "WhatsApp Image 2026-02-05 at 7.45.25 PM (1).jpeg", "WhatsApp Image 2026-02-05 at 7.45.25 PM.jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.26 PM (1).jpeg", "WhatsApp Image 2026-02-05 at 7.45.26 PM (2).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.26 PM (3).jpeg", "WhatsApp Image 2026-02-05 at 7.45.26 PM (4).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.26 PM (5).jpeg", "WhatsApp Image 2026-02-05 at 7.45.26 PM (6).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.26 PM.jpeg", "WhatsApp Image 2026-02-05 at 7.45.27 PM (1).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.27 PM (2).jpeg", "WhatsApp Image 2026-02-05 at 7.45.27 PM (3).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.27 PM (4).jpeg", "WhatsApp Image 2026-02-05 at 7.45.27 PM (5).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.27 PM.jpeg", "WhatsApp Image 2026-02-05 at 7.45.28 PM (1).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.28 PM (2).jpeg", "WhatsApp Image 2026-02-05 at 7.45.28 PM (3).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.28 PM (4).jpeg", "WhatsApp Image 2026-02-05 at 7.45.28 PM (5).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.28 PM (6).jpeg", "WhatsApp Image 2026-02-05 at 7.45.28 PM.jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.29 PM (1).jpeg", "WhatsApp Image 2026-02-05 at 7.45.29 PM (2).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.29 PM (3).jpeg", "WhatsApp Image 2026-02-05 at 7.45.29 PM (4).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.29 PM (5).jpeg", "WhatsApp Image 2026-02-05 at 7.45.29 PM.jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.30 PM (1).jpeg", "WhatsApp Image 2026-02-05 at 7.45.30 PM (2).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.30 PM (3).jpeg", "WhatsApp Image 2026-02-05 at 7.45.30 PM (4).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.30 PM.jpeg", "WhatsApp Image 2026-02-05 at 7.45.31 PM (1).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.31 PM (2).jpeg", "WhatsApp Image 2026-02-05 at 7.45.31 PM (3).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.31 PM (4).jpeg", "WhatsApp Image 2026-02-05 at 7.45.31 PM (5).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.31 PM.jpeg", "WhatsApp Image 2026-02-05 at 7.45.32 PM (1).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.32 PM (2).jpeg", "WhatsApp Image 2026-02-05 at 7.45.32 PM (3).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.32 PM (4).jpeg", "WhatsApp Image 2026-02-05 at 7.45.32 PM (5).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.32 PM.jpeg", "WhatsApp Image 2026-02-05 at 7.45.33 PM (1).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.33 PM (2).jpeg", "WhatsApp Image 2026-02-05 at 7.45.33 PM (3).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.33 PM (4).jpeg", "WhatsApp Image 2026-02-05 at 7.45.33 PM.jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.34 PM.jpeg", "WhatsApp Image 2026-02-05 at 7.45.35 PM (1).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.35 PM (2).jpeg", "WhatsApp Image 2026-02-05 at 7.45.35 PM (3).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.35 PM (4).jpeg", "WhatsApp Image 2026-02-05 at 7.45.35 PM.jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.36 PM (1).jpeg", "WhatsApp Image 2026-02-05 at 7.45.36 PM (2).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.36 PM (3).jpeg", "WhatsApp Image 2026-02-05 at 7.45.36 PM (4).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.36 PM.jpeg", "WhatsApp Image 2026-02-05 at 7.45.37 PM (1).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.37 PM (2).jpeg", "WhatsApp Image 2026-02-05 at 7.45.37 PM (3).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.37 PM.jpeg", "WhatsApp Image 2026-02-05 at 7.45.38 PM (1).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.38 PM (2).jpeg", "WhatsApp Image 2026-02-05 at 7.45.38 PM (3).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.38 PM (4).jpeg", "WhatsApp Image 2026-02-05 at 7.45.38 PM.jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.39 PM (1).jpeg", "WhatsApp Image 2026-02-05 at 7.45.39 PM (2).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.39 PM (3).jpeg", "WhatsApp Image 2026-02-05 at 7.45.39 PM (4).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.39 PM.jpeg", "WhatsApp Image 2026-02-05 at 7.45.40 PM (1).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.40 PM (2).jpeg", "WhatsApp Image 2026-02-05 at 7.45.40 PM (3).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.40 PM (4).jpeg", "WhatsApp Image 2026-02-05 at 7.45.40 PM.jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.41 PM (1).jpeg", "WhatsApp Image 2026-02-05 at 7.45.41 PM (2).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.41 PM.jpeg", "WhatsApp Image 2026-02-05 at 7.45.42 PM (1).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.42 PM (2).jpeg", "WhatsApp Image 2026-02-05 at 7.45.42 PM (3).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.42 PM (4).jpeg", "WhatsApp Image 2026-02-05 at 7.45.42 PM (5).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.42 PM (6).jpeg", "WhatsApp Image 2026-02-05 at 7.45.42 PM (7).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.42 PM.jpeg", "WhatsApp Image 2026-02-05 at 7.45.43 PM (1).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.43 PM (2).jpeg", "WhatsApp Image 2026-02-05 at 7.45.43 PM (3).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.43 PM (4).jpeg", "WhatsApp Image 2026-02-05 at 7.45.43 PM (5).jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.43 PM (6).jpeg", "WhatsApp Image 2026-02-05 at 7.45.43 PM.jpeg",
    "WhatsApp Image 2026-02-05 at 7.45.44 PM (1).jpeg", "WhatsApp Image 2026-02-05 at 7.45.44 PM.jpeg"
  ];

  // Variable para controlar si la música ya inició
  let musicStarted = false;

  function forcePlayMusic() {
    if (musicStarted) return;
    if (isVideoReady && player && player.playVideo) {
      player.unMute();
      player.setVolume(70);
      player.playVideo();
      // Asumimos que funcionó, si el navegador lo bloquea, el próximo tap lo volverá a intentar
      musicStarted = true;
    }
  }

  // Escuchar cualquier interacción en toda la página para forzar el audio (hack para iPhone/Android)
  document.addEventListener('click', forcePlayMusic);
  document.addEventListener('touchstart', forcePlayMusic, {passive: true});

  startBtn.addEventListener('click', () => {
    // Intentar poner en pantalla completa
    const docEl = document.documentElement;
    if (docEl.requestFullscreen) {
      docEl.requestFullscreen().catch(() => {});
    } else if (docEl.webkitRequestFullscreen) {
      docEl.webkitRequestFullscreen().catch(() => {});
    }

    // Esconder modal suavemente con nueva animación
    startModal.classList.add('fade-out');
    setTimeout(() => { startModal.style.display = 'none'; }, 1200);
    
    // Forzar la música inmediatamente en este clic explícito
    forcePlayMusic();
    
    // Si YouTube no había cargado aún, lo intentamos periódicamente 
    // (el usuario tendrá que hacer otro tap en móviles si esto pasa, pero en PC funciona)
    if (!musicStarted) {
      let interval = setInterval(() => {
        if(isVideoReady && player && player.playVideo) {
          player.unMute();
          player.setVolume(70);
          player.playVideo();
          musicStarted = true;
          clearInterval(interval);
        }
      }, 500);
    }
    
    runGalaxy({ cinematic: true });
  });

  closePhotoBtn.addEventListener('click', () => {
    photoModal.classList.remove('active');
    setTimeout(() => { photoViewer.src = ''; }, 500);
    if(globalControls) globalControls.enabled = true; // Rehabilitar zoom/giro
  });

  viewGalleryBtn.addEventListener('click', () => {
    galleryModal.classList.add('active');
    if(galleryGrid.children.length === 0) {
      imgFiles.forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = `img/${file}`;
        img.loading = 'lazy';
        
        const text = document.createElement('p');
        text.textContent = romanticMessages[index % romanticMessages.length];
        
        item.appendChild(img);
        item.appendChild(text);
        galleryGrid.appendChild(item);
      });
      // Mostrar el botón oculto grandioso al final
      setTimeout(() => {
        grandFinaleBtn.style.display = 'block';
      }, 1000);
    }
  });

  closeGalleryBtn.addEventListener('click', () => {
    galleryModal.classList.remove('active');
  });

  grandFinaleBtn.addEventListener('click', () => {
    galleryModal.classList.remove('active');
    photoModal.classList.remove('active'); // Ocultar también la foto individual si estaba abierta
    setTimeout(() => { photoViewer.src = ''; }, 500); // Limpiar imagen para que no quede pegada
    
    finaleState = 1;
    finaleTimer = 0;
    deepEventState = -1; // Detener cualquier otra animación (asteroide)
    if(grandAsteroidGroup) grandAsteroidGroup.visible = false;
    
    if(globalControls) globalControls.enabled = false;
  });

  // ====== WEBGL CHECK ======
  try { 
    const test = document.createElement('canvas').getContext('webgl') || document.createElement('canvas').getContext('experimental-webgl');
    if(!test) throw new Error('Tu navegador no tiene WebGL activo');
  } catch(e) { 
    showError('WebGL parece desactivado. Usa un navegador moderno.'); 
    return; 
  }

  function runGalaxy(opts={}) {
    const canvas = document.getElementById('galaxy-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    // Fondo azul oscuro profundo
    renderer.setClearColor(new THREE.Color('#03071e'), 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 15000);
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.05;
    controls.minDistance = 15; controls.maxDistance = 1500;
    globalControls = controls;
    
    // ====== POST-PROCESSING (HIPERREALISMO) ======
    const renderScene = new THREE.RenderPass(scene, camera);
    const bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0.05;
    bloomPass.strength = 1.2;
    bloomPass.radius = 0.5;

    const composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
    
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let interactiveStars = [];

    // ====== ANIMACIÓN CINEMATOGRÁFICA (5 SEGUNDOS EXACTOS) ======
    let cinematicState = opts.cinematic ? 0 : null;
    let cinematicStart = null;
    let duration1 = 2.0; // Zoom rápido
    let duration2 = 1.5; // Giro majestuoso
    let duration3 = 1.5; // Acomodo final
    let totalCine = duration1 + duration2 + duration3; // = 5.0s

    function setCam(){
      const isMobile = window.innerWidth < 768;
      camera.fov = isMobile ? 80 : 70;
      camera.position.set(0, isMobile? 30 : 25, isMobile? 120 : 80);
      camera.updateProjectionMatrix(); controls.update();
    }
    setCam();

    const radius = 12;

    const textureLoader = new THREE.TextureLoader();
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    // ====== LA TIERRA (NÚCLEO) ======
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);
    
    const earthColor = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');
    earthColor.anisotropy = maxAnisotropy;
    const earthNormal = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg');
    const earthSpec = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg');
    const cloudsTex = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png');
    cloudsTex.anisotropy = maxAnisotropy;

    const earthMat = new THREE.MeshStandardMaterial({
      map: earthColor,
      normalMap: earthNormal,
      roughnessMap: earthSpec,
      roughness: 0.6,
      metalness: 0.3
    });
    const earthMesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 64, 64), earthMat);
    earthGroup.add(earthMesh);

    const cloudMat = new THREE.MeshPhongMaterial({
      map: cloudsTex,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const cloudMesh = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.02, 64, 64), cloudMat);
    earthGroup.add(cloudMesh);

    // Luces
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5); // Luz base suave
    scene.add(ambientLight);
    
    const earthLight = new THREE.DirectionalLight(0xffffff, 2);
    earthLight.position.set(50, 20, 30);
    scene.add(earthLight);
    
    const pinkLight = new THREE.PointLight(0xd9b3ff, 1.5, 200);
    pinkLight.position.set(-50, -20, -30);
    scene.add(pinkLight);

    // Fondo de estrellas lejanas (Cielo Profundo)
    const bgStarsGeo = new THREE.BufferGeometry();
    const bgStarsCount = 15000;
    const bgStarsPos = new Float32Array(bgStarsCount * 3);
    const bgStarsCol = new Float32Array(bgStarsCount * 3);
    for(let i=0; i<bgStarsCount; i++) {
      const r = 800 + Math.random() * 1200;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      bgStarsPos[i*3] = r * Math.sin(phi) * Math.cos(theta);
      bgStarsPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      bgStarsPos[i*3+2] = r * Math.cos(phi);
      
      // Tonos azulados y blancos
      const c = new THREE.Color().setHSL(0.6 + Math.random()*0.1, 0.8, 0.6 + Math.random()*0.4);
      bgStarsCol[i*3] = c.r; bgStarsCol[i*3+1] = c.g; bgStarsCol[i*3+2] = c.b;
    }
    bgStarsGeo.setAttribute('position', new THREE.BufferAttribute(bgStarsPos, 3));
    bgStarsGeo.setAttribute('color', new THREE.BufferAttribute(bgStarsCol, 3));
    const bgStarsMat = new THREE.PointsMaterial({ size: 1.5, vertexColors: true, transparent: true, opacity: 0.8 });
    const bgStars = new THREE.Points(bgStarsGeo, bgStarsMat);
    scene.add(bgStars);

    // ====== OBJETOS CELESTES LEJANOS ======
    const distantObjects = new THREE.Group();
    scene.add(distantObjects);

    // 1. EL SOL (A un lado)
    const sunGroup = new THREE.Group();
    sunGroup.position.set(3000, 500, 0); // Lejos en el eje X positivo
    distantObjects.add(sunGroup);
    
    const sunRadius = 150;
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffddaa });
    const sunMesh = new THREE.Mesh(new THREE.SphereGeometry(sunRadius, 64, 64), sunMat);
    sunGroup.add(sunMesh);
    
    // Brillo del sol
    const canvasSun = document.createElement('canvas');
    canvasSun.width = 128; canvasSun.height = 128;
    const ctxSun = canvasSun.getContext('2d');
    const gradSun = ctxSun.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradSun.addColorStop(0, 'rgba(255, 221, 170, 1)');
    gradSun.addColorStop(0.2, 'rgba(255, 170, 50, 0.8)');
    gradSun.addColorStop(0.5, 'rgba(200, 50, 0, 0.4)');
    gradSun.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctxSun.fillStyle = gradSun;
    ctxSun.fillRect(0, 0, 128, 128);
    
    const sunGlowMat = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvasSun), color: 0xffddaa, transparent: true, blending: THREE.AdditiveBlending });
    const sunGlow = new THREE.Sprite(sunGlowMat);
    sunGlow.scale.set(600, 600, 1);
    sunGroup.add(sunGlow);

    // Luz del sol lejano
    const distantSunLight = new THREE.PointLight(0xffddaa, 3, 10000);
    sunGroup.add(distantSunLight);

    // 2. LA LUNA (En el lado opuesto)
    const moonGroup = new THREE.Group();
    moonGroup.position.set(-3000, -500, 0); // Lejos en el eje X negativo (opuesto al sol)
    distantObjects.add(moonGroup);
    
    const moonRadius = 50;
    const moonTex = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg');
    moonTex.anisotropy = maxAnisotropy;
    const moonMat = new THREE.MeshPhongMaterial({ map: moonTex, bumpMap: moonTex, bumpScale: 0.5, color: 0xcccccc });
    const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(moonRadius, 32, 32), moonMat);
    moonGroup.add(moonMesh);

    // 3. PLANETAS REGADOS
    const planetData = [
      { name: 'Mercury', color: 0x888888, size: radius * 1.5, dist: 2500, speed: 0.04 },
      { name: 'Venus', color: 0xe3bb76, size: radius * 2.5, dist: 2800, speed: 0.015 },
      { name: 'Mars', color: 0xc1440e, size: radius * 2, dist: 3100, speed: 0.008 },
      { name: 'Jupiter', color: 0xd39c7e, size: radius * 8, dist: 3500, speed: 0.002 },
      { name: 'Saturn', color: 0xead6b8, size: radius * 6, dist: 3800, speed: 0.0009, ring: true },
      { name: 'Uranus', color: 0x88ccff, size: radius * 4, dist: 4100, speed: 0.0004 },
      { name: 'Neptune', color: 0x274687, size: radius * 4, dist: 4400, speed: 0.0001 }
    ];
    
    const planetObjects = [];
    planetData.forEach(p => {
      const pGroup = new THREE.Group();
      const pMat = new THREE.MeshPhongMaterial({ color: p.color });
      const pMesh = new THREE.Mesh(new THREE.SphereGeometry(p.size, 32, 32), pMat);
      pGroup.add(pMesh);
      if(p.ring) {
        const rMat = new THREE.MeshBasicMaterial({ color: 0xcfae7f, transparent: true, opacity: 0.6, side: THREE.DoubleSide });
        const ring = new THREE.Mesh(new THREE.RingGeometry(p.size * 1.5, p.size * 2.5, 64), rMat);
        ring.rotation.x = Math.PI / 2 + 0.3;
        pGroup.add(ring);
      }
      
      // Regarlos en ángulos aleatorios y alturas diferentes alrededor del origen
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 1500;
      pGroup.position.set(Math.cos(angle)*p.dist, height, Math.sin(angle)*p.dist);
      pGroup.userData = { speed: p.speed };
      distantObjects.add(pGroup);
      planetObjects.push(pGroup);
    });
    
    // Galaxias lejanas (nebulosas espirales reales)
    const distantGalaxies = new THREE.Group();
    const galaxyTex1 = textureLoader.load('https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Andromeda_Galaxy_560mm_FL.jpg/1024px-Andromeda_Galaxy_560mm_FL.jpg');
    galaxyTex1.anisotropy = maxAnisotropy;
    const galaxyTex2 = textureLoader.load('https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/NGC_4414_%28NASA-med%29.jpg/1024px-NGC_4414_%28NASA-med%29.jpg');
    galaxyTex2.anisotropy = maxAnisotropy;
    
    for(let g=0; g<45; g++) { // Más galaxias a lo lejos
      const tex = Math.random() > 0.5 ? galaxyTex1 : galaxyTex2;
      const gMat = new THREE.SpriteMaterial({ map: tex, color: new THREE.Color().setHSL(Math.random(), 0.6, 0.5), transparent: true, opacity: 0.7 + Math.random()*0.3, blending: THREE.AdditiveBlending });
      const sprite = new THREE.Sprite(gMat);
      
      const dist = 3000 + Math.random()*3000; // Más lejos (en el vacío)
      const angle = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      sprite.position.set(dist * Math.sin(phi) * Math.cos(angle), dist * Math.sin(phi) * Math.sin(angle), dist * Math.cos(phi));
      
      const size = 600 + Math.random()*800; // Más grandes
      sprite.scale.set(size, size * 0.6, 1); // Espirales ovaladas
      distantGalaxies.add(sprite);
    }
    scene.add(distantGalaxies);



    // ====== ASTEROIDES Y EL ESCUDO INVISIBLE ======
    const asteroides = [];
    const shieldImpacts = [];
    const shieldRadius = 80;
    
    const astMat = new THREE.MeshPhongMaterial({ color: 0x555555, flatShading: true });
    
    const canvasP = document.createElement('canvas'); canvasP.width = 64; canvasP.height = 64;
    const ctxP = canvasP.getContext('2d');
    const gradP = ctxP.createRadialGradient(32,32,0, 32,32,32);
    gradP.addColorStop(0, 'rgba(255,255,255,1)');
    gradP.addColorStop(0.3, 'rgba(255,255,255,0.8)');
    gradP.addColorStop(1, 'rgba(255,255,255,0)');
    ctxP.fillStyle = gradP; ctxP.fillRect(0,0,64,64);
    const whiteParticleMat = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvasP), color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending });
    
    function spawnAsteroid() {
      const size = 1.5 + Math.random() * 2.5;
      const astGeo = new THREE.DodecahedronGeometry(size, 0);
      
      // Deformar un poco el asteroide
      const pos = astGeo.attributes.position.array;
      for(let i=0; i<pos.length; i+=3) {
        pos[i] += (Math.random()-0.5)*0.5;
        pos[i+1] += (Math.random()-0.5)*0.5;
        pos[i+2] += (Math.random()-0.5)*0.5;
      }
      astGeo.computeVertexNormals();
      
      const ast = new THREE.Mesh(astGeo, astMat);
      
      // Aparecer en la lejanía
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 100;
      const dist = 400 + Math.random() * 200;
      ast.position.set(Math.cos(angle)*dist, height, Math.sin(angle)*dist);
      
      // Trayectoria recta perfecta hacia el centro
      const speed = 1.5 + Math.random(); // Rápidos
      const dir = new THREE.Vector3(0,0,0).sub(ast.position).normalize();
      ast.userData.velocity = dir.multiplyScalar(speed);
      
      ast.userData.rotX = (Math.random()-0.5)*0.1;
      ast.userData.rotY = (Math.random()-0.5)*0.1;
      
      scene.add(ast);
      asteroides.push(ast);
    }
    
    setInterval(() => {
      if(deepEventState === 3 && asteroides.length < 4 && Math.random() > 0.4) spawnAsteroid();
    }, 3000);

    // Textura de impacto de escudo
    function createShieldImpactTexture() {
      const c = document.createElement('canvas'); c.width = 128; c.height = 128;
      const ctx = c.getContext('2d');
      const grad = ctx.createRadialGradient(64,64,0, 64,64,64);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.2, 'rgba(150,200,255,0.8)');
      grad.addColorStop(0.8, 'rgba(50,100,255,0.2)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad; ctx.fillRect(0,0,128,128);
      
      // Hexágonos
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for(let i=0; i<6; i++) {
        ctx.lineTo(64 + 40*Math.cos(i*Math.PI/3), 64 + 40*Math.sin(i*Math.PI/3));
      }
      ctx.closePath();
      ctx.stroke();
      
      return new THREE.CanvasTexture(c);
    }
    const impactTex = createShieldImpactTexture();
    const impactMat = new THREE.MeshBasicMaterial({ map: impactTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });

    // ====== ESTRELLAS DE LA GALAXIA ======
    const galaxy = new THREE.Group(); 
    scene.add(galaxy);

    const starCount = 10000;
    const gGeo = new THREE.BufferGeometry();
    const gPos = new Float32Array(starCount * 3);
    const gCol = new Float32Array(starCount * 3);
    const galRadius = 100;
    
    for(let i=0; i<starCount; i++){ 
      const ang = Math.random() * Math.PI * 2; 
      const dist = Math.random() * galRadius * 1.5;
      // Forma de platillo: Eje Y muy aplastado
      const y = (Math.random() - 0.5) * 4 * Math.pow(1 - Math.min(dist, galRadius) / galRadius, 2);
      gPos[i*3] = Math.cos(ang) * dist; 
      gPos[i*3+1] = y; 
      gPos[i*3+2] = Math.sin(ang) * dist; 
      
      const c = new THREE.Color().setHSL(0.58 + Math.random()*0.15, 0.8, 0.6 + Math.random()*0.4);
      gCol[i*3] = c.r; gCol[i*3+1] = c.g; gCol[i*3+2] = c.b;
    }
    gGeo.setAttribute('position', new THREE.BufferAttribute(gPos, 3));
    gGeo.setAttribute('color', new THREE.BufferAttribute(gCol, 3));
    const gMat = new THREE.PointsMaterial({ size: 0.3, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    galaxy.add(new THREE.Points(gGeo, gMat));

    // ====== FOTOS COMO ESTRELLAS BRILLANTES ======
    // Crearemos texturas de brillo
    function createGlowTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 64; canvas.height = 64;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.2, 'rgba(230, 200, 255, 0.8)');
      grad.addColorStop(0.5, 'rgba(150, 100, 255, 0.2)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(canvas);
    }
    
    const glowTex = createGlowTexture();
    const arms = 4;
    
    imgFiles.forEach((file, index) => {
      // Distribuir a lo largo de los brazos de la galaxia
      const perArm = imgFiles.length / arms; 
      const armIndex = Math.floor(index / perArm);
      const prog = (index % perArm) / perArm;
      
      const armAng = armIndex * (Math.PI * 2 / arms);
      const ang = armAng + prog * Math.PI * 1.5; // Curvatura
      
      const minDist = radius * 2.5;
      const maxDist = radius * 6.5;
      const dist = minDist + (maxDist - minDist) * prog;
      
      const y = (Math.random() - 0.5) * 15;
      
      const starMat = new THREE.SpriteMaterial({ 
        map: glowTex, 
        color: 0xffe6ff, 
        transparent: true, 
        blending: THREE.AdditiveBlending 
      });
      
      const star = new THREE.Sprite(starMat);
      star.position.set(Math.cos(ang)*dist, y, Math.sin(ang)*dist);
      star.scale.set(4, 4, 1);
      // Guardar el path de la imagen y mensaje
      const randomMsg = romanticMessages[Math.floor(Math.random() * romanticMessages.length)];
      star.userData = { isPhotoStar: true, src: `img/${file}`, message: randomMsg };
      
      // Animación de parpadeo
      star.userData.pulsePhase = Math.random() * Math.PI * 2;
      star.userData.pulseSpeed = 1 + Math.random() * 2;
      
      interactiveStars.push(star);
      galaxy.add(star);
    });

    // Frases flotando (minimalistas)
    const phrases = ["Osita", "Mi osita hermosa", "Felices 21 ✨", "Mi universo", "Mi Paz", "Te Amo Infinitamente ♾️"];
    function makeTextTexture(text) {
      const c = document.createElement('canvas'); c.width = 512; c.height = 128;
      const g = c.getContext('2d');
      g.font = '600 36px Outfit, sans-serif';
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillStyle = 'rgba(255, 255, 255, 0.8)';
      g.shadowColor = 'rgba(194, 161, 255, 0.8)'; g.shadowBlur = 10;
      g.fillText(text, 256, 64);
      return new THREE.CanvasTexture(c);
    }
    phrases.forEach((ph, i) => {
      const tex = makeTextTexture(ph);
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
      const spr = new THREE.Sprite(mat);
      const angle = (i / phrases.length) * Math.PI * 2;
      const dist = radius * 3.5;
      spr.position.set(Math.cos(angle)*dist, (Math.random()-0.5)*10, Math.sin(angle)*dist);
      spr.scale.set(16, 4, 1);
      galaxy.add(spr);
    });

    // ====== EVENTOS DE INTERACCIÓN ======
    function onPointerDown(event) {
      if(cinematicState !== null || finaleState !== 0) return; // No interacciones durante intro o final
      
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      const intersectables = [...interactiveStars, earthMesh];
      const intersects = raycaster.intersectObjects(intersectables);
      
      if (intersects.length > 0) {
        const obj = intersects[0].object;
        if(obj === earthMesh) {
          photoViewer.src = "WhatsApp Image 2026-06-20 at 3.49.58 PM.jpeg";
          photoMessage.textContent = "Nuestro hermoso mundo juntos 🌍💖";
          viewGalleryBtn.style.display = "inline-block";
          photoModal.classList.add('active');
          if(globalControls) globalControls.enabled = false;
        } else if(obj.userData && obj.userData.isPhotoStar) {
          photoViewer.src = obj.userData.src;
          photoMessage.textContent = obj.userData.message;
          viewGalleryBtn.style.display = "none";
          photoModal.classList.add('active');
          if(globalControls) globalControls.enabled = false; // Deshabilitar zoom
          
          // Lógica de contador de clics para mostrar mensaje rápido
          starsClickedCount++;
          if(starsClickedCount % 3 === 0) {
            const toast = document.getElementById('toastMsg');
            toast.textContent = "Toca el universo que está en medio de nuestra galaxia 🌍";
            toast.classList.add('show');
            setTimeout(() => { toast.classList.remove('show'); }, 6000);
          }
        }
      }
    }
    window.addEventListener('pointerdown', onPointerDown);
    
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    });

    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
        
        // Solicitar pantalla completa al girar a horizontal
        if (window.orientation === 90 || window.orientation === -90) {
          const docEl = document.documentElement;
          if (docEl.requestFullscreen) docEl.requestFullscreen().catch(()=>{});
          else if (docEl.webkitRequestFullscreen) docEl.webkitRequestFullscreen().catch(()=>{});
        }
      }, 200);
    });

    // ====== ESTRELLAS FUGACES ======
    const shootingStarsArray = [];
    let meteorShowerTimer = 0;
    let isMeteorShower = false;

    function spawnShootingStar() {
      const r = 3500 + Math.random() * 4000; // Muy lejos en el fondo absoluto
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const startPos = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );

      // Dirección siempre tangencial para que NUNCA crucen cerca del centro de la galaxia
      const dir = startPos.clone().cross(new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5)).normalize();
      
      const geo = new THREE.CylinderGeometry(5, 15, 1000 + Math.random()*1500, 4); // Más grandes para verse desde lejos
      geo.translate(0, 500, 0);
      geo.rotateX(Math.PI / 2);
      
      const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1.0, blending: THREE.AdditiveBlending });
      const star = new THREE.Mesh(geo, mat);
      star.position.copy(startPos);
      star.lookAt(startPos.clone().add(dir));
      
      star.userData.velocity = dir.multiplyScalar(200 + Math.random()*250); // Muy rápidas para compensar la distancia
      star.userData.life = 1.0;
      star.userData.decay = 0.01 + Math.random() * 0.02;
      
      scene.add(star);
      shootingStarsArray.push(star);
    }

    // ====== RENDER LOOP ======
    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const t = clock.getElapsedTime();
      
      // Animación cinematográfica
      if (cinematicState !== null) {
        if (cinematicStart === null) cinematicStart = t;
        const elapsed = t - cinematicStart;
        
        // Easing function (smoothstep)
        const smooth = (x) => x * x * (3 - 2 * x);

        if (elapsed < duration1) {
          // Zoom In
          const p = smooth(elapsed / duration1);
          camera.position.lerpVectors(new THREE.Vector3(0, 0, 400), new THREE.Vector3(0, 30, 80), p);
          camera.lookAt(0,0,0);
          controls.enabled = false;
        } else if (elapsed < duration1 + duration2) {
          // Orbit majestic
          const p = smooth((elapsed - duration1) / duration2);
          const a = Math.PI/2 + p * Math.PI * 1.5;
          camera.position.set(Math.cos(a)*80, 30 - 10*p, Math.sin(a)*80);
          camera.lookAt(0,0,0);
        } else if (elapsed < totalCine) {
          // Acomodo final hacia la posición estándar
          const p = smooth((elapsed - duration1 - duration2) / duration3);
          const startA = Math.PI/2 + Math.PI * 1.5;
          const targetDist = window.innerWidth < 768 ? 120 : 80;
          const targetY = window.innerWidth < 768 ? 30 : 25;
          
          const dist = 80 + (targetDist - 80) * p;
          camera.position.set(Math.cos(startA)*dist, 20 + (targetY - 20)*p, Math.sin(startA)*dist);
          camera.lookAt(0,0,0);
        } else {
          if(!photoModal.classList.contains('active')) controls.enabled = true;
          cinematicState = null;
        }
      }
      
      if (cinematicState === null) {
        // === CINEMÁTICA PROFUNDA (ASTEROIDE GIGANTE) ===
        if (deepEventState === 0) {
          deepEventTimer += dt;
          if (deepEventTimer > 10) {
            deepEventState = 1;
            // Guardar cámara para restaurar después
            camera.userData.oldPos = camera.position.clone();
            if(globalControls) camera.userData.oldTarget = globalControls.target.clone();
            
            // Generar el GRAN asteroide realista
            grandAsteroidGroup = new THREE.Group();
            grandAsteroidGroup.position.set(250, 150, 350); // Diagonal dramática
            grandAsteroidGroup.lookAt(0,0,0);
            
            const astGeo = new THREE.IcosahedronGeometry(12, 4);
            const posAttr = astGeo.attributes.position;
            for(let i=0; i<posAttr.count; i++) {
              posAttr.setX(i, posAttr.getX(i) + (Math.random()-0.5)*4.0);
              posAttr.setY(i, posAttr.getY(i) + (Math.random()-0.5)*4.0);
              posAttr.setZ(i, posAttr.getZ(i) + (Math.random()-0.5)*4.0);
            }
            astGeo.computeVertexNormals();
            
            const rockTex = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg');
            rockTex.anisotropy = maxAnisotropy;
            const rockMat = new THREE.MeshStandardMaterial({ map: rockTex, bumpMap: rockTex, bumpScale: 2.0, color: 0x888888, roughness: 1.0, metalness: 0.2 });
            grandAsteroidMesh = new THREE.Mesh(astGeo, rockMat);
            grandAsteroidGroup.add(grandAsteroidMesh);
            
            // FUEGO DEL ASTEROIDE GIGANTE
            const gFireGeo = new THREE.BufferGeometry();
            const gFirePos = new Float32Array(500 * 3);
            const gFireCol = new Float32Array(500 * 3);
            for(let i=0; i<500; i++) {
              gFirePos[i*3] = (Math.random()-0.5)*15;
              gFirePos[i*3+1] = (Math.random()-0.5)*15;
              gFirePos[i*3+2] = -Math.random()*40; // Estela hacia atrás (-Z)
              
              const color = new THREE.Color();
              if(Math.random() > 0.5) color.setHex(0xff3300); // Rojo
              else if(Math.random() > 0.5) color.setHex(0xffaa00); // Naranja
              else color.setHex(0xffff00); // Amarillo
              
              gFireCol[i*3] = color.r; gFireCol[i*3+1] = color.g; gFireCol[i*3+2] = color.b;
            }
            gFireGeo.setAttribute('position', new THREE.BufferAttribute(gFirePos, 3));
            gFireGeo.setAttribute('color', new THREE.BufferAttribute(gFireCol, 3));
            const gFireMat = new THREE.PointsMaterial({ size: 2.5, vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
            const gFire = new THREE.Points(gFireGeo, gFireMat);
            grandAsteroidGroup.add(gFire);
            grandAsteroidGroup.userData.fire = gFire;
            grandAsteroidGroup.userData.speed = (grandAsteroidGroup.position.length() - shieldRadius) / 6.0; // Distancia / 6 segundos exactos
            
            scene.add(grandAsteroidGroup);
            
            // FORZAR CIERRE DE FOTO Y BLOQUEAR CONTROLES
            photoModal.classList.remove('active');
            if(globalControls) globalControls.enabled = false;
          }
        } else if (deepEventState === 1) {
          // Asteroide gigante acercándose LÍNEA RECTA (6 segundos)
          grandAsteroidGroup.translateZ(grandAsteroidGroup.userData.speed * dt); // Avanza hacia la Tierra (+Z)
          grandAsteroidMesh.rotation.x += dt * 3.0; // Rota la malla independientemente
          grandAsteroidMesh.rotation.y += dt * 3.0;
          
          // Animar el fuego
          const fP = grandAsteroidGroup.userData.fire.geometry.attributes.position.array;
          for(let i=0; i<500; i++) {
            fP[i*3+2] -= dt * 40; // Fuego va hacia atrás (-Z)
            if(fP[i*3+2] < -70) {
              fP[i*3] = (Math.random()-0.5)*15;
              fP[i*3+1] = (Math.random()-0.5)*15;
              fP[i*3+2] = 0;
            }
          }
          grandAsteroidGroup.userData.fire.geometry.attributes.position.needsUpdate = true;
          
          // Cámara panorámica extrema, hace un zoom muy hacia atrás para ver todo el escenario de frente
          camera.position.lerpVectors(camera.position, new THREE.Vector3(0, 150, 800), 0.08);
          // Enfoca fijamente a la Tierra para ver al meteorito entrar y chocar en el centro
          camera.lookAt(0,0,0);
          
          if (grandAsteroidGroup.position.length() <= shieldRadius) {
            // IMPACTO DE ESCUDO AZUL GIGANTE
            const impact = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), impactMat.clone());
            impact.position.copy(grandAsteroidGroup.position);
            impact.lookAt(0,0,0);
            impact.userData.life = 1.0;
            scene.add(impact);
            shieldImpacts.push(impact);
            
            // Cientos de fragmentos blancos y redondos flotando lento (Cámara lenta)
            for(let p=0; p<150; p++) {
              const pa = new THREE.Sprite(whiteParticleMat);
              pa.scale.set(3 + Math.random()*4, 3 + Math.random()*4, 1);
              pa.position.copy(grandAsteroidGroup.position);
              pa.userData.vx = (Math.random()-0.5)*2.5; pa.userData.vy = (Math.random()-0.5)*2.5; pa.userData.vz = (Math.random()-0.5)*2.5;
              pa.userData.life = 1.0;
              pa.userData.isSlowMo = true;
              scene.add(pa);
              shieldImpacts.push(pa);
            }
            scene.remove(grandAsteroidGroup);
            
            // Iniciar pausa dramática de 3 segundos
            deepEventState = 1.5;
            deepEventTimer = 0;
          }
        } else if (deepEventState === 1.5) {
          // 3 Segundos de silencio dramático viendo restos flotar
          deepEventTimer += dt;
          camera.position.lerp(new THREE.Vector3(-100, 40, 150), 0.02); // Se acerca un poco al impacto
          camera.lookAt(0,0,0);
          if (deepEventTimer >= 3.0) {
            deepEventState = 2;
            deepEventTimer = 0;
            document.getElementById('deepMessageOverlay').classList.add('active');
          }
        } else if (deepEventState === 2) {
          // Mensaje profundo mostrándose por 8 segundos
          deepEventTimer += dt;
          // Pequeño drift de cámara alejándose tras el impacto
          camera.position.z += dt * 3;
          camera.lookAt(0,0,0);
          
          if (deepEventTimer > 10) {
            document.getElementById('deepMessageOverlay').classList.remove('active');
            deepEventState = 2.1; // Pausa
            deepEventTimer = 0;
          }
        } else if (deepEventState === 2.1) {
          deepEventTimer += dt;
          camera.position.z += dt * 3;
          camera.lookAt(0,0,0);
          
          if (deepEventTimer > 1.5) {
            document.getElementById('deepMessageOverlay2').classList.add('active');
            deepEventState = 2.2; // Segundo mensaje
            deepEventTimer = 0;
          }
        } else if (deepEventState === 2.2) {
          deepEventTimer += dt;
          camera.position.z += dt * 3;
          camera.lookAt(0,0,0);
          
          if (deepEventTimer > 10) {
            document.getElementById('deepMessageOverlay2').classList.remove('active');
            deepEventState = 2.5; // Ir a transición de regreso
            deepEventTimer = 0;
          }
        } else if (deepEventState === 2.5) {
          // Transición de regreso a la posición original
          deepEventTimer += dt;
          camera.position.lerp(camera.userData.oldPos, 0.05);
          
          if(camera.userData.oldTarget) {
            const t = Math.min(1.0, deepEventTimer / 2.0);
            const currentLookAt = new THREE.Vector3(0,0,0).lerp(camera.userData.oldTarget, t);
            camera.lookAt(currentLookAt);
          }
          
          if (deepEventTimer > 2) {
            deepEventState = 3; // Termina el evento especial
            if(globalControls && finaleState === 0) {
              globalControls.target.copy(camera.userData.oldTarget);
              globalControls.enabled = true;
            }
          }
        }
      }
      
      // === GRAN FINAL (FORMACIÓN ESTELAR A CORAZÓN Y DESTELLO MAGNÍFICO) ===
      if (finaleState === 1) {
        finaleState = 1.5;
        
        // Apagar el sol para que la luz provenga solo del corazón
        sunGroup.visible = false;
        
        // Poner la cámara en la posición inicial para el final
        camera.position.set(0, 50, 150);
        camera.lookAt(0, 0, 0);
        
        // Crear una luz central súper potente para el corazón
        finaleLight = new THREE.PointLight(0xffffff, 0, 20000);
        finaleLight.position.set(0, 60, 0); // Centro geométrico aproximado del corazón
        scene.add(finaleLight);
        
        // Función para obtener un punto aleatorio dentro del volumen de un corazón 3D
        function randomHeartPoint(scale) {
            let attempt = 0;
            while(attempt < 1000) {
                attempt++;
                // x, y, z entre -1.5 y 1.5
                const x = (Math.random() - 0.5) * 3.0;
                const y = (Math.random() - 0.5) * 3.0;
                const z = (Math.random() - 0.5) * 3.0;
                
                // Fórmula del volumen del corazón 3D (Y es arriba en Three.js)
                const val1 = (x*x) + (9/4)*(z*z) + (y*y) - 1;
                const val2 = (x*x) * (y*y*y);
                const val3 = (9/80) * (z*z) * (y*y*y);
                
                if ((val1*val1*val1) - val2 - val3 <= 0) {
                    return new THREE.Vector3(x * scale, y * scale, z * scale);
                }
            }
            return new THREE.Vector3(0,0,0); // Fallback
        }
        
        // Generar las 4000 partículas blancas esparcidas por todo el universo
        for (let i = 0; i < 4000; i++) {
          const scale = 50 + Math.random() * 20; // Escala grande para el corazón
          const targetPos = randomHeartPoint(scale);
          // Moverlo un poco hacia arriba para que no quede muy bajo
          targetPos.y += 60;
          
          // Posición Inicial: Distribución esférica gigante y completamente aleatoria
          const startRadius = 1500 + Math.random() * 2500;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos((Math.random() * 2) - 1);
          
          const startX = startRadius * Math.sin(phi) * Math.cos(theta);
          const startY = startRadius * Math.sin(phi) * Math.sin(theta);
          const startZ = startRadius * Math.cos(phi);
          const startPos = new THREE.Vector3(startX, startY, startZ);
          
          const pa = new THREE.Sprite(whiteParticleMat);
          pa.scale.set(5, 5, 1);
          pa.position.copy(startPos);
          // Retraso aleatorio para que lleguen en diferentes momentos
          pa.userData = { target: targetPos, start: startPos, delay: Math.random() * 10.0 }; 
          
          // Estrellas pura y exclusivamente BLANCAS
          pa.material.color.setHex(0xffffff);
          pa.material.opacity = 0; // Inician apagadas y se encienden al viajar
          
          scene.add(pa);
          finaleParticles.push(pa);
        }
      } else if (finaleState === 1.5) {
        finaleTimer += dt;
        
        // Alejar cámara lentamente para contemplar la inmensidad
        camera.position.lerp(new THREE.Vector3(0, 150, 800), 0.003);
        camera.lookAt(0, 60, 0);
        
        let allDone = true;
        
        finaleParticles.forEach((p) => {
          // Si ya pasó el tiempo de delay de esta partícula, comienza a viajar
          if (finaleTimer > p.userData.delay) {
            // El viaje dura 15 segundos desde que empieza
            const prog = Math.min(1.0, (finaleTimer - p.userData.delay) / 15.0);
            
            // Suavizado (Easing In/Out)
            const ease = prog < 0.5 ? 2 * prog * prog : 1 - Math.pow(-2 * prog + 2, 2) / 2;
            
            p.position.lerpVectors(p.userData.start, p.userData.target, ease);
            
            // Efecto de encendido gradual
            p.material.opacity = Math.min(1.0, prog * 2.0);
            
            // Latido final si ya llegó
            if (prog >= 1.0) {
              const pulse = Math.sin(finaleTimer * 6 + p.userData.target.x) * 1.5;
              p.scale.set(5 + pulse, 5 + pulse, 1);
            } else {
              allDone = false;
            }
          } else {
            allDone = false;
          }
        });
        
        if (finaleTimer > 30.0) { // Tras 30s todo debe estar formado y latiendo
          finaleState = 2;
        }
        
      } else if (finaleState === 2) {
        finaleTimer += dt;
        
        camera.position.lerp(new THREE.Vector3(0, 150, 800), 0.003);
        camera.lookAt(0, 60, 0);
        
        // Latido intenso y sincronizado, la luz del corazón empieza a brillar
        const heartbeat = Math.sin(finaleTimer * 6) * Math.sin(finaleTimer * 6) * 4;
        finaleParticles.forEach(p => {
          p.scale.set(6 + heartbeat, 6 + heartbeat, 1);
        });
        
        finaleLight.intensity = Math.min(50, (finaleTimer - 30.0) * 2); // Crece la luz iluminando el universo
        
        // A los 40s, iniciamos el destello de luz inmenso (Bloom)
        if (finaleTimer > 40.0) {
          finaleState = 3;
        }
      } else if (finaleState === 3) {
        finaleTimer += dt;
        
        // Subir drásticamente el bloom y la luz interna
        bloomPass.strength += dt * 10.0; // Sube a niveles cegadores
        finaleLight.intensity += dt * 50.0; // Luz interna cegadora
        
        const heartbeat = Math.sin(finaleTimer * 6) * Math.sin(finaleTimer * 6) * 6;
        finaleParticles.forEach(p => {
          p.scale.set(6 + heartbeat, 6 + heartbeat, 1);
        });
        
        // A los 43s, activar el div blanco
        if (finaleTimer > 42.5) {
           document.getElementById('whiteFlashOverlay').classList.add('active');
           finaleState = 4;
        }
      } else if (finaleState === 4) {
        finaleTimer += dt;
        // Restaurar el bloom silenciosamente en el fondo
        if(bloomPass.strength > 1.2) bloomPass.strength -= dt * 10;
        
        // Mostrar la sección final (que es blanca) y luego se torna negra
        if (finaleTimer > 49.0) {
           document.getElementById('finalGoodbyeSection').classList.add('active');
           setTimeout(() => {
             document.getElementById('finalGoodbyeSection').classList.add('black-bg');
           }, 500); // Darle medio segundo blanco y transicionar a negro y letras
           finaleState = 5;
        }
      } else if (finaleState === 5) {
        // Fin de todo. Todo se ejecuta desde CSS ahora.
      }
      
      // Rotaciones
      earthMesh.rotation.y += dt * 0.05;
      cloudMesh.rotation.y += dt * 0.06;
      sunMesh.rotation.y += dt * 0.02;
      moonMesh.rotation.y += dt * 0.02;
      distantObjects.rotation.y += dt * 0.01;
      planetObjects.forEach(p => {
        p.rotation.y += dt * p.userData.speed * 10;
        p.children[0].rotation.y += dt * p.userData.speed * 20; // Rota el planeta en su eje
      });
      galaxy.rotation.y += dt * 0.02;
      bgStars.rotation.y -= dt * 0.005; // El fondo gira muy lento
      


      // Animar Asteroides y Colisión de Escudo
      for(let i=asteroides.length-1; i>=0; i--) {
        const ast = asteroides[i];
        ast.position.add(ast.userData.velocity); // Movimiento recto perfecto hacia el centro
        ast.rotation.x += ast.userData.rotX; // Solo afecta lo visual
        ast.rotation.y += ast.userData.rotY;
        
        // Calcular distancia al centro
        if(ast.position.length() <= shieldRadius) {
          // COLISIÓN! Crear impacto de escudo
          const impact = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), impactMat.clone());
          impact.position.copy(ast.position);
          impact.lookAt(0,0,0);
          impact.userData.life = 1.0;
          scene.add(impact);
          shieldImpacts.push(impact);
          
          // Crear partículas de desintegración blancas y redondas
          for(let p=0; p<30; p++) {
            const pa = new THREE.Sprite(whiteParticleMat);
            pa.scale.set(2 + Math.random()*2, 2 + Math.random()*2, 1);
            pa.position.copy(ast.position);
            pa.userData.vx = (Math.random()-0.5)*4; pa.userData.vy = (Math.random()-0.5)*4; pa.userData.vz = (Math.random()-0.5)*4;
            pa.userData.life = 1.0;
            scene.add(pa);
            shieldImpacts.push(pa); // Usamos el mismo array para limpiar
          }
          
          scene.remove(ast);
          asteroides.splice(i,1);
        }
      }
      
      // Animar Impactos y Partículas de desintegración
      for(let i=shieldImpacts.length-1; i>=0; i--) {
        const imp = shieldImpacts[i];
        if(imp.userData.isSlowMo) {
           imp.userData.life -= dt * 0.15; // Flota lento y dura aprox 6 segundos
        } else {
           imp.userData.life -= dt * 1.5;
        }
        
        if(imp.geometry && imp.geometry.type === 'PlaneGeometry') {
          imp.scale.addScalar(dt * 8.0); // Onda expansiva crece
          if(imp.userData.isBoom) {
             imp.material.color.setHSL(imp.userData.life * 0.1, 1.0, 0.5); // Cambia el tono del rojo/amarillo
          }
          imp.material.opacity = imp.userData.life;
        } else {
          // Partícula blanca redonda
          imp.position.x += imp.userData.vx; imp.position.y += imp.userData.vy; imp.position.z += imp.userData.vz;
          imp.material.opacity = imp.userData.life;
        }
        
        if(imp.userData.life <= 0) {
          scene.remove(imp);
          shieldImpacts.splice(i,1);
        }
      }
      
      // Parpadeo de estrellas interactivas (sin apagarse por completo)
      interactiveStars.forEach(star => {
        const p = Math.sin(t * star.userData.pulseSpeed + star.userData.pulsePhase);
        const scale = 3 + p * 1.5;
        star.scale.set(scale, scale, 1);
        star.material.opacity = 0.75 + p * 0.25;
      });

      // Actualizar Estrellas Fugaces
      meteorShowerTimer += dt;
      if (meteorShowerTimer > 8) {
        // Cada 8 segundos, hay una lluvia de meteoros de 4 segundos
        isMeteorShower = true;
        meteorShowerTimer = 0;
      }
      if (isMeteorShower && meteorShowerTimer > 4) {
        isMeteorShower = false;
      }

      // Durante lluvia, 60% chance por frame, sino 5% (muchísimas más estrellas)
      const spawnChance = isMeteorShower ? 0.6 : 0.05; 
      if (Math.random() < spawnChance) spawnShootingStar();

      for (let i = shootingStarsArray.length - 1; i >= 0; i--) {
        const star = shootingStarsArray[i];
        star.position.add(star.userData.velocity);
        star.userData.life -= star.userData.decay;
        star.material.opacity = star.userData.life;
        if (star.userData.life <= 0) {
          scene.remove(star);
          shootingStarsArray.splice(i, 1);
        }
      }

      // Solo actualizar controls si no estamos forzando la cámara manualmente
      if (deepEventState === 0 || deepEventState === 3) {
        controls.update();
      }
      composer.render();
    }
    animate();
    
    // Corazones al hacer doble clic / clic rápido (mantenido)
    const fx = document.getElementById('fx');
    const ctx2 = fx.getContext('2d');
    function resizeFx(){
      fx.width = window.innerWidth * window.devicePixelRatio;
      fx.height = window.innerHeight * window.devicePixelRatio;
      fx.style.width = window.innerWidth + 'px';
      fx.style.height = window.innerHeight + 'px';
    }
    window.addEventListener('resize', resizeFx); resizeFx();
    
    const hearts = [];
    function spawnHearts(x, y){
      const DPR = window.devicePixelRatio;
      x *= DPR; y *= DPR;
      for(let i=0;i<15;i++){ 
        const a=Math.random()*Math.PI*2;
        hearts.push({x, y, vx:Math.cos(a)*1.5, vy:-(1+Math.random()*2), life:1, size:10+Math.random()*15});
      }
    }
    function drawHeart(x,y,size){
      const s=size; ctx2.save(); ctx2.translate(x,y);
      ctx2.beginPath(); ctx2.moveTo(0,-0.25*s);
      ctx2.bezierCurveTo(.5*s,-.9*s,1.4*s,-.1*s,0,.9*s);
      ctx2.bezierCurveTo(-1.4*s,-.1*s,-.5*s,-.9*s,0,-.25*s);
      ctx2.fillStyle = `rgba(255, 150, 200, 0.8)`;
      ctx2.shadowColor = '#ff66b3'; ctx2.shadowBlur = 10;
      ctx2.fill(); ctx2.restore();
    }
    
    let lastTap = 0;
    window.addEventListener('pointerdown', (e) => {
      const now = performance.now();
      if(now - lastTap < 300) spawnHearts(e.clientX, e.clientY);
      lastTap = now;
    });

    function loopFx(){
      ctx2.clearRect(0,0,fx.width,fx.height);
      for(let i=hearts.length-1;i>=0;i--){ 
        const h=hearts[i]; h.x+=h.vx; h.y+=h.vy; h.vy-=0.03; h.life-=0.02;
        ctx2.globalAlpha=Math.max(0,h.life); drawHeart(h.x,h.y,h.size); ctx2.globalAlpha=1; 
        if(h.life<=0) hearts.splice(i,1);
      }
      requestAnimationFrame(loopFx);
    } 
    loopFx();
  }
});
