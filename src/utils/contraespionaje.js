// SISTEMA DE CONTRAESPIONAJE
const PROBABILIDAD_CONTRAESPIONAJE = 100; // 20% de chance de detección

function verificarContraespionaje() {
    const numeroAleatorio = Math.random() * 100;
    const detectado = numeroAleatorio < PROBABILIDAD_CONTRAESPIONAJE;

    console.log(`[CONTRAESPIONAJE] Número: ${numeroAleatorio.toFixed(2)} | Detectado: ${detectado}`);

    return detectado;
}

module.exports = { verificarContraespionaje };