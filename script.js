document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Lógica de Texto Multicolor Dinámico ---
    const textElement = document.getElementById('animated-text');
    if (textElement) {
        const text = textElement.textContent;
        textElement.innerHTML = ''; // Limpiamos el contenido original
        
        const colors = ['#F4943E', '#F8CA5B', '#8ECBCE', '#F49DB5', '#B893D6'];
        let colorIndex = 0;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            
            if (char.trim() === '') {
                // Si es un espacio en blanco, lo agregamos sin envolver ni aumentar el contador
                textElement.appendChild(document.createTextNode(char));
            } else {
                // Si es un carácter, lo envolvemos en un span y le asignamos un color
                const span = document.createElement('span');
                span.textContent = char;
                span.style.color = colors[colorIndex % colors.length];
                textElement.appendChild(span);
                
                colorIndex++; // Solo incrementamos el color si no fue un espacio
            }
        }
    }

    // --- 2. Canvas y Secuencia de Imágenes ---
    const canvas = document.getElementById('sequence-canvas');
    const ctx = canvas.getContext('2d');
    
    // Configuración de frames
    const frameCount = 32;
    const images = [];
    const obj = { frame: 0 }; // Objeto para que GSAP anime la propiedad 'frame'

    // Generar nombres de archivos
    const currentFrame = (index) => `./frame_${String(index).padStart(5, '0')}.webp`;

    // Función para renderizar una imagen en el canvas con cover-like scaling
    function render(img) {
        if (!img || !img.complete) return;
        
        // Limpiamos el canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calcular escala para 'object-fit: cover'
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;
        
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    }

    // Redimensionar canvas para que coincida con la ventana
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Re-renderizamos el frame actual si ya hay una imagen cargada
        const currentImg = images[Math.round(obj.frame)];
        if (currentImg) {
            render(currentImg);
        }
    }

    // Listener para responsividad
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Llamada inicial

    // Precargar las imágenes
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
        
        // Cuando se carga la primera imagen, la dibujamos inmediatamente
        if (i === 1) {
            img.onload = () => {
                if (obj.frame === 0) { // Solo si la animación aún no ha avanzado
                    render(img);
                }
            };
        }
    }

    // --- 3. ScrollTrigger y Animación de GSAP ---
    gsap.registerPlugin(ScrollTrigger);

    // Animación de la secuencia de imágenes
    const tl = gsap.to(obj, {
        frame: frameCount - 1, // de 0 a 31 (índices del array 'images')
        snap: 'frame', // Asegura que el valor sea entero
        ease: 'none',
        duration: 1.2, // Duración rápida
        onUpdate: () => {
            const index = Math.round(obj.frame);
            if (images[index]) {
                render(images[index]);
            }
        },
        paused: true // Lo pausamos para iniciarlo con ScrollTrigger sin scrub
    });

    // ScrollTrigger para detectar el primer movimiento de scroll
    ScrollTrigger.create({
        trigger: 'body',
        start: 'top top',
        end: '+=10', // Solo un pequeño movimiento
        once: true, // Que solo ocurra una vez
        onEnter: () => {
            // Reproducir la animación de frames
            tl.play();
            
            // Ocultar el Hint (dedo)
            const hint = document.getElementById('scroll-hint');
            if (hint) {
                gsap.to(hint, { autoAlpha: 0, duration: 0.5 });
            }
        }
    });
});
