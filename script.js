// ============================================
// script.js – Interactividad para la página educativa de Matemáticas
// Autor: Asistente de código
// Descripción: Añade funcionalidades como quiz interactivo, scroll suave y botón "volver arriba".
// ============================================

// Esperamos a que el DOM esté completamente cargado antes de ejecutar
document.addEventListener("DOMContentLoaded", function () {

    // ==================== 1. BOTÓN "VOLVER ARRIBA" ====================
    // Se muestra cuando el usuario hace scroll hacia abajo
    const backToTopBtn = document.getElementById("back-to-top");

    if (backToTopBtn) {
        // Escuchar el evento de scroll
        window.addEventListener("scroll", function () {
            // Si el scroll es mayor a 300px, mostramos el botón
            if (window.scrollY > 300) {
                backToTopBtn.classList.add("visible");
            } else {
                backToTopBtn.classList.remove("visible");
            }
        });

        // Al hacer clic, subimos suavemente al inicio de la página
        backToTopBtn.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth" // Scroll suave
            });
        });
    }

    // ==================== 3. SCROLL SUAVE PARA ENLACES INTERNOS ====================
    // Si hay enlaces que apuntan a secciones dentro de la página
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener("click", function (e) {
            e.preventDefault(); // Evitamos el comportamiento por defecto
            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: "smooth",  // Scroll suave
                    block: "start"       // Alinea al inicio del elemento
                });
            }
        });
    });

    // ==================== 4. ANIMACIÓN AL HACER SCROLL (INTERSECTION OBSERVER) ====================
    // Las secciones se desvanecen al entrar en el viewport
    const secciones = document.querySelectorAll("section");

    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    // Cuando la sección es visible, añadimos la clase de animación
                    entry.target.classList.add("visible");
                }
            });
        },
        {
            threshold: 0.15 // Se activa cuando el 15% de la sección es visible
        }
    );

    // Observamos cada sección
    secciones.forEach(function (seccion) {
        seccion.classList.add("oculta");     // Estado inicial: oculta
        seccion.classList.add("animada");    // Clase para transición
        observer.observe(seccion);           // Empezamos a observarla
    });

    // ==================== 5. QUIZ INTERACTIVO ====================
    // Preguntas de matemáticas con opciones y respuesta correcta
    const preguntas = [
        {
            pregunta: "¿Cuál es el resultado de 7 × 8?",
            opciones: ["54", "56", "64", "58"],
            correcta: 1 // Índice de la respuesta correcta
        },
        {
            pregunta: "¿Cuál es el valor de Pi (π) redondeado a 2 decimales?",
            opciones: ["3.12", "3.16", "3.14", "3.18"],
            correcta: 2
        },
        {
            pregunta: "¿Cuántos lados tiene un hexágono?",
            opciones: ["5", "6", "7", "8"],
            correcta: 1
        },
        {
            pregunta: "¿Qué número es 'i' en matemáticas?",
            opciones: ["Número primo", "Unidad imaginaria", "Número neutro", "Número negativo"],
            correcta: 1
        },
        {
            pregunta: "¿Quién es conocido como el 'Padre de la Geometría'?",
            opciones: ["Pitágoras", "Arquímedes", "Euclides", "Newton"],
            correcta: 2
        }
    ];

    // Referencias al contenedor del quiz y botones
    const quizContainer = document.getElementById("quiz-container");
    const quizBtn = document.getElementById("quiz-btn");
    const iniciarQuizBtn = document.getElementById("iniciar-quiz-btn");

    if (iniciarQuizBtn && quizContainer) {
        iniciarQuizBtn.addEventListener("click", function () {
            quizContainer.classList.remove("hidden");
            iniciarQuizBtn.style.display = "none";
            iniciarQuiz();
        });
    }

    if (quizBtn && quizContainer) {
        quizBtn.addEventListener("click", function () {
            reiniciarQuiz();
        });
    }

    // Variables para el estado del quiz
    let preguntaActual = 0;
    let puntuacion = 0;
    let quizEnCurso = false;

    /**
     * Función que inicia o reinicia el quiz.
     */
    function iniciarQuiz() {
        preguntaActual = 0;
        puntuacion = 0;
        quizEnCurso = true;
        quizContainer.innerHTML = "";
        mostrarPregunta();
    }

    function reiniciarQuiz() {
        preguntaActual = 0;
        puntuacion = 0;
        quizEnCurso = true;
        quizBtn.style.display = "none";
        quizContainer.innerHTML = "";
        quizContainer.classList.remove("hidden");
        mostrarPregunta();
    }

    /**
     * Muestra la pregunta actual en el contenedor del quiz.
     */
    function mostrarPregunta() {
        if (preguntaActual >= preguntas.length) {
            mostrarResultado();
            return;
        }

        const datos = preguntas[preguntaActual];
        let html = `<div class="quiz-pregunta animada visible">`;
        html += `<h3>Pregunta ${preguntaActual + 1} de ${preguntas.length}</h3>`;
        html += `<p class="pregunta-texto">${datos.pregunta}</p>`;
        html += `<div class="quiz-opciones">`;

        datos.opciones.forEach(function (opcion, index) {
            html += `<button class="opcion-btn" data-index="${index}">${opcion}</button>`;
        });

        html += `</div>`;
        html += `<div class="quiz-retro hidden" id="retro-${preguntaActual}"></div>`;
        html += `</div>`;

        quizContainer.innerHTML = html;

        // Añadir evento de clic a cada botón de opción
        quizContainer.querySelectorAll(".opcion-btn").forEach(function (btn) {
            btn.addEventListener("click", function () {
                const seleccion = parseInt(this.getAttribute("data-index"));
                verificarRespuesta(seleccion);
            });
        });
    }

    /**
     * Verifica si la respuesta seleccionada es correcta.
     */
    function verificarRespuesta(seleccion) {
        const datos = preguntas[preguntaActual];
        const retro = document.getElementById(`retro-${preguntaActual}`);
        const botones = quizContainer.querySelectorAll(".opcion-btn");

        // Deshabilitamos todos los botones para evitar doble clic
        botones.forEach(function (btn) {
            btn.disabled = true;
        });

        if (seleccion === datos.correcta) {
            botones[seleccion].classList.add("correcta");
            puntuacion++;
            retro.innerHTML = `<p class="mensaje-correcto">✅ ¡Correcto! Muy bien.</p>`;
        } else {
            botones[seleccion].classList.add("incorrecta");
            botones[datos.correcta].classList.add("correcta");
            retro.innerHTML = `<p class="mensaje-incorrecto">❌ Incorrecto. La respuesta correcta era: <strong>${datos.opciones[datos.correcta]}</strong></p>`;
        }

        retro.classList.remove("hidden");

        // Después de 1.5 segundos, pasamos a la siguiente pregunta
        setTimeout(function () {
            preguntaActual++;
            mostrarPregunta();
        }, 1500);
    }

    /**
     * Muestra el resultado final del quiz con la puntuación.
     */
    function mostrarResultado() {
        const porcentaje = Math.round((puntuacion / preguntas.length) * 100);
        let mensaje = "";

        if (porcentaje === 100) {
            mensaje = "🏆 ¡Excelente! Eres un genio de las matemáticas.";
        } else if (porcentaje >= 70) {
            mensaje = "👏 ¡Muy bien! Tienes buenos conocimientos matemáticos.";
        } else if (porcentaje >= 40) {
            mensaje = "💪 ¡Buen intento! Sigue practicando para mejorar.";
        } else {
            mensaje = "📚 ¡Sigue aprendiendo! Revisa las secciones de la página.";
        }

        quizEnCurso = false;
        quizContainer.innerHTML = `
            <div class="quiz-resultado animada visible">
                <h3>🎯 Resultado del Quiz</h3>
                <p class="resultado-puntuacion">Has acertado <strong>${puntuacion}</strong> de <strong>${preguntas.length}</strong> preguntas (${porcentaje}%)</p>
                <p class="resultado-mensaje">${mensaje}</p>
                <button id="quiz-reiniciar" class="btn-reiniciar">🔄 Reiniciar Quiz</button>
            </div>
        `;

        document.getElementById("quiz-reiniciar").addEventListener("click", function () {
            iniciarQuiz();
        });

        quizBtn.style.display = "inline-block";
    }

    // ==================== 6. EFECTO HOVER EN TARJETAS ====================
    const tarjetas = document.querySelectorAll(".rama-card");

    tarjetas.forEach(function (tarjeta) {
        tarjeta.addEventListener("mouseenter", function () {
            this.style.transform = "translateY(-5px) scale(1.02)";
        });

        tarjeta.addEventListener("mouseleave", function () {
            this.style.transform = "translateY(0) scale(1)";
        });
    });

    // ==================== 7. EXPANDIR / CONTRAER SECCIONES ====================
    const encabezadosSeccion = document.querySelectorAll("section > h2");

    encabezadosSeccion.forEach(function (h2) {
        const seccion = h2.parentElement;
        const contenidoSeccion = seccion.querySelectorAll("p, ul, div, figure");

        h2.style.cursor = "pointer";
        h2.title = "Haz clic para expandir/contraer";

        h2.addEventListener("click", function () {
            contenidoSeccion.forEach(function (elemento) {
                if (elemento.style.display === "none") {
                    elemento.style.display = "";
                } else {
                    elemento.style.display = "none";
                }
            });
        });
    });

});
// Fin del DOMContentLoaded